/**
 * XellCodee - Security & Anti-Inspect Protection Layer
 * Mencegah inspect element, view source, right-click, dan download gambar.
 */

(function () {
    'use strict';

    // 1. Disable Right Click (Context Menu)
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });

    // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S)
    document.addEventListener('keydown', function (e) {
        // F12 key
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        const isCtrl = e.ctrlKey || e.metaKey; // Windows Ctrl or Mac Cmd

        if (isCtrl) {
            // Ctrl + Shift + I (Inspect)
            // Ctrl + Shift + J (Console)
            // Ctrl + Shift + C (Inspect Element)
            if (e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl + U (View Source)
            if (e.key === 'U' || e.key === 'u' || e.keyCode === 85) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl + S (Save Page)
            if (e.key === 'S' || e.key === 's' || e.keyCode === 83) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    });

    // 3. Disable Image Dragging & Text Selection on Media
    document.addEventListener('dragstart', function (e) {
        if (e.target.nodeName === 'IMG' || e.target.nodeName === 'SVG') {
            e.preventDefault();
            return false;
        }
    });

    // 4. Console Warning for DevTools
    console.log('%c⚠️ XellCodee Protection Active', 'color: #1CB0F6; font-size: 22px; font-weight: bold;');
    console.log('%cInspect element dan pengambilan asset dinonaktifkan.', 'color: #FF4B4B; font-size: 14px;');

    // 5. Anti-Debugging Hook
    setInterval(function () {
        (function () {
            return false;
        }['constructor']('debugger')());
    }, 1500);

})();
