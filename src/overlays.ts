let serverOnline = false;

const defaultDescStyle = {
    position: 'absolute',
    padding: '10px 15px',
    background: 'rgba(30, 30, 30, 0.9)',
    backdropFilter: 'blur(5px)',
    fontFamily: "'FiraCode Nerd Font', monospace",
    fontSize: '13px',
    border: `1px solid ${Colors.solidCyan}`,
    borderRadius: '8px',
    boxShadow: `0 0 15px ${Colors.solidCyan}, inset 0 0 15px ${Colors.solidCyan}`,
    pointerEvents: 'none',
    color: `${Colors.solidCyan}`,
    zIndex: '30000',
    maxWidth: '300px',
    whiteSpace: 'pre-wrap',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    opacity: '0',
    transform: 'translateY(5px)',
};

const defaultTextStyle = {
    position: 'relative',
    zIndex: '1',
};

const defaultOverlayStyle = {
    padding: '7.5px 15px',
    background: Colors.dimCyan,
    backdropFilter: 'blur(5px)',
    fontFamily: "'FiraCode Nerd Font', monospace",
    fontSize: '14px',
    border: `1px solid ${Colors.solidCyan}`,
    borderRadius: '8px',
    boxShadow: `0 0 20px ${Colors.solidCyan}`,
    transition: 'background-color 0.5s ease, transform 0.5s ease, box-shadow 0.5s ease',
    pointerEvents: 'auto',
    cursor: 'default',
    zIndex: '20001',
    color: `${Colors.solidCyan}`,
    position: 'relative',
};

const startTime = Date.now();
const overlayContainer = document.createElement('div');

overlayContainer.id = 'overlay-container';
document.body.appendChild(overlayContainer);

Object.assign(overlayContainer.style, {
    position: 'fixed',
    bottom: '30px',
    left: '20px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '20px',
    zIndex: '20000',
    pointerEvents: 'none',
});

type Accent = {
    solid: string;
    light: string;
    dim: string;
};

const cyanAccent: Accent = {
    solid: Colors.solidCyan,
    light: Colors.lightCyan,
    dim: Colors.dimCyan,
};

const redAccent: Accent = {
    solid: Colors.solidRed,
    light: Colors.lightRed,
    dim: Colors.dimRed,
};

const yellowAccent: Accent = {
    solid: Colors.solidYellow,
    light: Colors.lightYellow,
    dim: Colors.dimYellow,
};

const greenAccent: Accent = {
    solid: Colors.solidGreen,
    light: Colors.lightGreen,
    dim: Colors.dimGreen,
};

type OverlayOptions = {
    text?: string;
    styles?: Partial<CSSStyleDeclaration>;
    accent?: Accent;
    animated?: boolean;
    desc?: boolean;
};

class Overlay {
    obj: HTMLDivElement;
    textEl: HTMLSpanElement;

    descEl?: HTMLDivElement;
    descTextEl?: HTMLDivElement;

    private accent: Accent;
    private animated: boolean;
    private animationsBound = false;

    constructor(optionsOrStyles: OverlayOptions | Partial<CSSStyleDeclaration> = {}, animatedFlag: boolean = false) {
        let options: OverlayOptions;

        if (optionsOrStyles && typeof optionsOrStyles === 'object' && !('text' in optionsOrStyles) && !('accent' in optionsOrStyles)) {
            options = {
                styles: optionsOrStyles as Partial<CSSStyleDeclaration>,
                animated: animatedFlag,
            };
        } else {
            options = optionsOrStyles as OverlayOptions;
        }

        const { text = '', styles = {}, accent = cyanAccent, animated = false, desc = false } = options;

        this.accent = accent;
        this.animated = animated;

        this.obj = document.createElement('div');
        Object.assign(this.obj.style, defaultOverlayStyle, styles);
        overlayContainer.appendChild(this.obj);

        this.textEl = document.createElement('span');
        this.textEl.textContent = text;
        Object.assign(this.textEl.style, defaultTextStyle);
        this.obj.appendChild(this.textEl);

        if (desc) {
            this.createDesc();
        }

        this.setAccent(accent);
        this.bindAnimations();
    }

    setAccent(accent: Accent) {
        if (accent != this.accent) {
            this.accent = accent;
            this.obj.style.background = accent.dim;
            this.obj.style.border = `1px solid ${accent.solid}`;
            this.obj.style.color = accent.solid;
            this.obj.style.boxShadow = `0 0 20px ${accent.solid}`;
        }
    }

    setText(text: string) {
        this.textEl.textContent = text;
    }

    start(callback: () => void) {
        callback();
    }

    private createDesc() {
        this.descEl = document.createElement('div');
        Object.assign(this.descEl.style, defaultDescStyle);

        this.descTextEl = document.createElement('div');
        Object.assign(this.descTextEl.style, defaultTextStyle);
        this.descEl.appendChild(this.descTextEl);

        document.body.appendChild(this.descEl);

        this.obj.addEventListener('mouseenter', () => this.showDesc());
        this.obj.addEventListener('mouseleave', () => this.hideDesc());
    }

    setDescHTML(html: string) {
        if (!this.descTextEl) return;
        this.descTextEl.innerHTML = html;
    }

    private showDesc() {
        if (!this.descEl) return;

        this.descEl.style.opacity = '0';
        this.descEl.style.display = 'block';

        const rect = this.obj.getBoundingClientRect();
        const height = this.descEl.offsetHeight;

        this.descEl.style.left = `${rect.left + rect.width / 2}px`;
        this.descEl.style.top = `${rect.top - height - 10}px`;
        this.descEl.style.transform = 'translateX(-50%) translateY(0)';
        this.descEl.style.opacity = '1';
    }

    private hideDesc() {
        if (!this.descEl) return;
        this.descEl.style.opacity = '0';
        this.descEl.style.transform = 'translateX(-50%) translateY(5px)';
    }

    private bindAnimations() {
        if (!this.animated || this.animationsBound) return;
        this.animationsBound = true;

        this.obj.addEventListener('mouseenter', () => {
            this.obj.style.transform = 'translateY(-2.5px) scale(1.05)';
            this.obj.style.boxShadow = `0 0 20px ${this.accent.solid}, inset 0 0 10px ${this.accent.solid}`;
        });

        this.obj.addEventListener('mouseleave', () => {
            this.obj.style.transform = 'translateY(0) scale(1)';
            this.obj.style.boxShadow = `0 0 20px ${this.accent.solid}`;
        });

        this.obj.addEventListener('mousedown', () => {
            this.obj.style.transition = 'none';
            this.obj.style.background = this.accent.light;
            this.obj.style.transform = 'translateY(-5px) scale(1.1)';
            void this.obj.offsetWidth;
            this.obj.style.transition = 'background-color 0.5s ease, transform 0.5s ease, box-shadow 0.5s ease';
            requestAnimationFrame(() => {
                this.obj.style.transform = 'translateY(-2.5px) scale(1)';
                this.obj.style.background = this.accent.dim;
            });
        });
    }
}

const timeOverlay = new Overlay({
    text: '0h 0m 0.000s',
    accent: cyanAccent,
    animated: true,
    desc: false,
});

timeOverlay.obj.style.animation = 'blurpleGlow 5s ease infinite';

function updateTimer() {
    const now = Date.now();
    const elapsed = now - startTime;
    const hours = Math.floor(elapsed / 3600000);
    const mins = Math.floor((elapsed % 3600000) / 60000);
    const secs = Math.floor((elapsed % 60000) / 1000);
    const ms = elapsed % 1000;
    const msPadded = ms.toString().padStart(3, '0');

    timeOverlay.setText(`${hours}h ${mins}m ${secs}.${msPadded}s`);

    requestAnimationFrame(updateTimer);
}

updateTimer();

const line = document.createElement('div');
timeOverlay.obj.appendChild(line);
Object.assign(line.style, {
    position: 'absolute',
    top: '0',
    width: '2px',
    height: '100%',
    backgroundColor: '#beffffff',
});

let position = 0;
let direction = 1;
const speed = 3;

function bounceLine() {
    const boxWidth = timeOverlay.obj.clientWidth;
    const lineWidth = line.clientWidth;
    position += direction * speed;

    if (position + lineWidth >= boxWidth) {
        direction = -1;
        position = boxWidth - lineWidth;
    } else if (position <= 0) {
        direction = 1;
        position = 0;
    }
    line.style.left = `${position}px`;

    requestAnimationFrame(bounceLine);
}

bounceLine();

let stored = localStorage.getItem('keyCount');
let totKeyCount: number;
let curKeyCount: number = 0;
let keyCountHue: number = 0;

if (stored === null) {
    totKeyCount = 0;
    localStorage.setItem('keyCount', String(totKeyCount));
} else {
    totKeyCount = Number(stored);
}

let keyOverlayInterval: any = null;

function updateKeyOverlay() {
    if (keyOverlayInterval) clearInterval(keyOverlayInterval);
    keyOverlayInterval = setInterval(() => {
        keyCountHue = (keyCountHue + 1) % 360;
        keyOverlay.obj.style.backgroundColor = `hsla(${keyCountHue}, 100%, 60%, 0.5)`;
        keyOverlay.obj.style.boxShadow = `0 0 20px hsl(${keyCountHue}, 100%, 60%)`;
        keyOverlay.obj.style.border = `1px solid hsl(${keyCountHue}, 100%, 60%)`;
        keyOverlay.textEl.style.color = `hsl(${keyCountHue}, 100%, 60%)`;
    }, 100);
}

const keyOverlay = new Overlay({
    text: `⌨️ ${curKeyCount} (${totKeyCount})`,
    accent: cyanAccent,
    animated: false,
    desc: false,
});

keyOverlay.obj.style.border = `1px solid hsl(${keyCountHue}, 100%, 60%)`;
keyOverlay.obj.style.backgroundColor = `hsla(${keyCountHue}, 100%, 60%, 0.3)`;
keyOverlay.obj.style.boxShadow = `0 0 20px hsl(${keyCountHue}, 100%, 60%)`;
keyOverlay.textEl.style.color = `hsl(${keyCountHue}, 100%, 100%)`;
keyOverlay.start(updateKeyOverlay);

document.addEventListener('keydown', () => {
    keyOverlay.obj.style.transition = 'none';
    keyOverlay.obj.style.transform = 'translateY(-5px) scale(1.1)';
    keyOverlay.obj.style.boxShadow = `0 0 20px hsl(${keyCountHue}, 100%, 60%), inset 0 0 20px hsl(${keyCountHue}, 100%, 60%)`;
    keyOverlay.obj.style.border = `1px solid hsl(${keyCountHue}, 100%, 60%)`;
    keyOverlay.textEl.style.color = `hsl(${keyCountHue}, 100%, 60%)`;

    void keyOverlay.obj.offsetWidth;

    requestAnimationFrame(() => {
        keyOverlay.obj.style.transition = 'transform 0.1s ease, background-color 0.1s ease';
        keyOverlay.obj.style.transform = 'translateY(0px) scale(1)';
        keyOverlay.obj.style.boxShadow = `0 0 20px hsl(${keyCountHue}, 100%, 60%)`;
    });
});

document.addEventListener('keyup', () => {
    totKeyCount++;
    curKeyCount++;
    localStorage.setItem('keyCount', String(totKeyCount));
    keyOverlay.setText(`⌨️ ${curKeyCount} (${totKeyCount})`);
});

const serverOverlay = new Overlay({
    text: '🟡 unknown',
    accent: yellowAccent,
    animated: true,
    desc: true,
});

let serverUptime = null;

function updateServer() {
    fetch('http://localhost:3001/main')
        .then((res) => {
            if (!res.ok) {
                console.error(`HTTP error: ${res.status}`);
                serverOnline = false;
                return;
            }
            return res.json();
        })
        .then((data) => {
            serverOverlay.setText('🟢 on');
            serverOverlay.setAccent(greenAccent);

            serverUptime = data.uptime;
            updateServerContent();
            serverOnline = true;
        })
        .catch((error) => {
            if (error.name === 'TypeError') {
                serverOverlay.setText('🔴 off');
                console.error(error);
            } else {
                serverOverlay.setText('🔴 error');
            }

            serverOverlay.setAccent(redAccent);

            console.error(error);
            serverOnline = false;
        });
}

setInterval(updateServer, 500);
updateServer();

function updateServerContent() {
    let serverOnlinePrompt = `Server: <span class="highlight-glow">http://localhost:3001</span>
Uptime: ${serverUptime}
<span class="highlight-glow">Click to open localhost page</span>`;

    let serverOfflinePrompt = `The server is offline.
<span class="highlight-glow">Click to retry server connection</span>`;

    if (serverOnline) {
        serverOverlay.setDescHTML(serverOnlinePrompt);
    } else {
        serverOverlay.setDescHTML(serverOfflinePrompt);
    }
}

setInterval(updateServerContent, 500);
updateServerContent();

serverOverlay.obj.addEventListener('mousedown', () => {
    updateServer();
    updateServerContent();

    if (serverOnline) {
        window.open('http://localhost:3001/main', '_blank');
    }
});

let latitude: number;
let longitude: number;
let availableLocation = true;

function updateLocation() {
    fetch('http://ip-api.com/json/')
        .then((res) => res.json())
        .then((data) => {
            latitude = parseFloat(data.lat);
            longitude = parseFloat(data.lon);
            console.log(`Location: ${latitude}, ${longitude}`);
            availableLocation = true;
            updateWeather();
        })
        .catch((err) => {
            console.error('Location failed:', err);
            availableLocation = false;
            updateWeather();
        });
}

setTimeout(() => {
    updateLocation();
    setInterval(updateLocation, 50000);
}, 1500);

const weatherDescriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
};

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const weatherOverlay = new Overlay({
    text: `▲ ${timezone}`,
    accent: cyanAccent,
    animated: true,
    desc: true,
});

let availableWeather = false;
let temperature = null;
let windSpeed = null;
let windDirection = null;
let humidity = null;
let weatherCode = null;
let pm10 = null;
let pm2_5 = null;
let windDirectionDescriptor = 'Unavailable';
let weatherDescriptor = 'Unavailable';

function degreesToCardinal(degrees: number) {
    if (typeof degrees !== 'number' || isNaN(degrees)) {
        return 'Unavailable';
    }
    degrees = ((degrees % 360) + 360) % 360;
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

function updateWeather() {
    if (latitude == null || longitude == null || !availableLocation) {
        console.error('Latitude or longitude is undefined. Waiting for location...');
        availableWeather = false;
        updateWeatherContent();
        return;
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,wind_speed_10m,wind_direction_10m,relative_humidity_2m&timezone=auto`;
    const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5&timezone=auto`;
    Promise.all([
        fetch(weatherUrl).then((res) => {
            if (!res.ok) {
                console.error(`Weather HTTP error: ${res.status}`);
                availableWeather = false;
                return Promise.reject();
            }
            return res.json();
        }),
        fetch(airUrl).then((res) => {
            if (!res.ok) {
                console.error(`Air HTTP error: ${res.status}`);
                return Promise.reject();
            }
            return res.json();
        }),
    ])
        .then(([weatherData, airData]) => {
            temperature = weatherData.current?.temperature_2m ?? 'N/A';
            weatherCode = weatherData.current?.weathercode ?? 0;
            weatherDescriptor = weatherDescriptions[weatherCode] || 'Unknown';
            windSpeed = weatherData.current?.wind_speed_10m ?? 'N/A';
            windDirection = weatherData.current?.wind_direction_10m ?? 0;
            windDirectionDescriptor = degreesToCardinal(windDirection);
            humidity = weatherData.current?.relative_humidity_2m ?? 'N/A';
            pm10 = airData?.current?.pm10 ?? 'N/A';
            pm2_5 = airData?.current?.pm2_5 ?? 'N/A';
            availableWeather = true;
            updateWeatherContent();
        })
        .catch((err) => {
            console.error('Weather/Air fetch failed:', err);
            availableWeather = false;
            updateWeatherContent();
        });
}

setTimeout(() => {
    updateWeather();
    setInterval(updateWeather, 20000);
}, 1500);

let weatherOverlayHover = false;

function updateWeatherStatus() {
    const isWeatherSuccess = availableWeather && availableLocation;

    if (isWeatherSuccess) {
        weatherOverlay.setAccent(cyanAccent);
    } else {
        weatherOverlay.setAccent(redAccent);
    }
}

setInterval(updateWeatherStatus, 500);
updateWeatherStatus();

let weatherLocationFailurePrompt = `Couldn't fetch current user location!
<span class="highlight-glow">Click to retry server connection</span>`;
let weatherInformationFailurePrompt = `Couldn't fetch weather information!
<span class="highlight-glow">Click to retry server connection</span>`;

function updateWeatherContent() {
    if (availableWeather && availableLocation) {
        let weatherSuccessPrompt = `🌡️ ${temperature}°C 💦 ${humidity}%
💨 ${windSpeed}m/s @ ${windDirection}° (${windDirectionDescriptor})
🌤️ <span class="highlight-glow">${weatherDescriptor}</span>
🌫️ <span class="highlight-glow">PM10</span> ${pm10}µg/m³ <span class="highlight-glow">PM2.5</span> ${pm2_5}µg/m³
<span class="highlight-glow">Click to refresh weather content</span>`;

        weatherOverlay.setDescHTML(weatherSuccessPrompt);
    } else {
        if (!availableLocation) {
            weatherOverlay.setDescHTML(weatherLocationFailurePrompt);
        } else {
            weatherOverlay.setDescHTML(weatherInformationFailurePrompt);
        }
    }
}

setInterval(updateWeatherContent, 500);
updateWeatherContent();

weatherOverlay.obj.addEventListener('mousedown', () => {
    updateWeather();
    updateWeatherStatus();
    updateWeatherContent();

    if (!availableLocation) {
        updateLocation();
    }
});

const pingOverlay = new Overlay({
    text: `▲ Show Ping`,
    accent: cyanAccent,
    animated: true,
    desc: true,
});

let githubLatency = null;
let googleLatency = null;
let selfLatency = null;

function updatePing() {
    if (serverOnline) {
        fetch('http://localhost:3001/main')
            .then((res) => res.json())
            .then((data) => {
                githubLatency = data.githubPing ?? 'Unknown key';
                googleLatency = data.googlePing ?? 'Unknown key';
                selfLatency = data.selfPing ?? 'Unknown key';
                updatePingContent();
            });
    }
}

setInterval(updatePing, 1000);
updatePing();

function updatePingStatus() {
    const pingSuccess = serverOnline && githubLatency != null && googleLatency != null && selfLatency != null;

    if (pingSuccess) {
        pingOverlay.setAccent(cyanAccent);
    } else {
        pingOverlay.setAccent(redAccent);
    }
}

setInterval(updatePingStatus, 500);
updatePingStatus();

function updatePingContent() {
    if (serverOnline && githubLatency != null && googleLatency != null && selfLatency != null) {
        let serverSuccessPrompt = `📡 <span class="highlight-glow">GitHub</span>: ${githubLatency}
🌐 <span class="highlight-glow">Google</span>: ${googleLatency}
🖥️ <span class="highlight-glow">Localhost</span>: ${selfLatency}
<span class="highlight-glow">Click to refresh ping intervals</span>`;
        pingOverlay.setDescHTML(serverSuccessPrompt);
    } else {
        let serverFailPrompt = `The server is offline.
<span class="highlight-glow">Click to retry server connection</span>`;
        pingOverlay.setDescHTML(serverFailPrompt);
    }
}

setInterval(updatePingContent, 500);
updatePingContent();

pingOverlay.obj.addEventListener('mouseenter', () => {
    pingOverlay.setText(`▼ Hide Ping`);
});

pingOverlay.obj.addEventListener('mouseleave', () => {
    pingOverlay.setText(`▲ Show Ping`);
});

pingOverlay.obj.addEventListener('mousedown', () => {
    updatePing();
    updatePingStatus();
    updatePingContent();
});

const levelOverlay = document.createElement('div');
const levelProgress = document.createElement('div');
const levelProgressLine = document.createElement('div');
const levelText = document.createElement('div');

levelOverlay.appendChild(levelText);
levelOverlay.appendChild(levelProgress);
levelOverlay.appendChild(levelProgressLine);
document.body.appendChild(levelOverlay);

Object.assign(levelOverlay.style, {
    position: 'absolute',
    zIndex: '20002',
    fontSize: '17.5px',
    borderRadius: '5px',
    textAlign: 'center',
    left: '50%',
    top: '10px',
    transform: 'translateX(-50%)',
    fontFamily: 'Consolas, monospace',
    transition: 'opacity 1s ease',
    border: '2px solid hsla(0, 100%, 90%, 1)',
    width: '30%',
    pointerEvents: 'auto',
});
Object.assign(levelText.style, defaultTextStyle);
Object.assign(levelProgress.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100%',
    width: '0%',
    borderRadius: '5px',
    transition: 'width 10s ease',
    zIndex: '20001',
    pointerEvents: 'none',
});
Object.assign(levelProgressLine.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100%',
    width: '2px',
    transition: 'left 0.2s ease',
    zIndex: '20003',
    pointerEvents: 'none',
});

function getCurrentLevelStatus() {
    let baseLevel = 500;
    let copyKeyCount = totKeyCount;
    let level = 0;
    while (true) {
        if (copyKeyCount >= baseLevel) {
            copyKeyCount -= baseLevel;
            level++;
            baseLevel += 50;
        } else {
            return [level, copyKeyCount, baseLevel];
        }
    }
}

let hoveringLevel = false;

function updateLevelContent() {
    const [level, keys, nextLevelReq] = getCurrentLevelStatus();
    if (hoveringLevel) {
        levelText.textContent = `Lv. ${level} -> ${level + 1} | 0/${nextLevelReq + 50}`;
    } else {
        levelText.textContent = `Lv. ${level} | ${keys}/${nextLevelReq} (${nextLevelReq - keys} left)`;
        const progressPercent = (keys / nextLevelReq) * 100;
        levelProgress.style.width = `${progressPercent}%`;
        levelProgressLine.style.left = `${progressPercent}%`;
    }
    requestAnimationFrame(updateLevelContent);
}

updateLevelContent();

levelOverlay.addEventListener('mouseenter', () => {
    hoveringLevel = true;
});

levelOverlay.addEventListener('mouseleave', () => {
    hoveringLevel = false;
});

let levelHue = 0;

function updateLevelColor() {
    levelHue = (levelHue + 0.5) % 360;
    levelText.style.color = `hsl(${levelHue}, 100%, 90%)`;
    levelText.style.textShadow = `0 0 10px hsl(${levelHue}, 100%, 60%), inset 0 0 10px hsl(${levelHue}, 100%, 60%)`;
    levelOverlay.style.backgroundColor = `hsla(${levelHue}, 100%, 50%, 0.15)`;
    levelOverlay.style.borderColor = `hsl(${levelHue}, 100%, 90%)`;
    levelOverlay.style.boxShadow = `0 0 10px hsl(${levelHue}, 100%, 50%), inset 0 0 10px hsl(${levelHue}, 100%, 50%)`;
    levelProgress.style.backgroundColor = `hsla(${levelHue}, 100%, 50%, 0.3)`;
    levelProgress.style.boxShadow = `0 0 10px hsl(${levelHue}, 100%, 50%), inset 0 0 5px hsl(${levelHue}, 100%, 75%)`;
    levelProgressLine.style.backgroundColor = `hsl(${levelHue}, 100%, 90%)`;
    levelProgressLine.style.boxShadow = `0 0 10px hsl(${levelHue}, 100%, 50%)`;

    requestAnimationFrame(updateLevelColor);
}

updateLevelColor();

let lastFrameTime: number;
let lastUpdateTime: number = performance.now();
let frameCount = 0;
let fpsDisplay = document.createElement('div');

Object.assign(fpsDisplay.style, {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '20001',
    fontFamily: "'FiraCode Nerd Font', monospace",
    fontSize: '20px',
});

document.body.appendChild(fpsDisplay);

function updateFPSLoop() {
    const now = performance.now();
    frameCount++;
    if (now - lastUpdateTime >= 250) {
        const fps: number = Number(((frameCount * 1000) / (now - lastUpdateTime)).toFixed(2));

        fpsDisplay.textContent = `${fps} FPS`;
        if (fps <= 30) {
            fpsDisplay.style.color = Colors.solidRed;
            fpsDisplay.style.textShadow = `0 0 20px ${Colors.lightRed}`;
        } else if (fps > 30 && fps <= 45) {
            fpsDisplay.style.color = Colors.solidYellow;
            fpsDisplay.style.textShadow = `0 0 20px ${Colors.lightYellow}`;
        } else {
            fpsDisplay.style.color = Colors.solidGreen;
            fpsDisplay.style.textShadow = `0 0 20px ${Colors.lightGreen}`;
        }
        frameCount = 0;
        lastUpdateTime = now;
    }
    lastFrameTime = now;

    requestAnimationFrame(updateFPSLoop);
}

requestAnimationFrame(updateFPSLoop);

let modalVisibility = true;

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'h') {
        modalVisibility = !modalVisibility;

        if (overlayContainer) {
            overlayContainer.style.display = modalVisibility ? 'flex' : 'none';
        }

        if (fpsDisplay) {
            fpsDisplay.style.display = modalVisibility ? 'flex' : 'none';
        }
    }
});
