/**
 * XellCodee - Interactive Onboarding Wizard Module (Electric Indigo & Aurora Edition)
 */

window.obData = {
    selectedLanguages: ['Python'],
    reason: "",
    dailyGoal: "15 mins",
    priorKnowledge: "Dasar"
};

window.currentObStep = 1;
window.totalObSteps = 5;

const languagesList = [
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg", popular: true },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", popular: true },
    { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
    { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
    { name: "Go", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg" },
    { name: "Rust", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg" },
    { name: "HTML/CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" }
];

window.initOnboardingGrid = () => {
    // Ambil data onboarding tersimpan di localStorage bila ada
    if (window.StorageManager) {
        const saved = window.StorageManager.getOnboarding();
        if (saved) {
            if (saved.selectedLanguages && saved.selectedLanguages.length > 0) {
                window.obData.selectedLanguages = saved.selectedLanguages;
            }
            if (saved.reason) window.obData.reason = saved.reason;
            if (saved.dailyGoal) window.obData.dailyGoal = saved.dailyGoal;
            if (saved.priorKnowledge) window.obData.priorKnowledge = saved.priorKnowledge;
        }
    }

    const langGrid = document.getElementById('langGrid');
    if (!langGrid) return;
    
    langGrid.innerHTML = '';
    languagesList.forEach(lang => {
        const isSelected = window.obData.selectedLanguages.includes(lang.name);
        const div = document.createElement('div');
        div.className = `opt-card p-4 rounded-2xl flex flex-col items-center gap-2 hover:scale-[1.02] transition-all bg-slate-900 border border-slate-800 text-white ${isSelected ? 'selected' : ''}`;
        div.innerHTML = `
            <div class="relative">
                <img src="${lang.icon}" class="w-12 h-12 object-contain" alt="${lang.name}">
                ${lang.popular ? '<span class="absolute -top-2 -right-2 bg-xc-emerald text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase shadow">Populer</span>' : ''}
            </div>
            <span class="font-black text-white text-base">${lang.name}</span>
        `;
        div.onclick = () => window.toggleObLanguage(lang.name, div);
        langGrid.appendChild(div);
    });

    window.validateObStep();
};

window.toggleObLanguage = (langName, element) => {
    if (window.SoundManager) window.SoundManager.playClickSound();
    if (window.obData.selectedLanguages.includes(langName)) {
        if (window.obData.selectedLanguages.length > 1) {
            window.obData.selectedLanguages = window.obData.selectedLanguages.filter(l => l !== langName);
            element.classList.remove('selected');
        }
    } else {
        window.obData.selectedLanguages.push(langName);
        element.classList.add('selected');
    }
    window.validateObStep();
};

window.selectSingle = (stepNum, value, element) => {
    if (window.SoundManager) window.SoundManager.playClickSound();
    const parent = element.parentElement;
    Array.from(parent.children).forEach(child => child.classList.remove('selected'));
    element.classList.add('selected');
    
    if (stepNum === 2) window.obData.reason = value;
    if (stepNum === 3) window.obData.dailyGoal = value;
    if (stepNum === 4) window.obData.priorKnowledge = value;
    window.validateObStep();
};

window.validateObStep = () => {
    const btn = document.getElementById('obContinueBtn');
    if (!btn) return;

    let isValid = false;
    if (window.currentObStep === 1 && window.obData.selectedLanguages.length > 0) isValid = true;
    if (window.currentObStep === 2 && window.obData.reason !== "") isValid = true;
    if (window.currentObStep === 3 && window.obData.dailyGoal !== "") isValid = true;
    if (window.currentObStep === 4 && window.obData.priorKnowledge !== "") isValid = true;
    if (window.currentObStep === 5) isValid = true;

    if (isValid) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    }
};

window.nextObStep = () => {
    if (window.SoundManager) window.SoundManager.playClickSound();
    if (window.currentObStep >= window.totalObSteps) {
        window.startFreeLearning();
        return;
    }
    
    document.getElementById(`ob-step-${window.currentObStep}`)?.classList.remove('active');
    window.currentObStep++;
    document.getElementById(`ob-step-${window.currentObStep}`)?.classList.add('active');

    if (window.currentObStep === 4) {
        const textEl = document.getElementById('knowledgeLangText');
        if (textEl) textEl.innerText = window.obData.selectedLanguages[0] || "Coding";
    }
    if (window.currentObStep === 5) {
        const langEl = document.getElementById('summaryPrimaryLang');
        const goalEl = document.getElementById('summaryGoal');
        if (langEl) langEl.innerText = window.obData.selectedLanguages.join(', ');
        if (goalEl) goalEl.innerText = window.obData.dailyGoal;
    }

    document.getElementById('obBackBtn')?.classList.remove('hidden');
    const progressBar = document.getElementById('obProgressBar');
    if (progressBar) progressBar.style.width = `${(window.currentObStep / window.totalObSteps) * 100}%`;
    window.validateObStep();
};

window.prevObStep = () => {
    if (window.SoundManager) window.SoundManager.playClickSound();
    if (window.currentObStep <= 1) return;
    
    document.getElementById(`ob-step-${window.currentObStep}`)?.classList.remove('active');
    window.currentObStep--;
    document.getElementById(`ob-step-${window.currentObStep}`)?.classList.add('active');
    
    if (window.currentObStep === 1) {
        document.getElementById('obBackBtn')?.classList.add('hidden');
    }
    
    const progressBar = document.getElementById('obProgressBar');
    if (progressBar) progressBar.style.width = `${(window.currentObStep / window.totalObSteps) * 100}%`;
    window.validateObStep();
};

window.startFreeLearning = () => {
    if (window.SoundManager) window.SoundManager.playSuccessSound();
    if (window.StorageManager) {
        window.StorageManager.saveOnboarding(window.obData);
    }

    const activeLang = window.obData.selectedLanguages[0] || 'Python';
    window.currentPlaygroundLang = activeLang;
    
    const userData = window.StorageManager ? window.StorageManager.getUserData() : null;
    const targetLesson = (userData && typeof userData.currentLessonIdx === 'number') ? userData.currentLessonIdx : 0;
    
    window.showView('playground');
    window.loadLesson(targetLesson);
};
