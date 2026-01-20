const blurContainer = document.createElement('div');
document.body.appendChild(blurContainer);
Object.assign(blurContainer.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '20050',
    pointerEvents: 'none',
    overflow: 'hidden',
});
const blurOverlay = document.createElement('div');
blurContainer.appendChild(blurOverlay);
Object.assign(blurOverlay.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(3px)',
    opacity: '0',
    transition: 'opacity 0.3s ease',
});
function trackQuickInput() {
    const widget = document.querySelector('.quick-input-widget');
    const isVisible = widget !== null && widget.offsetParent !== null;
    if (isVisible) {
        blurOverlay.style.opacity = '1';
        const rect = widget.getBoundingClientRect();
        const clipPath = `polygon(
            0 0,
            0 100%,
            ${rect.left}px 100%,
            ${rect.left}px ${rect.top}px,
            ${rect.right}px ${rect.top}px,
            ${rect.right}px ${rect.bottom}px,
            ${rect.left}px ${rect.bottom}px,
            ${rect.left}px 100%,
            100% 100%,
            100% 0
    )`;
        blurOverlay.style.clipPath = clipPath;
    }
    else {
        blurOverlay.style.opacity = '0';
        blurOverlay.style.clipPath = 'none';
    }
    requestAnimationFrame(trackQuickInput);
}
trackQuickInput();
