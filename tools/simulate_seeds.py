#!/usr/bin/env python3
"""
Lucky3 seed simulation (lightweight Monte Carlo)

This script approximates outcome distributions by simulating many games under a
fixed policy. It mirrors the current in-game rules found in `index.html`:

- 40 cards: values 1..10, 4 copies each (A counts as 1)
- Deal draws from the *end* of the deck (JS `deck.pop()`)
- New game "cheat": one 3 is forced to be the last drawn card (bottom card)
- Opening: auto-deal 3 cards to each of 4 columns, round-robin
- Clear: in a single column, you may clear 3 cards if:
    - their sum is 9 / 19 / 29
    - positions match one of:
        (tail3)      [len-3, len-2, len-1]
        (head1tail2) [0, len-2, len-1]
        (head2tail1) [0, 1, len-1]
- Recycle: when deck empty and clearedGroups non-empty, rebuild deck by clear
  order so the *first* cleared group returns to the top of the deck.
- Win conditions:
    - "zero-clear": board has 0 cards
    - "lucky3": board has 1 card and it is value 3
- Deadlock: deck empty AND recycle empty AND no legal clear exists.

IMPORTANT: Results depend on the policy used to pick clear moves.
Default policy is deterministic: clear whenever possible, choosing the first
legal move scanning columns 0..3 and candidate order (tail3 -> head1tail2 ->
head2tail1). This is NOT an optimal solver.
"""

from __future__ import annotations

from dataclasses import dataclass
import argparse
import random
from typing import Iterable, List, Optional, Tuple


TARGET_SUMS = (9, 19, 29)


def build_deck(rng: random.Random, deck_mode: str = "forced3") -> List[int]:
    """
    Create a new deck matching the in-game distribution (values only):
    - Start with 4 copies of each value 1..10
    - Remove one '3' to force it as bottom card (last to be drawn)
    - Shuffle remaining 39 values
    - Represent deck as list where pop() draws next card
      => put forced bottom card at index 0, shuffled cards after it.
    """
    values: List[int] = []
    for v in range(1, 11):
        values.extend([v] * 4)

    if deck_mode == "full-random":
        rng.shuffle(values)
        return values

    # Default: remove one 3 to be the forced bottom card.
    values.remove(3)
    rng.shuffle(values)
    # JS deck is [forcedBottomCard, ...topDeck] and uses pop().
    return [3] + values


def opening_deal(deck: List[int], cols: List[List[int]], cards_per_col: int = 3) -> None:
    for _ in range(cards_per_col):
        for col in cols:
            if not deck:
                return
            col.append(deck.pop())


def legal_clear_moves_for_col(col: List[int]) -> List[Tuple[int, int, int]]:
    L = len(col)
    if L < 3:
        return []
    # Prefer head-position clears (head1tail2, head2tail1) before tail3.
    candidates = [
        (0, L - 2, L - 1),  # head1tail2
        (0, 1, L - 1),  # head2tail1
        (L - 3, L - 2, L - 1),  # tail3
    ]

    seen = set()
    out: List[Tuple[int, int, int]] = []
    for c in candidates:
        c = tuple(sorted(c))
        if c in seen:
            continue
        seen.add(c)
        s = col[c[0]] + col[c[1]] + col[c[2]]
        if s in TARGET_SUMS:
            out.append(c)
    return out


def has_any_legal_clear(cols: List[List[int]], active: List[bool]) -> bool:
    for i in range(4):
        if not active[i]:
            continue
        if legal_clear_moves_for_col(cols[i]):
            return True
    return False


def recycle(deck: List[int], cleared_groups: List[List[int]]) -> None:
    # In JS:
    # deck = []
    # for i from clearedGroups.length-1 downto 0:
    #   deck.push(...clearedGroups[i])
    deck.clear()
    for g in reversed(cleared_groups):
        deck.extend(g)
    cleared_groups.clear()


@dataclass
class Outcome:
    kind: str  # lucky3 | zero-clear | deadlock | cycle | timeout
    steps: int
    deals: int
    clears: int
    recycles: int
    remaining_board: int
    remaining_deck: int
    remaining_recycle_groups: int


def simulate_game(
    rng: random.Random,
    policy: str = "deterministic",
    deck_mode: str = "forced3",
    max_steps: int = 10000,
    detect_cycle: bool = True,
) -> Outcome:
    deck = build_deck(rng, deck_mode=deck_mode)
    cols: List[List[int]] = [[], [], [], []]
    active = [True, True, True, True]
    next_idx = 0
    cleared_groups: List[List[int]] = []

    opening_deal(deck, cols, cards_per_col=3)

    steps = 0
    deals = 0
    clears = 0
    recycles = 0

    seen: set = set()

    while True:
        steps += 1
        if steps > max_steps:
            remaining_board = sum(len(c) for c in cols)
            return Outcome("timeout", steps, deals, clears, recycles, remaining_board, len(deck), len(cleared_groups))

        # Cycle detection prevents infinite loops under a fixed policy.
        if detect_cycle:
            state = (
                tuple(deck),
                tuple(tuple(c) for c in cols),
                tuple(active),
                next_idx,
                tuple(tuple(g) for g in cleared_groups),
            )
            if state in seen:
                remaining_board = sum(len(c) for c in cols)
                return Outcome("cycle", steps, deals, clears, recycles, remaining_board, len(deck), len(cleared_groups))
            seen.add(state)

        # Victory checks (mirrors checkVictory order)
        total_cards = sum(len(c) for c in cols)
        if total_cards == 0:
            return Outcome("zero-clear", steps, deals, clears, recycles, 0, len(deck), len(cleared_groups))
        if total_cards == 1:
            lone = next(v for col in cols for v in col if col)
            if lone == 3:
                return Outcome("lucky3", steps, deals, clears, recycles, 1, len(deck), len(cleared_groups))

        # Attempt to clear (policy decides which clear to take)
        moves: List[Tuple[int, Tuple[int, int, int]]] = []
        for sid in range(4):
            if not active[sid]:
                continue
            for idxs in legal_clear_moves_for_col(cols[sid]):
                moves.append((sid, idxs))

        if moves:
            if policy == "random":
                sid, idxs = rng.choice(moves)
            else:
                # Deterministic: scan in UI order.
                sid, idxs = moves[0]

            col = cols[sid]
            i0, i1, i2 = idxs
            group = [col[i0], col[i1], col[i2]]  # ascending indices (matches JS)
            # Remove highest to lowest to keep indices stable
            for i in sorted(idxs, reverse=True):
                col.pop(i)

            cleared_groups.append(group)
            clears += 1

            if len(col) == 0:
                active[sid] = False
            continue

        # No clears: deal / recycle / deadlock
        if not deck and cleared_groups:
            recycle(deck, cleared_groups)
            recycles += 1
            continue

        if not deck:
            # Deck empty, no recycle, no clears => deadlock overlay triggers in-game.
            remaining_board = sum(len(c) for c in cols)
            return Outcome("deadlock", steps, deals, clears, recycles, remaining_board, 0, 0)

        # Deal one card to next active slot (round-robin)
        target = None
        for off in range(4):
            cand = (next_idx + off) % 4
            if active[cand]:
                target = cand
                break
        if target is None:
            # No active columns left; board should already be 0, but guard anyway.
            remaining_board = sum(len(c) for c in cols)
            return Outcome("deadlock", steps, deals, clears, recycles, remaining_board, len(deck), len(cleared_groups))

        cols[target].append(deck.pop())
        deals += 1
        next_idx = (target + 1) % 4


def main(argv: Optional[List[str]] = None) -> int:
    p = argparse.ArgumentParser(description="Simulate Lucky3 outcomes for many RNG seeds.")
    p.add_argument("--games", type=int, default=1000, help="Number of games to simulate (default: 1000)")
    p.add_argument("--policy", choices=["deterministic", "random"], default="deterministic", help="Clear-move policy")
    p.add_argument("--deck-mode", choices=["forced3", "full-random"], default="forced3", help="Deck generation mode")
    p.add_argument("--max-steps", type=int, default=10000, help="Hard cap on steps per game")
    p.add_argument("--seed-start", type=int, default=0, help="First seed (default: 0; uses seed..seed+games-1)")
    p.add_argument("--random-seeds", action="store_true", help="Use random seeds instead of sequential seed-start")
    p.add_argument("--detect-cycle", action="store_true", help="Stop and mark outcome as 'cycle' on repeated state")
    args = p.parse_args(argv)

    counts = {"lucky3": 0, "zero-clear": 0, "deadlock": 0, "cycle": 0, "timeout": 0}
    examples = {k: [] for k in counts.keys()}
    deadlock_board_hist: dict[int, int] = {}

    total_deals = 0
    total_clears = 0
    total_recycles = 0

    sysrng = random.SystemRandom()
    for i in range(args.games):
        seed = sysrng.randrange(0, 2**32) if args.random_seeds else (args.seed_start + i)
        rng = random.Random(seed)
        out = simulate_game(
            rng,
            policy=args.policy,
            deck_mode=args.deck_mode,
            max_steps=args.max_steps,
            detect_cycle=args.detect_cycle,
        )
        counts[out.kind] += 1
        if len(examples[out.kind]) < 10:
            examples[out.kind].append(seed)
        total_deals += out.deals
        total_clears += out.clears
        total_recycles += out.recycles
        if out.kind == "deadlock":
            deadlock_board_hist[out.remaining_board] = deadlock_board_hist.get(out.remaining_board, 0) + 1

    n = args.games
    print(
        f"games={n} policy={args.policy} deck_mode={args.deck_mode} "
        f"max_steps={args.max_steps} detect_cycle={bool(args.detect_cycle)}"
    )
    print("outcomes:")
    for k in ["lucky3", "zero-clear", "deadlock", "cycle", "timeout"]:
        c = counts[k]
        pct = (c / n * 100.0) if n else 0.0
        ex = ", ".join(str(s) for s in examples[k])
        print(f"  - {k:10s}: {c:4d} ({pct:6.2f}%)  seeds: [{ex}]")
    print("averages:")
    if n:
        print(f"  - deals/game   : {total_deals / n:.2f}")
        print(f"  - clears/game  : {total_clears / n:.2f}")
        print(f"  - recycles/game: {total_recycles / n:.2f}")

    if deadlock_board_hist:
        print("deadlock remaining-board histogram (top 10):")
        items = sorted(deadlock_board_hist.items(), key=lambda kv: (-kv[1], kv[0]))[:10]
        for cards_left, c in items:
            pct = (c / n * 100.0) if n else 0.0
            print(f"  - cards_left={cards_left:2d}: {c:4d} ({pct:6.2f}%)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
