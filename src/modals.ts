const glowOverlay = document.createElement('div');

document.body.appendChild(glowOverlay);

Object.assign(glowOverlay.style, {
    position: 'fixed',
    top: '-1px',
    left: '-1px',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '20000',
    border: '2px solid transparent',
    boxShadow: 'inset 0 0 20px rgba(255, 0, 0, 1)',
    opacity: '0.75',
    transition: 'box-shadow 0.1s ease',
});

let hue = 0;

function animateGlow() {
    const color = `hsl(${hue}, 100%, 60%)`;
    glowOverlay.style.boxShadow = `inset 0 0 75px ${color}`;
    hue = (hue + 0.1) % 360;
    requestAnimationFrame(animateGlow);
}

animateGlow();

const modalContainer = document.createElement('div');

Object.assign(modalContainer.style, {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(33, 23, 89, 0.75)',
    backdropFilter: 'blur(1px)',
    zIndex: '20001',
    color: 'white',
    cursor: 'pointer',
    opacity: '0',
    transition: 'opacity 1s ease',
    fontFamily: "'FiraCode Nerd Font', monospace",
});

document.body.appendChild(modalContainer);

requestAnimationFrame(() => {
    modalContainer.style.opacity = '1';
});

modalContainer.addEventListener('click', () => {
    modalContainer.style.opacity = '0';
    setTimeout(() => {
        modalContainer.remove();
    }, 1000);
});

type Position = {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
};

class ModalText {
    text: string;
    textObject: HTMLElement;

    constructor(fontSize: string, positionObject: Position, color: string, text: string, extendedStyles: Partial<CSSStyleDeclaration> = {}, position: CSSStyleDeclaration['position'] = 'absolute') {
        this.text = text;
        this.textObject = document.createElement('div');

        Object.assign(this.textObject.style, {
            position: position,
            zIndex: '1',
            fontSize: fontSize,
            textShadow: '0 0 10px ' + color,
            ...positionObject,
            color: color,
            ...extendedStyles,
        });
    }

    appendChild() {
        this.textObject.innerHTML = this.text;
        modalContainer.appendChild(this.textObject);
    }
}

const modalWelcomeText = new ModalText('70px', { left: '10vw', top: '35vh' }, 'rgba(126, 83, 206, 1)', 'Welcome back!');
modalWelcomeText.appendChild();

const modalWelcomeTextSub = new ModalText('50px', { left: '10vw', top: 'calc(35vh + 80px)' }, 'rgba(162, 119, 242, 1)', 'おかえりなさい！');
modalWelcomeTextSub.appendChild();

const modalWelcomeSeparator = document.createElement('hr');
Object.assign(modalWelcomeSeparator.style, {
    position: 'fixed',
    top: 'calc(35vh + 80px + 60px)',
    left: '10vw',
    width: '80%',
    height: '6px',
    backgroundColor: '#a3a3a37f',
    border: 'none',
});
modalContainer.appendChild(modalWelcomeSeparator);

const modalInfoDesc = `VSCode improvements and visuals by Lanzoor.<br>Make sure to turn the NodeJS server on for the full experience.<br>Do note that updates disable the modifications, so refresh styles after a VSCode update!<br><b>Press CTRL+ALT+H to hide all overlays.</b><br><br><b><i>Good luck, and have fun! :D</b></i>`;

const modalInfoText = new ModalText('20px', { left: '10vw', top: 'calc(35vh + 80px + 90px)' }, 'rgba(193, 162, 252, 1)', modalInfoDesc, { lineHeight: '1.3' });
modalInfoText.appendChild();

const modalCloseInfoDesc = '- <b>Click anywhere on screen to close modal</b> -<br>- 画面のどこかをクリックするとモーダルが閉じます -';

const modalCloseInfoText = new ModalText('20px', { left: '50vw', bottom: '20px' }, 'rgba(193, 162, 252, 1)', modalCloseInfoDesc, { textAlign: 'center', transform: 'translateX(-50%)', animation: 'blurpleGlow 5s infinite linear' });
modalCloseInfoText.appendChild();

class Circle {
    circleObject: HTMLElement;

    constructor(diameter: string, color: string) {
        this.circleObject = document.createElement('div');

        Object.assign(this.circleObject.style, {
            position: 'fixed',
            width: diameter,
            height: diameter,
            borderRadius: '50%',
            backgroundColor: color,
            top: '50vh',
            left: '100vw',
            transform: 'translate(-50%, -50%)',
            zIndex: '20001',
            transition: 'transform 0.1s ease',
        });
    }

    display() {
        modalContainer.appendChild(this.circleObject);
    }
}

const circle1 = new Circle('100vw', 'rgba(126, 83, 206, 0.2)');
const circle2 = new Circle('75vw', 'rgba(126, 83, 206, 0.4)');

circle1.display();
circle2.display();

type BrightnessPoint = { hour: number; brightness: number };

function getBrightness(hour: number): number {
    const brightnessCurve: BrightnessPoint[] = [
        { hour: 0, brightness: 0.75 },
        { hour: 3, brightness: 0.8 },
        { hour: 6, brightness: 0.9 },
        { hour: 9, brightness: 0.95 },
        { hour: 12, brightness: 1.0 },
        { hour: 15, brightness: 0.95 },
        { hour: 18, brightness: 0.9 },
        { hour: 21, brightness: 0.8 },
        { hour: 24, brightness: 0.75 },
    ];

    // !
    let prev: BrightnessPoint = brightnessCurve[0]!;
    let next: BrightnessPoint = brightnessCurve[brightnessCurve.length - 1]!;

    for (let i = 1; i < brightnessCurve.length; i++) {
        let currentBrightness = brightnessCurve[i]!;
        let previousBrightness = brightnessCurve[i - 1]!;

        if (hour < currentBrightness.hour) {
            next = currentBrightness;
            prev = previousBrightness;
            break;
        }
    }

    const ratio = (hour - prev.hour) / (next.hour - prev.hour);
    return prev.brightness + ratio * (next.brightness - prev.brightness);
}

function updateBrightness() {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    const brightness = getBrightness(hour);
    document.body.style.filter = `brightness(${brightness})`;
}

setInterval(updateBrightness, 2000);
updateBrightness();
