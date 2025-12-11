// ข้อมูล Time Zones
const TIMEZONES = {
    thai: { id: 'Asia/Bangkok', name: '🇹🇭 กรุงเทพฯ, ประเทศไทย', offset: 7, city: 'ไทย' },
    japan: { id: 'Asia/Tokyo', name: '🇯🇵 โตเกียว, ญี่ปุ่น', offset: 9, city: 'ญี่ปุ่น' },
    sydney: { id: 'Australia/Sydney', name: '🇦🇺 ซิดนีย์, ออสเตรเลีย', offset: 11, city: 'ซิดนีย์' } 
};

// ฐานข้อมูลปีนักษัตร (ราศีตะวันออก)
const CHINESE_ZODIACS = [
    "ชวด (หนู)", "ฉลู (วัว)", "ขาล (เสือ)", "เถาะ (กระต่าย)", 
    "มะโรง (งูใหญ่/มังกร)", "มะเส็ง (งูเล็ก)", "มะเมีย (ม้า)", "มะแม (แพะ)", 
    "วอก (ลิง)", "ระกา (ไก่)", "จอ (สุนัข)", "กุน (หมู)"
];

const isNight = (hour) => hour >= 19 || hour < 6;

// ==============================================
// ฟังก์ชันคำนวณข้อมูลส่วนตัว
// ==============================================

function getZodiacSign(birthDate) {
    const month = birthDate.getMonth(); // 0 = ม.ค., 11 = ธ.ค.
    const day = birthDate.getDate();

    // 1. ราศีมังกร (ธ.ค. 22 - ม.ค. 19)
    if ((month === 11 && day >= 22) || (month === 0 && day < 20)) return "มังกร (Capricorn)";
    
    // 2. ราศีกุมภ์ (ม.ค. 20 - ก.พ. 18)
    else if ((month === 0 && day >= 20) || (month === 1 && day < 19)) return "กุมภ์ (Aquarius)";
    
    // 3. ราศีมีน (ก.พ. 19 - มี.ค. 20)
    else if ((month === 1 && day >= 19) || (month === 2 && day < 21)) return "มีน (Pisces)";
    
    // 4. ราศีเมษ (มี.ค. 21 - เม.ย. 19)
    else if ((month === 2 && day >= 21) || (month === 3 && day < 20)) return "เมษ (Aries)";
    
    // 5. ราศีพฤษภ (เม.ย. 20 - พ.ค. 20)
    else if ((month === 3 && day >= 20) || (month === 4 && day < 21)) return "พฤษภ (Taurus)";
    
    // 6. ราศีเมถุน (พ.ค. 21 - มิ.ย. 20)
    else if ((month === 4 && day >= 21) || (month === 5 && day < 21)) return "เมถุน (Gemini)";
    
    // 7. ราศีกรกฎ (มิ.ย. 21 - ก.ค. 22)
    else if ((month === 5 && day >= 21) || (month === 6 && day < 23)) return "กรกฎ (Cancer)";
    
    // 8. ราศีสิงห์ (ก.ค. 23 - ส.ค. 22)
    else if ((month === 6 && day >= 23) || (month === 7 && day < 23)) return "สิงห์ (Leo)";
    
    // 9. ราศีกันย์ (ส.ค. 23 - ก.ย. 22)
    else if ((month === 7 && day >= 23) || (month === 8 && day < 23)) return "กันย์ (Virgo)";
    
    // 10. ราศีตุลย์ (ก.ย. 23 - ต.ค. 22)
    else if ((month === 8 && day >= 23) || (month === 9 && day < 23)) return "ตุลย์ (Libra)";
    
    // 11. ราศีพิจิก (ต.ค. 23 - พ.ย. 21)
    else if ((month === 9 && day >= 23) || (month === 10 && day < 23)) return "พิจิก (Scorpio)";
    
    // 12. ราศีธนู (พ.ย. 22 - ธ.ค. 21)
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

// ** คำนวณข้อมูลส่วนตัว (สำหรับ index.html) **
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
    const minutes = document.getElementById('timer-minutes').value || 5;
    const seconds = document.getElementById('timer-seconds').value || 0;
    
    const initialTime = parseInt(minutes) * 60 + parseInt(seconds);
    if (display) display.textContent = formatTime(initialTime);
}

function initTimer() {
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
                 alarmSound.play().catch(e => console.error("Error playing sound (เบราว์เซอร์อาจบล็อก):", e));
            }
           
            document.getElementById('timer-display').textContent = "🚨 หมดเวลา! 🚨";

            document.getElementById('start-button').textContent = '▶️ เริ่มจับเวลา';
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
    if (!document.getElementById('clock-display-container')) return; // หยุดถ้าไม่ได้อยู่หน้า Clock
    
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
    // กำหนดให้โค้ดเริ่มต้นทำงานเฉพาะเมื่อพบ Element ที่เกี่ยวข้องในหน้าปัจจุบัน
    
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
    
    // index.html: ไม่ต้องมีโค้ดเริ่มต้น เพราะฟังก์ชัน calculatePersonalInfo ถูกเรียกด้วยปุ่ม onclick
});
