/**
 * XellCodee - i18n Multilingual Support (Electric Indigo & Aurora Cyan Edition)
 */

const translations = {
    "id": {
        "nav_features": "Fitur",
        "nav_paths": "Peta Jalur",
        "nav_curriculum": "Kurikulum",
        "nav_quests": "Misi Harian",
        "nav_playground": "Code Playground",
        "nav_start": "Mulai Gratis",
        "hero_badge": "100% GRATIS · INTERACTIVE CODING ACADEMY",
        "hero_title": "Kuasai Software Engineering dengan <span class='gradient-text-aurora'>praktek nyata</span>.",
        "hero_desc": "Tinggalkan tutorial pasif. Ketik dan uji coba kode nyata langsung di browser, selesaikan skill tree berjenjang, dan bangun daily streakmu setiap hari.",
        "btn_get_started": "Mulai Belajar Sekarang",
        "btn_try_sandbox": "Buka Code Playground",
        "stat_active": "50k+ Pemelajar Aktif",
        "stat_rating": "4.9/5 Rating Komunitas",
        "stat_lessons": "250+ Modul Interaktif",
        "path_title": "Peta Jalur Belajar (Skill Tree)",
        "path_subtitle": "Kemajuan belajar bertingkat dengan roadmap terstruktur dari nol hingga mahir.",
        "quests_title": "Misi Harian & Gamifikasi",
        "quests_subtitle": "Dapatkan bonus XP dan Gems setiap hari untuk menjaga konsistensi belajarmu.",
        "features_title": "Kenapa Belajar di XellCodee?",
        "features_subtitle": "Metode belajar hands-on yang terbukti 3x lebih cepat dalam memahami logika pemrograman.",
        "curriculum_title": "Kurikulum Lengkap Standar Industri",
        "curriculum_desc": "Dirancang dari dasar mutlak hingga arsitektur algoritma modern dan problem solving nyata.",
        "footer_desc": "Platform edukasi coding berbasis web interaktif dan gamified untuk siapa saja yang ingin belajar software engineering 100% gratis."
    },
    "en": {
        "nav_features": "Features",
        "nav_paths": "Skill Tree",
        "nav_curriculum": "Curriculum",
        "nav_quests": "Daily Quests",
        "nav_playground": "Code Playground",
        "nav_start": "Start Free",
        "hero_badge": "100% FREE · INTERACTIVE CODING ACADEMY",
        "hero_title": "Master Software Engineering through <span class='gradient-text-aurora'>active practice</span>.",
        "hero_desc": "Stop watching passive tutorials. Write and execute real code directly in your browser, progress through the interactive skill tree, and keep your daily streak alive.",
        "btn_get_started": "Get Started Free",
        "btn_try_sandbox": "Open Code Playground",
        "stat_active": "50k+ Active Coders",
        "stat_rating": "4.9/5 Community Rating",
        "stat_lessons": "250+ Interactive Modules",
        "path_title": "Skill Tree & Learning Pathway",
        "path_subtitle": "Gamified, structured progression from absolute zero to software mastery.",
        "quests_title": "Daily Quests & Rewards",
        "quests_subtitle": "Earn daily XP and Gems rewards to accelerate your software engineering habit.",
        "features_title": "Why Learn on XellCodee?",
        "features_subtitle": "Hands-on browser-based execution proven to build deep algorithmic problem solving skills.",
        "curriculum_title": "Exhaustive Industry Curriculum",
        "curriculum_desc": "From primitive variables to scalable data structures and high-performance algorithms.",
        "footer_desc": "Gamified web-based coding education for modern developers. Practice daily, master algorithms, and build real projects for free."
    }
};

window.changeSiteLanguage = (langCode) => {
    const dict = translations[langCode] || translations["id"];
    document.querySelectorAll('[data-i18n]').forEach(el => { 
        const k = el.getAttribute('data-i18n'); 
        if(dict[k]) el.innerHTML = dict[k]; 
    });
    localStorage.setItem('siteLanguage', langCode);
};
