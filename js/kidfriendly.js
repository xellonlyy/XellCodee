/**
 * XellCodee - Kid-Friendly & Beginner Accessibility Module
 * Fitur:
 * 1. Click-to-Insert Code Chips (Blok Bantuan Ketik)
 * 2. Narasi Suara Soal (Web Speech API Text-to-Speech)
 * 3. Bedah Kode Sederhana (Analogi Bahasa Manusia)
 * 4. Canvas Confetti Particle Celebration
 * 5. Lencana Prestasi (Kid-Friendly Badges)
 */

window.KidFriendly = (function () {

    /**
     * 1. Click-to-Insert Code Chips
     */
    function insertSnippet(snippet, targetEditorId = 'codeEditor') {
        const editor = document.getElementById(targetEditorId);
        if (!editor) return;

        editor.focus();
        const start = editor.selectionStart || 0;
        const end = editor.selectionEnd || 0;
        const text = editor.value;

        const before = text.substring(0, start);
        const after = text.substring(end);
        editor.value = before + snippet + after;

        const newPos = start + snippet.length;
        editor.selectionStart = editor.selectionEnd = newPos;

        if (window.SoundManager) window.SoundManager.playClickSound();

        // Trigger input event to update autosave
        editor.dispatchEvent(new Event('input', { bubbles: true }));
    }

    /**
     * 2. Narasi Suara Instruksi (Read Aloud via Web Speech API)
     */
    let currentUtterance = null;

    function speakText(text) {
        if (!('speechSynthesis' in window)) {
            alert('Fitur narasi suara tidak didukung di browser ini.');
            return;
        }

        // Hentikan suara jika sedang berbicara
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            updateSpeakerIcons(false);
            return;
        }

        // Bersihkan tag HTML
        const cleanText = text.replace(/<[^>]*>?/gm, '');
        const lang = localStorage.getItem('siteLanguage') || 'id';

        currentUtterance = new SpeechSynthesisUtterance(cleanText);
        currentUtterance.lang = lang === 'en' ? 'en-US' : 'id-ID';
        currentUtterance.rate = 0.95; // Kecepatan sedikit lebih santai untuk anak-anak
        currentUtterance.pitch = 1.05; // Nada ramah

        currentUtterance.onstart = () => updateSpeakerIcons(true);
        currentUtterance.onend = () => updateSpeakerIcons(false);
        currentUtterance.onerror = () => updateSpeakerIcons(false);

        window.speechSynthesis.speak(currentUtterance);
    }

    function updateSpeakerIcons(isPlaying) {
        document.querySelectorAll('.btn-speaker-icon').forEach(el => {
            if (isPlaying) {
                el.className = 'btn-speaker-icon fas fa-volume-high text-xc-cyan animate-pulse';
            } else {
                el.className = 'btn-speaker-icon fas fa-volume-up text-slate-400 hover:text-xc-cyan';
            }
        });
    }

    /**
     * 3. Bedah Kode Sederhana (Analogi Kehidupan Sehari-hari)
     */
    const CODE_EXPLANATIONS = {
        0: [
            { code: "name = 'Developer'", meaning: "📦 <b>Kotak Bernama 'name'</b>: Komputer membuat kotak penyimpanan bernama <code>name</code> dan memasukkan tulisan <i>'Developer'</i> ke dalamnya." },
            { code: "print(f'Hello, {name}!')", meaning: "🗣️ <b>Katakan ke Layar</b>: Komputer membuka kotak <code>name</code> lalu mengucapkan salam sambutan ke layar terminal." }
        ],
        1: [
            { code: "score = 85", meaning: "📦 <b>Kotak Nilai</b>: Menyimpan angka 85 ke dalam kotak <code>score</code>." },
            { code: "if score >= 75:", meaning: "🚦 <b>Pemeriksaan Logika</b>: 'Apakah isi kotak score sama dengan atau lebih dari 75?'" },
            { code: "print('LULUS')", meaning: "🎉 <b>Jika Benar</b>: Komputer akan menampilkan kata 'LULUS'." }
        ],
        2: [
            { code: "languages = ['Python', 'JS', 'Rust']", meaning: "📋 <b>Daftar Belanjaan (List)</b>: Menyimpan beberapa nama bahasa pemrograman sekaligus dalam satu kelompok." },
            { code: "for lang in languages:", meaning: "🔁 <b>Antrean Satu per Satu</b>: Mengambil satu per satu barang di daftar belanjaan untuk diproses." },
            { code: "print('Belajar:', lang)", meaning: "🖨️ <b>Cetak Setiap Barang</b>: Menampilkan kata 'Belajar:' diikuti nama bahasa yang sedang dipegang." }
        ],
        3: [
            { code: "def tambah(a, b):", meaning: "🛠️ <b>Mesin / Robot 'tambah'</b>: Kita membuat robot otomatis bernama <code>tambah</code> yang siap menerima 2 angka." },
            { code: "return a + b", meaning: "🎁 <b>Kado Hasil</b>: Robot menjumlahkan kedua angka dan memberikan hasilnya kembali kepada kita." }
        ],
        4: [
            { code: "genap = [n for n in angka if n % 2 == 0]", meaning: "🔍 <b>Penyaring Otomatis</b>: Robot memeriksa semua angka satu per satu dan hanya memilih angka yang habis dibagi 2 (angka genap)." },
            { code: "print('Total genap:', sum(genap))", meaning: "🧮 <b>Hitung Total</b>: Robot menjumlahkan semua angka genap yang berhasil disaring lalu menampilkannya." }
        ]
    };

    function showCodeExplainer(lessonIdx = 0) {
        const explanations = CODE_EXPLANATIONS[lessonIdx] || CODE_EXPLANATIONS[0];
        const container = document.getElementById('codeExplainerContent');
        if (!container) return;

        container.innerHTML = explanations.map(item => `
            <div class="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
                <code class="text-xs font-mono text-cyan-300 font-bold block mb-1.5">${item.code}</code>
                <p class="text-xs text-slate-300 font-medium leading-relaxed">${item.meaning}</p>
            </div>
        `).join('');

        const modal = document.getElementById('codeExplainerModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        if (window.SoundManager) window.SoundManager.playClickSound();
    }

    function hideCodeExplainer() {
        const modal = document.getElementById('codeExplainerModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    /**
     * 4. Canvas Confetti Particle Celebration
     */
    function launchConfetti() {
        let canvas = document.getElementById('confettiCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'confettiCanvas';
            canvas.style.position = 'fixed';
            canvas.style.inset = '0';
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '9999';
            document.body.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6'];
        const particles = [];

        for (let i = 0; i < 90; i++) {
            particles.push({
                x: canvas.width * 0.5,
                y: canvas.height * 0.6,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.8) * 16 - 4,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 10,
                opacity: 1
            });
        }

        let animationFrame;
        const startTime = Date.now();

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const elapsed = Date.now() - startTime;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.35; // Gravity
                p.vx *= 0.98; // Air resistance
                p.rotation += p.vRot;
                p.opacity = Math.max(0, 1 - (elapsed / 2500));

                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            });

            if (elapsed < 2500) {
                animationFrame = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animationFrame);
            }
        }

        render();
    }

    return {
        insertSnippet,
        speakText,
        showCodeExplainer,
        hideCodeExplainer,
        launchConfetti
    };

})();
