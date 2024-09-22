document.addEventListener('DOMContentLoaded', () => {
    const dockButtons = document.querySelectorAll('#dockAppMount .dock-button');
    const windows = document.querySelectorAll('.constructorWindow');
    windows.forEach(window => {
        window.style.display = 'none';
    });
    dockButtons.forEach(button => {
        button.addEventListener('click', () => {
            const windowId = button.id.split('_')[0];
            const targetWindow = document.getElementById(windowId);

            if (targetWindow) {
                if (targetWindow.style.display === 'none') {
                    targetWindow.style.display = 'block';
                } else {
                    targetWindow.style.display = 'none';
                }
            }
        });
    });
});
