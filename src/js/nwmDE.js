document.addEventListener('DOMContentLoaded', () => {
    const windows = document.querySelectorAll('.constructorWindow');
    const header = document.getElementById('header'); // Get the header element

    windows.forEach((window, index) => {
        window.style.zIndex = 20 + index;
        window.style.position = 'absolute';
    });

    windows.forEach(windowConstructor => {
        const windowHeader = windowConstructor.querySelector('.windowHeader');

        let isDragging = false;
        let isResizing = false;
        let resizingDirection = null;
        let offsetX, offsetY;

        windowHeader.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - windowConstructor.getBoundingClientRect().left;
            offsetY = e.clientY - windowConstructor.getBoundingClientRect().top;
            windowConstructor.style.zIndex = 30;

            windows.forEach(win => {
                if (win !== windowConstructor && parseInt(win.style.zIndex, 10) >= 30) {
                    win.style.zIndex = parseInt(win.style.zIndex, 10) - 1;
                }
            });

            windowHeader.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let left = e.clientX - offsetX;
                let top = e.clientY - offsetY;
                windowConstructor.style.left = `${left}px`;
                windowConstructor.style.top = `${top}px`;
            } else if (isResizing) {
                const rect = windowConstructor.getBoundingClientRect();
                let newWidth = rect.width;
                let newHeight = rect.height;

                if (resizingDirection === 'top-left') {
                    newWidth = Math.max(500, rect.right - e.clientX);
                    newHeight = Math.max(400, rect.bottom - e.clientY);
                    windowConstructor.style.left = `${e.clientX}px`;
                    windowConstructor.style.top = `${e.clientY}px`;
                } else if (resizingDirection === 'top-right') {
                    newWidth = Math.max(500, e.clientX - rect.left);
                    newHeight = Math.max(400, rect.bottom - e.clientY);
                    windowConstructor.style.top = `${e.clientY}px`;
                } else if (resizingDirection === 'bottom-left') {
                    newWidth = Math.max(500, rect.right - e.clientX);
                    newHeight = Math.max(400, e.clientY - rect.top);
                    windowConstructor.style.left = `${e.clientX}px`;
                } else if (resizingDirection === 'bottom-right') {
                    newWidth = Math.max(500, e.clientX - rect.left);
                    newHeight = Math.max(400, e.clientY - rect.top);
                } else if (resizingDirection === 'left') {
                    newWidth = Math.max(500, rect.right - e.clientX);
                    windowConstructor.style.left = `${e.clientX}px`;
                } else if (resizingDirection === 'right') {
                    newWidth = Math.max(500, e.clientX - rect.left);
                } else if (resizingDirection === 'top') {
                    newHeight = Math.max(400, rect.bottom - e.clientY);
                    windowConstructor.style.top = `${e.clientY}px`;
                } else if (resizingDirection === 'bottom') {
                    newHeight = Math.max(400, e.clientY - rect.top);
                }

                windowConstructor.style.width = `${newWidth}px`;
                windowConstructor.style.height = `${newHeight}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                windowHeader.style.cursor = 'grab';

                // Snap the window back to just below the header if necessary
                const rect = windowConstructor.getBoundingClientRect();
                const headerRect = header.getBoundingClientRect();
                if (rect.bottom > headerRect.top && rect.top < headerRect.top) {
                    windowConstructor.style.top = `${headerRect.bottom}px`;
                }
            } else if (isResizing) {
                isResizing = false;
                windowConstructor.style.cursor = 'default';
            }
        });

        windowConstructor.addEventListener('mousemove', (e) => {
            const rect = windowConstructor.getBoundingClientRect();
            const proximity = {
                left: e.clientX - rect.left,
                right: rect.right - e.clientX,
                top: e.clientY - rect.top,
                bottom: rect.bottom - e.clientY,
            };
            const edgeThreshold = 10;

            if (isResizing) return;

            if (proximity.left < edgeThreshold && proximity.top < edgeThreshold) {
                windowConstructor.style.cursor = 'nw-resize';
                resizingDirection = 'top-left';
            } else if (proximity.right < edgeThreshold && proximity.top < edgeThreshold) {
                windowConstructor.style.cursor = 'ne-resize';
                resizingDirection = 'top-right';
            } else if (proximity.left < edgeThreshold && proximity.bottom < edgeThreshold) {
                windowConstructor.style.cursor = 'sw-resize';
                resizingDirection = 'bottom-left';
            } else if (proximity.right < edgeThreshold && proximity.bottom < edgeThreshold) {
                windowConstructor.style.cursor = 'se-resize';
                resizingDirection = 'bottom-right';
            } else if (proximity.left < edgeThreshold) {
                windowConstructor.style.cursor = 'w-resize';
                resizingDirection = 'left';
            } else if (proximity.right < edgeThreshold) {
                windowConstructor.style.cursor = 'e-resize';
                resizingDirection = 'right';
            } else if (proximity.top < edgeThreshold) {
                windowConstructor.style.cursor = 'n-resize';
                resizingDirection = 'top';
            } else if (proximity.bottom < edgeThreshold) {
                windowConstructor.style.cursor = 's-resize';
                resizingDirection = 'bottom';
            } else {
                windowConstructor.style.cursor = 'default';
                resizingDirection = null;
            }
        });

        windowConstructor.addEventListener('mousedown', (e) => {
            if (resizingDirection) {
                isResizing = true;
                e.preventDefault();
            } else {
                windowConstructor.style.zIndex = 30;
                windows.forEach(win => {
                    if (win !== windowConstructor && parseInt(win.style.zIndex, 10) >= 30) {
                        win.style.zIndex = parseInt(win.style.zIndex, 10) - 1;
                    }
                });
            }
        });
    });
});