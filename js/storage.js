/**
 * XellCodee - Unified LocalStorage & State Management Module
 * Mengelola penyimpanan lokal untuk progres belajar, streak harian, XP, Gems, draft kode, dan onboarding.
 */

const STORAGE_KEYS = {
    USER_DATA: 'xellcodee_user_profile',
    DRAFTS: 'xellcodee_code_drafts',
    ONBOARDING: 'xellcodee_onboarding_data',
    SITE_LANG: 'siteLanguage'
};

const DEFAULT_USER_DATA = {
    xp: 50,
    streak: 1,
    gems: 100,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessons: [],
    currentLessonIdx: 0,
    selectedTrack: 'Python'
};

window.StorageManager = {
    /**
     * Mengambil profil pengguna dari localStorage
     */
    getUserData: () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.USER_DATA);
            if (!raw) {
                const initial = { ...DEFAULT_USER_DATA };
                localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(initial));
                return initial;
            }
            return { ...DEFAULT_USER_DATA, ...JSON.parse(raw) };
        } catch (e) {
            console.warn('Gagal membaca data pengguna dari localStorage:', e);
            return { ...DEFAULT_USER_DATA };
        }
    },

    /**
     * Menyimpan profil pengguna ke localStorage
     */
    saveUserData: (data) => {
        try {
            const current = window.StorageManager.getUserData();
            const merged = { ...current, ...data };
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(merged));
            
            // Kompatibilitas legacy key
            if (typeof merged.xp === 'number') localStorage.setItem('xellcodee_xp', merged.xp);
            if (typeof merged.streak === 'number') localStorage.setItem('xellcodee_streak', merged.streak);
            
            window.StorageManager.updateUIStats();
            return merged;
        } catch (e) {
            console.error('Gagal menyimpan data pengguna ke localStorage:', e);
            return null;
        }
    },

    /**
     * Menambah XP pengguna
     */
    addXP: (amount = 25) => {
        const user = window.StorageManager.getUserData();
        user.xp = (user.xp || 0) + amount;
        window.StorageManager.saveUserData(user);
        return user.xp;
    },

    /**
     * Menambah Gems pengguna
     */
    addGems: (amount = 10) => {
        const user = window.StorageManager.getUserData();
        user.gems = (user.gems || 0) + amount;
        window.StorageManager.saveUserData(user);
        return user.gems;
    },

    /**
     * Memeriksa dan memperbarui daily streak secara cerdas
     */
    checkAndUpdateDailyStreak: () => {
        const user = window.StorageManager.getUserData();
        const today = new Date().toISOString().split('T')[0];
        const lastDate = user.lastActiveDate;

        if (!lastDate) {
            user.lastActiveDate = today;
            user.streak = 1;
            window.StorageManager.saveUserData(user);
            return user.streak;
        }

        if (lastDate === today) {
            // Sudah aktif hari ini, streak tetap
            return user.streak;
        }

        const lastDateTime = new Date(lastDate).getTime();
        const todayDateTime = new Date(today).getTime();
        const diffDays = Math.round((todayDateTime - lastDateTime) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Berurutan kemarin -> naikkan streak
            user.streak = (user.streak || 0) + 1;
        } else if (diffDays > 1) {
            // Bolong lebih dari 1 hari -> reset streak ke 1
            user.streak = 1;
        }

        user.lastActiveDate = today;
        window.StorageManager.saveUserData(user);
        return user.streak;
    },

    /**
     * Menandai modul/pelajaran sebagai selesai
     */
    completeLesson: (lessonIdx) => {
        const user = window.StorageManager.getUserData();
        const completed = user.completedLessons || [];
        const isFirstTime = !completed.includes(lessonIdx);

        if (isFirstTime) {
            completed.push(lessonIdx);
            user.completedLessons = completed;
            user.xp = (user.xp || 0) + 25;
            user.gems = (user.gems || 0) + 10;
        } else {
            // Latihan ulang: beri bonus kecil 5 XP
            user.xp = (user.xp || 0) + 5;
        }

        user.currentLessonIdx = lessonIdx;
        window.StorageManager.saveUserData(user);
        return { isFirstTime, user };
    },

    /**
     * Mengecek apakah modul tertentu sudah diselesaikan
     */
    isLessonCompleted: (lessonIdx) => {
        const user = window.StorageManager.getUserData();
        return (user.completedLessons || []).includes(lessonIdx);
    },

    /**
     * Menyimpan draft kode saat pengguna mengetik di editor
     */
    saveLessonDraft: (lessonIdx, code) => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.DRAFTS);
            const drafts = raw ? JSON.parse(raw) : {};
            drafts[lessonIdx] = code;
            localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
        } catch (e) {
            console.warn('Gagal menyimpan draft kode:', e);
        }
    },

    /**
     * Mengambil draft kode yang tersimpan untuk modul tertentu
     */
    getLessonDraft: (lessonIdx, defaultStarterCode = '') => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.DRAFTS);
            if (!raw) return defaultStarterCode;
            const drafts = JSON.parse(raw);
            return (drafts && drafts[lessonIdx] !== undefined) ? drafts[lessonIdx] : defaultStarterCode;
        } catch (e) {
            return defaultStarterCode;
        }
    },

    /**
     * Reset draft kode modul kembali ke starter code
     */
    resetLessonDraft: (lessonIdx) => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.DRAFTS);
            if (raw) {
                const drafts = JSON.parse(raw);
                delete drafts[lessonIdx];
                localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
            }
        } catch (e) {
            console.warn('Gagal reset draft kode:', e);
        }
    },

    /**
     * Menyimpan preferensi Onboarding
     */
    saveOnboarding: (onboardingData) => {
        try {
            const payload = {
                ...onboardingData,
                completed: true,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(payload));
            
            // Sinkronkan bahasa utama ke profil jika ada
            if (payload.selectedLanguages && payload.selectedLanguages.length > 0) {
                window.StorageManager.saveUserData({
                    selectedTrack: payload.selectedLanguages[0]
                });
            }
            return payload;
        } catch (e) {
            console.warn('Gagal menyimpan data onboarding:', e);
            return null;
        }
    },

    /**
     * Mengambil data Onboarding tersimpan
     */
    getOnboarding: () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },

    /**
     * Memperbarui seluruh elemen tampilan statistik (XP, Gems, Streak) di halaman
     */
    updateUIStats: () => {
        const user = window.StorageManager.getUserData();
        
        // XP Counters
        document.querySelectorAll('.user-xp-display, #userXpCount').forEach(el => {
            el.innerText = user.xp || 0;
        });

        // Streak Counters
        document.querySelectorAll('.user-streak-display, #userStreakCount').forEach(el => {
            el.innerText = user.streak || 1;
        });

        // Gems Counters
        document.querySelectorAll('.user-gems-display, #userGemsCount').forEach(el => {
            el.innerText = user.gems || 0;
        });

        // Global variables compatibility
        window.userXP = user.xp;
        window.userStreak = user.streak;
        window.userGems = user.gems;
    },

    /**
     * Reset semua data progres ke awal
     */
    resetAllProgress: () => {
        if (confirm('Apakah kamu yakin ingin mereset semua progres belajar, XP, Gems, dan draft kode?')) {
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            localStorage.removeItem(STORAGE_KEYS.DRAFTS);
            localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
            localStorage.removeItem('xellcodee_xp');
            localStorage.removeItem('xellcodee_streak');
            window.location.reload();
        }
    },

    /**
     * Inisialisasi awal saat aplikasi dimuat
     */
    init: () => {
        window.StorageManager.checkAndUpdateDailyStreak();
        window.StorageManager.updateUIStats();
    }
};
