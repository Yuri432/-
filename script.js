// ข้อมูล Time Zones
const TIMEZONES = {
    thai: { id: 'Asia/Bangkok', name: '🇹🇭 กรุงเทพฯ, ประเทศไทย', offset: 7, city: 'ไทย' },
    japan: { id: 'Asia/Tokyo', name: '🇯🇵 โตเกียว, ญี่ปุ่น', offset: 9, city: 'ญี่ปุ่น' },
    sydney: { id: 'Australia/Sydney', name: '🇦🇺 ซิดนีย์, ออสเตรเลีย', offset: 11, city: 'ซิดนีย์' } 
};

// ฐานข้อมูลปีนักษัตร
const CHINESE_ZODIACS = [
    "ชวด (หนู)", "ฉลู (วัว)", "ขาล (เสือ)", "เถาะ (กระต่าย)", 
    "มะโรง (งูใหญ่/มังกร)", "มะเส็ง (งูเล็ก)", "มะเมีย (ม้า)", "มะแม (แพะ)", 
    "วอก (ลิง)", "ระกา (ไก่)", "จอ (สุนัข)", "กุน (หมู)"
];

const isNight = (hour) => hour >= 19 || hour < 6;

// ==============================================
// 🛠️ ฟังก์ชันช่วยเหลือ: แปลงรูปแบบวันที่
// ==============================================

function parseDate(dateString) {
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;

    let day = parseInt(parts[0]);
    let month = parseInt(parts[1]) - 1; 
    let year = parseInt(parts[2]);

    const currentCEYear = new Date().getFullYear();
    if (year > currentCEYear + 10) { 
        year = year - 543; // แปลง พ.ศ. เป็น ค.ศ.
    }

    const date = new Date(year, month, day);

    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        return null;
    }

    return date;
}


// ==============================================
// 🔮 ข้อมูลฐานระบบทำนายชื่อ (ทักษา และ เลขศาสตร์)
// ==============================================

const TAKSA_RULES = {
    0: { day: "วันอาทิตย์", rules: ["อห", "กขคฆง", "จฉชซฌญ", "ฎฏฐฑฒณ", "ตถทธน", "บปผฝพฟภม", "ยรลว", "ศษสหฬฮ"], vowels: "ะาิีึืุูเแอโอไอใ", kala: "ศษสหฬฮ" },
    1: { day: "วันจันทร์", rules: ["กขคฆง", "จฉชซฌญ", "ฎฏฐฑฒณ", "ตถทธน", "บปผฝพฟภม", "ยรลว", "ศษสหฬฮ", "อห"], vowels: "ะาิีึืุูเแอโอไอใ", kala: "อะอาอิอีอุอูเแอโอไอใ" },
    2: { day: "วันอังคาร", rules: ["จฉชซฌญ", "ฎฏฐฑฒณ", "ตถทธน", "บปผฝพฟภม", "ยรลว", "ศษสหฬฮ", "อห", "กขคฆง"], kala: "กขคฆง" },
    3: { day: "วันพุธ (กลางวัน)", rules: ["ฎฏฐฑฒณ", "ตถทธน", "บปผฝพฟภม", "ยรลว", "ศษสหฬฮ", "อห", "กขคฆง", "จฉชซฌญ"], kala: "จฉชซฌญ" },
    4: { day: "วันพฤหัสบดี", rules: ["ตถทธน", "บปผฝพฟภม", "ยรลว", "ศษสหฬฮ", "อห", "กขคฆง", "จฉชซฌญ", "ฎฏฐฑฒณ"], kala: "ฎฏฐฑฒณ" },
    5: { day: "วันศุกร์", rules: ["บปผฝพฟภม", "ยรลว", "ศษสหฬฮ", "อห", "กขคฆง", "จฉชซฌญ", "ฎฏฐฑฒณ", "ตถทธน"], kala: "ตถทธน" },
    6: { day: "วันเสาร์", rules: ["ยรลว", "ศษสหฬฮ", "อห", "กขคฆง", "จฉชซฌญ", "ฎฏฐฑฒณ", "ตถทธน", "บปผฝพฟภม"], kala: "บปผฝพฟภม" },
    7: { day: "วันพุธ (กลางคืน/ราหู)", rules: ["ศษสหฬฮ", "อห", "กขคฆง", "จฉชซฌญ", "ฎฏฐฑฒณ", "ตถทธน", "บปผฝพฟภม", "ยรลว"], kala: "ยรลว" },
};
const TAKSA_NAMES = ["บริวาร (ผู้คนรอบตัว)", "อายุ (สุขภาพ)", "เดช (อำนาจ/บารมี)", "ศรี (สิริมงคล/โชคลาภ)", "มูละ (ทรัพย์สิน/การเงิน)", "อุตสาหะ (ความพยายาม/ผลสำเร็จ)", "มนตรี (ผู้อุปถัมภ์/ผู้ใหญ่)", "กาลกิณี (อับโชค/ความขัดแย้ง)"];
const THAI_NUMEROLOGY_VALUES = {
    'ก': 1, 'ด': 1, 'ถ': 1, 'ท': 1, 'ภ': 1, 'อ': 1, 'ะ': 1, 'า': 1, 'ั': 6, 'ำ': 1, 'ฤ': 1,
    'ข': 2, 'ช': 2, 'บ': 2, 'ป': 2, 'ง': 2, 'เ': 2, 'แ': 2, 'ใ': 2, 'ไ': 2, '่': 2, '้': 2, '๊': 2, '๋': 2,
    'จ': 3, 'ร': 3, 'ย': 3, 'ว': 3, 'ี': 3, 'ึ': 3, 'ื': 3, 'โ': 5,
    'ต': 4, 'น': 4, 'ธ': 4, 'ซ': 4, 'ศ': 4, 'ษ': 4, 'ณ': 4, 'ฒ': 4, 'ุ': 4, 'ู': 4, '็': 4, '์': 0, 'ฯ': 0, ' ': 0,
    'ฆ': 5, 'ค': 5, 'ฉ': 5, 'ฑ': 5, 'ม': 5, 'ห': 5, 'ฮ': 5,
    'ผ': 6, 'พ': 6, 'ฝ': 6, 'ฟ': 6, 'ม': 6, 'ย': 6, 'ศ': 6, 'ส': 6,
    'ซ': 7, 'ฐ': 7, 'ฑ': 7, 'ฒ': 7, 'ร': 7, 'ิ': 4,
    'ฎ': 9, 'ล': 9,
};
const NUMEROLOGY_MEANINGS = { 19: { title: "19: ดาวจันทร์คู่ดาวอาทิตย์ (ความสำเร็จสูง)", detail: "เป็นเลขดีมาก มักนำมาซึ่งความสำเร็จ โชคลาภ..." }, 22: { title: "22: จันทร์คู่ (ความอ่อนไหว/ขาดความแน่นอน)", detail: "เป็นเลขที่ไม่ดี มักประสบปัญหาในชีวิตคู่..." }, 24: { title: "24: โชคลาภและความอุดมสมบูรณ์", detail: "เป็นเลขดีมาก มักมีชีวิตที่สุขสบาย..." }, 29: { title: "29: ความก้าวหน้าอย่างรวดเร็ว (ความสามารถรอบด้าน)", detail: "เป็นเลขดีมาก มีความสามารถรอบด้าน..." },};

function getDayOfWeek(date) {
    const dayIndex = date.getDay(); 
    const hour = date.getHours();
    if (dayIndex === 3 && hour >= 18) return 7;
    return dayIndex; 
}
function analyzeTaksā(birthDate, name, surname) {
    const fullName = (name + surname).replace(/\s+/g, '');
    const birthDayIndex = getDayOfWeek(birthDate);
    const taksaData = TAKSA_RULES[birthDayIndex];
    let kalaCharacters = [];
    let characterBreakdown = {};
    if (!taksaData) return { error: 'ไม่สามารถระบุหลักทักษาได้', day: 'ไม่ทราบ' };
    const kalaSet = taksaData.kala;
    for (const char of fullName) {
        let category = 'ไม่จัดประเภท';
        let isKala = false;
        if (kalaSet.includes(char)) { kalaCharacters.push(char); category = 'กาลกิณี'; isKala = true; } 
        if (!isKala) {
            for(let i=0; i<taksaData.rules.length; i++) {
                if (taksaData.rules[i].includes(char)) { category = TAKSA_NAMES[i]; break; }
            }
            if (category === 'ไม่จัดประเภท') category = 'สระ/วรรณยุกต์';
        }
        if (!characterBreakdown[category]) characterBreakdown[category] = [];
        characterBreakdown[category].push(char);
    }
    return { day: taksaData.day, isKala: kalaCharacters.length > 0, kalaCharacters, breakdown: characterBreakdown };
}
function getNumerologySum(text) {
    if (!text) return 0;
    let sum = 0;
    const cleanText = text.trim();
    for (let i = 0; i < cleanText.length; i++) {
        const char = cleanText[i];
        if (THAI_NUMEROLOGY_VALUES.hasOwnProperty(char)) {
            sum += THAI_NUMEROLOGY_VALUES[char];
        }
    }
    return sum;
}
window.calculateNumerology = function() {
    const name = document.getElementById('name-input').value;
    const surname = document.getElementById('surname-input').value;
    const dateValue = document.getElementById('birthdate-input').value;
    const resultDiv = document.getElementById('numerology-result');
    if (!name && !surname) { resultDiv.innerHTML = '<p style="color:red;">⚠️ กรุณาป้อนชื่อและ/หรือนามสกุล (ภาษาไทย)</p>'; return; }
    if (!dateValue) { resultDiv.innerHTML = '<p style="color:red;">⚠️ กรุณาป้อนวันเกิดของคุณในส่วนด้านบนก่อนทำนายหลักทักษา</p>'; return; }
    const birthDate = parseDate(dateValue);
    if (!birthDate) { resultDiv.innerHTML = '<p style="color:red;">⚠️ รูปแบบวันที่ไม่ถูกต้อง กรุณาใช้ DD/MM/YYYY (เช่น 13/02/2552)</p>'; return; }

    const nameSum = getNumerologySum(name);
    const surnameSum = getNumerologySum(surname);
    const totalSum = nameSum + surnameSum;
    const meaning = NUMEROLOGY_MEANINGS[totalSum] || { title: `เลข ${totalSum}: คำทำนายโดยรวม`, detail: `ผลรวมเลขศาสตร์ ${totalSum} เป็นการบ่งชี้ถึงแนวโน้มชีวิต...` };
    let singleSum = totalSum;
    if (singleSum > 9) singleSum = (totalSum - 1) % 9 + 1; 
    const taksaResult = analyzeTaksā(birthDate, name, surname);
    
    let taksaHtml = taksaResult.isKala 
        ? `<p style="color:#e74c3c; font-weight:bold;">❌ คำเตือน: ชื่อนี้มีอักขระกาลกิณี (${taksaResult.kalaCharacters.join(', ')})</p><p style="font-size: 0.9em;">(อักขระที่ห้ามใช้ตามหลักทักษาสำหรับคนเกิด${taksaResult.day})</p>`
        : `<p style="color:#28a745; font-weight:bold;">✅ ชื่อนี้ไม่มีอักขระกาลกิณี</p>`;

    let breakdownHtml = `<h4>การวิเคราะห์อักษร (ตามหลักทักษา):</h4><ul style="list-style-type: none; padding-left: 0;">`;
    const displayOrder = TAKSA_NAMES.slice(0, 7).concat(['กาลกิณี', 'สระ/วรรณยุกต์', 'ไม่จัดประเภท']);
    displayOrder.forEach(category => {
        if (taksaResult.breakdown[category]) {
            const chars = taksaResult.breakdown[category].join(', ');
            let color = category === 'กาลกิณี' ? '#e74c3c' : (category === TAKSA_NAMES[3] ? '#28a745' : '#34495e'); 
            breakdownHtml += `<li><span style="color:${color}; font-weight:bold;">${category}:</span> ${chars}</li>`;
        }
    });
    breakdownHtml += `</ul>`;

    resultDiv.innerHTML = `
        <h3>📜 ผลการทำนายชื่อ-นามสกุล (แบบสมบูรณ์)</h3>
        <div class="result-box numerology-meaning" style="border-left-color: ${taksaResult.isKala ? '#e74c3c' : '#28a745'};">
            <h4>🌟 โหราศาสตร์ (หลักทักษา) - สำหรับคนเกิด${taksaResult.day}:</h4>
            ${taksaHtml}
        </div>
        <div class="result-box numerology-result-total">
            <h4>✨ เลขศาสตร์ (ผลรวมชื่อ+นามสกุล): <span style="font-size: 1.5em; color: #e74c3c;">${totalSum}</span></h4>
            <p><strong>ผลรวมเลขเดี่ยว:</strong> ${singleSum} (ใช้ทำนายแนวโน้มชีวิต)</p>
            <p><strong>คำทำนาย:</strong> ${meaning.title}</p>
            <p style="font-size: 0.9em;">${meaning.detail}</p>
        </div>
        <div class="result-box numerology-breakdown">${breakdownHtml}</div>
    `;
};


// ==============================================
// 🆕 ฟังก์ชันคำนวณอายุ & ราศี
// ==============================================

function calculateDetailedAge(birthDate) {
    const now = new Date();
    const diffMs = now.getTime() - birthDate.getTime();
    if (diffMs < 0) return "ยังไม่เกิด";
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return { years, months, days, hours, minutes, totalDays };
}

function getThaiZodiacSign(birthDate) {
    const month = birthDate.getMonth() + 1; 
    const day = birthDate.getDate();
    const dates = [
        { name: "เมษ (Aries)", start: [4, 13] }, { name: "พฤษภ (Taurus)", start: [5, 14] }, { name: "เมถุน (Gemini)", start: [6, 14] },
        { name: "กรกฎ (Cancer)", start: [7, 15] }, { name: "สิงห์ (Leo)", start: [8, 15] }, { name: "กันย์ (Virgo)", start: [9, 15] },
        { name: "ตุลย์ (Libra)", start: [10, 15] }, { name: "พิจิก (Scorpio)", start: [11, 14] }, { name: "ธนู (Sagittarius)", start: [12, 15] },
        { name: "มังกร (Capricorn)", start: [1, 15] }, { name: "กุมภ์ (Aquarius)", start: [2, 13] }, { name: "มีน (Pisces)", start: [3, 14] },
    ];
    let zodiac = "ไม่ทราบ";
    for (let i = 0; i < dates.length; i++) {
        const nextIndex = (i + 1) % dates.length;
        const current = dates[i];
        const next = dates[nextIndex];
        if (month === current.start[0] && day >= current.start[1]) { zodiac = current.name; break; }
        if (month === next.start[0] && day < next.start[1]) { zodiac = current.name; break; }
        if (current.start[0] < next.start[0] && month > current.start[0] && month < next.start[0]) { zodiac = current.name; break; }
        if (current.start[0] === 12 && next.start[0] === 1 && (month === 12 && day >= current.start[1] || month === 1 && day < next.start[1])) { zodiac = current.name; break; }
    }
    return zodiac; 
}

function getWesternZodiacSign(birthDate) {
    const month = birthDate.getMonth(); 
    const day = birthDate.getDate();
    if ((month === 11 && day >= 22) || (month === 0 && day < 20)) return "มังกร (Capricorn)";
    else if ((month === 0 && day >= 20) || (month === 1 && day < 19)) return "กุมภ์ (Aquarius)";
    else if ((month === 1 && day >= 19) || (month === 2 && day < 21)) return "มีน (Pisces)";
    else if ((month === 2 && day >= 21) || (month === 3 && day < 20)) return "เมษ (Aries)";
    else if ((month === 3 && day >= 20) || (month === 4 && day < 21)) return "พฤษภ (Taurus)";
    else if ((month === 4 && day >= 21) || (month === 5 && day < 21)) return "เมถุน (Gemini)";
    else if ((month === 5 && day >= 21) || (month === 6 && day < 23)) return "กรกฎ (Cancer)";
    else if ((month === 6 && day >= 23) || (month === 7 && day < 23)) return "สิงห์ (Leo)";
    else if ((month === 7 && day >= 23) || (month === 8 && day < 23)) return "กันย์ (Virgo)";
    else if ((month === 8 && day >= 23) || (month === 9 && day < 23)) return "ตุลย์ (Libra)";
    else if ((month === 9 && day >= 23) || (month === 10 && day < 23)) return "พิจิก (Scorpio)";
    else if ((month === 10 && day >= 23) || (month === 11 && day < 22)) return "ธนู (Sagittarius)";
    return 'ไม่ทราบ';
}

function getLunarZodiac(birthDate, system = 'thai') {
    const birthYearCE = birthDate.getFullYear();
    const month = birthDate.getMonth(); 
    const day = birthDate.getDate();
    let yearToCalculate = birthYearCE;
    if (system === 'thai' && (month < 3 || (month === 3 && day < 13))) { 
        yearToCalculate--;
    } 
    const index = (yearToCalculate + 8) % 12; 
    return CHINESE_ZODIACS[index];
}

window.calculatePersonalInfo = function() {
    const inputElement = document.getElementById('birthdate-input');
    const resultDiv = document.getElementById('personal-result');
    if (!inputElement.value) { resultDiv.innerHTML = '<p style="color:red;">⚠️ กรุณาป้อนวันเดือนปีเกิด</p>'; return; }
    const birthDate = parseDate(inputElement.value); 
    if (!birthDate) { resultDiv.innerHTML = '<p style="color:red;">⚠️ รูปแบบวันที่ไม่ถูกต้อง กรุณาใช้ DD/MM/YYYY (เช่น 13/02/2552)</p>'; return; }

    const ageData = calculateDetailedAge(birthDate);
    const westernZodiac = getWesternZodiacSign(birthDate); 
    const thaiZodiac = getThaiZodiacSign(birthDate); 
    const lunarZodiacThai = getLunarZodiac(birthDate, 'thai'); 
    const lunarZodiacJapan = getLunarZodiac(birthDate, 'japan');
    const birthYearCE = birthDate.getFullYear();
    const birthYearBE = birthYearCE + 543;
    const birthDayText = birthDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

    resultDiv.innerHTML = `
        <h3>✅ ข้อมูลที่คำนวณได้:</h3>
        <div class="result-box age-details">
            <p><strong>วันเกิดที่ป้อน:</strong> ${birthDayText} พ.ศ. ${birthYearBE} (ค.ศ. ${birthYearCE})</p>
            <h4>⏱️ อายุปัจจุบัน (ละเอียด):</h4>
            <p style="font-size: 1.1em; font-weight: bold; color: #e74c3c;">
                ${ageData.years} ปี ${ageData.months} เดือน ${ageData.days} วัน
            </p>
            <p style="font-size: 0.9em;">(ประมาณ ${ageData.totalDays} วัน / ${ageData.hours} ชั่วโมง ${ageData.minutes} นาที)</p>
        </div>
        <div class="result-box">
            <h4>🇹🇭 ราศีไทย (ตามหลักโหราศาสตร์):</h4>
            <p><strong>ราศีตามเดือนเกิด:</strong> <span style="font-weight: bold;">${thaiZodiac}</span></p>
            <p style="font-size: 0.8em; color: #7f8c8d;">(ราศีตามการโคจรของดวงอาทิตย์)</p>
        </div>
        <div class="result-box">
            <h4>🌟 ราศีตะวันตก (สากล):</h4>
            <p><strong>ราศีตามเดือนเกิด:</strong> ${westernZodiac}</p>
        </div>
        <div class="result-box">
            <h4>🧧 ปีนักษัตร (ราศีตะวันออก):</h4>
            <p><strong>🇹🇭 ระบบไทย:</strong> ${lunarZodiacThai} (นับเปลี่ยนปีหลังสงกรานต์)</p>
            <p><strong>🇯🇵 ระบบสากล/ญี่ปุ่น:</strong> ${lunarZodiacJapan} (นับเปลี่ยนปี 1 ม.ค.)</p>
        </div>
    `;
};


// ==============================================
// ฟังก์ชันระบบจับเวลา (สำหรับ timer.html)
// ==============================================

let timerIntervalId;
let isTimerRunning = false;
let timerTotalSeconds = 0;
let alarmSound; 

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function resetTimerDisplay() {
    const display = document.getElementById('timer-display');
    const minutes = document.getElementById('timer-minutes') ? document.getElementById('timer-minutes').value : 5;
    const seconds = document.getElementById('timer-seconds') ? document.getElementById('timer-seconds').value : 0;
    const initialTime = parseInt(minutes) * 60 + parseInt(seconds);
    if (display) display.textContent = formatTime(initialTime);
}

function initTimer() {
    alarmSound = document.getElementById('alarm-sound');
    resetTimerDisplay();
}

window.startTimer = function() {
    if (isTimerRunning) return;
    const inputMinutes = parseInt(document.getElementById('timer-minutes').value) || 0;
    const inputSeconds = parseInt(document.getElementById('timer-seconds').value) || 0;
    if (timerTotalSeconds <= 0) { timerTotalSeconds = inputMinutes * 60 + inputSeconds; }
    if (timerTotalSeconds <= 0) { alert("กรุณาตั้งเวลาอย่างน้อย 1 วินาที!"); return; }

    document.getElementById('timer-input-container').style.display = 'none';
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('pause-button').style.display = 'inline-block';

    isTimerRunning = true;
    
    timerIntervalId = setInterval(() => {
        timerTotalSeconds--;
        document.getElementById('timer-display').textContent = formatTime(timerTotalSeconds);

        if (timerTotalSeconds <= 0) {
            clearInterval(timerIntervalId);
            isTimerRunning = false;
            if(alarmSound) { alarmSound.play().catch(e => console.error("Error playing sound.")); }
            document.getElementById('timer-display').textContent = "🚨 หมดเวลา! 🚨";
            document.getElementById('start-button').textContent = '▶️ เริ่มจับเวลาใหม่';
            document.getElementById('start-button').style.display = 'inline-block';
            document.getElementById('pause-button').style.display = 'none';
            document.getElementById('timer-input-container').style.display = 'flex';
        }
    }, 1000);
}

window.pauseTimer = function() {
    if (!isTimerRunning) return;
    clearInterval(timerIntervalId);
    isTimerRunning = false;
    document.getElementById('start-button').textContent = '▶️ ดำเนินการต่อ';
    document.getElementById('start-button').style.display = 'inline-block';
    document.getElementById('pause-button').style.display = 'none';
}

window.resetTimer = function() {
    clearInterval(timerIntervalId);
    isTimerRunning = false;
    timerTotalSeconds = 0; 
    if(alarmSound) { alarmSound.pause(); alarmSound.currentTime = 0; }
    document.getElementById('timer-input-container').style.display = 'flex';
    document.getElementById('start-button').textContent = '▶️ เริ่มจับเวลา';
    document.getElementById('start-button').style.display = 'inline-block';
    document.getElementById('pause-button').style.display = 'none';
    resetTimerDisplay();
}


// ==============================================
// ฟังก์ชันสำหรับนาฬิกาโลก (สำหรับ worldclock.html)
// ==============================================

function displayCurrentZodiacYear() {
    const currentCEYear = new Date().getFullYear(); 
    const currentBEYear = currentCEYear + 543;
    const zodiacs = CHINESE_ZODIACS;
    const zodiacIndex = (currentBEYear + 9) % 12;
    const currentZodiac = zodiacs[zodiacIndex];
    const elem = document.getElementById('current-zodiac');
    if (elem) elem.textContent = `ปีนักษัตรปัจจุบัน: ${currentZodiac}`;
}

function createClockElements() {
    const container = document.getElementById('clock-display-container');
    if (!container) return; 
    container.innerHTML = ''; 
    for (const key in TIMEZONES) {
        const zone = TIMEZONES[key];
        const clockHTML = `
            <div class="clock" id="${key}-clock">
                <h2>${zone.name}</h2>
                <div class="date-display" id="${key}-date">---</div>
                <div class="time" id="${key}-time">--:--:--</div>
                <div class="timezone">เวลามาตรฐาน: ${zone.id.split('/').pop()} (UTC+${zone.offset})</div>
            </div>
        `;
        container.innerHTML += clockHTML;
    }
}

function updateClocks() {
    if (!document.getElementById('clock-display-container')) return; 
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let thaiOffset = 0;
    let japanOffset = 0; 
    for (const key in TIMEZONES) {
        const zone = TIMEZONES[key];
        const date = new Date();
        const timeString = date.toLocaleTimeString('th-TH', { timeZone: zone.id, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const dateString = date.toLocaleDateString('th-TH', { timeZone: zone.id, ...dateOptions });
        const hourNumeric = parseInt(date.toLocaleTimeString('en-US', { timeZone: zone.id, hour: 'numeric', hour12: false }));

        const timeElement = document.getElementById(`${key}-time`);
        const dateElement = document.getElementById(`${key}-date`);
        const clockElement = document.getElementById(`${key}-clock`);

        if (timeElement) timeElement.textContent = timeString;
        if (dateElement) dateElement.textContent = dateString;
        if (clockElement) {
            if (isNight(hourNumeric)) {
                clockElement.classList.add('night-mode');
            } else {
                clockElement.classList.remove('night-mode');
            }
        }
        if (key === 'thai') thaiOffset = zone.offset;
        if (key === 'japan') japanOffset = zone.offset;
    }

    const diffHours = japanOffset - thaiOffset; 
    const diffMinutes = Math.abs(diffHours * 60);
    const diffDisplayElement = document.getElementById('time-difference');
    
    if (diffDisplayElement) {
        if (diffHours > 0) {
            diffDisplayElement.innerHTML = `ญี่ปุ่นเร็วกว่าไทย <span style="color:#e74c3c;">${diffHours} ชั่วโมง</span> (${diffMinutes} นาที)`;
        } else if (diffHours < 0) {
            diffDisplayElement.innerHTML = `ไทยเร็วกว่าญี่ปุ่น <span style="color:#e74c3c;">${Math.abs(diffHours)} ชั่วโมง</span> (${diffMinutes} นาที)`;
        } else {
            diffDisplayElement.innerHTML = `เวลาเท่ากัน`;
        }
    }
}


// ==============================================
// 🧠 ฐานข้อมูลคำถาม & ตัวแปร Quiz Game
// ==============================================

const QUIZ_QUESTIONS = [
    { question: "1. (พีทาโกรัส ม.2) ด้านประกอบมุมฉาก 6 ซม. และ 8 ซม. ความยาวด้านตรงข้ามมุมฉากคือ?", options: ["9 ซม.", "10 ซม.", "12 ซม.", "14 ซม."], answer: "10 ซม.", difficulty: "ยาก" },
    { question: "2. (พีทาโกรัสประยุกต์) บันไดพิงกำแพงสูง 12 ม. ห่างฐาน 5 ม. ความยาวบันไดคือ?", options: ["12.5 ม.", "13 ม.", "13.5 ม.", "17 ม."], answer: "13 ม.", difficulty: "ยาก" },
    { question: "3. (สายส่ง/อิมพีแดนซ์) สายส่ง 50 Ω ส่วนสายอากาศ 50 Ω ค่า VSWR ใกล้เคียงเท่าใด?", options: ["1.0", "1.5", "2", "3"], answer: "1.0", difficulty: "ยาก" },
    { question: "4. (สายส่ง—สัมประสิทธิ์การสะท้อน) สายส่ง 50 Ω สายอากาศ 75 Ω สัมประสิทธิ์การสะท้อน |Γ| ใกล้เคียงข้อใด", options: ["0.2", "0.25", "0.33", "0.5"], answer: "0.2", difficulty: "ยาก" },
    { question: "5. (คำนวณอัตราส่วน) ถ้าแรงดันในสายอากาศ 20 V และกระแส 0.4 A อิมพีแดนซ์เท่าไร?", options: ["20 Ω", "40 Ω", "50 Ω", "80 Ω"], answer: "50 Ω", difficulty: "ยาก" },
    { question: "6. น้ำเดือดที่อุณหภูมิประมาณกี่องศาเซลเซียส (ที่ความดันปกติ)?", options: ["90°C", "100°C", "120°C", "80°C"], answer: "100°C", difficulty: "กลาง" },
    { question: "7. ดาวเคราะห์ดวงใดอยู่ใกล้ดวงอาทิตย์ที่สุด?", options: ["ดาวศุกร์", "ดาวพุธ", "โลก", "ดาวอังคาร"], answer: "ดาวพุธ", difficulty: "กลาง" },
    { question: "8. สารใดต่อไปนี้เป็นโลหะ?", options: ["ซัลเฟอร์", "เหล็ก", "ไฮโดรเจน", "ออกซิเจน"], answer: "เหล็ก", difficulty: "กลาง" },
    { question: "9. พลังงานไฟฟ้าในบ้านเราใช้หน่วยอะไรในการคิดค่าไฟ?", options: ["วัตต์", "โวลต์", "กิโลวัตต์ชั่วโมง", "แอมแปร์"], answer: "กิโลวัตต์ชั่วโมง", difficulty: "กลาง" },
    { question: "10. เลือดส่วนใดที่ทำหน้าที่ลำเลียงออกซิเจน?", options: ["เม็ดเลือดขาว", "เม็ดเลือดแดง", "เกล็ดเลือด", "พลาสมา"], answer: "เม็ดเลือดแดง", difficulty: "กลาง" },
    { question: "11. ประเทศที่มีประชากรมากที่สุดในโลกคือประเทศอะไร? (อ้างอิงข้อมูลล่าสุด)", options: ["จีน", "อินเดีย", "สหรัฐอเมริกา", "อินโดนีเซีย"], answer: "อินเดีย", difficulty: "กลาง" },
    { question: "12. เมืองใดเป็นเมืองหลวงของญี่ปุ่น?", options: ["โอซาก้า", "โตเกียว", "ฮอกไกโด", "เกียวโต"], answer: "โตเกียว", difficulty: "กลาง" },
    { question: "13. สัตว์ประจำชาติของออสเตรเลียคือข้อใด?", options: ["โคอาล่า", "จิงโจ้", "นกอีมู", "วอมแบต"], answer: "จิงโจ้", difficulty: "กลาง" },
    { question: "14. ทวีปใดมีขนาดพื้นที่ใหญ่ที่สุดในโลก?", options: ["แอฟริกา", "เอเชีย", "อเมริกาเหนือ", "ยุโรป"], answer: "เอเชีย", difficulty: "กลาง" },
    { question: "15. ทะเลทรายซาฮาราอยู่ในทวีปใด?", options: ["เอเชีย", "แอฟริกา", "อเมริกาใต้", "ออสเตรเลีย"], answer: "แอฟริกา", difficulty: "กลาง" },
    { question: "16. ผลลัพธ์ของ 8,400 – 2,750 คือ?", options: ["5,550", "5,650", "5,700", "6,050"], answer: "5,650", difficulty: "ง่าย" },
    { question: "17. ผลลัพธ์ของ 125 × 24 คือ?", options: ["2,500", "2,800", "3,000", "3,250"], answer: "3,000", difficulty: "ง่าย" },
    { question: "18. ผลลัพธ์ของ 4,320 ÷ 12 คือ?", options: ["320", "340", "360", "380"], answer: "360", difficulty: "ง่าย" },
    { question: "19. (พีทาโกรัสย้อนกลับ) ด้านตรงข้ามมุมฉาก 25, ด้านหนึ่ง 7 อีกด้านยาวเท่าไร?", options: ["18", "20", "21", "24"], answer: "24", difficulty: "ง่าย" },
    { question: "20. ถ้าใช้สายส่ง 75 Ω ต่อกับสายอากาศ 50 Ω ควรเกิดอะไรขึ้น?", options: ["สอดคล้องดี", "ไม่แมทช์ มีการสะท้อน", "กำลังเพิ่มขึ้น", "รับได้ไกลขึ้น"], answer: "ไม่แมทช์ มีการสะท้อน", difficulty: "ง่าย" },
    { question: "21. แม่น้ำไนล์อยู่ในทวีปอะไร?", options: ["แอฟริกา", "เอเชีย", "ยุโรป", "อเมริกา"], answer: "แอฟริกา", difficulty: "ง่าย" },
    { question: "22. ประเทศที่มีรูปทรงคล้ายรองเท้าบูทคือประเทศใด?", options: ["สเปน", "อิตาลี", "กรีซ", "โปรตุเกส"], answer: "อิตาลี", difficulty: "ง่าย" },
    { question: "23. ภูเขาที่สูงที่สุดในโลกคือ?", options: ["เอเวอเรสต์", "คิลิมันจาโร", "ฟูจิ", "K2"], answer: "เอเวอเรสต์", difficulty: "ง่าย" },
    { question: "24. ประเทศใดมีพื้นที่ใหญ่ที่สุดในโลก?", options: ["แคนาดา", "รัสเซีย", "จีน", "สหรัฐอเมริกา"], answer: "รัสเซีย", difficulty: "ง่าย" },
    { question: "25. ปราสาทนอยชวานสไตน์ (ต้นแบบดิสนีย์) อยู่ประเทศอะไร?", options: ["ฝรั่งเศส", "เยอรมนี", "ออสเตรีย", "สวิตเซอร์แลนด์"], answer: "เยอรมนี", difficulty: "ง่าย" },
    { question: "26. แหล่งพลังงานหลักของโลกคืออะไร?", options: ["ดวงจันทร์", "ลม", "ดวงอาทิตย์", "ความร้อนใต้พิภพ"], answer: "ดวงอาทิตย์", difficulty: "ง่าย" },
    { question: "27. ข้อใดคือสถานะของสสาร?", options: ["ของแข็ง ของเหลว ก๊าซ", "น้ำ ไฟ ดิน", "แข็ง–เย็น–ร้อน", "ร้อน เย็น อุ่น"], answer: "ของแข็ง ของเหลว ก๊าซ", difficulty: "ง่าย" },
    { question: "28. สิ่งมีชีวิตใดต่อไปนี้จัดเป็นสัตว์เลี้ยงลูกด้วยนม?", options: ["จระเข้", "ปลาวาฬ", "เต่า", "งู"], answer: "ปลาวาฬ", difficulty: "ง่าย" },
    { question: "29. พืชหายใจเข้าอะไรตอนกลางวัน?", options: ["ออกซิเจน", "คาร์บอนไดออกไซด์", "ไนโตรเจน", "ฮีเลียม"], answer: "ออกซิเจน", difficulty: "ง่าย" },
    { question: "30. เสียงเดินทางได้ดีที่สุดในสื่อใด?", options: ["อากาศ", "น้ำ", "ของแข็ง", "สุญญากาศ"], answer: "ของแข็ง", difficulty: "ง่าย" },
];

const DIFFICULTY_TIME = {
    "ง่าย": 30,   
    "กลาง": 45,  
    "ยาก": 60    
};

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLimit = 0;
let timerInterval;
let totalTimeTaken = 0; 
const LEADERBOARD_KEY = 'quiz_leaderboard'; 


// ... (ฟังก์ชัน shuffleArray, startQuiz, displayQuestion, startTimer, checkAnswer เหมือนเดิม)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startQuiz() {
    shuffleArray(QUIZ_QUESTIONS);
    quizQuestions = QUIZ_QUESTIONS.slice(0, 10);
    
    currentQuestionIndex = 0;
    score = 0;
    totalTimeTaken = 0; 
    
    document.getElementById('quiz-start-area').style.display = 'none';
    document.getElementById('quiz-game-area').style.display = 'block';
    document.getElementById('quiz-result-area').style.display = 'none';
    document.getElementById('quiz-leaderboard-area').style.display = 'none'; 

    displayQuestion();
}

function displayQuestion() {
    clearInterval(timerInterval); 
    
    if (currentQuestionIndex >= quizQuestions.length) {
        showQuizResult();
        return;
    }

    const qData = quizQuestions[currentQuestionIndex];
    const questionElement = document.getElementById('quiz-question');
    const optionsElement = document.getElementById('quiz-options');
    const timerElement = document.getElementById('quiz-timer');

    questionElement.textContent = `${currentQuestionIndex + 1}. ${qData.question}`;
    optionsElement.innerHTML = '';
    
    timeLimit = DIFFICULTY_TIME[qData.difficulty] || 45; 
    timerElement.textContent = `⏳ เวลา: ${timeLimit} วินาที (${qData.difficulty})`;

    const options = [...qData.options];
    shuffleArray(options); 

    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('quiz-option-btn');
        button.onclick = () => checkAnswer(button, option, qData.answer);
        optionsElement.appendChild(button);
    });

    startTimerQuiz();
}

function startTimerQuiz() {
    const timerElement = document.getElementById('quiz-timer');
    
    timerInterval = setInterval(() => {
        timeLimit--;
        timerElement.textContent = `⏳ เวลา: ${timeLimit} วินาที (${quizQuestions[currentQuestionIndex].difficulty})`;

        if (timeLimit <= 10) {
            timerElement.style.color = '#e74c3c'; 
        } else {
             timerElement.style.color = '#3498db';
        }

        if (timeLimit <= 0) {
            clearInterval(timerInterval);
            checkAnswer(null, null, quizQuestions[currentQuestionIndex].answer); 
        }
    }, 1000);
}


function checkAnswer(selectedButton, selectedOption, correctAnswer) {
    clearInterval(timerInterval); 

    const timeSpentOnThisQuestion = (DIFFICULTY_TIME[quizQuestions[currentQuestionIndex].difficulty] || 45) - timeLimit;
    totalTimeTaken += timeSpentOnThisQuestion; 

    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.querySelectorAll('button').forEach(btn => {
        btn.disabled = true; 
        if (btn.textContent === correctAnswer) {
            btn.style.backgroundColor = '#28a745'; 
        }
    });

    if (selectedOption === correctAnswer) {
        score++;
        if (selectedButton) selectedButton.style.backgroundColor = '#28a745'; 
    } else {
        if (selectedButton) selectedButton.style.backgroundColor = '#e74c3c'; 
    }
    
    document.getElementById('quiz-score').textContent = `คะแนน: ${score} / ${currentQuestionIndex + 1}`;

    setTimeout(() => {
        currentQuestionIndex++;
        document.getElementById('quiz-timer').style.color = '#3498db'; 
        displayQuestion();
    }, 2000); 
}

// ==============================================
// 🏆 ฟังก์ชัน Leaderboard
// ==============================================

function loadLeaderboard() {
    try {
        const leaderboardJson = localStorage.getItem(LEADERBOARD_KEY);
        return leaderboardJson ? JSON.parse(leaderboardJson) : [];
    } catch (e) {
        console.error("Error loading leaderboard from localStorage", e);
        return [];
    }
}

function saveToLeaderboard(score, timeTaken, playerName) {
    let leaderboard = loadLeaderboard();
    
    const newEntry = {
        name: playerName || 'ผู้กล้าไร้นาม',
        score: score,
        timeTaken: timeTaken, 
        date: new Date().toLocaleDateString('th-TH'),
    };

    leaderboard.push(newEntry);
    
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score; 
        }
        return a.timeTaken - b.timeTaken; 
    });
    
    leaderboard = leaderboard.slice(0, 10);
    
    try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    } catch (e) {
        console.error("Error saving leaderboard to localStorage", e);
    }
    
    return leaderboard;
}

function displayLeaderboard(leaderboard) {
    const tableBody = document.getElementById('leaderboard-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    if (leaderboard.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">ยังไม่มีผู้เล่นทำคะแนนสูงสุด</td></tr>';
        return;
    }

    leaderboard.forEach((entry, index) => {
        const timeFormat = `${Math.floor(entry.timeTaken / 60)}:${String(entry.timeTaken % 60).padStart(2, '0')}`;
        const row = tableBody.insertRow();
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td style="font-weight: bold;">${entry.name}</td>
            <td>${entry.score} / 10</td>
            <td>${timeFormat}</td>
            <td>${entry.date}</td>
        `;
    });
    
    document.getElementById('quiz-leaderboard-area').style.display = 'block';
}


function showQuizResult() {
    const resultElement = document.getElementById('quiz-final-result');
    const totalQuestions = quizQuestions.length;
    let message = '';
    
    if (score >= totalQuestions * 0.8) {
        message = '🏆 ยอดเยี่ยม! คุณคืออัจฉริยะ!';
    } else if (score >= totalQuestions * 0.5) {
        message = '👍 ดีมาก! ความรู้รอบตัวของคุณแน่นมาก';
    } else {
        message = '🤔 ลองใหม่นะครับ! เพิ่มเติมความรู้รอบตัวอีกนิด';
    }
    
    let playerName = prompt(`🎉 ยินดีด้วย! คุณทำได้ ${score} คะแนน ใช้เวลา ${totalTimeTaken} วินาที\nกรุณาใส่ชื่อของคุณเพื่อบันทึกสถิติ:`, "ผู้เล่น");
    if (!playerName || playerName.trim() === '') {
        playerName = 'ผู้กล้าไร้นาม';
    }
    
    const updatedLeaderboard = saveToLeaderboard(score, totalTimeTaken, playerName.substring(0, 20)); 

    resultElement.innerHTML = `
        <h3 style="color:#2980b9;">🎉 จบเกมตอบคำถาม 🎉</h3>
        <p>คุณทำได้ **${score}** คะแนน จากทั้งหมด **${totalQuestions}** ข้อ</p>
        <p>ใช้เวลาตอบทั้งหมด: <strong>${Math.floor(totalTimeTaken / 60)} นาที ${String(totalTimeTaken % 60).padStart(2, '0')} วินาที</strong></p>
        <p style="font-size: 1.2em; font-weight: bold;">${message}</p>
    `;
    
    document.getElementById('quiz-game-area').style.display = 'none';
    document.getElementById('quiz-result-area').style.display = 'block';
    document.getElementById('quiz-start-area').style.display = 'block';
    document.getElementById('quiz-start-btn').textContent = 'เริ่มเล่นใหม่';
    
    displayLeaderboard(updatedLeaderboard);
}

// -----------------------------------------------------
// --- การเริ่มต้น (Entry Point) ---
// -----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    
    if (document.getElementById('clock-display-container')) {
        createClockElements();
        displayCurrentZodiacYear();
        updateClocks();
        setInterval(updateClocks, 1000); 
    }

    if (document.getElementById('timer-display')) {
        initTimer(); 
    }

    const startBtn = document.getElementById('quiz-start-btn');
    if (startBtn) {
        startBtn.onclick = startQuiz;
        const initialLeaderboard = loadLeaderboard();
        displayLeaderboard(initialLeaderboard);
    }
});
