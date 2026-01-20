let isClicking = false;
let idleTimer;
document.addEventListener('mousemove', (e) => {
    cursorRing.style.left = `${e.clientX}px`;
    cursorRing.style.top = `${e.clientY}px`;
    cursorRing.style.opacity = '1';
    clearTimeout(idleTimer);
    if (!isClicking) {
        idleTimer = setTimeout(() => {
            cursorRing.style.opacity = '0';
        }, 500);
    }
});
document.addEventListener('mousedown', () => {
    isClicking = true;
    clearTimeout(idleTimer);
    cursorRing.style.opacity = '1';
    cursorRing.style.border = `2px solid ${Colors.solidMagenta}`;
    cursorRing.style.boxShadow = `0 0 20px ${Colors.dimMagenta}, inset 0 0 20px ${Colors.dimMagenta}`;
    cursorRing.style.width = '45px';
    cursorRing.style.height = '45px';
});
document.addEventListener('mouseup', () => {
    isClicking = false;
    idleTimer = setTimeout(() => {
        cursorRing.style.opacity = '0';
    }, 500);
    cursorRing.style.border = `2px solid ${Colors.solidCyan}`;
    cursorRing.style.boxShadow = `0 0 8px ${Colors.dimCyan}, inset 0 0 8px ${Colors.dimCyan}`;
    cursorRing.style.width = '40px';
    cursorRing.style.height = '40px';
});
document.addEventListener('mousemove', (e) => {
    const clickTrailStyles = {
        width: '30px',
        height: '30px',
        backgroundColor: `${Colors.dimmerMagenta}`,
        boxShadow: `0 0 5px ${Colors.dimmerMagenta}, inset 0 0 5px ${Colors.dimmerMagenta}`,
    };
    const idleTrailStyles = {
        width: '10px',
        height: '10px',
        backgroundColor: `${Colors.dimmerCyan}`,
        boxShadow: `0 0 5px ${Colors.dimmerCyan}, inset 0 0 5px ${Colors.dimmerCyan}`,
    };
    const baseTrailStyles = {
        position: 'fixed',
        left: `${isClicking ? e.clientX - 15 : e.clientX - 5}px`,
        top: `${isClicking ? e.clientY - 15 : e.clientY - 5}px`,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '100000',
        opacity: '1',
        transition: 'opacity 1.75s ease',
    };
    const trail = document.createElement('div');
    Object.assign(trail.style, baseTrailStyles, isClicking ? clickTrailStyles : idleTrailStyles);
    document.body.appendChild(trail);
    requestAnimationFrame(() => {
        trail.style.opacity = '0';
    });
    setTimeout(() => {
        document.body.removeChild(trail);
    }, 1750);
});
const cursorRing = document.createElement('div');
document.body.appendChild(cursorRing);
Object.assign(cursorRing.style, {
    position: 'fixed',
    width: '40px',
    height: '40px',
    border: `2px solid ${Colors.solidCyan}`,
    boxShadow: `0 0 5px ${Colors.dimCyan}, inset 0 0 5px ${Colors.dimCyan}`,
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: '100001',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'transparent',
    transition: 'transform 0.05s ease-out, border 0.1s ease, box-shadow 0.1s ease, opacity 0.1s ease',
    opacity: '1',
});
const rippleContainer = document.createElement('div');
Object.assign(rippleContainer.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '29999',
});
document.body.appendChild(rippleContainer);
document.addEventListener('mousedown', (event) => {
    const ripple = document.createElement('div');
    const size = 20;
    const x = event.clientX - size / 2;
    const y = event.clientY - size / 2;
    Object.assign(ripple.style, {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0 0 7.5px rgba(255, 255, 255, 0.7), inset 0 0 5px rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
        transition: 'transform 0.75s ease-out, opacity 0.75s ease-out',
        transform: 'scale(0.5)',
        opacity: '0.6',
        zIndex: '2147483647',
    });
    rippleContainer.appendChild(ripple);
    requestAnimationFrame(() => {
        Object.assign(ripple.style, {
            transform: 'scale(6)',
            opacity: '0',
        });
    });
    setTimeout(() => {
        ripple.remove();
    }, 750);
});
