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
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase Initialized Successfully");
} catch (e) {
    console.error("Firebase Init Failed:", e);
}
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
    { id: 'trim', name: "Bourns Trimpot 10k", type: "passive", value: 10, unit: "kΩ", icon: "fa-square-caret-down" },

    // Phase 4 Additions (User Requested) - flagged for custom rendering
    { id: 'esp32', name: "ESP32 Dev Module", type: "mcu", value: 0, unit: "", icon: "fa-microchip", custom: true },
    { id: 'uno', name: "Arduino Uno", type: "mcu", value: 0, unit: "", icon: "fa-microchip", custom: true },
    { id: 'nano', name: "Arduino Nano", type: "mcu", value: 0, unit: "", icon: "fa-microchip", custom: true },
    { id: 'mega', name: "Arduino Mega", type: "mcu", value: 0, unit: "", icon: "fa-microchip", custom: true },
    { id: 'atsha', name: "ATSHA204A Crypto", type: "active", value: 0, unit: "", icon: "fa-key" },
    { id: 'p_amp', name: "RF Power Amp", type: "rf", value: 0, unit: "dB", icon: "fa-wifi" },
    { id: 'ant_433', name: "433 MHz Antenna", type: "rf", value: 0, unit: "", icon: "fa-tower-broadcast" },
    { id: 'oled', name: "OLED Display", type: "output", value: 0, unit: "", icon: "fa-display" },
    { id: 'max3014', name: "MAX3014 Codec", type: "active", value: 0, unit: "", icon: "fa-headphones" }
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
    // Diodes: Pointing Right (Anode Left, Cathode Right)
    'dio': `<path d="M0,20 L20,20 M40,20 L60,20 M40,5 L40,35 M20,10 L40,20 L20,30 Z" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'led': `<path d="M0,20 L20,20 M40,20 L60,20 M40,5 L40,35 M20,10 L40,20 L20,30 Z" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M25,8 L35,0 M30,10 L40,2" stroke="currentColor" stroke-width="1.5" transform="translate(0, -5)"/>`,
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
    'zen': `<path d="M0,20 L20,20 M40,20 L60,20 M40,5 L40,35 M40,5 L35,10 M40,35 L45,30 M20,10 L40,20 L20,30 Z" fill="none" stroke="currentColor" stroke-width="2"/>`,
    'sch': `<path d="M0,20 L20,20 M40,20 L60,20 M40,5 L40,35 M40,5 L45,5 M45,5 L45,8 M40,35 L35,35 M35,35 L35,32 M20,10 L40,20 L20,30 Z" fill="none" stroke="currentColor" stroke-width="2"/>`,
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
             <path d="M0,20 L15,20 M45,20 L60,20" stroke="currentColor" stroke-width="2"/>`,

    // Phase 4 Icons - Enhanced Visuals & Scaled for Big Boards
    'esp32': `<rect x="0" y="0" width="90" height="130" rx="4" fill="#1a1a1a" stroke="#000" stroke-width="2"/>
              <rect x="25" y="20" width="40" height="60" rx="2" fill="#ccc" stroke="#999"/> <!-- Shield -->
              <text x="45" y="50" text-anchor="middle" fill="#666" font-size="8" font-family="monospace">ESP32</text>
              <rect x="35" y="120" width="20" height="8" fill="#silver"/> <!-- USB -->`,

    'uno': `<rect x="0" y="0" width="140" height="100" rx="4" fill="#008CBA" stroke="#005f7f" stroke-width="2"/>
            <rect x="0" y="20" width="30" height="30" fill="#silver" stroke="#666"/> <!-- USB -->
            <rect x="5" y="70" width="20" height="25" fill="#111"/> <!-- DC Jack -->
            <rect x="60" y="50" width="50" height="15" fill="#111" stroke="#333"/> <!-- Chip -->
            <text x="85" y="61" text-anchor="middle" fill="#fff" font-size="10">ATMEGA328P</text>
            <text x="70" y="80" fill="#fff" font-size="14" font-weight="bold">UNO</text>`,

    'nano': `<rect x="0" y="0" width="80" height="120" rx="2" fill="#004080" stroke="#002040" stroke-width="2"/>
             <rect x="25" y="5" width="30" height="20" fill="#silver"/> <!-- USB -->
             <rect x="30" y="50" width="20" height="20" transform="rotate(45 40 60)" fill="#111"/> <!-- Chip -->
             <text x="40" y="90" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">NANO</text>`,

    'mega': `<rect x="0" y="0" width="200" height="110" rx="4" fill="#007acc" stroke="#005c99" stroke-width="2"/>
             <rect x="0" y="20" width="25" height="25" fill="#silver"/> <!-- USB -->
             <rect x="80" y="40" width="40" height="40" transform="rotate(45 100 60)" fill="#111"/> <!-- Chip -->
             <text x="140" y="70" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">MEGA 2560</text>`,
    'atsha': `<rect x="15" y="5" width="30" height="30" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
              <text x="30" y="20" text-anchor="middle" fill="currentColor" font-size="6">CRYPTO</text>
              <path d="M25,25 L35,25 L35,30 M30,22 L30,25" stroke="currentColor" stroke-width="1.5"/>`,
    'p_amp': `<path d="M10,30 L10,10 L45,20 Z" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M45,20 L55,20 M5,20 L10,20" stroke="currentColor" stroke-width="2"/>
              <text x="22" y="23" fill="currentColor" font-size="8" font-weight="bold">PA</text>`,
    'ant_433': `<path d="M30,35 L30,20 M30,20 L20,5 M30,20 L40,5 M30,20 L30,5" stroke="currentColor" stroke-width="2"/>
                <path d="M20,5 Q30,0 40,5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>`,
    'oled': `<rect x="5" y="5" width="50" height="30" rx="2" fill="#000" stroke="currentColor" stroke-width="2"/>
             <rect x="8" y="8" width="44" height="24" fill="#0af" opacity="0.2"/>
             <text x="28" y="24" text-anchor="middle" fill="#0af" font-size="8">OLED</text>`,
    'max3014': `<rect x="12" y="5" width="36" height="30" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M12,12 L5,12 M54,12 L48,12 M12,28 L5,28 M54,28 L48,28" stroke="currentColor" stroke-width="1.5"/>
                <text x="30" y="22" text-anchor="middle" fill="currentColor" font-size="7">CODEC</text>`
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
const ctxRotate = document.getElementById('ctx-rotate');
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
// Pin Layout Definitions (Width, Height, Pins Array)
const pinLayouts = {
    'uno': {
        width: 140, height: 100,
        pins: [
            // Top Header (Digital)
            { id: 'D0', x: 120, y: 10 }, { id: 'D1', x: 112, y: 10 }, { id: 'D2', x: 104, y: 10 }, { id: 'D3', x: 96, y: 10 },
            { id: 'D4', x: 88, y: 10 }, { id: 'D5', x: 80, y: 10 }, { id: 'D6', x: 72, y: 10 }, { id: 'D7', x: 64, y: 10 },
            { id: 'D8', x: 54, y: 10 }, { id: 'D9', x: 46, y: 10 }, { id: 'D10', x: 38, y: 10 }, { id: 'D11', x: 30, y: 10 },
            { id: 'D12', x: 22, y: 10 }, { id: 'D13', x: 14, y: 10 }, { id: 'GND1', x: 6, y: 10 }, { id: 'AREF', x: 0, y: 10 },
            // Bottom Header (Power + Analog)
            // Power
            { id: 'RST', x: 30, y: 90 }, { id: '3V3', x: 38, y: 90 }, { id: '5V', x: 46, y: 90 },
            { id: 'GND2', x: 54, y: 90 }, { id: 'GND3', x: 62, y: 90 }, { id: 'VIN', x: 70, y: 90 },
            // Analog
            { id: 'A0', x: 86, y: 90 }, { id: 'A1', x: 94, y: 90 }, { id: 'A2', x: 102, y: 90 },
            { id: 'A3', x: 110, y: 90 }, { id: 'A4', x: 118, y: 90 }, { id: 'A5', x: 126, y: 90 }
        ]
    },
    'nano': {
        width: 80, height: 120,
        pins: [
            // Left Row (Top to Bottom)
            { id: 'D13', x: 5, y: 10 }, { id: '3V3', x: 5, y: 18 }, { id: 'REF', x: 5, y: 26 }, { id: 'A0', x: 5, y: 34 },
            { id: 'A1', x: 5, y: 42 }, { id: 'A2', x: 5, y: 50 }, { id: 'A3', x: 5, y: 58 }, { id: 'A4', x: 5, y: 66 },
            { id: 'A5', x: 5, y: 74 }, { id: 'A6', x: 5, y: 82 }, { id: 'A7', x: 5, y: 90 }, { id: '5V', x: 5, y: 98 },
            { id: 'RST', x: 5, y: 106 }, { id: 'GND1', x: 5, y: 114 },
            // Right Row (Top to Bottom)
            { id: 'D12', x: 75, y: 10 }, { id: 'D11', x: 75, y: 18 }, { id: 'D10', x: 75, y: 26 }, { id: 'D9', x: 75, y: 34 },
            { id: 'D8', x: 75, y: 42 }, { id: 'D7', x: 75, y: 50 }, { id: 'D6', x: 75, y: 58 }, { id: 'D5', x: 75, y: 66 },
            { id: 'D4', x: 75, y: 74 }, { id: 'D3', x: 75, y: 82 }, { id: 'D2', x: 75, y: 90 }, { id: 'GND2', x: 75, y: 98 },
            { id: 'RST2', x: 75, y: 106 }, { id: 'TX', x: 75, y: 114 }
        ]
    },
    'esp32': {
        width: 90, height: 130,
        pins: [
            // Left Row
            { id: 'EN', x: 5, y: 10 }, { id: 'VP', x: 5, y: 18 }, { id: 'VN', x: 5, y: 26 }, { id: '34', x: 5, y: 34 },
            { id: '35', x: 5, y: 42 }, { id: '32', x: 5, y: 50 }, { id: '33', x: 5, y: 58 }, { id: '25', x: 5, y: 66 },
            { id: '26', x: 5, y: 74 }, { id: '27', x: 5, y: 82 }, { id: '14', x: 5, y: 90 }, { id: '12', x: 5, y: 98 },
            { id: 'GND1', x: 5, y: 106 }, { id: '13', x: 5, y: 114 }, { id: 'D2', x: 5, y: 122 },
            // Right Row
            { id: '23', x: 85, y: 10 }, { id: '22', x: 85, y: 18 }, { id: 'TX', x: 85, y: 26 }, { id: 'RX', x: 85, y: 34 },
            { id: '21', x: 85, y: 42 }, { id: 'GND2', x: 85, y: 50 }, { id: '19', x: 85, y: 58 }, { id: '18', x: 85, y: 66 },
            { id: '5', x: 85, y: 74 }, { id: '17', x: 85, y: 82 }, { id: '16', x: 85, y: 90 }, { id: '4', x: 85, y: 98 },
            { id: '0', x: 85, y: 106 }, { id: '2', x: 85, y: 114 }, { id: '15', x: 85, y: 122 }
        ]
    },
    'mega': {
        width: 200, height: 110,
        pins: [
            // Top Digital
            { id: 'D22', x: 190, y: 10 }, { id: 'D24', x: 182, y: 10 }, { id: 'D26', x: 174, y: 10 }, { id: 'D28', x: 166, y: 10 },
            { id: 'D0', x: 140, y: 10 }, { id: 'D1', x: 132, y: 10 }, { id: 'D2', x: 124, y: 10 }, { id: 'D3', x: 116, y: 10 },
            { id: 'D4', x: 108, y: 10 }, { id: 'D5', x: 100, y: 10 }, { id: 'D6', x: 92, y: 10 }, { id: 'D7', x: 84, y: 10 },
            { id: 'D8', x: 70, y: 10 }, { id: 'D9', x: 62, y: 10 }, { id: 'D10', x: 54, y: 10 }, { id: 'D11', x: 46, y: 10 },
            { id: 'D12', x: 38, y: 10 }, { id: 'D13', x: 30, y: 10 }, { id: 'GND', x: 20, y: 10 },
            // Bottom
            { id: '5V', x: 40, y: 100 }, { id: '3V3', x: 30, y: 100 }, { id: 'GND2', x: 50, y: 100 },
            { id: 'A0', x: 80, y: 100 }, { id: 'A1', x: 88, y: 100 }, { id: 'A2', x: 96, y: 100 }, { id: 'A3', x: 104, y: 100 },
            { id: 'A4', x: 112, y: 100 }, { id: 'A5', x: 120, y: 100 }, { id: 'A8', x: 135, y: 100 }, { id: 'A15', x: 190, y: 100 }
        ]
    }
};

// Pin Layout Generatort
function getPinLayout(compDef) {
    // 1. Explicit Custom Layouts (MCUs)
    if (pinLayouts[compDef.id]) return pinLayouts[compDef.id];

    // 2. Transistors (3-Pin)
    if (['bjt', 'pnp', 'mos', 'pmos', 'jfet'].includes(compDef.id)) {
        return {
            width: 60, height: 60,
            pins: [
                { id: 'C', x: 30, y: 5 },  // Collector / Drain
                { id: 'B', x: 5, y: 30 },  // Base / Gate
                { id: 'E', x: 30, y: 55 }  // Emitter / Source
            ]
        };
    }

    // 3. Sensors/Modules (3-Pin or 4-Pin) usually bottom row
    if (compDef.type === 'sensor' && !compDef.custom) {
        // Generic 3-pin Sensor
        return {
            width: 60, height: 50,
            pins: [
                { id: 'VCC', x: 10, y: 45 },
                { id: 'OUT', x: 30, y: 45 },
                { id: 'GND', x: 50, y: 45 }
            ]
        };
    }

    // 4. ICs (Logic Gates - 2 In, 1 Out)
    if (['nand', 'nor', 'xor'].includes(compDef.id)) {
        return {
            width: 60, height: 40,
            pins: [
                { id: 'A', x: 0, y: 10 },
                { id: 'B', x: 0, y: 30 },
                { id: 'Q', x: 60, y: 20 }
            ]
        };
    }

    // 5. Standard 2-Pin (Res, Cap, LED, etc.)
    // We map them to specific coordinates instead of CSS classes
    return {
        width: 60, height: 40,
        pins: [
            { id: 'L', x: 0, y: 20 },
            { id: 'R', x: 60, y: 20 }
        ]
    };
}

// Inject Styles for Big Pins
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .node {
        width: 12px !important;
        height: 12px !important;
        background: #ffaa00 !important; /* Orange to stand out */
        border: 2px solid #000;
        z-index: 100 !important;
        transform: translate(-50%, -50%); /* Center on coordinate */
    }
    .node:hover {
        transform: translate(-50%, -50%) scale(1.3);
        background: #fff !important;
        box-shadow: 0 0 10px #ffaa00;
    }
    /* Hide old node-left/node-right default positioning since we use explicit top/left now */
    .component-2d .node-left, .component-2d .node-right {
        position: absolute; 
    }
`;
document.head.appendChild(styleSheet);

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
    console.log("Login Form Found, attaching listener.");
    loginForm.addEventListener('submit', (e) => {
        console.log("Form Submitted! Preventing Default.");
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
                // Fix: ID is stored as number in comp data objects usually
                // But let's handle if it was undefined or whatever
                // If c.id is "comp-1", split might be needed. If it's just 1, direct use.
                // Our data model uses numbers for IDs.
                const idNum = parseInt(c.id);
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

    // If we have a query, we stop here (Only show matches)
    if (lowQuery) return;

    // --- FULL LIBRARY SECTION (Only if no search) ---
    const categories = {
        'mcu': 'Microcontrollers',
        'rf': 'RF Modules',
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
        if (window.innerWidth <= 768) {
            const rect = circuitBoard.getBoundingClientRect();
            const x = (rect.width / 2) / zoomLevel - 40;
            const y = (rect.height / 2) / zoomLevel - 30;
            addComponentToCanvas(comp, x, y);
            if (palette.classList.contains('open')) palette.classList.remove('open');
            showToast(`Added ${comp.name}`, "success");
        }
    });

    // Add for desktop: Double click to add to center of board
    item.addEventListener('dblclick', () => {
        if (window.innerWidth > 768) {
            const rect = circuitBoard.getBoundingClientRect();
            const x = (rect.width / 2) / zoomLevel - 40;
            const y = (rect.height / 2) / zoomLevel - 30;
            addComponentToCanvas(comp, x, y);
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
    // Always render, even if empty (which resets to full list)
    renderPalette(e.target.value);
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
        // Waypoint Logic: If released on board (not node), add a waypoint
        if (currentWireStart && !e.target.classList.contains('node')) {
            if (tempWireEnd) {
                if (!currentWireStart.waypoints) currentWireStart.waypoints = [];
                // Add current cursor position as waypoint
                currentWireStart.waypoints.push({ x: tempWireEnd.x, y: tempWireEnd.y });
            }
            // Do NOT clear currentWireStart. User continues drawing from this waypoint.
            drawWires();
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
    if (ctxRotate) {
        ctxRotate.addEventListener('click', () => { if (contextMenuTargetId !== null) { rotateComponent(contextMenuTargetId); contextMenu.classList.add('hidden'); } });
    }
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
    const compData = { id: id, defId: compDef.id, name: compDef.name, value: compDef.value, unit: compDef.unit, x: x, y: y, rotation: 0 };
    circuitComponents.push(compData);

    const el = document.createElement('div');
    el.className = 'circuit-component component-2d';

    // Get Layout (Generic or Custom)
    const layout = getPinLayout(compDef);
    compData.width = layout.width;
    compData.height = layout.height;

    el.id = `comp-${id}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${compData.width}px`;
    el.style.height = `${compData.height}px`;

    const svgPath = svgIcons[compDef.id] || svgIcons['res'];

    // Render Nodes Loop
    let nodesHTML = '';
    layout.pins.forEach(pin => {
        // For standard components, map 'L' and 'R' to their visual positions
        // The getPinLayout function already handles coordinate definition
        nodesHTML += `<div class="node" data-node="${pin.id}" 
            style="left: ${pin.x}px; top: ${pin.y}px;" 
            title="${pin.id}"></div>`;
    });

    el.innerHTML = `
        ${nodesHTML}
        // Scale SVG to fit
        <svg class="comp-svg" width="${compData.width}" height="${compData.height}" 
             viewBox="0 0 ${compData.width} ${compData.height}" preserveAspectRatio="none">${svgPath}</svg>
        <div class="comp-label" style="top: ${compData.height + 2}px"><span class="name">${compData.name}</span><span class="val-badge">${compData.value}${compData.unit}</span></div>`;

    attachComponentInteractions(el, compData);
    circuitBoard.appendChild(el);

    addToHistory({ type: 'ADD', data: compData });
}

// Updated drawWires to support Waypoints
function drawWires() {
    wiresLayer.innerHTML = '';
    wiresLayer.innerHTML = '';
    const getPos = (compId, nodeId) => {
        const comp = circuitComponents.find(c => c.id === compId); if (!comp) return { x: 0, y: 0 };

        // Universal Lookup via Layout System
        const compDef = componentsDB.find(c => c.id === comp.defId) || { id: 'res' };
        const layout = getPinLayout(compDef);
        const pin = layout.pins.find(p => p.id === nodeId);

        if (pin) {
            const cx = layout.width / 2;
            const cy = layout.height / 2;
            const dx = pin.x - cx;
            const dy = pin.y - cy; // Relative to center

            const rad = (comp.rotation || 0) * (Math.PI / 180);
            const rdx = dx * Math.cos(rad) - dy * Math.sin(rad);
            const rdy = dx * Math.sin(rad) + dy * Math.cos(rad);
            return { x: comp.x + cx + rdx, y: comp.y + cy + rdy };
        }
        return { x: comp.x, y: comp.y }; // Fallback
    };

    // Draw Completed Wires
    wires.forEach(wire => {
        const p1 = getPos(wire.start.compId, wire.start.nodeId);
        const p2 = getPos(wire.end.compId, wire.end.nodeId);

        let d = `M ${p1.x} ${p1.y}`;
        if (wire.waypoints && wire.waypoints.length > 0) {
            wire.waypoints.forEach(wp => {
                d += ` L ${wp.x} ${wp.y}`;
            });
        }
        d += ` L ${p2.x} ${p2.y}`;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('stroke', isRunning ? '#00f2ea' : '#888');
        path.setAttribute('stroke-width', isRunning ? '3' : '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('stroke-linecap', 'round');

        if (isRunning) path.classList.add('active');
        wiresLayer.appendChild(path);

        // Draw Waypoint dots for visibility (optional, but helpful for debugging/visuals)
        if (wire.waypoints) {
            wire.waypoints.forEach(wp => {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', wp.x); circle.setAttribute('cy', wp.y);
                circle.setAttribute('r', '2'); circle.setAttribute('fill', '#888');
                wiresLayer.appendChild(circle);
            });
        }
    });

    // Draw Active Drawing Wire
    if (currentWireStart && tempWireEnd) {
        const pStart = currentWireStart; // Has x,y from initial click
        // But better to re-calculate from component in case it moved? 
        // No, you can't move components while drawing wires usually.

        let d = `M ${pStart.x} ${pStart.y}`;

        // Draw confirmed waypoints
        if (currentWireStart.waypoints && currentWireStart.waypoints.length > 0) {
            currentWireStart.waypoints.forEach(wp => {
                d += ` L ${wp.x} ${wp.y}`;
            });
        }

        // Draw line to current cursor
        d += ` L ${tempWireEnd.x} ${tempWireEnd.y}`;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('stroke', '#fff');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-dasharray', '5,5');
        wiresLayer.appendChild(path);
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
        showToast("Warning: Open circuit pins detected. Simulation continues.", "warning");
    }

    return true; // Allow running anyway
}

// --- MNA Solver & Math Helpers ---

function solveLinearSystem(A, b) {
    // Gaussian Elimination with Partial Pivoting
    const n = A.length;

    for (let i = 0; i < n; i++) {
        // Pivot
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
        }

        // Swap rows in A and b
        [A[i], A[maxRow]] = [A[maxRow], A[i]];
        [b[i], b[maxRow]] = [b[maxRow], b[i]];

        // Eliminate
        if (Math.abs(A[i][i]) < 1e-10) continue; // Singular or nearly singular

        for (let k = i + 1; k < n; k++) {
            const factor = A[k][i] / A[i][i];
            b[k] -= factor * b[i];
            for (let j = i; j < n; j++) {
                A[k][j] -= factor * A[i][j];
            }
        }
    }

    // Back Substitution
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        if (Math.abs(A[i][i]) < 1e-10) continue;
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += A[i][j] * x[j];
        }
        x[i] = (b[i] - sum) / A[i][i];
    }

    return x;
}

function solveCircuit() {
    if (!isRunning) return;

    // 1. Identify Nets (Groups of connected nodes)
    const nets = [];
    const visitedNodes = new Set();
    const nodeMap = new Map(); // Fast lookup cache

    // Helper: Build Nets
    function getNet(compId, nodeId) {
        const key = `${compId}-${nodeId}`;
        if (visitedNodes.has(key)) return null;

        const net = [];
        const queue = [{ compId, nodeId }];
        visitedNodes.add(key);

        // Find full net
        while (queue.length > 0) {
            const current = queue.shift();
            net.push(current);
            nodeMap.set(`${current.compId}-${current.nodeId}`, nets.length); // Optimization

            wires.forEach(w => {
                let neighbor = null;
                if (w.start.compId === current.compId && w.start.nodeId === current.nodeId) neighbor = w.end;
                else if (w.end.compId === current.compId && w.end.nodeId === current.nodeId) neighbor = w.start;

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
        const compDef = componentsDB.find(c => c.id === comp.defId) || { id: 'res' };
        const layout = getPinLayout(compDef);
        layout.pins.forEach(pin => {
            const net = getNet(comp.id, pin.id);
            if (Array.isArray(net)) nets.push(net);
        });
    });

    // Determine Ground Net
    let gndNetIdx = -1;
    circuitComponents.forEach(comp => {
        if (comp.defId === 'gnd') {
            const netIdx = nets.findIndex(n => n.some(node => node.compId === comp.id));
            if (netIdx !== -1) gndNetIdx = netIdx;
        }
    });

    if (gndNetIdx === -1) gndNetIdx = 0; // Floating reference if needed

    // Voltage Sources for Modified Nodal
    const voltageSources = [];
    circuitComponents.forEach(comp => {
        if (['bat', 'ps', 'cell'].includes(comp.defId)) voltageSources.push(comp);
    });

    const numNets = nets.length;
    const numVS = voltageSources.length;
    const matrixSize = numNets + numVS;

    if (matrixSize === 0) {
        console.warn("Solver: Matrix empty (No nets or sources).");
        return;
    }

    // Helpers
    const getNetId = (compId, nodeId) => {
        return nets.findIndex(n => n.some(node => node.compId === compId && node.nodeId === nodeId));
    };

    // State Persistence for Iterations (Store voltage diffs to smooth transitions)
    // We actually just need the last solution vector to determine operating points.
    // Initialize with 0 if not exists (or previous frame's approximation)
    let solution = new Array(matrixSize).fill(0);

    // --- NON-LINEAR ITERATION LOOP ---
    const MAX_ITER = 10;
    for (let iter = 0; iter < MAX_ITER; iter++) {

        // Reset Matrix System
        const G = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(0));
        const I = new Array(matrixSize).fill(0);

        // -- Stamp Linear Components --
        circuitComponents.forEach(comp => {
            const n1 = getNetId(comp.id, 'L');
            const n2 = getNetId(comp.id, 'R');
            if (n1 === -1 || n2 === -1) return;

            // Resistors
            if (['res', 'pot', 'trim', 'nth'].includes(comp.defId)) {
                let r = parseFloat(comp.value) || 1000;
                if (comp.unit === 'kΩ') r *= 1000;
                if (comp.unit === 'mΩ') r *= 0.001;
                if (r < 0.001) r = 0.001;
                const g = 1 / r;
                G[n1][n1] += g; G[n2][n2] += g; G[n1][n2] -= g; G[n2][n1] -= g;
            }

            // Ideal Meters
            if (comp.defId === 'v_meter') {
                const g = 1e-9; // Very Low Conductance (1G Ohm)
                G[n1][n1] += g; G[n2][n2] += g; G[n1][n2] -= g; G[n2][n1] -= g;
            }
            if (comp.defId === 'a_meter') {
                const g = 1000; // 0.001 Ohm
                G[n1][n1] += g; G[n2][n2] += g; G[n1][n2] -= g; G[n2][n1] -= g;
            }
        });

        // -- Stamp Voltage Sources --
        voltageSources.forEach((comp, idx) => {
            const vsIdx = numNets + idx;
            let v = parseFloat(comp.value) || 9;
            if (comp.unit === 'mV') v *= 0.001;

            // Corrected Polarity: Left (Long Bar) is Positive, Right (Short Bar) is Negative
            const nPos = getNetId(comp.id, 'L');
            const nNeg = getNetId(comp.id, 'R');

            if (nPos !== -1) { G[vsIdx][nPos] = 1; G[nPos][vsIdx] = 1; }
            if (nNeg !== -1) { G[vsIdx][nNeg] = -1; G[nNeg][vsIdx] = -1; }
            I[vsIdx] = v;
        });

        // -- Ground --
        if (gndNetIdx !== -1) {
            G[gndNetIdx][gndNetIdx] += 1e6; // Soft Ground
        }

        // -- Stamp Non-Linear Components (Dynamic) --
        /* 
           Using Norton Equivalent for Diode/Zener in ON state:
           Source I_eq in parallel with G_on.
           V = (I_node + I_eq) / G_on
           We want V_diff = V_fwd
           Current I flowing from Anode->Cathode = (V_a - V_c - V_fwd) * G_on
           KCL term at Anode: -I_diode = - (V_a - V_c)G_on + V_fwd*G_on
           KCL term at Cathode: +I_diode = + (V_a - V_c)G_on - V_fwd*G_on
           
           So:
           Add G_on to Matrix (Like resistor).
           Add constant current J = V_fwd * G_on to Vector.
               - Inflow to Anode node (Positive Index)? No, KCL sum I = 0.
               - Ix = GxV - J... 
               - I_leaving_anode = (Va - Vc - Vf)*G
                                 = (Va - Vc)G - Vf*G
               - Matrix row for Anode (Sum currents = 0):
                 ... + (Va - Vc)G ...  = ... + Vf*G
               - So Add +Vf*G to Anode RHS (I vector).
               - Add -Vf*G to Cathode RHS (I vector).
        */

        circuitComponents.forEach(comp => {
            if (!['led', 'dio', 'zen', 'sch'].includes(comp.defId)) return;

            const nA = getNetId(comp.id, 'L'); // Anode (Left?) - Wait, icons suggest Triangle points right aka L inputs, R outputs?
            // Standard schematic: Current flows Left to Right usually.
            // Let's assume Left=Anode, Right=Cathode for standard icons.
            const nC = getNetId(comp.id, 'R');

            if (nA === -1 || nC === -1) return;

            // Get current estimates
            const vA = solution[nA] || 0;
            const vC = solution[nC] || 0;
            const vDiff = vA - vC;

            // Parameters
            let vFwd = 0.7; // Standard Diode/Zener Fwd
            let vRev = 0;   // Breakdown voltage (Positive Value)

            if (comp.defId === 'led') vFwd = 2.0;
            if (comp.defId === 'sch') vFwd = 0.3;
            if (comp.defId === 'zen') vRev = parseFloat(comp.value) || 5.1; // Zener Value

            const gOff = 1e-9;
            const gOn = 10; // 0.1 Ohm ON resistance

            // Logic
            let activeG = gOff;
            let activeVcorr = 0; // The battery part of the model

            // Check Forward Bias
            if (vDiff > vFwd) {
                activeG = gOn;
                activeVcorr = vFwd; // Opposes current from A to C
                // Current I = (Vdiff - Vfwd) * Gon
            }
            // Check Reverse Bias (Zener Breakdown)
            else if (vRev > 0 && (vC - vA) > vRev) {
                // Breakdown! Current flows Cathode -> Anode
                // Modeled as Source Vrev opposing C->A current
                activeG = gOn;
                activeVcorr = -vRev; // Negative because it's opposing the reverse potential? 

                // Let's derive again:
                // We want Vc - Va = Vrev  => Va - Vc = -Vrev
                // I_c_to_a = (Vc - Va - Vrev) * Gon
                // I_leaving_anode (entering diode from left) = - I_c_to_a
                // = - (Vc - Va - Vrev) * Gon
                // = (Va - Vc + Vrev) * Gon
                // = (Va - Vc)*Gon + Vrev*Gon
                // Anode Row: ... + (Va-Vc)G ... = - Vrev*Gon
                // So activeVcorr = -Vrev.
            }

            // Apply G
            G[nA][nA] += activeG; G[nC][nC] += activeG;
            G[nA][nC] -= activeG; G[nC][nA] -= activeG;

            // Apply Current Correction (RHS)
            if (activeVcorr !== 0) {
                const currentInj = activeVcorr * activeG;
                // Anode Row RHS: += currentInj
                I[nA] += currentInj;
                // Cathode Row RHS: -= currentInj
                I[nC] -= currentInj;
            }
        });

        // -- Solve --
        const nextSolution = solveLinearSystem(G, I);

        // Damping / Convergence Check
        let diffSum = 0;
        for (let k = 0; k < matrixSize; k++) diffSum += Math.abs(nextSolution[k] - solution[k]);

        solution = nextSolution;
        if (diffSum < 0.001) break; // Converged
    }

    // --- Update UI ---
    circuitComponents.forEach(comp => {
        const el = document.getElementById(`comp-${comp.id}`);
        if (!el) return;

        const n1 = getNetId(comp.id, 'L');
        const n2 = getNetId(comp.id, 'R');
        const vL = (n1 !== -1) ? solution[n1] : 0;
        const vR = (n2 !== -1) ? solution[n2] : 0;
        const diff = vL - vR; // Anode - Cathode generally

        if (comp.defId === 'v_meter') {
            const vDiff = vR - vL; // Keep meter polarity standard (R is +?)
            el.querySelector('.val-badge').textContent = `${vDiff.toFixed(2)}V`;
            if (Math.abs(vDiff) > 0.1) el.classList.add('comp-active-v');
            else el.classList.remove('comp-active-v');
        }

        if (comp.defId === 'a_meter') {
            const i = (vL - vR) / 0.001; // Current L->R
            el.querySelector('.val-badge').textContent = `${Math.abs(i).toFixed(3)}A`;
            if (Math.abs(i) > 0.001) el.classList.add('comp-active-a');
            else el.classList.remove('comp-active-a');
        }

        if (['led', 'dio', 'zen', 'sch'].includes(comp.defId)) {
            // Visual cleanup - if conducting significantly
            // For Zener, if reverse breakdown (vR - vL > Vz), it's active.
            let isActive = false;
            if (diff > 0.5) isActive = true; // Forward
            if (comp.defId === 'zen' && (vR - vL) > (parseFloat(comp.value) || 0) * 0.9) isActive = true; // Breakdown

            if (isActive) el.classList.add('comp-active-led');
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

// Direct assignment to ensure no event listener issues
// Consolidated Event Listeners

// 1. Component Update Logic
if (saveValueBtn) {
    saveValueBtn.addEventListener('click', () => {
        try {
            if (!editValue) {
                alert("Critical Error: Edit input not found in DOM");
                return;
            }

            const valStr = editValue.value;

            if (editingComponentId === null) {
                alert("Error: No component ID currently selected.");
                return;
            }

            const comp = circuitComponents.find(c => c.id === editingComponentId);
            if (comp) {
                comp.value = valStr;

                // Update Badge UI
                const el = document.getElementById(`comp-${comp.id}`);
                if (el) {
                    const badge = el.querySelector('.val-badge');
                    if (badge) badge.textContent = `${valStr}${comp.unit}`;
                }

                showToast(`Component updated: ${valStr}${comp.unit}`, "success");

                // If simulation is running, re-calculate immediately
                if (isRunning && typeof solveCircuit === 'function') solveCircuit();

            } else {
                alert("Error: Component not found in memory.");
            }

            // Close Modal
            if (editModal) editModal.classList.add('hidden');

        } catch (e) {
            console.error("Update Handler Error:", e);
            alert("Update Error: " + e.message);
        }
    });
}

// 2. Run / Stop Logic
if (runBtn) {
    runBtn.addEventListener('click', () => {
        try {
            if (!circuitComponents || circuitComponents.length === 0) {
                showToast("Circuit is empty!", "warning");
                return;
            }

            // Basic validation
            if (typeof validateCircuit === 'function' && !validateCircuit()) {
                // validateCircuit usually handles its own toasts
            }

            isRunning = true;
            runBtn.classList.add('hidden');
            stopBtn.classList.remove('hidden');

            // Force redraw/calculation
            drawWires();
            if (typeof solveCircuit === 'function') {
                solveCircuit();
            } else {
                console.warn("solveCircuit function not found!");
            }

            document.querySelectorAll('.comp-svg').forEach(svg => svg.style.stroke = '#00f2ea');
            showToast("Simulation Started", "success");

        } catch (err) {
            console.error("Run Error:", err);
            isRunning = false;
            runBtn.classList.remove('hidden');
            stopBtn.classList.add('hidden');
        }
    });
}

if (stopBtn) {
    stopBtn.addEventListener('click', () => {
        isRunning = false;
        stopBtn.classList.add('hidden');
        runBtn.classList.remove('hidden');

        drawWires();

        // Reset Visuals
        document.querySelectorAll('.comp-active-led').forEach(el => el.classList.remove('comp-active-led'));
        document.querySelectorAll('.comp-active-v').forEach(el => el.classList.remove('comp-active-v'));
        document.querySelectorAll('.comp-active-a').forEach(el => el.classList.remove('comp-active-a'));

        // Reset Meters
        circuitComponents.forEach(comp => {
            if (['v_meter', 'a_meter'].includes(comp.defId)) {
                const el = document.getElementById(`comp-${comp.id}`);
                if (el) {
                    const badge = el.querySelector('.val-badge');
                    if (badge) badge.textContent = `0${comp.unit}`;
                }
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

// Rotate Logic
function rotateComponent(id) {
    // Ensure ID is number if needed (our IDs are numbers)
    const numericId = parseInt(id);
    const comp = circuitComponents.find(c => c.id === numericId);

    if (!comp) {
        return;
    }

    if (!comp.rotation) comp.rotation = 0;
    const oldRotation = comp.rotation;
    comp.rotation = (comp.rotation + 90) % 360;

    const el = document.getElementById(`comp-${numericId}`);
    if (el) {
        el.style.transform = `rotate(${comp.rotation}deg)`;
    } else {
        // console.warn("Rotate Warning: DOM Element not found for ID:", numericId);
    }

    drawWires();
}

// Global Key Listener for Rotation and Cancellation
document.addEventListener('keydown', (e) => {
    // Escape to cancel wire
    if (e.key === 'Escape' && currentWireStart) {
        currentWireStart = null;
        tempWireEnd = null;
        drawWires();
        // showToast("Wire cancelled", "info"); // Optional feedback
        return;
    }

    // Ignore if typing in input fields
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Find selected component
        const selected = document.querySelector('.circuit-component.selected');
        if (selected) {
            console.log("Rotation Key Pressed. Selected:", selected.id);
            const idPart = selected.id.split('-')[1];
            if (idPart) rotateComponent(idPart);
        } else {
            console.log("Rotation Key Pressed but no component selected.");
        }
    }
});

function restoreComponent(compData, connectedWires) {
    if (compData.rotation === undefined) compData.rotation = 0;
    circuitComponents.push(compData);
    const el = document.createElement('div');
    el.className = 'circuit-component component-2d';
    el.id = `comp-${compData.id}`;
    el.style.left = `${compData.x}px`;
    el.style.top = `${compData.y}px`;
    if (compData.rotation) el.style.transform = `rotate(${compData.rotation}deg)`;
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
                const newWire = {
                    start: { ...currentWireStart },
                    end: { compId: compData.id, nodeId: node.dataset.node, x: centerX, y: centerY },
                    waypoints: currentWireStart.waypoints ? [...currentWireStart.waypoints] : []
                };
                wires.push(newWire);
                addToHistory({ type: 'WIRE', data: { wire: newWire } });
                currentWireStart = null; tempWireEnd = null;
                drawWires();
                // If running, only solve if circuit is valid (might be partial now)
                if (isRunning && typeof solveCircuit === 'function') solveCircuit();
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
