// ข้อมูล Time Zones ที่ต้องการแสดงผล
const TIMEZONES = {
    thai: { id: 'Asia/Bangkok', name: '🇹🇭 กรุงเทพฯ, ประเทศไทย', offset: 7, city: 'ไทย' },
    japan: { id: 'Asia/Tokyo', name: '🇯🇵 โตเกียว, ญี่ปุ่น', offset: 9, city: 'ญี่ปุ่น' },
    sydney: { id: 'Australia/Sydney', name: '🇦🇺 ซิดนีย์, ออสเตรเลีย', offset: 11, city: 'ซิดนีย์' } 
};

// ฐานข้อมูลราศีตะวันตก (Western Zodiac, ใช้ปฏิทินตะวันตก)
const ZODIACS = [
    { name: "มังกร (Capricorn)", startMonth: 0, startDate: 20 },
    { name: "กุมภ์ (Aquarius)", startMonth: 1, startDate: 19 },
    { name: "มีน (Pisces)", startMonth: 2, startDate: 21 },
    { name: "เมษ (Aries)", startMonth: 3, startDate: 20 },
    { name: "พฤษภ (Taurus)", startMonth: 4, startDate: 21 },
    { name: "เมถุน (Gemini)", startMonth: 5, startDate: 21 },
    { name: "กรกฎ (Cancer)", startMonth: 6, startDate: 23 },
    { name: "สิงห์ (Leo)", startMonth: 7, startDate: 23 },
    { name: "กันย์ (Virgo)", startMonth: 8, startDate: 23 },
    { name: "ตุลย์ (Libra)", startMonth: 9, startDate: 23 },
    { name: "พิจิก (Scorpio)", startMonth: 10, startDate: 23 },
    { name: "ธนู (Sagittarius)", startMonth: 11, startDate: 22 }
];

// ฐานข้อมูลปีนักษัตร (Eastern Zodiac, ใช้ปี ค.ศ.)
const CHINESE_ZODIACS = [
    "ชวด (หนู)", "ฉลู (วัว)", "ขาล (เสือ)", "เถาะ (กระต่าย)", 
    "มะโรง (งูใหญ่/มังกร)", "มะเส็ง (งูเล็ก)", "มะเมีย (ม้า)", "มะแม (แพะ)", 
    "วอก (ลิง)", "ระกา (ไก่)", "จอ (สุนัข)", "กุน (หมู)"
];


// ฟังก์ชันช่วยในการตรวจสอบว่าเป็นเวลากลางคืนหรือไม่ (19:00 - 05:59 น.)
const isNight = (hour) => hour >= 19 || hour < 6;

// ==============================================
// ฟังก์ชันคำนวณข้อมูลส่วนตัว (CALCULATOR FUNCTIONS)
// ==============================================

/**
 * คำนวณราศีตะวันตกจากวันเกิด
 * @param {Date} birthDate - วันเกิด
 * @returns {string} ชื่อราศี
 */
function getZodiacSign(birthDate) {
    const month = birthDate.getMonth();
    const day = birthDate.getDate();

    // วนลูปเพื่อหาราศี
    for (let i = 0; i < ZODIACS.length; i++) {
        const zodiac = ZODIACS[i];
        const nextZodiac = ZODIACS[(i + 1) % ZODIACS.length]; 

        if (
            (month === zodiac.startMonth && day >= zodiac.startDate) ||
            (month === nextZodiac.startMonth && day < nextZodiac.startDate)
        ) {
            return zodiac.name;
        }
    }
    return 'ไม่ทราบ';
}

/**
 * คำนวณอายุจากวันเกิด
 * @param {Date} birthDate - วันเกิด
 * @returns {number} อายุ
 */
function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

/**
 * คำนวณปีนักษัตร (ราศีตะวันออก)
 * @param {Date} birthDate - วันเกิด
 * @param {'thai' | 'japan'} system - ระบบการนับ (ไทย: เปลี่ยนปีหลังสงกรานต์, ญี่ปุ่น: เปลี่ยนปี 1 ม.ค.)
 * @returns {string} ชื่อปีนักษัตร
 */
function getLunarZodiac(birthDate, system = 'thai') {
    const birthYearCE = birthDate.getFullYear();
    const month = birthDate.getMonth(); // Month index 0-11
    const day = birthDate.getDate();
    
    let yearToCalculate = birthYearCE;

    if (system === 'thai') {
        // ไทย: เปลี่ยนปีนักษัตรกลางเดือนเมษายน (ใช้ 13 เม.ย. เป็นจุดตัดโดยประมาณ)
        if (month < 3 || (month === 3 && day < 13)) { 
            yearToCalculate--;
        }
    } 
    // สำหรับ 'japan' (และระบบสากลอื่นๆ): เปลี่ยนปีวันที่ 1 ม.ค. ซึ่งตรงกับปี CE โดยตรง

    // สูตรคำนวณ: (ปี ค.ศ. + 8) % 12 (ปี 1900 เป็นปีชวด)
    const index = (yearToCalculate + 8) % 12; 
    return CHINESE_ZODIACS[index];
}

// ฟังก์ชันหลักที่เรียกเมื่อกดปุ่ม "คำนวณ"
window.calculatePersonalInfo = function() {
    const inputElement = document.getElementById('birthdate-input');
    const resultDiv = document.getElementById('personal-result');
    
    if (!inputElement.value) {
        resultDiv.innerHTML = '<p style="color:red;">⚠️ กรุณาป้อนวันเดือนปีเกิด</p>';
        return;
    }

    // 1. แยกส่วนประกอบวันที่
    const dateValue = inputElement.value;
    const parts = dateValue.split('-'); 
    let year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; 
    const day = parseInt(parts[2]);

    // 2. ตรรกะการแปลงปี พ.ศ. / ค.ศ. 
    const currentCEYear = new Date().getFullYear(); 

    if (year > currentCEYear + 10) { 
        year = year - 543; // แปลงเป็น ค.ศ.
    }
    
    // 3. สร้าง Date Object
    const birthDate = new Date(year, month, day);

    if (isNaN(birthDate.getTime()) || birthDate.getFullYear() !== year || birthDate.getMonth() !== month || birthDate.getDate() !== day) {
        resultDiv.innerHTML = '<p style="color:red;">⚠️ รูปแบบวันที่ไม่ถูกต้อง</p>';
        return;
    }

    // 4. คำนวณข้อมูล
    const age = calculateAge(birthDate);
    const westernZodiac = getZodiacSign(birthDate); // ราศีตะวันตก
    
    const lunarZodiacThai = getLunarZodiac(birthDate, 'thai'); // ปีนักษัตร (ไทย)
    const lunarZodiacJapan = getLunarZodiac(birthDate, 'japan'); // ปีนักษัตร (ญี่ปุ่น/สากล)

    // 5. เตรียมการแสดงผล
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
            <h4>🌟 ราศีตะวันตก:</h4>
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
// ฟังก์ชันสำหรับนาฬิกาโลก (WORLD CLOCK FUNCTIONS)
// (ไม่มีการเปลี่ยนแปลงจากโค้ดชุดล่าสุด)
// ==============================================

function displayCurrentZodiacYear() {
    const currentCEYear = new Date().getFullYear(); 
    const currentBEYear = currentCEYear + 543;
    
    const zodiacs = CHINESE_ZODIACS;
    
    // สูตรคำนวณนักษัตรปัจจุบัน: (ปี พ.ศ. + 9) % 12 (นับตามปี พ.ศ. ที่เปลี่ยน 1 ม.ค.)
    const zodiacIndex = (currentBEYear + 9) % 12;

    const currentZodiac = zodiacs[zodiacIndex];
    
    document.getElementById('current-zodiac').textContent = `ปีนักษัตรปัจจุบัน: ${currentZodiac}`;
}

function createClockElements() {
    const container = document.getElementById('clock-display-container');
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
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let thaiOffset = 0;
    let japanOffset = 0; 

    for (const key in TIMEZONES) {
        const zone = TIMEZONES[key];
        const date = new Date();

        // ดึงเวลา
        const timeString = date.toLocaleTimeString('th-TH', { timeZone: zone.id, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        
        // ดึงวันที่
        const dateString = date.toLocaleDateString('th-TH', { timeZone: zone.id, ...dateOptions });

        // ดึงชั่วโมงสำหรับธีมกลางวัน/กลางคืน
        const hourNumeric = parseInt(date.toLocaleTimeString('en-US', { timeZone: zone.id, hour: 'numeric', hour12: false }));

        // อัปเดต HTML
        const timeElement = document.getElementById(`${key}-time`);
        const dateElement = document.getElementById(`${key}-date`);
        const clockElement = document.getElementById(`${key}-clock`);

        if (timeElement) timeElement.textContent = timeString;
        if (dateElement) dateElement.textContent = dateString;
        
        // จัดการธีมกลางวัน/กลางคืน
        if (clockElement) {
            if (isNight(hourNumeric)) {
                clockElement.classList.add('night-mode');
            } else {
                clockElement.classList.remove('night-mode');
            }
        }

        // เก็บ Offset
        if (key === 'thai') thaiOffset = zone.offset;
        if (key === 'japan') japanOffset = zone.offset;
    }

    // --- คำนวณส่วนต่างเวลา ไทย vs ญี่ปุ่น ---
    const diffHours = japanOffset - thaiOffset; 
    const diffMinutes = Math.abs(diffHours * 60);

    const diffDisplayElement = document.getElementById('time-difference');
    
    if (diffHours > 0) {
        diffDisplayElement.innerHTML = `ญี่ปุ่นเร็วกว่าไทย <span style="color:#e74c3c;">${diffHours} ชั่วโมง</span> (${diffMinutes} นาที)`;
    } else if (diffHours < 0) {
         diffDisplayElement.innerHTML = `ไทยเร็วกว่าญี่ปุ่น <span style="color:#e74c3c;">${Math.abs(diffHours)} ชั่วโมง</span> (${diffMinutes} นาที)`;
    } else {
         diffDisplayElement.innerHTML = `เวลาเท่ากัน`;
    }
}

// -----------------------------------------------------
// --- การเริ่มต้น (Entry Point) ---
// -----------------------------------------------------

// 1. สร้างโครงสร้างนาฬิกาทั้งหมด
createClockElements();

// 2. แสดงผลปีนักษัตรปัจจุบัน
displayCurrentZodiacYear();

// 3. อัปเดตเวลาทันที
updateClocks();

// 4. ตั้งเวลาให้ทำงานซ้ำทุก 1 วินาที
setInterval(updateClocks, 1000);
