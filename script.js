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
// ฟังก์ชันคำนวณข้อมูลส่วนตัว (สำหรับ index.html)
// ==============================================

function getZodiacSign(birthDate) {
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

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function getLunarZodiac(birthDate, system = 'thai') {
    const birthYearCE = birthDate.getFullYear();
    const month = birthDate.getMonth(); 
    const day = birthDate.getDate();
    
    let yearToCalculate = birthYearCE;

    if (system === 'thai') {
        if (month < 3 || (month === 3 && day < 13)) { 
            yearToCalculate--;
        }
    } 
    
    const index = (yearToCalculate + 8) % 12; 
    return CHINESE_ZODIACS[index];
}

window.calculatePersonalInfo = function() {
    const inputElement = document.getElementById('birthdate-input');
    const resultDiv = document.getElementById('personal-result');
    
    if (!inputElement.value) {
        resultDiv.innerHTML = '<p style="color:red;">⚠️ กรุณาป้อนวันเดือนปีเกิด</p>';
        return;
    }

    const dateValue = inputElement.value;
    const parts = dateValue.split('-'); 
    let year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; 
    const day = parseInt(parts[2]);

    const currentCEYear = new Date().getFullYear(); 

    if (year > currentCEYear + 10) { 
        year = year - 543; 
    }
    
    const birthDate = new Date(year, month, day);

    if (isNaN(birthDate.getTime()) || birthDate.getFullYear() !== year || birthDate.getMonth() !== month || birthDate.getDate() !== day) {
        resultDiv.innerHTML = '<p style="color:red;">⚠️ รูปแบบวันที่ไม่ถูกต้อง</p>';
        return;
    }

    const age = calculateAge(birthDate);
    const westernZodiac = getZodiacSign(birthDate); 
    const lunarZodiacThai = getLunarZodiac(birthDate, 'thai'); 
    const lunarZodiacJapan = getLunarZodiac(birthDate, 'japan');
    const birthYearCE = birthDate.getFullYear();
    const birthYearBE = birthDate.getFullYear() + 543;
    const birthDayText = birthDate.toLocaleDateString('th-TH', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });


    resultDiv.innerHTML = `
        <h3>✅ ข้อมูลที่คำนวณได้:</h3>
        <div class="result-box">
            <p><strong>วันเกิดที่ป้อน:</strong> ${birthDayText} พ.ศ. ${birthYearBE} (ค.ศ. ${birthYearCE})</p>
            <p><strong>อายุปัจจุบัน:</strong> ${age} ปี</p>
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
// 🔮 NEW: ฟังก์ชันทำนายเลขศาสตร์ (สำหรับ index.html)
// ==============================================

// ตารางเลขศาสตร์ (Numerology Table) ตามหลักการมาตรฐานของไทย
const THAI_NUMEROLOGY_VALUES = {
    // กลุ่มค่า 1
    'ก': 1, 'ด': 1, 'ถ': 1, 'ท': 1, 'ภ': 1, 'อ': 1, 'ฤ': 1, 'ะ': 1, 'า': 1, 'ำ': 1, 'ั': 6,
    // กลุ่มค่า 2
    'ข': 2, 'ช': 2, 'บ': 2, 'ป': 2, 'ง': 2, 'เ': 2, 'แ': 2, 'ไ': 2, 'ใ': 2, '่': 2, '้': 2, '๊': 2, '๋': 2,
    // กลุ่มค่า 3
    'จ': 3, 'ร': 3, 'ย': 3, 'ว': 3, 'ี': 3, 'ึ': 3, 'ื': 3, 'โ': 5, 
    // กลุ่มค่า 4
    'ต': 4, 'น': 4, 'ธ': 4, 'ซ': 4, 'ศ': 4, 'ษ': 4, 'ณ': 4, 'ฒ': 4, 'ุ': 4, 'ู': 4, '็': 4, '์': 0, 'ฯ': 0, ' ': 0,
    // กลุ่มค่า 5
    'ฆ': 5, 'ค': 5, 'ฉ': 5, 'ฑ': 5, 'ม': 5, 'ห': 5, 'ฮ': 5, 'สระโอ': 5, 'สระเอา': 5,
    // กลุ่มค่า 6
    'ผ': 6, 'พ': 6, 'ฝ': 6, 'ย': 6, 'ส': 6, 'ั': 6,
    // กลุ่มค่า 7
    'ซ': 7, 'ฐ': 7, 'ฑ': 7, 'ฒ': 7, 'ร': 7, 'ิ': 4, 'สระอิ': 7,
    // กลุ่มค่า 8
    'ซ': 8, 'ศ': 8, 'ส': 8, 'ห': 8,
    // กลุ่มค่า 9
    'ฎ': 9, 'ฐ': 9, 'ธ': 9, 'ป': 9, 'ผ': 9, 'ฝ': 9, 'พ': 9, 'ฟ': 9, 'ภ': 9, 'ร': 9, 'ล': 9, 'ว': 9, 'ศ': 9, 'ส': 9, 'ห': 9, 'อ': 9, 'ฮ': 9, 'สระอี': 9, 'สระอือ': 9, 'สระอึ': 9,
};


// คำทำนายผลรวมเลขศาสตร์ (ตัวอย่างเลข 19 - 30)
const NUMEROLOGY_MEANINGS = {
    19: { title: "เลข 19: ความสำเร็จและโชคดี", detail: "เป็นเลขดีมาก มักนำมาซึ่งความสำเร็จ โชคลาภ และตำแหน่งหน้าที่การงานที่สูงส่ง มักได้รับการช่วยเหลือจากผู้ใหญ่และมีไหวพริบดีเยี่ยม" },
    20: { title: "เลข 20: ความรักและจินตนาการ", detail: "เป็นเลขที่อ่อนโยน มีเสน่ห์ทางคำพูด มักประสบความสำเร็จจากความสามารถเฉพาะตัว มีจินตนาการสูง แต่ขาดความมั่นคงทางอารมณ์" },
    21: { title: "เลข 21: ความก้าวหน้าและความนิยม", detail: "เป็นเลขแห่งมงคล เป็นที่รักของคนทั่วไป มักประสบความสำเร็จในอาชีพที่ต้องใช้การสื่อสาร หรือการพบปะผู้คน มีความเจริญรุ่งเรืองอย่างต่อเนื่อง" },
    22: { title: "เลข 22: ความทุกข์และความล้มเหลว", detail: "เป็นเลขที่ไม่ดี มักประสบปัญหาในชีวิตคู่ การเงินไม่มั่นคง มีอุปสรรคเข้ามาบ่อยครั้ง อาจต้องเผชิญกับความผิดหวังซ้ำ ๆ" },
    23: { title: "เลข 23: เสน่ห์และความสำเร็จจากการงาน", detail: "เป็นเลขดี มีเสน่ห์ต่อเพศตรงข้ามอย่างมาก มีความฉลาดในการดำเนินธุรกิจและการเงิน มักประสบความสำเร็จในตำแหน่งใหญ่" },
    24: { title: "เลข 24: ความอุดมสมบูรณ์และคู่ครองดี", detail: "เป็นเลขดีมาก มักมีชีวิตที่สุขสบาย มีคู่ครองที่ดี มีความมั่งคั่งและสมบูรณ์พูนสุข แต่บางครั้งขาดความกระตือรือร้น" },
    25: { title: "เลข 25: ผู้ตามหาความมั่นคง", detail: "เป็นเลขดี มักมีความมานะพยายามในการสร้างฐานะชีวิต มีความมุ่งมั่นสูง แต่ต้องระวังความเครียดและความกดดันจากความคาดหวังของตัวเอง" },
    26: { title: "เลข 26: ปัญหาความรักและอุปสรรค", detail: "เป็นเลขไม่ดี มักมีปัญหาเกี่ยวกับความรัก ความผันผวนในชีวิตสูง การเงินไม่แน่นอน ต้องพยายามอย่างหนักจึงจะประสบความสำเร็จ" },
    27: { title: "เลข 27: ชื่อเสียงและวาสนา", detail: "เป็นเลขดีมาก มีชื่อเสียงโด่งดัง เป็นที่รู้จักในสังคม มักมีผู้คอยให้การสนับสนุน มียศศักดิ์ และประสบความสำเร็จอย่างรวดเร็ว" },
    28: { title: "เลข 28: ความผันผวนในชีวิต", detail: "เป็นเลขที่อันตราย มีความผันผวนในชีวิตสูงมาก ทั้งประสบความสำเร็จสูงสุดและล้มเหลวต่ำสุดได้ง่าย ต้องระมัดระวังการตัดสินใจอย่างยิ่ง" },
    29: { title: "เลข 29: ความก้าวหน้าอย่างรวดเร็ว", detail: "เป็นเลขดีมาก มีความสามารถรอบด้าน ฉลาดหลักแหลม มักได้รับการสนับสนุนจากผู้ใหญ่ ทำให้ประสบความสำเร็จในหน้าที่การงานอย่างรวดเร็ว" },
    30: { title: "เลข 30: การเปลี่ยนแปลงและโชคชะตา", detail: "เป็นเลขกลางๆ ชีวิตมีการเปลี่ยนแปลงอยู่เสมอ มีความรักในการเดินทางและการผจญภัย มักได้รับโชคลาภที่ไม่คาดคิด แต่ต้องระวังอุบัติเหตุ" },
};

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
    const nameInput = document.getElementById('name-input');
    const surnameInput = document.getElementById('surname-input');
    const resultDiv = document.getElementById('numerology-result');
    
    const name = nameInput.value;
    const surname = surnameInput.value;
    
    if (!name && !surname) {
        resultDiv.innerHTML = '<p style="color:red;">⚠️ กรุณาป้อนชื่อและ/หรือนามสกุล (ภาษาไทย)</p>';
        return;
    }

    const nameSum = getNumerologySum(name);
    const surnameSum = getNumerologySum(surname);
    const totalSum = nameSum + surnameSum;

    const meaning = NUMEROLOGY_MEANINGS[totalSum] || { 
        title: `เลข ${totalSum}: คำทำนายพื้นฐาน`, 
        detail: `ผลรวมเลขศาสตร์ ${totalSum} อยู่นอกเหนือช่วงทำนายตัวอย่าง (19-30) กรุณาค้นหาความหมายเพิ่มเติม` 
    };
    
    let singleSum = totalSum;
    if (singleSum > 9) {
        singleSum = singleSum % 9 || 9; // ลดทอนเป็นเลข 1-9
    }

    resultDiv.innerHTML = `
        <h3>📜 ผลการทำนายชื่อ-นามสกุล</h3>
        <div class="result-box numerology-result">
            <p><strong>ผลรวมชื่อ (${name}):</strong> ${nameSum}</p>
            <p><strong>ผลรวมนามสกุล (${surname}):</strong> ${surnameSum}</p>
        </div>
        
        <div class="result-box numerology-result-total">
            <h4>✨ ผลรวมเลขศาสตร์ทั้งหมด: <span style="font-size: 1.5em; color: #e74c3c;">${totalSum}</span></h4>
            <p><strong>ผลรวมเลขเดี่ยว:</strong> ${singleSum} (ใช้ทำนายแนวโน้มชีวิต)</p>
        </div>

        <div class="result-box numerology-meaning">
            <h4>${meaning.title}</h4>
            <p>${meaning.detail}</p>
        </div>
    `;
};


// ==============================================
// ฟังก์ชันระบบจับเวลา (สำหรับ timer.html)
// ==============================================

let totalSeconds = 0;
let intervalId;
let isRunning = false;
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
    // ต้องตรวจสอบว่ามี element นี้อยู่หรือไม่ก่อน
    alarmSound = document.getElementById('alarm-sound');
    resetTimerDisplay();
}

window.startTimer = function() {
    if (isRunning) return;

    const inputMinutes = parseInt(document.getElementById('timer-minutes').value) || 0;
    const inputSeconds = parseInt(document.getElementById('timer-seconds').value) || 0;
    
    if (totalSeconds <= 0) { 
        totalSeconds = inputMinutes * 60 + inputSeconds;
    }
    
    if (totalSeconds <= 0) {
        alert("กรุณาตั้งเวลาอย่างน้อย 1 วินาที!");
        return;
    }

    document.getElementById('timer-input-container').style.display = 'none';
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('pause-button').style.display = 'inline-block';

    isRunning = true;
    
    intervalId = setInterval(() => {
        totalSeconds--;
        document.getElementById('timer-display').textContent = formatTime(totalSeconds);

        if (totalSeconds <= 0) {
            clearInterval(intervalId);
            isRunning = false;
            
            if(alarmSound) {
                 // ใส่ try-catch เพื่อป้องกัน browser block
                 alarmSound.play().catch(e => console.error("Error playing sound. Browser blocked it or file not found."));
            }
           
            document.getElementById('timer-display').textContent = "🚨 หมดเวลา! 🚨";

            document.getElementById('start-button').textContent = '▶️ เริ่มจับเวลาใหม่';
            document.getElementById('start-button').style.display = 'inline-block';
            document.getElementById('pause-button').style.display = 'none';
            document.getElementById('timer-input-container').style.display = 'flex';
        }
    }, 1000);
}

window.pauseTimer = function() {
    if (!isRunning) return;
    
    clearInterval(intervalId);
    isRunning = false;
    
    document.getElementById('start-button').textContent = '▶️ ดำเนินการต่อ';
    document.getElementById('start-button').style.display = 'inline-block';
    document.getElementById('pause-button').style.display = 'none';
}

window.resetTimer = function() {
    clearInterval(intervalId);
    isRunning = false;
    totalSeconds = 0; 
    
    if(alarmSound) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }
    
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

// -----------------------------------------------------
// --- การเริ่มต้น (Entry Point) ---
// -----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // โค้ดจะรันเฉพาะเมื่อพบ ID ของ Element ที่อยู่ในหน้านั้นๆ
    
    if (document.getElementById('clock-display-container')) {
        // สำหรับ worldclock.html
        createClockElements();
        displayCurrentZodiacYear();
        updateClocks();
        setInterval(updateClocks, 1000); 
    }

    if (document.getElementById('timer-display')) {
        // สำหรับ timer.html
        initTimer(); 
    }
});
