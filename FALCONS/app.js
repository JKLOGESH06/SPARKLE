/* Firebase Configuration - Replace with your actual config from Firebase Console! */
const firebaseConfig = {
    apiKey: "AIzaSyBxzAQtK6Wx9SX_-gPPjmEBCYDKstAJksk",
    authDomain: "sparkle-simulation.firebaseapp.com",
    projectId: "sparkle-simulation",
    storageBucket: "sparkle-simulation.firebasestorage.app",
    messagingSenderId: "204976496972",
    appId: "1:204976496972:web:b3233c5703747b620e6fe9",
    measurementId: "G-LNPXLZ3H0C"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

/* ... data model ... */
const componentsDB = [
    // Basics
    { id: 'res', name: "Resistor", type: "passive", value: 1000, unit: "Ω", icon: "fa-bolt" },
    { id: 'cap', name: "Capacitor", type: "passive", value: 10, unit: "µF", icon: "fa-database" },
    { id: 'ind', name: "Inductor", type: "passive", value: 100, unit: "mH", icon: "fa-ring" },
    { id: 'dio', name: "Diode", type: "active", value: 0.7, unit: "V", icon: "fa-caret-right" },
    { id: 'led', name: "LED", type: "active", value: 20, unit: "mA", icon: "fa-lightbulb" },
    { id: 'bjt', name: "Transistor (NPN)", type: "active", value: 100, unit: "hFE", icon: "fa-share-nodes" },
    { id: 'ic', name: "IC (555 Timer)", type: "active", value: 0, unit: "", icon: "fa-microchip" },
    { id: 'sw', name: "Switch", type: "control", value: 0, unit: "", icon: "fa-toggle-off" },
    { id: 'rel', name: "Relay", type: "control", value: 5, unit: "V", icon: "fa-square" },
    { id: 'trf', name: "Transformer", type: "passive", value: 1, unit: "Ratio", icon: "fa-right-left" },

    // Sources/Output
    { id: 'bat', name: "Battery", type: "source", value: 9, unit: "V", icon: "fa-battery-full" },
    { id: 'ps', name: "Power Supply", type: "source", value: 12, unit: "V", icon: "fa-plug" },
    { id: 'gnd', name: "Ground", type: "source", value: 0, unit: "V", icon: "fa-arrow-down" },
    { id: 'lcd', name: "Display (LCD)", type: "output", value: 0, unit: "", icon: "fa-tv" },

    // Temp Sensors
    { id: 'lm35', name: "LM35 Temp", type: "sensor", value: 25, unit: "°C", icon: "fa-temperature-half" },
    { id: 'ds18', name: "DS18B20 Temp", type: "sensor", value: 25, unit: "°C", icon: "fa-temperature-full" },
    { id: 'tmp36', name: "TMP36 Temp", type: "sensor", value: 25, unit: "°C", icon: "fa-temperature-quarter" },

    // Pressure Sensors
    { id: 'bmp180', name: "BMP180 Pressure", type: "sensor", value: 1013, unit: "hPa", icon: "fa-gauge" },
    { id: 'mpx', name: "MPX5010 Pressure", type: "sensor", value: 100, unit: "kPa", icon: "fa-gauge-high" },
    { id: 'bme280', name: "BME280 Env", type: "sensor", value: 0, unit: "", icon: "fa-cloud" },

    // Motion/Position
    { id: 'hc501', name: "HC-SR501 PIR", type: "sensor", value: 0, unit: "", icon: "fa-person-running" },
    { id: 'mpu', name: "MPU6050 IMU", type: "sensor", value: 0, unit: "", icon: "fa-arrows-up-down-left-right" },
    { id: 'hmc', name: "HMC5883L Mag", type: "sensor", value: 0, unit: "uT", icon: "fa-compass" },

    // Light
    { id: 'ldr', name: "LDR (GL5528)", type: "sensor", value: 1000, unit: "Ω", icon: "fa-sun" },
    { id: 'tsl', name: "TSL2561 Lux", type: "sensor", value: 500, unit: "lx", icon: "fa-eye" },
    { id: 'bh17', name: "BH1750 Lux", type: "sensor", value: 500, unit: "lx", icon: "fa-lightbulb" },

    // Gas
    { id: 'mq2', name: "MQ-2 Gas", type: "sensor", value: 0, unit: "", icon: "fa-smog" },
    { id: 'mq7', name: "MQ-7 CO", type: "sensor", value: 0, unit: "", icon: "fa-skull-crossbones" },
    { id: 'mq135', name: "MQ-135 Air", type: "sensor", value: 0, unit: "", icon: "fa-wind" },

    // Distance/Prox
    { id: 'hcsr04', name: "HC-SR04 Sonic", type: "sensor", value: 0, unit: "cm", icon: "fa-ruler" },
    { id: 'gp2y', name: "IR Proximity", type: "sensor", value: 0, unit: "cm", icon: "fa-ruler-horizontal" },
    { id: 'vl53', name: "VL53L0X ToF", type: "sensor", value: 0, unit: "mm", icon: "fa-ruler-vertical" },

    // Humidity
    { id: 'dht11', name: "DHT11 Hum", type: "sensor", value: 50, unit: "%", icon: "fa-droplet" },
    { id: 'dht22', name: "DHT22 Hum", type: "sensor", value: 50, unit: "%", icon: "fa-droplet" },
    { id: 'sht31', name: "SHT31 Hum", type: "sensor", value: 50, unit: "%", icon: "fa-water" },

    // Sound
    { id: 'ky37', name: "KY-037 Mic", type: "sensor", value: 0, unit: "", icon: "fa-microphone" },
    { id: 'max98', name: "MAX9814 Amp", type: "sensor", value: 0, unit: "", icon: "fa-microphone-lines" },
    { id: 'spw24', name: "SPW2430 MEMS", type: "sensor", value: 0, unit: "", icon: "fa-volume-high" },

    // Phase 2 Additions
    { id: 'pot', name: "Potentiometer", type: "passive", value: 10, unit: "kΩ", icon: "fa-sliders" },
    { id: 'v_meter', name: "Voltmeter", type: "output", value: 0, unit: "V", icon: "fa-gauge" },
    { id: 'a_meter', name: "Ammeter", type: "output", value: 0, unit: "A", icon: "fa-gauge-high" },
    { id: 'zen', name: "Zener Diode", type: "active", value: 5.1, unit: "V", icon: "fa-caret-right" },
    { id: 'sch', name: "Schottky Diode", type: "active", value: 0.3, unit: "V", icon: "fa-bolt" },
    { id: 'pnp', name: "Transistor (PNP)", type: "active", value: 100, unit: "hFE", icon: "fa-share-nodes" },
    { id: 'mos', name: "N-MOSFET", type: "active", value: 0, unit: "", icon: "fa-wave-square" },
    { id: 'trf_ct', name: "Transformer (CT)", type: "passive", value: 230, unit: "V", icon: "fa-right-left" },

    // Phase 3 Additions
    { id: 'nand', name: "NAND Gate", type: "active", value: 0, unit: "", icon: "fa-microchip" },
    { id: 'nor', name: "NOR Gate", type: "active", value: 0, unit: "", icon: "fa-microchip" },
    { id: 'xor', name: "XOR Gate", type: "active", value: 0, unit: "", icon: "fa-microchip" },
    { id: 'buz', name: "Buzzer", type: "output", value: 5, unit: "V", icon: "fa-volume-low" },
    { id: 'spk', name: "Speaker", type: "output", value: 8, unit: "Ω", icon: "fa-volume-high" },
    { id: 'rgb', name: "RGB LED", type: "active", value: 0, unit: "", icon: "fa-lightbulb" },
    { id: 'jfet', name: "JFET (N-Channel)", type: "active", value: 0, unit: "", icon: "fa-share-nodes" },
    { id: 'pmos', name: "P-MOSFET", type: "active", value: 0, unit: "", icon: "fa-wave-square" },
    { id: 'pdio', name: "Photo-diode", type: "sensor", value: 0, unit: "lx", icon: "fa-eye" },
    { id: 'nth', name: "Thermistor (NTC)", type: "sensor", value: 10, unit: "kΩ", icon: "fa-temperature-low" },
    { id: 'cell', name: "Cell (1.5V)", type: "source", value: 1.5, unit: "V", icon: "fa-battery-quarter" },
    { id: 'trim', name: "Bourns Trimpot 10k", type: "passive", value: 10, unit: "kΩ", icon: "fa-square-caret-down" }
];

// Helper to generate Module SVG
const moduleSVG = (label, color = '#445') => `
    <rect x="5" y="5" width="50" height="30" rx="3" fill="${color}" stroke="currentColor" stroke-width="2"/>
    <circle cx="10" cy="20" r="2" fill="#888"/> <circle cx="50" cy="20" r="2" fill="#888"/>
    <text x="30" y="24" text-anchor="middle" fill="#fff" font-size="9" font-family="monospace">${label}</text>
`;

const svgIcons = {
    // Basic Schemes
    'res': `<path d="M0,20 L10,20 L15,10 L25,30 L35,10 L45,30 L50,20 L60,20" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'cap': `<path d="M0,20 L25,20 M35,20 L60,20 M25,5 L25,35 M35,5 L35,35" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'ind': `<path d="M0,20 L15,20 M45,20 L60,20 Q18,5 25,20 Q28,5 35,20 Q38,5 45,20" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'dio': `<path d="M0,20 L20,20 M40,20 L60,20 M40,5 L40,35 M20,20 L40,10 L40,30 Z" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'led': `<path d="M0,20 L20,20 M40,20 L60,20 M40,5 L40,35 M20,20 L40,10 L40,30 Z" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M30,10 L20,0 M35,8 L25,-2" stroke="currentColor" stroke-width="1.5" transform="translate(5, -5)"/>`,
    'bjt': `<circle cx="30" cy="20" r="15" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M25,10 L25,30 M25,20 L5,20 M25,15 L40,5 M25,25 L40,35" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'ic': `<rect x="15" y="5" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2"/>
           <path d="M15,10 L5,10 M15,20 L5,20 M15,30 L5,30 M45,10 L55,10 M45,20 L55,20 M45,30 L55,30" stroke="currentColor" stroke-width="1.5"/>`,
    'sw': `<path d="M0,20 L20,20 M40,20 L60,20 M20,20 L38,12" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'rel': `<rect x="15" y="10" width="30" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M0,20 L15,20 M45,20 L60,20 M25,15 L35,25" stroke="currentColor" stroke-width="1.5"/>`,
    'trf': `<circle cx="20" cy="15" r="5" fill="none" stroke="currentColor"/><circle cx="20" cy="25" r="5" fill="none" stroke="currentColor"/>
            <line x1="30" y1="10" x2="30" y2="30" stroke="currentColor" stroke-width="2"/>
            <line x1="33" y1="10" x2="33" y2="30" stroke="currentColor" stroke-width="2"/>
            <circle cx="43" cy="15" r="5" fill="none" stroke="currentColor"/><circle cx="43" cy="25" r="5" fill="none" stroke="currentColor"/>`,
    'bat': `<path d="M0,20 L25,20 M35,20 L60,20 M25,5 L25,35 M35,12 L35,28" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'ps': `<rect x="15" y="10" width="30" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>
           <path d="M20,20 L28,20 M32,20 L40,20 M30,15 L30,25" stroke="currentColor"/>`,
    'gnd': `<path d="M30,0 L30,15 M15,15 L45,15 M20,22 L40,22 M25,29 L35,29" stroke="currentColor" stroke-width="2" transform="translate(0, 5)"/>`,
    'lcd': `<rect x="5" y="5" width="50" height="30" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
            <rect x="10" y="10" width="40" height="20" fill="rgba(0,255,255,0.1)"/>
            <text x="14" y="24" fill="currentColor" font-size="8" font-family="monospace">1234</text>`,

    // Modules (Sensors)
    'lm35': moduleSVG('LM35'), 'ds18': moduleSVG('DS18'), 'tmp36': moduleSVG('TMP36'),
    'bmp180': moduleSVG('BMP'), 'mpx': moduleSVG('MPX'), 'bme280': moduleSVG('BME'),
    'hc501': moduleSVG('PIR'), 'mpu': moduleSVG('MPU'), 'hmc': moduleSVG('HMC'),
    'ldr': moduleSVG('LDR'), 'tsl': moduleSVG('TSL'), 'bh17': moduleSVG('LUX'),
    'mq2': moduleSVG('MQ2'), 'mq7': moduleSVG('MQ7'), 'mq135': moduleSVG('MQ135'),
    'hcsr04': moduleSVG('SONIC'), 'gp2y': moduleSVG('IR-D'), 'vl53': moduleSVG('TOF'),
    'dht11': moduleSVG('DHT11'), 'dht22': moduleSVG('DHT22'), 'sht31': moduleSVG('SHT31'),
    'ky37': moduleSVG('MIC'), 'max98': moduleSVG('AMP'), 'spw24': moduleSVG('MEMS'),

    // Phase 2 Icons
    'pot': `<path d="M0,20 L10,20 L15,10 L25,30 L35,10 L45,30 L50,20 L60,20 M30,5 L30,35 M25,10 L35,5" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'v_meter': `<circle cx="30" cy="20" r="15" fill="none" stroke="currentColor" stroke-width="2"/>
                <text x="30" y="24" text-anchor="middle" fill="currentColor" font-size="12" font-weight="bold">V</text>`,
    'a_meter': `<circle cx="30" cy="20" r="15" fill="none" stroke="currentColor" stroke-width="2"/>
                <text x="30" y="24" text-anchor="middle" fill="currentColor" font-size="12" font-weight="bold">A</text>`,
    'zen': `<path d="M0,20 L20,20 M40,20 L60,20 M40,5 L40,35 M40,5 L35,5 M40,35 L45,35 M20,20 L40,10 L40,30 Z" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'sch': `<path d="M0,20 L20,20 M40,20 L60,20 M40,5 L40,35 M40,5 L45,10 M40,35 L35,30 M20,20 L40,10 L40,30 Z" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'pnp': `<circle cx="30" cy="20" r="15" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M25,10 L25,30 M25,20 L5,20 M25,15 L40,5 M25,25 L40,35 M30,22 L25,20 L30,18" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'mos': `<path d="M5,20 L20,20 M25,10 L25,30 M30,10 L30,15 M30,18 L30,22 M30,25 L30,30 M30,10 L50,10 M30,30 L50,30 M30,20 L50,20" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'trf_ct': `<circle cx="20" cy="15" r="5" fill="none" stroke="currentColor"/><circle cx="20" cy="25" r="5" fill="none" stroke="currentColor"/>
               <line x1="30" y1="5" x2="30" y2="35" stroke="currentColor" stroke-width="2"/>
               <line x1="33" y1="5" x2="33" y2="35" stroke="currentColor" stroke-width="2"/>
               <circle cx="43" cy="10" r="4" fill="none" stroke="currentColor"/><circle cx="43" cy="20" r="4" fill="none" stroke="currentColor"/><circle cx="43" cy="30" r="4" fill="none" stroke="currentColor"/>`,

    // Phase 3 Icons
    'nand': `<path d="M10,5 L30,5 Q50,5 50,20 Q50,35 30,35 L10,35 Z" fill="none" stroke="currentColor" stroke-width="2"/>
             <circle cx="54" cy="20" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
             <line x1="0" y1="12" x2="10" y2="12" stroke="currentColor" stroke-width="2"/>
             <line x1="0" y1="28" x2="10" y2="28" stroke="currentColor" stroke-width="2"/>
             <line x1="57" y1="20" x2="60" y2="20" stroke="currentColor" stroke-width="2"/>`,
    'nor': `<path d="M10,5 Q25,5 30,5 Q50,10 50,20 Q50,30 30,35 Q25,35 10,35 Q20,20 10,5 Z" fill="none" stroke="currentColor" stroke-width="2"/>
            <circle cx="54" cy="20" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
            <line x1="0" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
            <line x1="0" y1="28" x2="12" y2="28" stroke="currentColor" stroke-width="2"/>
            <line x1="57" y1="20" x2="60" y2="20" stroke="currentColor" stroke-width="2"/>`,
    'xor': `<path d="M5,5 Q15,20 5,35 M12,5 Q22,20 12,35 M12,5 Q32,5 45,20 Q32,35 12,35" fill="none" stroke="currentColor" stroke-width="2"/>
            <line x1="0" y1="12" x2="10" y2="12" stroke="currentColor" stroke-width="2"/>
            <line x1="0" y1="28" x2="10" y2="28" stroke="currentColor" stroke-width="2"/>
            <line x1="45" y1="20" x2="60" y2="20" stroke="currentColor" stroke-width="2"/>`,
    'buz': `<path d="M15,10 L45,10 L45,30 L15,30 Z M15,15 L10,10 L10,30 L15,25" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M30,15 L30,25 M25,20 L35,20" stroke="currentColor" stroke-width="1"/>`,
    'spk': `<path d="M20,15 L20,25 L35,35 L35,5 Z" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M40,12 Q45,20 40,28 M45,8 Q52,20 45,32" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
    'rgb': `<circle cx="30" cy="20" r="12" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M25,20 L35,20 M30,15 L30,25" stroke="currentColor" stroke-width="1"/>
            <path d="M42,20 L55,20 M30,32 L30,45 M18,20 L5,20" stroke="currentColor" stroke-width="1.5"/>`,
    'jfet': `<line x1="25" y1="10" x2="25" y2="30" stroke="currentColor" stroke-width="3"/>
             <line x1="5" y1="20" x2="25" y2="20" stroke="currentColor" stroke-width="2"/>
             <line x1="25" y1="12" x2="45" y2="12" stroke="currentColor" stroke-width="2"/>
             <line x1="25" y1="28" x2="45" y2="28" stroke="currentColor" stroke-width="2"/>
             <path d="M15,17 L25,20 L15,23 Z" fill="currentColor"/>`,
    'pmos': `<path d="M5,20 L20,20 M25,10 L25,30 M30,10 L30,15 M30,18 L30,22 M30,25 L30,30 M30,10 L50,10 M30,30 L50,30 M30,20 L50,20" fill="none" stroke="currentColor" stroke-width="2"/>
             <path d="M40,20 L30,20 L35,17 Z" fill="currentColor" transform="translate(0,0)"/>`,
    'pdio': `<path d="M0,20 L20,20 M40,20 L60,20 M40,5 L40,35 M20,20 L40,10 L40,30 Z" fill="none" stroke="currentColor" stroke-width="2"/>
             <path d="M10,0 L20,10 M15,-5 L25,5" stroke="currentColor" stroke-width="1.5" transform="rotate(200, 20, 10)"/>`,
    'nth': `<path d="M0,20 L15,20 L20,10 L30,30 L40,10 L45,20 L60,20" fill="none" stroke="currentColor" stroke-width="2"/>
            <line x1="15" y1="35" x2="45" y2="5" stroke="currentColor" stroke-width="2"/>`,
    'cell': `<path d="M0,20 L28,20 M32,20 L60,20 M28,5 L28,35 M32,12 L32,28" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'trim': `<rect x="15" y="5" width="30" height="30" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
             <circle cx="40" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
             <line x1="38" y1="10" x2="42" y2="10" stroke="currentColor" stroke-width="1"/>
             <path d="M0,20 L15,20 M45,20 L60,20" stroke="currentColor" stroke-width="2"/>`
};

let circuitComponents = [];
let wires = [];
let isRunning = false;
let nextId = 1;
let currentWireStart = null;
let tempWireEnd = null;
let zoomLevel = 1;
let contextMenuTargetId = null;

const paletteList = document.getElementById('palette-list');
const circuitBoard = document.getElementById('circuit-board');
let wiresLayer = document.getElementById('wires-layer');
const loginForm = document.getElementById('login-form');
const runBtn = document.getElementById('run-btn');
const stopBtn = document.getElementById('stop-btn');
const editModal = document.getElementById('edit-modal');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const contextMenu = document.getElementById('context-menu');
const ctxDelete = document.getElementById('ctx-delete');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const exportExcelBtn = document.getElementById('export-excel-btn');

const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const downloadBtn = document.getElementById('download-btn');
const mobilePaletteToggle = document.getElementById('mobile-palette-toggle');
const palette = document.querySelector('.palette');

// Mode for Auth
let isLoginMode = true;
const authToggleBtn = document.getElementById('auth-toggle-btn');
const authToggleWrapper = document.getElementById('auth-toggle-wrapper');
const loginTitle = document.querySelector('.logo-area p');
const submitBtn = document.getElementById('submit-btn');

// History State
const historyStack = [];
const redoStack = [];
const MAX_HISTORY = 50;

// Auth Button
const authBtn = document.getElementById('auth-btn');
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');

const editName = document.getElementById('edit-name');
const editValue = document.getElementById('edit-value');
const editUnit = document.getElementById('edit-unit');
const saveValueBtn = document.getElementById('save-value-btn');
let editingComponentId = null;

document.addEventListener('DOMContentLoaded', () => {
    renderPalette();
    setupCanvasInteractions();
    setupContextMenu();

    // Auth Button Initial State
    updateAuthState(false);

    const resizeObserver = new ResizeObserver(() => {
        wiresLayer.setAttribute('width', circuitBoard.offsetWidth);
        wiresLayer.setAttribute('height', circuitBoard.offsetHeight);
        drawWires();
    });
    resizeObserver.observe(circuitBoard);
});

// Undo/Redo Logic
function addToHistory(action) {
    historyStack.push(action);
    if (historyStack.length > MAX_HISTORY) historyStack.shift();
    redoStack.length = 0;
    updateHistoryButtons();
}

function updateHistoryButtons() {
    undoBtn.disabled = historyStack.length === 0;
    redoBtn.disabled = redoStack.length === 0;
}

if (undoBtn) {
    undoBtn.addEventListener('click', () => {
        if (historyStack.length === 0) return;
        const action = historyStack.pop();
        redoStack.push(action);
        if (action.type === 'ADD') deleteComponent(action.data.id, false);
        else if (action.type === 'DELETE') restoreComponent(action.data.comp, action.data.wires);
        else if (action.type === 'MOVE') moveComponent(action.data.id, action.data.oldX, action.data.oldY);
        else if (action.type === 'WIRE') { wires.pop(); drawWires(); }
        updateHistoryButtons();
    });
}

if (redoBtn) {
    redoBtn.addEventListener('click', () => {
        if (redoStack.length === 0) return;
        const action = redoStack.pop();
        historyStack.push(action);
        if (action.type === 'ADD') restoreComponent(action.data, []);
        else if (action.type === 'DELETE') deleteComponent(action.data.id, false);
        else if (action.type === 'MOVE') moveComponent(action.data.id, action.data.newX, action.data.newY);
        else if (action.type === 'WIRE') { wires.push(action.data.wire); drawWires(); }
        updateHistoryButtons();
    });
}

// Auth Logic
const loginError = document.getElementById('login-error');

function updateAuthState(loggedIn, user = null) {
    currentUser = user;
    if (loggedIn && user) {
        authBtn.textContent = 'Logout';
        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        dashboardScreen.classList.remove('hidden');
        setTimeout(() => dashboardScreen.classList.add('active'), 50);
        loginError.classList.add('hidden');
        loginError.textContent = '';
        console.log("Logged in as:", user.email);
    } else {
        authBtn.textContent = 'Login';
        dashboardScreen.classList.remove('active');
        dashboardScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        setTimeout(() => loginScreen.classList.add('active'), 50);

        isRunning = false;
        if (runBtn) runBtn.classList.remove('hidden');
        if (stopBtn) stopBtn.classList.add('hidden');
    }
}

// Observer for Auth State
auth.onAuthStateChanged((user) => {
    updateAuthState(!!user, user);
});

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        loginTitle.textContent = "Advanced Component Simulation";
        submitBtn.innerHTML = 'Initialize System <i class="fa-solid fa-arrow-right"></i>';
        authToggleWrapper.innerHTML = `Don't have an account? <button id="auth-toggle-btn" class="btn-link" style="background:none; border:none; color:var(--primary); cursor:pointer; font-family:inherit; padding:0; text-decoration:underline;">Sign Up</button>`;
    } else {
        loginTitle.textContent = "Create New Account";
        submitBtn.innerHTML = 'Create Account <i class="fa-solid fa-user-plus"></i>';
        authToggleWrapper.innerHTML = `Already have an account? <button id="auth-toggle-btn" class="btn-link" style="background:none; border:none; color:var(--primary); cursor:pointer; font-family:inherit; padding:0; text-decoration:underline;">Login</button>`;
    }
    // Re-attach since innerHTML was used
    document.getElementById('auth-toggle-btn').addEventListener('click', toggleAuthMode);
}

if (authToggleBtn) {
    authToggleBtn.addEventListener('click', toggleAuthMode);
}

if (authBtn) {
    authBtn.addEventListener('click', () => {
        if (authBtn.textContent === 'Logout') {
            auth.signOut();
        } else {
            document.getElementById('username').focus();
        }
    });
}

// Login Form Submit
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const btn = submitBtn || loginForm.querySelector('button');

        btn.disabled = true;
        btn.innerHTML = isLoginMode ? 'Verifying...' : 'Creating Account...';
        loginError.classList.add('hidden');

        if (isLoginMode) {
            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    btn.disabled = false;
                    btn.innerHTML = 'Initialize System <i class="fa-solid fa-arrow-right"></i>';
                })
                .catch((error) => {
                    btn.disabled = false;
                    btn.innerHTML = 'Initialize System <i class="fa-solid fa-arrow-right"></i>';
                    loginError.textContent = error.message;
                    loginError.classList.remove('hidden');
                    shakePanel();
                });
        } else {
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    db.collection("users").doc(userCredential.user.uid).set({
                        email: email,
                        registeredAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    btn.disabled = false;
                    btn.innerHTML = 'Account Created! Logging in...';
                    setTimeout(() => {
                        isLoginMode = true;
                        toggleAuthMode(); // Switch UI back
                    }, 1500);
                })
                .catch(err => {
                    btn.disabled = false;
                    btn.innerHTML = 'Create Account <i class="fa-solid fa-user-plus"></i>';
                    loginError.textContent = err.message;
                    loginError.classList.remove('hidden');
                    shakePanel();
                });
        }
    });
}

function shakePanel() {
    const panel = document.querySelector('.login-panel');
    if (panel) {
        panel.classList.remove('shake');
        void panel.offsetWidth;
        panel.classList.add('shake');
    }
}

// Settings & Excel Export
if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });
}

if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', () => {
        showToast("Fetching user registry...", "info");

        db.collection("users").get().then((querySnapshot) => {
            const data = [["Email", "Registered At"]];
            querySnapshot.forEach((doc) => {
                const user = doc.data();
                data.push([user.email, user.registeredAt?.toDate().toLocaleString() || "N/A"]);
            });

            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Users");
            XLSX.writeFile(wb, "sparkle_user_registry.xlsx");
            showToast("Registry exported successfully!", "success");
        }).catch(err => {
            showToast("Failed to fetch registry.");
            console.error(err);
        });
    });
}

// Download Circuit Logic
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        if (circuitComponents.length === 0) {
            showToast("Circuit is empty!");
            return;
        }

        showToast("Generating image...", "info");

        // Use html2canvas to capture the board
        const captureArea = document.getElementById('circuit-board');
        const controls = document.querySelector('.canvas-controls');

        // Hide controls temporarily
        if (controls) controls.style.visibility = 'hidden';

        html2canvas(captureArea, {
            backgroundColor: '#0a0a14', // Match theme background
            scale: 2, // High resolution
            useCORS: true,
            logging: false
        }).then(canvas => {
            if (controls) controls.style.visibility = 'visible';

            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `sparkle_circuit_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            showToast("Circuit downloaded as PNG!", "success");
        }).catch(err => {
            if (controls) controls.style.visibility = 'visible';
            console.error("Capture Failed:", err);
            showToast("Failed to generate image.");
        });
    });
}

// Cloud Storage Logic
function saveCircuitToCloud() {
    if (!currentUser) {
        showToast("Please login to save to cloud");
        return;
    }
    if (circuitComponents.length === 0) {
        showToast("Cannot save empty circuit");
        return;
    }

    showToast("Saving to Cloud...", "info");

    db.collection("circuits").doc(currentUser.uid).set({
        components: circuitComponents,
        wires: wires,
        lastSaved: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        showToast("Circuit saved to Cloud!", "success");
    }).catch(err => {
        showToast("Cloud save failed");
        console.error(err);
    });
}

function loadCircuitFromCloud() {
    if (!currentUser) {
        showToast("Please login to load from cloud");
        return;
    }

    if (circuitComponents.length > 0 && !confirm("This will clear your current workspace. Continue?")) {
        return;
    }

    showToast("Loading from Cloud...", "info");

    db.collection("circuits").doc(currentUser.uid).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();

            // Clear current workspace
            circuitComponents = [];
            wires = [];

            // Remove all component elements but keep wires-layer
            const components = circuitBoard.querySelectorAll('.component');
            components.forEach(c => c.remove());

            // Clear wires-layer
            if (wiresLayer) wiresLayer.innerHTML = '';

            // Restore components
            let maxIdNum = 0;
            data.components.forEach(c => {
                restoreComponent(c, []);
                const idNum = parseInt(c.id.split('_')[1]);
                if (!isNaN(idNum)) maxIdNum = Math.max(maxIdNum, idNum);
            });

            // Update nextId to prevent collisions
            nextId = maxIdNum + 1;

            // Restore wires
            wires = data.wires || [];

            showToast("Circuit loaded from Cloud!", "success");
            drawWires();
        } else {
            showToast("No saved circuit found in Cloud");
        }
    }).catch(err => {
        showToast("Cloud load failed");
        console.error(err);
    });
}
const componentSearch = document.getElementById('component-search');
const searchBtn = document.getElementById('search-btn');

function renderPalette(query = '') {
    const listContainer = document.getElementById('palette-list');
    if (!listContainer) return;

    // Reset view
    listContainer.innerHTML = '';
    listContainer.scrollTop = 0;

    const lowQuery = query.trim().toLowerCase();
    let matches = [];

    if (lowQuery) {
        // 1. Filter and Sort Matches
        matches = componentsDB.filter(c =>
            c.name.toLowerCase().includes(lowQuery) ||
            c.id.toLowerCase().includes(lowQuery)
        ).sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const aStarts = aName.startsWith(lowQuery);
            const bStarts = bName.startsWith(lowQuery);

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            // If both start or both don't, prioritize exact matches
            if (aName === lowQuery && bName !== lowQuery) return -1;
            if (bName === lowQuery && aName !== lowQuery) return 1;

            return aName.localeCompare(bName);
        });

        // 2. Display Matches at the absolute top
        if (matches.length > 0) {
            const header = document.createElement('div');
            header.className = 'palette-category-header results-header';
            header.innerHTML = `<i class="fa-solid fa-square-poll-vertical"></i> Matches for "${query}"`;
            listContainer.appendChild(header);

            matches.forEach(comp => {
                listContainer.appendChild(createPaletteItem(comp, true));
            });

            // Divider
            const separator = document.createElement('div');
            separator.className = 'palette-separator';
            listContainer.appendChild(separator);
        } else {
            const noResults = document.createElement('div');
            noResults.className = 'palette-category-header';
            noResults.style.textAlign = 'center';
            noResults.style.padding = '10px';
            noResults.textContent = `No matches found`;
            listContainer.appendChild(noResults);
        }
    }

    // --- FULL LIBRARY SECTION ---
    if (lowQuery) {
        const fullHeader = document.createElement('div');
        fullHeader.className = 'palette-category-header';
        fullHeader.style.opacity = '0.5';
        fullHeader.textContent = 'All Components';
        listContainer.appendChild(fullHeader);
    }

    const categories = {
        'source': 'Power Sources',
        'passive': 'Passive Components',
        'active': 'Active Components',
        'control': 'Control Devices',
        'sensor': 'Sensors & Modules',
        'output': 'Output Devices'
    };

    Object.keys(categories).forEach(catId => {
        const catComps = componentsDB.filter(c => c.type === catId);
        if (catComps.length > 0) {
            const header = document.createElement('div');
            header.className = 'palette-category-header';
            header.textContent = categories[catId];
            listContainer.appendChild(header);

            catComps.forEach(comp => {
                // If searching, skip the duplicate if it's already in matches
                if (lowQuery && matches.find(m => m.id === comp.id)) return;

                listContainer.appendChild(createPaletteItem(comp));
            });
        }
    });
}

function createPaletteItem(comp, isResult = false) {
    const item = document.createElement('div');
    item.className = `palette-item ${isResult ? 'search-result-item' : ''}`;
    item.draggable = true;
    item.dataset.type = comp.id;
    item.innerHTML = `
        <div class="palette-icon"><i class="fa-solid ${comp.icon}"></i></div>
        <span>${comp.name}</span>
    `;
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', comp.id);
        e.dataTransfer.effectAllowed = 'copy';
    });

    // Add for mobile: Click to add to center of board
    item.addEventListener('click', () => {
        // Only if it's not a drag (though 'click' generally handles this)
        // Check if on mobile or if palette is open (mobile mode)
        if (window.innerWidth <= 768) {
            const rect = circuitBoard.getBoundingClientRect();
            // Place in the middle of current view
            const x = (rect.width / 2) / zoomLevel - 40;
            const y = (rect.height / 2) / zoomLevel - 30;
            addComponentToCanvas(comp, x, y);

            // Close palette on mobile after adding
            if (palette.classList.contains('open')) palette.classList.remove('open');
            showToast(`Added ${comp.name}`, "success");
        }
    });
    return item;
}

// Search Logic - Restored with Button
searchBtn.addEventListener('click', () => {
    renderPalette(componentSearch.value);
});

componentSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        renderPalette(componentSearch.value);
    }
});

// Real-time filtering remains as an option or can be disabled
componentSearch.addEventListener('input', (e) => {
    if (e.target.value === '') renderPalette();
});


function setupCanvasInteractions() {
    // Mobile Palette Toggle
    if (mobilePaletteToggle) {
        mobilePaletteToggle.addEventListener('click', () => {
            palette.classList.toggle('open');
        });
    }

    // Close palette when clicking outside or on canvas
    circuitBoard.addEventListener('mousedown', () => {
        if (palette && palette.classList.contains('open')) palette.classList.remove('open');
    });

    circuitBoard.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
    circuitBoard.addEventListener('drop', (e) => {
        e.preventDefault();
        const typeId = e.dataTransfer.getData('type');
        const compDef = componentsDB.find(c => c.id === typeId);
        if (compDef) {
            const rect = circuitBoard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / zoomLevel - 40;
            const y = (e.clientY - rect.top) / zoomLevel - 30;
            addComponentToCanvas(compDef, x, y);
        }
    });

    const getEventPos = (e) => {
        const rect = circuitBoard.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) / zoomLevel,
            y: (clientY - rect.top) / zoomLevel
        };
    };

    const handleMove = (e) => {
        if (currentWireStart) {
            tempWireEnd = getEventPos(e);
            drawWires();
        }
    };

    const handleUp = (e) => {
        if (currentWireStart && !e.target.classList.contains('node')) {
            currentWireStart = null; tempWireEnd = null; drawWires();
        }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);

    zoomInBtn.addEventListener('click', () => updateZoom(0.1));
    zoomOutBtn.addEventListener('click', () => updateZoom(-0.1));
}

function updateZoom(delta) {
    zoomLevel += delta; if (zoomLevel < 0.5) zoomLevel = 0.5; if (zoomLevel > 2) zoomLevel = 2;
    circuitBoard.style.transform = `scale(${zoomLevel})`;
}

function setupContextMenu() {
    document.addEventListener('click', () => { contextMenu.classList.add('hidden'); contextMenuTargetId = null; });
    ctxDelete.addEventListener('click', () => { if (contextMenuTargetId !== null) { deleteComponent(contextMenuTargetId); contextMenu.classList.add('hidden'); } });
    circuitBoard.addEventListener('contextmenu', (e) => { e.preventDefault(); });
}

function deleteComponent(id, recordHistory = true) {
    const comp = circuitComponents.find(c => c.id === id);
    if (!comp) return;

    const connectedWires = wires.filter(w => w.start.compId === id || w.end.compId === id);

    if (recordHistory) {
        addToHistory({ type: 'DELETE', data: { id: id, comp: comp, wires: connectedWires } });
    }

    circuitComponents = circuitComponents.filter(c => c.id !== id);
    wires = wires.filter(w => w.start.compId !== id && w.end.compId !== id);
    const el = document.getElementById(`comp-${id}`); if (el) el.remove();
    drawWires();
}

function addComponentToCanvas(compDef, x, y) {
    const id = nextId++;
    const compData = { id: id, defId: compDef.id, name: compDef.name, value: compDef.value, unit: compDef.unit, x: x, y: y };
    circuitComponents.push(compData);

    const el = document.createElement('div');
    el.className = 'circuit-component component-2d';
    el.id = `comp-${id}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    const svgPath = svgIcons[compDef.id] || svgIcons['res'];

    el.innerHTML = `
        <div class="node node-left" data-node="L"></div>
        <svg class="comp-svg" width="60" height="40" viewBox="0 0 60 40">${svgPath}</svg>
        <div class="node node-right" data-node="R"></div>
        <div class="comp-label"><span class="name">${compData.name}</span><span class="val-badge">${compData.value}${compData.unit}</span></div>`;

    attachComponentInteractions(el, compData);
    circuitBoard.appendChild(el);

    addToHistory({ type: 'ADD', data: compData });
}

function drawWires() {
    wiresLayer.innerHTML = '';
    const getPos = (compId, nodeId) => {
        const comp = circuitComponents.find(c => c.id === compId); if (!comp) return { x: 0, y: 0 };
        let y = comp.y + 30; let x = comp.x; if (nodeId === 'R') x += 80; return { x, y };
    };
    wires.forEach(wire => {
        const p1 = getPos(wire.start.compId, wire.start.nodeId);
        const p2 = getPos(wire.end.compId, wire.end.nodeId);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
        path.setAttribute('d', d); path.setAttribute('stroke', isRunning ? '#00f2ea' : '#888');
        path.setAttribute('stroke-width', isRunning ? '3' : '2'); path.setAttribute('fill', 'none');
        if (isRunning) path.classList.add('active');
        wiresLayer.appendChild(path);
    });
    if (currentWireStart && tempWireEnd) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', currentWireStart.x); line.setAttribute('y1', currentWireStart.y);
        line.setAttribute('x2', tempWireEnd.x); line.setAttribute('y2', tempWireEnd.y);
        line.setAttribute('stroke', '#fff'); line.setAttribute('stroke-dasharray', '5,5');
        wiresLayer.appendChild(line);
    }
}

// Notification Logic
const notificationArea = document.getElementById('notification-area');

function showToast(message, type = 'error') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${message}</span>`;
    notificationArea.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function validateCircuit() {
    let isValid = true;
    document.querySelectorAll('.circuit-component').forEach(el => el.classList.remove('connection-error'));

    circuitComponents.forEach(comp => {
        const hasLeftConnection = wires.some(w => (w.start.compId === comp.id && w.start.nodeId === 'L') || (w.end.compId === comp.id && w.end.nodeId === 'L'));
        const hasRightConnection = wires.some(w => (w.start.compId === comp.id && w.start.nodeId === 'R') || (w.end.compId === comp.id && w.end.nodeId === 'R'));

        if (!hasLeftConnection || !hasRightConnection) {
            isValid = false;
            const el = document.getElementById(`comp-${comp.id}`);
            if (el) el.classList.add('connection-error');
        }
    });

    if (!isValid) {
        showToast("Connection Error: Open circuit detected. Please connect all component pins.");
    }

    return isValid;
}

function solveCircuit() {
    if (!isRunning) return;

    // 1. Identify Nets (Groups of connected nodes)
    const nets = [];
    const visitedNodes = new Set();

    function getNet(compId, nodeId) {
        const key = `${compId}-${nodeId}`;
        if (visitedNodes.has(key)) return null;

        const net = [];
        const queue = [{ compId, nodeId }];
        visitedNodes.add(key);

        while (queue.length > 0) {
            const current = queue.shift();
            net.push(current);

            // Find wires connected to this node
            wires.forEach(w => {
                let neighbor = null;
                if (w.start.compId === current.compId && w.start.nodeId === current.nodeId) {
                    neighbor = w.end;
                } else if (w.end.compId === current.compId && w.end.nodeId === current.nodeId) {
                    neighbor = w.start;
                }

                if (neighbor) {
                    const nKey = `${neighbor.compId}-${neighbor.nodeId}`;
                    if (!visitedNodes.has(nKey)) {
                        visitedNodes.add(nKey);
                        queue.push({ compId: neighbor.compId, nodeId: neighbor.nodeId });
                    }
                }
            });
        }
        return net;
    }

    // Map all nodes to nets
    circuitComponents.forEach(comp => {
        ['L', 'R'].forEach(nodeId => {
            const net = getNet(comp.id, nodeId);
            if (net) nets.push(net);
        });
    });

    // 2. Identify Voltages
    // Net maps to a voltage value
    const netVoltages = new Map();

    nets.forEach((net, index) => {
        let voltage = 0;
        // Check if any node in this net is connected to a source's positive terminal
        net.forEach(node => {
            const comp = circuitComponents.find(c => c.id === node.compId);
            if (comp.defId === 'bat' || comp.defId === 'ps' || comp.defId === 'cell') {
                if (node.nodeId === 'R') { // Assume Right is positive for sources
                    voltage = parseFloat(comp.value) || 0;
                }
            } else if (comp.defId === 'gnd') {
                voltage = 0;
            }
        });
        netVoltages.set(index, voltage);
    });

    // 3. Update Components
    circuitComponents.forEach(comp => {
        const el = document.getElementById(`comp-${comp.id}`);
        if (!el) return;

        const netLIdx = nets.findIndex(n => n.some(node => node.compId === comp.id && node.nodeId === 'L'));
        const netRIdx = nets.findIndex(n => n.some(node => node.compId === comp.id && node.nodeId === 'R'));
        const vL = netVoltages.get(netLIdx) || 0;
        const vR = netVoltages.get(netRIdx) || 0;
        const diff = Math.abs(vR - vL);

        if (comp.defId === 'v_meter') {
            el.querySelector('.val-badge').textContent = `${diff.toFixed(1)}V`;
            if (diff > 0) el.classList.add('comp-active-v');
            else el.classList.remove('comp-active-v');
        }

        if (comp.defId === 'a_meter') {
            // Simple Ohm's Law for Current reading: I = V / R_path
            // We assume a 100 Ohm internal resistance for the ammeter for calculation purposes
            // Or better: just show V difference if user connected it across something.
            // For a series ammeter, we need to know the circuit impedance. 
            // Simplified: I = (V_source / (R_load + 0.1))
            // Here we'll just show current proportional to voltage drop across the meter
            // with a 1 Ohm shunt assumption for display.
            const current = diff / 1.0;
            el.querySelector('.val-badge').textContent = `${current.toFixed(2)}A`;
            if (current > 0) el.classList.add('comp-active-a');
            else el.classList.remove('comp-active-a');
        }

        if (comp.defId === 'led') {
            if (diff >= 1.5) el.classList.add('comp-active-led');
            else el.classList.remove('comp-active-led');
        }
    });
}

function openEditModal(compData) {
    editingComponentId = compData.id;
    editName.textContent = compData.name;
    editValue.value = compData.value;
    editUnit.textContent = compData.unit;
    editValue.type = "text";
    editModal.classList.remove('hidden');
}

saveValueBtn.addEventListener('click', () => {
    const valStr = editValue.value;
    const comp = circuitComponents.find(c => c.id === editingComponentId);
    if (comp) {
        comp.value = valStr;
        const el = document.getElementById(`comp-${comp.id}`);
        el.querySelector('.val-badge').textContent = `${valStr}${comp.unit}`;
    }
    editModal.classList.add('hidden');
});

if (runBtn) {
    runBtn.addEventListener('click', () => {
        if (validateCircuit()) {
            isRunning = true;
            runBtn.classList.add('hidden');
            stopBtn.classList.remove('hidden');
            drawWires();
            solveCircuit();
            document.querySelectorAll('.comp-svg').forEach(svg => svg.style.stroke = '#00f2ea');
        }
    });
}

if (stopBtn) {
    stopBtn.addEventListener('click', () => {
        isRunning = false;
        stopBtn.classList.add('hidden');
        runBtn.classList.remove('hidden');
        drawWires();

        document.querySelectorAll('.comp-active-led').forEach(el => el.classList.remove('comp-active-led'));
        document.querySelectorAll('.comp-active-v').forEach(el => el.classList.remove('comp-active-v'));
        document.querySelectorAll('.comp-active-a').forEach(el => el.classList.remove('comp-active-a'));

        circuitComponents.forEach(comp => {
            if (comp.defId === 'v_meter' || comp.defId === 'a_meter') {
                const el = document.getElementById(`comp-${comp.id}`);
                if (el) el.querySelector('.val-badge').textContent = `0${comp.unit}`;
            }
        });

        document.querySelectorAll('.comp-svg').forEach(svg => svg.style.stroke = 'currentColor');
    });
}

/* Helper Functions for Undo/Redo */

function moveComponent(id, x, y) {
    const comp = circuitComponents.find(c => c.id === id);
    if (comp) {
        comp.x = x; comp.y = y;
        const el = document.getElementById(`comp-${id}`);
        if (el) { el.style.left = `${x}px`; el.style.top = `${y}px`; }
        drawWires();
    }
}

function restoreComponent(compData, connectedWires) {
    circuitComponents.push(compData);
    const el = document.createElement('div');
    el.className = 'circuit-component component-2d';
    el.id = `comp-${compData.id}`;
    el.style.left = `${compData.x}px`;
    el.style.top = `${compData.y}px`;
    const svgPath = svgIcons[compData.defId] || svgIcons['res'];
    el.innerHTML = `
        <div class="node node-left" data-node="L"></div>
        <svg class="comp-svg" width="60" height="40" viewBox="0 0 60 40">${svgPath}</svg>
        <div class="node node-right" data-node="R"></div>
        <div class="comp-label"><span class="name">${compData.name}</span><span class="val-badge">${compData.value}${compData.unit}</span></div>`;

    attachComponentInteractions(el, compData);
    circuitBoard.appendChild(el);
    if (connectedWires) wires.push(...connectedWires);
    drawWires();
}

function attachComponentInteractions(el, compData) {
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    let startPos = { x: 0, y: 0 };

    const handleDown = (e) => {
        if (e.target.classList.contains('node') || e.button === 2) return;
        isDragging = true;
        const rect = el.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        offset.x = (clientX - rect.left) / zoomLevel;
        offset.y = (clientY - rect.top) / zoomLevel;
        startPos = { x: compData.x, y: compData.y };
        document.querySelectorAll('.circuit-component').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        if (e.touches) e.preventDefault(); // Prevent scrolling while dragging
    };

    el.addEventListener('mousedown', handleDown);
    el.addEventListener('touchstart', handleDown, { passive: false });

    el.addEventListener('contextmenu', (e) => {
        e.preventDefault(); e.stopPropagation();
        contextMenuTargetId = compData.id;
        contextMenu.style.left = `${e.clientX}px`; contextMenu.style.top = `${e.clientY}px`;
        contextMenu.classList.remove('hidden');
    });

    const handleMove = (e) => {
        if (isDragging) {
            const boardRect = circuitBoard.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            let rawX = (clientX - boardRect.left) / zoomLevel - offset.x;
            let rawY = (clientY - boardRect.top) / zoomLevel - offset.y;
            let newX = Math.round(rawX / 20) * 20; let newY = Math.round(rawY / 20) * 20;
            el.style.left = `${newX}px`; el.style.top = `${newY}px`;
            compData.x = newX; compData.y = newY; drawWires();
            if (e.touches) e.preventDefault();
        }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });

    const handleUp = () => {
        if (isDragging) {
            isDragging = false;
            if (compData.x !== startPos.x || compData.y !== startPos.y) {
                // Record Move
                addToHistory({
                    type: 'MOVE',
                    data: { id: compData.id, oldX: startPos.x, oldY: startPos.y, newX: compData.x, newY: compData.y }
                });
            }
        }
    };

    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);

    el.addEventListener('dblclick', () => openEditModal(compData));

    // For mobile: handle double tap or long press for edit? 
    // Let's just add a small "edit" button later if needed, or stick to dblclick for now which works in some mobile browsers as fast double tap.
    // Actually, let's add a long press for context menu/edit on mobile.
    let pressTimer;
    el.addEventListener('touchstart', (e) => {
        pressTimer = window.setTimeout(() => {
            if (!isDragging) {
                contextMenuTargetId = compData.id;
                const touch = e.touches[0];
                contextMenu.style.left = `${touch.clientX}px`; contextMenu.style.top = `${touch.clientY}px`;
                contextMenu.classList.remove('hidden');
            }
        }, 600);
    });
    el.addEventListener('touchend', () => clearTimeout(pressTimer));
    el.addEventListener('touchmove', () => clearTimeout(pressTimer));

    el.querySelectorAll('.node').forEach(node => {
        const handleNodeDown = (e) => {
            if (e.button === 2) return;
            e.stopPropagation();
            const rect = node.getBoundingClientRect();
            const boardRect = circuitBoard.getBoundingClientRect();
            const centerX = (rect.left + rect.width / 2 - boardRect.left) / zoomLevel;
            const centerY = (rect.top + rect.height / 2 - boardRect.top) / zoomLevel;
            if (!currentWireStart) { currentWireStart = { compId: compData.id, nodeId: node.dataset.node, x: centerX, y: centerY }; }
            else if (currentWireStart.compId !== compData.id || currentWireStart.nodeId !== node.dataset.node) {
                const newWire = { start: { ...currentWireStart }, end: { compId: compData.id, nodeId: node.dataset.node, x: centerX, y: centerY } };
                wires.push(newWire);
                addToHistory({ type: 'WIRE', data: { wire: newWire } });
                currentWireStart = null; tempWireEnd = null; drawWires();
            }
            if (e.touches) e.preventDefault();
        };
        node.addEventListener('mousedown', handleNodeDown);
        node.addEventListener('touchstart', handleNodeDown, { passive: false });
    });
}

// Search Logic - Correctly Attached
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        renderPalette(componentSearch.value);
    });
}

if (componentSearch) {
    componentSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            renderPalette(componentSearch.value);
        }
    });

    componentSearch.addEventListener('input', (e) => {
        renderPalette(e.target.value);
    });
}

const cloudSaveBtn = document.getElementById('cloud-save-btn');
const cloudLoadBtn = document.getElementById('cloud-load-btn');

if (cloudSaveBtn) {
    cloudSaveBtn.addEventListener('click', saveCircuitToCloud);
}

if (cloudLoadBtn) {
    cloudLoadBtn.addEventListener('click', loadCircuitFromCloud);
}
