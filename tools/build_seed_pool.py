#!/usr/bin/env python3
"""
Build a curated seed pool with a target lucky3/zero-clear ratio.

Uses the same deterministic policy as simulate_seeds.py (with head1/head2
preferred) and full-random deck mode.
"""

from __future__ import annotations

import argparse
import json
import random
from typing import List, Tuple

from simulate_seeds import simulate_game


def build_pool(
    total: int,
    lucky3_ratio: float,
    zero_clear_ratio: float,
    deck_mode: str,
    policy: str,
    max_steps: int,
    seed_limit: int,
) -> Tuple[List[int], List[int]]:
    target_lucky3 = int(round(total * lucky3_ratio))
    target_zero = total - target_lucky3

    lucky3_seeds: List[int] = []
    zero_seeds: List[int] = []
    seen = set()

    sysrng = random.SystemRandom()
    attempts = 0
    while (len(lucky3_seeds) < target_lucky3 or len(zero_seeds) < target_zero) and attempts < seed_limit:
        attempts += 1
        seed = sysrng.randrange(0, 2**32)
        if seed in seen:
            continue
        seen.add(seed)

        out = simulate_game(
            random.Random(seed),
            policy=policy,
            deck_mode=deck_mode,
            max_steps=max_steps,
            detect_cycle=False,
        )

        if out.kind == "lucky3" and len(lucky3_seeds) < target_lucky3:
            lucky3_seeds.append(seed)
        elif out.kind == "zero-clear" and len(zero_seeds) < target_zero:
            zero_seeds.append(seed)

    if len(lucky3_seeds) < target_lucky3 or len(zero_seeds) < target_zero:
        raise RuntimeError(
            f"Seed search exhausted after {attempts} tries. "
            f"Got lucky3={len(lucky3_seeds)}/{target_lucky3}, "
            f"zero-clear={len(zero_seeds)}/{target_zero}."
        )

    return lucky3_seeds, zero_seeds


def main() -> int:
    p = argparse.ArgumentParser(description="Build a curated seed pool for Lucky3.")
    p.add_argument("--total", type=int, default=500)
    p.add_argument("--lucky3", type=float, default=0.99, help="Lucky3 ratio (0-1).")
    p.add_argument("--zero-clear", type=float, default=0.01, help="Zero-clear ratio (0-1).")
    p.add_argument("--deck-mode", choices=["forced3", "full-random"], default="full-random")
    p.add_argument("--policy", choices=["deterministic", "random"], default="deterministic")
    p.add_argument("--max-steps", type=int, default=10000)
    p.add_argument("--seed-limit", type=int, default=2000000, help="Max seed attempts before aborting.")
    p.add_argument("--out", type=str, default="tools/seed_pool_99_lucky3_01_zero_500.json")
    p.add_argument("--shuffle", action="store_true", help="Shuffle final pool before writing.")
    args = p.parse_args()

    if args.lucky3 + args.zero_clear <= 0:
        raise ValueError("Ratios must be positive.")
    total_ratio = args.lucky3 + args.zero_clear
    lucky_ratio = args.lucky3 / total_ratio
    zero_ratio = args.zero_clear / total_ratio

    lucky3_seeds, zero_seeds = build_pool(
        total=args.total,
        lucky3_ratio=lucky_ratio,
        zero_clear_ratio=zero_ratio,
        deck_mode=args.deck_mode,
        policy=args.policy,
        max_steps=args.max_steps,
        seed_limit=args.seed_limit,
    )

    pool = lucky3_seeds + zero_seeds
    if args.shuffle:
        random.Random(42).shuffle(pool)

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(pool, f, ensure_ascii=True, indent=2)

    print(f"wrote {len(pool)} seeds to {args.out}")
    print(f"lucky3={len(lucky3_seeds)} zero-clear={len(zero_seeds)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
