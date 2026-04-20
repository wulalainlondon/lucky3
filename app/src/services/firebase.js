import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCC5MVDctiEw_r4-bru2vaVozMjnzYx0KA",
    authDomain: "lucky3-d6bb3.firebaseapp.com",
    projectId: "lucky3-d6bb3",
    storageBucket: "lucky3-d6bb3.firebasestorage.app",
    messagingSenderId: "245595237917",
    appId: "1:245595237917:web:a2643aa43f846a558c60f4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ready = (async () => {
    try {
        await signInAnonymously(auth);
    } catch (e) {
        console.error("Anonymous auth failed:", e);
    }
})();

function fallbackName(uid) {
    return `Player-${String(uid || '').slice(0, 6) || 'guest'}`;
}

function sanitizeName(raw) {
    if (typeof raw !== 'string') return '';
    return raw.trim().slice(0, 12).replace(/[<>"'&]/g, '');
}

function isValidDateKey(s) {
    return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

// Leaderboard read cache — keyed by dateKey, expires after 60 seconds
const _lbCache = {};

async function submitDailyScore(payload) {
    await ready;
    const user = auth.currentUser;
    if (!user) throw new Error("auth user unavailable");

    const dateKey = payload.dateKey;
    const bestTimeMs = Number(payload.bestTimeMs);
    const moves = Number(payload.moves);
    const maxCombo = Number(payload.maxCombo);
    const resultKind = payload.resultKind === 'zero-clear' ? 'zero-clear' : 'lucky3';
    if (!isValidDateKey(dateKey) || !Number.isFinite(bestTimeMs)) throw new Error("invalid payload");

    const ref = doc(db, 'daily_leaderboards', dateKey, 'entries', user.uid);
    const snap = await getDoc(ref);

    const payloadName = sanitizeName(payload.name);
    const nextData = {
        uid: user.uid,
        name: payloadName || fallbackName(user.uid),
        bestTimeMs: Math.max(0, Math.round(bestTimeMs)),
        moves: Number.isFinite(moves) ? Math.max(0, Math.round(moves)) : 0,
        maxCombo: Number.isFinite(maxCombo) ? Math.max(0, Math.round(maxCombo)) : 0,
        resultKind,
        updatedAt: serverTimestamp()
    };

    if (!snap.exists()) {
        delete _lbCache[dateKey];
        await setDoc(ref, nextData);
        return { status: 'created' };
    }

    const prev = snap.data() || {};
    const prevBest = Number(prev.bestTimeMs);
    if (Number.isFinite(prevBest) && nextData.bestTimeMs >= prevBest) {
        return { status: 'skipped' };
    }

    // Prefer existing name unless player has now set one
    if (!payloadName && typeof prev.name === 'string' && prev.name.trim()) {
        nextData.name = sanitizeName(prev.name) || nextData.name;
    }
    delete _lbCache[dateKey];
    await setDoc(ref, nextData, { merge: true });
    return { status: 'updated' };
}

async function loadDailyLeaderboard(dateKey, topN = 20) {
    await ready;
    if (!isValidDateKey(dateKey)) throw new Error("invalid dateKey");
    const user = auth.currentUser;

    const cached = _lbCache[dateKey];
    if (cached && Date.now() - cached.ts < 60000) {
        return { uid: user ? user.uid : '', rows: cached.rows };
    }

    const col = collection(db, 'daily_leaderboards', dateKey, 'entries');
    const q = query(col, orderBy('bestTimeMs', 'asc'), limit(Math.max(1, Math.min(50, topN || 20))));
    const snap = await getDocs(q);
    const rows = [];
    snap.forEach((d, idx) => {
        const data = d.data() || {};
        rows.push({
            rank: idx + 1,
            uid: data.uid || d.id,
            name: sanitizeName(data.name) || fallbackName(data.uid || d.id),
            bestTimeMs: Number.isFinite(data.bestTimeMs) ? data.bestTimeMs : 0,
            moves: Number.isFinite(data.moves) ? data.moves : 0
        });
    });

    _lbCache[dateKey] = { ts: Date.now(), rows };
    return { uid: user ? user.uid : '', rows };
}

window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.lucky3Firebase = {
    ready,
    submitDailyScore,
    loadDailyLeaderboard
};
