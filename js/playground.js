/**
 * XellCodee - In-Browser Code Playground & Interactive Lessons Module (Electric Indigo & Aurora Cyan Edition)
 */

window.lessons = [
    {
        id: 0,
        title: "1. Variable & Output",
        lang: "Python",
        file: "main.py",
        instruction: "Buat variabel <code>name = 'Developer'</code> lalu cetak pesan sambutan <code>Hello, Developer!</code> menggunakan fungsi <code>print()</code>.",
        starterCode: "# Ketik kodemu di bawah ini:\nname = \"Developer\"\nprint(f\"Hello, {name}!\")\n",
        expectedOutput: "Hello, Developer!",
        hint: "Gunakan format string: print(f'Hello, {name}!') atau print('Hello, Developer!')"
    },
    {
        id: 1,
        title: "2. Control Flow (If/Else)",
        lang: "Python",
        file: "logic.py",
        instruction: "Tentukan apakah nilai <code>score = 85</code> sudah lulus. Jika score >= 75 cetak <code>'LULUS'</code>, jika tidak cetak <code>'REMEDIAL'</code>.",
        starterCode: "score = 85\nif score >= 75:\n    print(\"LULUS\")\nelse:\n    print(\"REMEDIAL\")\n",
        expectedOutput: "LULUS",
        hint: "Gunakan kondisi: if score >= 75: print('LULUS')"
    },
    {
        id: 2,
        title: "3. Perulangan Loop & List",
        lang: "Python",
        file: "loop.py",
        instruction: "Iterasikan list bahasa <code>['Python', 'JS', 'Rust']</code> dan cetak setiap elemennya ke terminal.",
        starterCode: "languages = [\"Python\", \"JavaScript\", \"Rust\"]\nfor lang in languages:\n    print(\"Belajar:\", lang)\n",
        expectedOutput: "Belajar: Python\nBelajar: JavaScript\nBelajar: Rust",
        hint: "Gunakan sintaks: for lang in languages: print('Belajar:', lang)"
    },
    {
        id: 3,
        title: "4. Function & Return Value",
        lang: "Python",
        file: "functions.py",
        instruction: "Buat fungsi <code>tambah(a, b)</code> yang mengembalikan hasil penjumlahan dua angka, lalu panggil dengan <code>print(tambah(10, 25))</code>.",
        starterCode: "def tambah(a, b):\n    return a + b\n\nprint(tambah(10, 25))\n",
        expectedOutput: "35",
        hint: "Definisikan fungsi dengan 'def tambah(a, b): return a + b' lalu cetak hasilnya."
    },
    {
        id: 4,
        title: "5. Algoritma Mini Project",
        lang: "Python",
        file: "project.py",
        instruction: "Saring angka genap dari list <code>[1, 2, 3, 4, 5, 6]</code> dan cetak total jumlah angka genap tersebut.",
        starterCode: "angka = [1, 2, 3, 4, 5, 6]\ngenap = [n for n in angka if n % 2 == 0]\nprint(\"Total genap:\", sum(genap))\n",
        expectedOutput: "Total genap: 12",
        hint: "Gunakan list comprehension atau looping dengan kondisi 'n % 2 == 0' lalu fungsi sum()."
    }
];

window.currentLessonIdx = 0;

/**
 * Render daftar navigasi modul di sidebar kiri
 */
window.renderLessonNavigation = () => {
    const listContainer = document.getElementById('lessonNavList');
    if (!listContainer) return;

    const completedLessons = window.StorageManager ? (window.StorageManager.getUserData().completedLessons || []) : [];

    listContainer.innerHTML = '';
    window.lessons.forEach((l, idx) => {
        const isCurrent = idx === window.currentLessonIdx;
        const isDone = completedLessons.includes(idx);

        const btn = document.createElement('button');
        btn.className = `w-full text-left p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
            isCurrent
                ? 'bg-xc-indigo/20 text-white border border-xc-indigo/50 shadow-sm'
                : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800'
        }`;
        
        btn.onclick = () => window.loadLesson(idx);
        btn.innerHTML = `
            <div class="flex items-center gap-2 truncate">
                <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isDone ? 'bg-xc-emerald text-white' : isCurrent ? 'bg-xc-indigo text-white' : 'bg-slate-800 text-slate-400'
                }">
                    ${isDone ? '<i class="fas fa-check"></i>' : idx + 1}
                </span>
                <span class="truncate">${l.title}</span>
            </div>
            ${isDone ? '<span class="text-[10px] text-xc-emerald font-black uppercase tracking-wider shrink-0">Selesai</span>' : ''}
        `;
        listContainer.appendChild(btn);
    });

    // Update Lesson Counter Text
    const counterEl = document.getElementById('lessonProgressCounter');
    if (counterEl) {
        counterEl.innerText = `${completedLessons.length}/${window.lessons.length} Selesai`;
    }
};

/**
 * Memuat modul latihan tertentu dan mengambil draft tersimpan
 */
window.loadLesson = (idx) => {
    if (idx < 0 || idx >= window.lessons.length) idx = 0;
    window.currentLessonIdx = idx;

    if (window.StorageManager) {
        window.StorageManager.saveUserData({ currentLessonIdx: idx });
    }

    const lesson = window.lessons[idx];
    if (!lesson) return;

    const titleEl = document.getElementById('lessonTitle');
    const instEl = document.getElementById('lessonInstruction');
    const editorEl = document.getElementById('codeEditor');
    const outputEl = document.getElementById('codeOutput');
    const statusEl = document.getElementById('outputStatus');
    const fileNameEl = document.getElementById('editorFileName');

    if (titleEl) titleEl.innerHTML = lesson.title;
    if (instEl) instEl.innerHTML = lesson.instruction;
    if (fileNameEl) fileNameEl.innerText = lesson.file || 'main.py';

    const savedCode = window.StorageManager 
        ? window.StorageManager.getLessonDraft(idx, lesson.starterCode)
        : lesson.starterCode;

    if (editorEl) editorEl.value = savedCode;
    if (outputEl) outputEl.innerText = "// Output terminal akan tampil di sini saat kode dijalankan...";
    if (statusEl) statusEl.className = "hidden";

    const nextBtn = document.getElementById('nextLessonBtn');
    if (nextBtn) nextBtn.classList.add('hidden');

    window.renderLessonNavigation();
};

/**
 * Inisialisasi auto-save pada code editor
 */
window.initEditorAutoSave = () => {
    const editorEl = document.getElementById('codeEditor');
    if (!editorEl) return;

    editorEl.addEventListener('input', (e) => {
        const code = e.target.value;
        if (window.StorageManager) {
            window.StorageManager.saveLessonDraft(window.currentLessonIdx, code);
        }
    });

    editorEl.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;
            if (window.StorageManager) {
                window.StorageManager.saveLessonDraft(window.currentLessonIdx, this.value);
            }
        }
    });
};

/**
 * Reset kode modul saat ini ke starter code awal
 */
window.resetCurrentCode = () => {
    const lesson = window.lessons[window.currentLessonIdx];
    if (!lesson) return;

    if (confirm('Kembalikan kode ke template awal? Perubahanmu pada modul ini akan di-reset.')) {
        if (window.StorageManager) {
            window.StorageManager.resetLessonDraft(window.currentLessonIdx);
        }
        const editorEl = document.getElementById('codeEditor');
        if (editorEl) editorEl.value = lesson.starterCode;

        const outputEl = document.getElementById('codeOutput');
        if (outputEl) outputEl.innerText = "// Kode di-reset ke template awal. Klik 'Jalankan Kode' untuk mencoba.";
        
        const statusEl = document.getElementById('outputStatus');
        if (statusEl) statusEl.className = "hidden";
    }
};

/**
 * Eksekusi dan validasi kode — menggunakan Pyodide (Python sungguhan)
 */
window.runCode = async () => {
    const code = document.getElementById('codeEditor')?.value || "";
    const outputEl = document.getElementById('codeOutput');
    const statusEl = document.getElementById('outputStatus');
    const runBtn = document.getElementById('runCodeBtn');
    const lesson = window.lessons[window.currentLessonIdx];

    if (!outputEl || !statusEl || !lesson) return;

    // Disable tombol & tampilkan loading
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = "<i class='fas fa-spinner fa-spin mr-2'></i> Menjalankan...";
    }

    const isFirstLoad = !window.isPyodideReady || !window.isPyodideReady();
    outputEl.innerText = isFirstLoad
        ? "⚙️ Memuat Python runtime (pertama kali ~5 detik)...\n"
        : "⚡ Menjalankan kode Python...\n";

    // Jalankan Python sungguhan via Pyodide
    const { output, isError } = await window.runPythonCode(code);

    // Kembalikan tombol
    if (runBtn) {
        runBtn.disabled = false;
        runBtn.innerHTML = "<i class='fas fa-play mr-2'></i> Jalankan Kode (RUN)";
    }

    outputEl.innerText = output;

    if (isError) {
        if (window.SoundManager) window.SoundManager.playErrorSound();
        statusEl.className = "flex items-center gap-2 text-xc-coral font-black bg-rose-950/40 px-4 py-2.5 rounded-xl border border-rose-500/30";
        statusEl.innerHTML = "<i class='fas fa-times-circle text-lg'></i> Kode mengandung error. Cek pesan di atas.";
        return;
    }

    // Validasi output terhadap expectedOutput lesson
    const expected = (lesson.expectedOutput || "").trim();
    const actual = output.trim();
    const isSuccess = actual === expected;

    if (isSuccess) {
        let xpReward = 25;
        let gemsReward = 10;
        let isFirst = true;

        if (window.StorageManager) {
            const result = window.StorageManager.completeLesson(window.currentLessonIdx);
            isFirst = result.isFirstTime;
            if (!isFirst) {
                xpReward = 5;
                gemsReward = 0;
            }
        }

        if (window.SoundManager) {
            if (window.currentLessonIdx === window.lessons.length - 1) {
                window.SoundManager.playLevelUpSound();
            } else {
                window.SoundManager.playSuccessSound();
            }
        }

        if (window.KidFriendly && window.KidFriendly.launchConfetti) {
            window.KidFriendly.launchConfetti();
        }

        statusEl.className = "flex items-center justify-between gap-2 text-xc-emerald font-black bg-emerald-950/40 px-4 py-2.5 rounded-xl border border-emerald-500/30";
        statusEl.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fas fa-check-circle text-lg text-xc-emerald"></i>
                <span>${isFirst ? '🎉 Hebat! Modul Selesai!' : '🌟 Latihan Ulang Selesai!'}</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
                <span class="bg-emerald-500/20 px-2 py-0.5 rounded text-xc-emerald font-black">+${xpReward} XP</span>
                ${gemsReward > 0 ? `<span class="bg-amber-500/20 px-2 py-0.5 rounded text-xc-amber font-black">+${gemsReward} Gems</span>` : ''}
            </div>
        `;

        window.renderLessonNavigation();

        const nextBtn = document.getElementById('nextLessonBtn');
        if (nextBtn && window.currentLessonIdx < window.lessons.length - 1) {
            nextBtn.classList.remove('hidden');
        }
    } else {
        if (window.SoundManager) window.SoundManager.playErrorSound();
        statusEl.className = "flex items-center gap-2 text-xc-coral font-black bg-rose-950/40 px-4 py-2.5 rounded-xl border border-rose-500/30";
        statusEl.innerHTML = `<i class='fas fa-lightbulb text-lg text-xc-amber'></i> Output belum sesuai. Diharapkan: <code class="ml-1 bg-rose-900/40 px-1.5 rounded">${expected}</code>`;
    }
};

window.nextLesson = () => {
    if (window.currentLessonIdx < window.lessons.length - 1) {
        window.loadLesson(window.currentLessonIdx + 1);
    }
};

window.showHint = () => {
    const lesson = window.lessons[window.currentLessonIdx];
    if (lesson) {
        alert("💡 Petunjuk Modul (" + lesson.title + "):\n\n" + lesson.hint);
    }
};
