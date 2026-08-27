/**
 * XellCodee - Pyodide Python Runtime Engine
 * Menjalankan Python sungguhan di browser via WebAssembly.
 */

(() => {
    let pyodideInstance = null;
    let loadingPromise = null;
    let isReady = false;

    /**
     * Inisialisasi Pyodide (lazy — hanya saat pertama kali dibutuhkan)
     */
    async function initPyodide() {
        if (isReady) return pyodideInstance;
        if (loadingPromise) return loadingPromise;

        loadingPromise = (async () => {
            try {
                pyodideInstance = await loadPyodide({
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
                });
                isReady = true;
                console.log("[Pyodide] ✅ Python runtime siap!");
                return pyodideInstance;
            } catch (err) {
                console.error("[Pyodide] ❌ Gagal load:", err);
                throw err;
            }
        })();

        return loadingPromise;
    }

    /**
     * Jalankan kode Python dan kembalikan output / error
     * @param {string} code - Kode Python yang akan dieksekusi
     * @returns {Promise<{output: string, isError: boolean}>}
     */
    window.runPythonCode = async function (code) {
        let pyodide;

        try {
            pyodide = await initPyodide();
        } catch (e) {
            return {
                output: "❌ Gagal memuat Python runtime. Cek koneksi internet kamu.",
                isError: true,
            };
        }

        // Redirect stdout ke variabel kita
        const captureScript = `
import sys
import io
_xell_stdout = io.StringIO()
sys.stdout = _xell_stdout
`;

        const fetchScript = `
sys.stdout = sys.__stdout__
_xell_stdout.getvalue()
`;

        try {
            await pyodide.runPythonAsync(captureScript);
            await pyodide.runPythonAsync(code);
            const output = await pyodide.runPythonAsync(fetchScript);
            return {
                output: output.trimEnd() || "(tidak ada output)",
                isError: false,
            };
        } catch (err) {
            // Pastikan stdout dikembalikan walau error
            try { await pyodide.runPythonAsync(`sys.stdout = sys.__stdout__`); } catch (_) {}

            // Format pesan error Python agar lebih rapi
            const msg = err.message || String(err);
            const lines = msg.split("\n");
            const errorLine = lines.find(l => /Error/.test(l)) || lines[lines.length - 1];
            return {
                output: "❌ " + errorLine.trim(),
                isError: true,
            };
        }
    };

    /**
     * Pre-warm Pyodide di background saat halaman idle.
     * Dipanggil oleh app.js setelah halaman siap.
     */
    window.prewarmPyodide = function () {
        initPyodide().catch(() => {});
    };

    window.isPyodideReady = () => isReady;
})();
