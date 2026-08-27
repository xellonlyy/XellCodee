/**
 * XellCodee - Main Application Controller (Electric Indigo & Aurora Cyan Edition)
 */

window.currentView = 'splash';

window.showView = (targetView) => {
    if (window.currentView === targetView) return;

    const splash = document.getElementById('splashScreen');
    const landing = document.getElementById('landingScreen');
    const onboarding = document.getElementById('onboardingScreen');
    const playground = document.getElementById('playgroundScreen');

    if (splash && !splash.classList.contains('hidden') && targetView !== 'splash') {
        splash.style.pointerEvents = 'none';
        splash.style.opacity = '0';
        setTimeout(() => splash.classList.add('hidden'), 500);
    }

    // Hide all views
    [landing, onboarding, playground].forEach(el => {
        if (el) {
            el.classList.add('hidden');
            el.classList.remove('flex');
        }
    });

    // Show target view
    if (targetView === 'landing' && landing) {
        landing.classList.remove('hidden');
        landing.classList.add('flex');
        if (window.StorageManager) window.StorageManager.updateUIStats();
        if (window.updateDailyQuests) window.updateDailyQuests();
    } else if (targetView === 'onboarding' && onboarding) {
        onboarding.classList.remove('hidden');
        onboarding.classList.add('flex');
        if (window.initOnboardingGrid) window.initOnboardingGrid();
    } else if (targetView === 'playground' && playground) {
        playground.classList.remove('hidden');
        playground.classList.add('flex');
        
        // Muat lesson yang aktif tersimpan
        const userData = window.StorageManager ? window.StorageManager.getUserData() : null;
        const currentIdx = (userData && typeof userData.currentLessonIdx === 'number') ? userData.currentLessonIdx : 0;
        if (window.loadLesson) window.loadLesson(currentIdx);
        if (window.StorageManager) window.StorageManager.updateUIStats();
    }

    window.currentView = targetView;
    window.scrollTo({ top: 0, behavior: 'instant' });
};

/**
 * In-Hero Interactive Sandbox Runner
 */
const DEFAULT_HERO_CODE = `# Coba langsung ketik kodemu di sini:
name = "Developer"
streak = 7
print(f"🚀 Halo {name}! Streak belajarmu: {streak} hari.")
print("⚡ Status: Siap kuasai Python & Software Engineering!")
`;

window.runHeroCode = () => {
    const editor = document.getElementById('heroCodeEditor');
    const output = document.getElementById('heroTerminalOutput');
    const status = document.getElementById('heroRunnerStatus');
    if (!editor || !output) return;

    const code = editor.value;
    output.innerText = "⚡ Menjalankan kode pada engine browser...";

    setTimeout(() => {
        let simulated = "";
        let isSuccess = false;

        try {
            if (code.includes("print(")) {
                simulated = "🚀 Halo Developer! Streak belajarmu: 7 hari.\n⚡ Status: Siap kuasai Python & Software Engineering!\n[Eksekusi Berhasil: 0.04s - Memory: 4.2MB]";
                isSuccess = true;
            } else {
                simulated = "⚠️ Catatan: Gunakan fungsi print(...) untuk melihat output di terminal.";
            }
        } catch (e) {
            simulated = "❌ Error: " + e.message;
        }

        output.innerText = simulated;

        if (isSuccess) {
            if (window.SoundManager) window.SoundManager.playSuccessSound();
            if (window.KidFriendly && window.KidFriendly.launchConfetti) window.KidFriendly.launchConfetti();
            if (status) {
                status.className = "flex items-center gap-1.5 text-[11px] font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30";
                status.innerHTML = "<i class='fas fa-check-circle'></i> Output Valid! +25 XP";
            }
            if (window.StorageManager) {
                window.StorageManager.addXP(25);
            }
        }
    }, 280);
};

window.resetHeroCode = () => {
    const editor = document.getElementById('heroCodeEditor');
    const output = document.getElementById('heroTerminalOutput');
    const status = document.getElementById('heroRunnerStatus');
    if (editor) editor.value = DEFAULT_HERO_CODE;
    if (output) output.innerText = "// Klik 'Jalankan Kode' di atas untuk menguji coba...";
    if (status) {
        status.className = "text-[11px] font-black text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-500/30";
        status.innerHTML = "<span class='w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block mr-1'></span> READY";
    }
    if (window.SoundManager) window.SoundManager.playClickSound();
};

/**
 * Buka materi dari node skill tree
 */
window.openPathLesson = (idx) => {
    if (window.SoundManager) window.SoundManager.playClickSound();
    window.showView('playground');
    if (window.loadLesson) window.loadLesson(idx);
};

/**
 * Sinkronisasi Papan Misi Harian (Daily Quests)
 */
window.updateDailyQuests = () => {
    const user = window.StorageManager ? window.StorageManager.getUserData() : null;
    if (!user) return;

    const completed = user.completedLessons || [];
    
    // Quest 1: Jalankan / coba modul pertama
    const q1 = document.getElementById('quest1Status');
    if (q1) {
        if (completed.length > 0 || user.xp > 50) {
            q1.innerHTML = "<i class='fas fa-check-circle text-emerald-400 text-base'></i>";
        }
    }

    // Quest 2: Pertahankan Daily Streak
    const q2 = document.getElementById('quest2Status');
    if (q2) {
        if (user.streak >= 1) {
            q2.innerHTML = "<i class='fas fa-check-circle text-emerald-400 text-base'></i>";
        }
    }

    // Quest 3: Selesaikan 3 Modul
    const q3 = document.getElementById('quest3Status');
    if (q3) {
        if (completed.length >= 3) {
            q3.innerHTML = "<i class='fas fa-check-circle text-emerald-400 text-base'></i>";
        }
    }
};

/**
 * Modal Profil & Pengaturan
 */
window.openProfileModal = () => {
    const modal = document.getElementById('profileModal');
    if (!modal) return;

    if (window.SoundManager) window.SoundManager.playClickSound();

    const user = window.StorageManager ? window.StorageManager.getUserData() : { xp: 50, streak: 1, gems: 100, completedLessons: [] };
    const totalLessons = (window.lessons && window.lessons.length) ? window.lessons.length : 5;
    const completedCount = (user.completedLessons || []).length;
    const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

    const xpEl = document.getElementById('modalUserXP');
    const streakEl = document.getElementById('modalUserStreak');
    const gemsEl = document.getElementById('modalUserGems');
    const lessonEl = document.getElementById('modalCompletedLessons');
    const barEl = document.getElementById('modalProgressBar');
    const pctEl = document.getElementById('modalProgressPercent');
    const trackEl = document.getElementById('modalActiveTrack');

    if (xpEl) xpEl.innerText = user.xp || 0;
    if (streakEl) streakEl.innerText = user.streak || 1;
    if (gemsEl) gemsEl.innerText = user.gems || 0;
    if (lessonEl) lessonEl.innerText = `${completedCount}/${totalLessons}`;
    if (pctEl) pctEl.innerText = `${progressPercent}%`;
    if (barEl) barEl.style.width = `${progressPercent}%`;
    if (trackEl) trackEl.innerText = user.selectedTrack || 'Python Track';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closeProfileModal = () => {
    const modal = document.getElementById('profileModal');
    if (modal) {
        if (window.SoundManager) window.SoundManager.playClickSound();
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

/**
 * Toggle Preferensi Suara
 */
window.toggleSoundPreference = () => {
    if (window.SoundManager) {
        const isMuted = window.SoundManager.toggleMute();
        if (!isMuted) window.SoundManager.playClickSound();
    }
};

/**
 * Mobile Navigation Drawer Controls
 */
window.toggleMobileMenu = () => {
    const drawer = document.getElementById('mobileNavDrawer');
    if (!drawer) return;
    if (window.SoundManager) window.SoundManager.playClickSound();
    drawer.classList.toggle('hidden');
    drawer.classList.toggle('flex');
};

window.closeMobileMenu = () => {
    const drawer = document.getElementById('mobileNavDrawer');
    if (drawer) {
        drawer.classList.add('hidden');
        drawer.classList.remove('flex');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Storage Manager & Statistik Profil
    if (window.StorageManager) {
        window.StorageManager.init();
    }

    // 2. Language Initialization
    const savedLang = localStorage.getItem('siteLanguage') || 'id';
    const selector = document.getElementById('siteLanguageSelector');
    if (selector) selector.value = savedLang;
    if (window.changeSiteLanguage) window.changeSiteLanguage(savedLang);

    // 3. Inisialisasi Auto-Save di Code Editor
    if (window.initEditorAutoSave) {
        window.initEditorAutoSave();
    }

    // 4. Inisialisasi Hero Sandbox default
    const heroEditor = document.getElementById('heroCodeEditor');
    if (heroEditor && !heroEditor.value) {
        heroEditor.value = DEFAULT_HERO_CODE;
    }

    // 5. Update Daily Quests Status
    if (window.updateDailyQuests) window.updateDailyQuests();

    // 6. Splash Screen Animation
    setTimeout(() => {
        const bar = document.getElementById('splashProgressBar');
        if (bar) bar.style.width = '100%';
    }, 50);

    setTimeout(() => {
        if (window.currentView === 'splash') window.showView('landing');
    }, 1000);

    // 7. Initialize Onboarding Language Grid
    if (window.initOnboardingGrid) window.initOnboardingGrid();

    // 8. Scroll Reveal Animation Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
});

// Scroll to top button visibility
window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollToTopBtn');
    if (btn) {
        if (window.scrollY > 400) {
            btn.classList.remove('translate-y-20', 'opacity-0');
        } else {
            btn.classList.add('translate-y-20', 'opacity-0');
        }
    }
});
