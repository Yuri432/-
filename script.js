document.addEventListener('DOMContentLoaded', () => {
    // โหลดฟังก์ชันตามหน้าปัจจุบัน
    if (document.getElementById('personal-info')) {
        // initializePersonalInfo(); // ไม่มีฟังก์ชันเริ่มต้นที่จำเป็น
    } else if (document.getElementById('world-clock')) {
        // *** แก้ไขแล้ว: เรียกใช้ฟังก์ชันทันทีที่พบ ID ของหน้า ***
        initializeWorldClock();
    } else if (document.getElementById('timer')) {
        initializeTimer();
    } else if (document.getElementById('quiz')) {
        initializeQuiz();
    }
});


// ==============================================
// 1. PERSONAL INFO & NUMEROLOGY FUNCTIONS (ไม่เปลี่ยนแปลง)
// ==============================================

function getZodiacSign(day, month) {
    // 19/04 - 18/05 : ราศีเมษ
    if ((month === 4 && day >= 19) || (month === 5 && day <= 18)) return "ราศีเมษ (Aries) ♈";
    // 19/05 - 18/06 : ราศีพฤษภ
    if ((month === 5 && day >= 19) || (month === 6 && day <= 18)) return "ราศีพฤษภ (Taurus) ♉";
    // 19/06 - 19/07 : ราศีเมถุน
    if ((month === 6 && day >= 19) || (month === 7 && day <= 19)) return "ราศีเมถุน (Gemini) ♊";
    // 20/07 - 16/08 : ราศีกรกฎ
    if ((month === 7 && day >= 20) || (month === 8 && day <= 16)) return "ราศีกรกฎ (Cancer) ♋";
    // 17/08 - 16/09 : ราศีสิงห์
    if ((month === 8 && day >= 17) || (month === 9 && day <= 16)) return "ราศีสิงห์ (Leo) ♌";
    // 17/09 - 16/10 : ราศีกันย์
    if ((month === 9 && day >= 17) || (month === 10 && day <= 16)) return "ราศีกันย์ (Virgo) ♍";
    // 17/10 - 15/11 : ราศีตุลย์
    if ((month === 10 && day >= 17) || (month === 11 && day <= 15)) return "ราศีตุลย์ (Libra) ♎";
    // 16/11 - 15/12 : ราศีพิจิก
    if ((month === 11 && day >= 16) || (month === 12 && day <= 15)) return "ราศีพิจิก (Scorpio) ♏";
    // 16/12 - 14/01 : ราศีธนู
    if ((month === 12 && day >= 16) || (month === 1) || (month === 1 && day <= 14)) return "ราศีธนู (Sagittarius) ♐";
    // 15/01 - 12/02 : ราศีมังกร
    if ((month === 1 && day >= 15) || (month === 2 && day <= 12)) return "ราศีมังกร (Capricorn) ♑";
    // 13/02 - 14/03 : ราศีกุมภ์
    if ((month === 2 && day >= 13) || (month === 3 && day <= 14)) return "ราศีกุมภ์ (Aquarius) ♒";
    // 15/03 - 18/04 : ราศีมีน
    if ((month === 3 && day >= 15) || (month === 4 && day <= 18)) return "ราศีมีน (Pisces) ♓";
    return "ไม่พบข้อมูลราศี";
}

function calculatePersonalInfo() {
    const birthdateInput = document.getElementById('birthdate-input').value;
    const resultDiv = document.getElementById('personal-result');
    resultDiv.innerHTML = '';
    resultDiv.style.borderLeftColor = '#3498db';

    const dateParts = birthdateInput.split('/');
    if (dateParts.length !== 3) {
        resultDiv.innerHTML = '<p style="color:red;">กรุณากรอกวันเดือนปีเกิดในรูปแบบ DD/MM/YYYY หรือ DD/MM/BBBB</p>';
        return;
    }

    let day = parseInt(dateParts[0]);
    let month = parseInt(dateParts[1]);
    let year = parseInt(dateParts[2]);

    if (isNaN(day) || isNaN(month) || isNaN(year) || day > 31 || month > 12) {
        resultDiv.innerHTML = '<p style="color:red;">ข้อมูลวันที่ไม่ถูกต้อง กรุณาตรวจสอบ</p>';
        return;
    }

    // แปลง พ.ศ. เป็น ค.ศ. หากปีมากกว่า 2500
    if (year > 2500) {
        year -= 543;
    }
    
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    if (birthDate > today) {
        resultDiv.innerHTML = '<p style="color:red;">วันเกิดไม่สามารถเป็นอนาคตได้ กรุณาตรวจสอบปี</p>';
        return;
    }

    // คำนวณอายุ
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    // คำนวณวันเกิดที่ใกล้จะถึง (วันเกิดในปีปัจจุบัน)
    let nextBirthday = new Date(today.getFullYear(), month - 1, day);
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const timeDiff = nextBirthday.getTime() - today.getTime();
    const daysUntilBirthday = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // คำนวณราศี
    const zodiac = getZodiacSign(day, month);

    resultDiv.innerHTML = `
        <h3>✅ ผลการคำนวณข้อมูลส่วนบุคคล</h3>
        <p><strong>วันเกิดของคุณ:</strong> ${day} / ${month} / ${year + 543} (พ.ศ. ${year + 543})</p>
        <p><strong>ราศีของคุณ:</strong> ${zodiac}</p>
        <p><strong>อายุ:</strong> ${age} ปี</p>
        <p><strong>วันเกิดที่ใกล้จะถึง:</strong> เหลืออีก ${daysUntilBirthday} วัน</p>
    `;
}

// Map ตัวอักษรไทยไปสู่ตัวเลขเลขศาสตร์ (1-8)
const numerologyMap = {
    'ก': 1, 'ด': 1, 'ถ': 1, 'ภ': 1, 'ฤ': 1, 'า': 1,
    'ข': 2, 'ช': 2, 'บ': 2, 'ป': 2, 'ง': 2, 'ฝ': 2, 'แ': 2, 'ใ': 2, 'ไ': 2,
    'ค': 3, 'ต': 3, 'จ': 3, 'ร': 3, 'ว': 3, 'ษ': 3,
    'ฆ': 4, 'ฑ': 4, 'ธ': 4, 'น': 4, 'ย': 4, 'ศ': 4, 'ส': 4, 'ห': 4, 'ฬ': 4, 'อ': 4,
    'ต': 5, 'ฌ': 5, 'ณ': 5, 'ม': 5, 'ฮ': 5, 'เ': 5, 'โ': 5, 'ฯ': 5,
    'ฉ': 6, 'ท': 6, 'ผ': 6, 'พ': 6, 'ฟ': 6, 'ห': 6, 'อ': 6,
    'ซ': 7, 'ซี': 7, 'ญ': 7, 'ร': 7,
    'ฏ': 8, 'ฐ': 8, 'ย': 8, 'ล': 8, 'ว': 8,
    // สระที่ไม่มีค่าตัวเลข (ถือว่าเป็น 0 หรือไม่นำมาคิด)
    'ะ': 0, 'ิ': 0, 'ี': 0, 'ึ': 0, 'ื': 0, 'ุ': 0, 'ู': 0, '็': 0, '์': 0, 'ำ': 0, 'ๆ': 0,
    'ไม้หันอากาศ': 0, 'ไม้ไต่คู้': 0, 'วรรณยุกต์': 0
};

function getNumerologyValue(text) {
    if (!text) return 0;
    
    let total = 0;
    const cleanText = text.trim().toLowerCase();

    // 1. นำตัวอักษรมาเทียบค่า
    for (const char of cleanText) {
        if (numerologyMap[char] !== undefined) {
            total += numerologyMap[char];
        } else {
            // กรณีเป็นสระหรือตัวที่ไม่ระบุใน map (อาจต้องปรับตามหลักเลขศาสตร์ที่ใช้)
            // สำหรับความเรียบง่าย จะข้ามตัวที่ไม่พบไป
        }
    }
    return total;
}

function reduceNumber(num) {
    while (num > 9) {
        num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
}

function calculateNumerology() {
    const nameInput = document.getElementById('name-input').value;
    const surnameInput = document.getElementById('surname-input').value;
    const resultDiv = document.getElementById('numerology-result');
    resultDiv.innerHTML = '';

    if (!nameInput && !surnameInput) {
        resultDiv.innerHTML = '<p style="color:red;">กรุณากรอกชื่อและนามสกุล (ภาษาไทย) เพื่อคำนวณเลขศาสตร์</p>';
        return;
    }

    const nameValue = getNumerologyValue(nameInput);
    const surnameValue = getNumerologyValue(surnameInput);
    const totalValue = nameValue + surnameValue;
    
    // เลขเดี่ยวที่ลดทอนแล้ว
    const reducedTotal = reduceNumber(totalValue);

    resultDiv.innerHTML = `
        <h3>✨ ผลการทำนายเลขศาสตร์เบื้องต้น</h3>
        <p><strong>ค่าเลขศาสตร์ชื่อ:</strong> ${nameValue}</p>
        <p><strong>ค่าเลขศาสตร์นามสกุล:</strong> ${surnameValue}</p>
        <hr style="border-top: 1px dashed #ccc; margin: 10px 0;">
        <p><strong>ผลรวมค่าเลขศาสตร์ (ชื่อ+นามสกุล):</strong> <strong>${totalValue}</strong></p>
        <p><strong>เลขเดี่ยวพลังงานหลัก:</strong> <strong>${reducedTotal}</strong></p>
        <div style="margin-top: 15px; padding: 10px; background-color: #f0f8ff; border-radius: 4px;">
            <p style="margin: 0;">*การทำนายนี้เป็นเพียงการคำนวณเบื้องต้นตามหลักเลขศาสตร์ ตัวเลขมีผลทางจิตวิทยาเท่านั้น</p>
        </div>
    `;
    resultDiv.style.borderLeftColor = '#27ae60';
}


// ==============================================
// 2. WORLD CLOCK FUNCTIONS (อัปเดต TimeZone ID)
// ==============================================

// ตัวแปรที่เก็บรายการนาฬิกาโลก
const worldClocks = [
    { name: "ไทย (Bangkok)", timeZone: "Asia/Bangkok" },
    { name: "จีน (Shanghai)", timeZone: "Asia/Shanghai" },
    { name: "ญี่ปุ่น (Tokyo)", timeZone: "Asia/Tokyo" },
    { name: "เกาหลีใต้ (Seoul)", timeZone: "Asia/Seoul" },
    { name: "อินเดีย (Kolkata)", timeZone: "Asia/Kolkata" },
    { name: "อินโดนีเซีย (Jakarta)", timeZone: "Asia/Jakarta" },
    { name: "บังกลาเทศ (Dhaka)", timeZone: "Asia/Dhaka" },
    { name: "ปากีสถาน (Karachi)", timeZone: "Asia/Karachi" },
    { name: "ออสเตรเลีย (Sydney)", timeZone: "Australia/Sydney" },
    { name: "คาซัคสถาน (Almaty)", timeZone: "Asia/Almaty" },

    // โซนยุโรป
    { name: "รัสเซีย (Moscow)", timeZone: "Europe/Moscow" },
    { name: "รัสเซีย (Yekaterinburg)", timeZone: "Asia/Yekaterinburg" },
    { name: "สหราชอาณาจักร (London)", timeZone: "Europe/London" },
    { name: "ฝรั่งเศส (Paris)", timeZone: "Europe/Paris" },
    { name: "เยอรมนี (Berlin)", timeZone: "Europe/Berlin" },
    { name: "อิตาลี (Rome)", timeZone: "Europe/Rome" },
    { name: "สเปน (Madrid)", timeZone: "Europe/Madrid" },
    { name: "สวิตเซอร์แลนด์ (Zurich)", timeZone: "Europe/Zurich" },
    { name: "เนเธอร์แลนด์ (Amsterdam)", timeZone: "Europe/Amsterdam" },
    { name: "สวีเดน (Stockholm)", timeZone: "Europe/Stockholm" },
    { name: "เดนมาร์ก (Copenhagen)", timeZone: "Europe/Copenhagen" },
    { name: "ฟินแลนด์ (Helsinki)", timeZone: "Europe/Helsinki" },
    { name: "เบลเยียม (Brussels)", timeZone: "Europe/Brussels" },
    { name: "นอร์เวย์ (Oslo)", timeZone: "Europe/Oslo" },
    { name: "ออสเตรีย (Vienna)", timeZone: "Europe/Vienna" },
    
    // โซนอเมริกา/แอฟริกา
    { name: "สหรัฐอเมริกา (New York)", timeZone: "America/New_York" },
    { name: "สหรัฐอเมริกา (Los Angeles)", timeZone: "America/Los_Angeles" },
    { name: "แคนาดา (Toronto)", timeZone: "America/Toronto" },
    { name: "เม็กซิโก (Mexico City)", timeZone: "America/Mexico_City" },
    { name: "บราซิล (Sao Paulo)", timeZone: "America/Sao_Paulo" },
    { name: "อาร์เจนตินา (Buenos Aires)", timeZone: "America/Argentina/Buenos_Aires" },
    { name: "ไนจีเรีย (Lagos)", timeZone: "Africa/Lagos" },
    { name: "แอลจีเรีย (Algiers)", timeZone: "Africa/Algiers" },
];


let clockInterval;

function getThaiZodiacSign(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // 1-12
    return getZodiacSign(day, month); // ใช้ฟังก์ชันราศีจากส่วนที่ 1
}

function displayTimeDifference() {
    const timeDiffDiv = document.getElementById('time-difference');
    if (!timeDiffDiv) return;

    const bangkokTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
    const localTime = new Date();
    
    const bangkokOffset = new Date(bangkokTime).getTimezoneOffset();
    const localOffset = localTime.getTimezoneOffset();
    const offsetDiffMinutes = localOffset - bangkokOffset;

    let message;
    if (offsetDiffMinutes === 0) {
        message = "เวลาในเขตพื้นที่ของคุณตรงกับเวลาในประเทศไทย (Bangkok)";
    } else {
        const diffHours = Math.abs(Math.floor(offsetDiffMinutes / 60));
        const diffMinutes = Math.abs(offsetDiffMinutes % 60);
        const sign = offsetDiffMinutes > 0 ? "ช้ากว่า" : "เร็วกว่า";
        
        message = `เวลาในเขตพื้นที่ของคุณ ${sign} เวลาประเทศไทย ${diffHours} ชั่วโมง ${diffMinutes} นาที`;
    }
    timeDiffDiv.textContent = `[ ${message} ]`;
}

function updateCurrentZodiac() {
    const zodiacDiv = document.getElementById('current-zodiac');
    if (!zodiacDiv) return;
    
    // ใช้เวลาปัจจุบันในกรุงเทพฯ เพื่อคำนวณราศี
    const nowInBangkok = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
    const bangkokDate = new Date(nowInBangkok);
    const zodiac = getThaiZodiacSign(bangkokDate);
    
    zodiacDiv.textContent = `ราศีปัจจุบันในประเทศไทย: ${zodiac}`;
}


function initializeWorldClock() {
    const container = document.getElementById('clock-display-container');
    if (!container) return; 

    // สร้าง Element นาฬิกาเริ่มต้น
    worldClocks.forEach(clockData => {
        const clockDiv = document.createElement('div');
        clockDiv.className = 'clock';
        // ใช้ regular expression เพื่อแทนที่ / ด้วย - เพื่อให้ ID ถูกต้องตาม HTML
        clockDiv.id = `clock-${clockData.timeZone.replace(/\//g, '-')}`; 
        clockDiv.innerHTML = `
            <h2>${clockData.name}</h2>
            <div class="time">--:--:--</div>
            <div class="date-display">--/--/----</div>
        `;
        container.appendChild(clockDiv);
    });

    // เริ่มอัปเดตทุกวินาที
    updateAllClocks();
    clockInterval = setInterval(updateAllClocks, 1000);
    
    // แสดงข้อมูลเสริม
    displayTimeDifference();
    updateCurrentZodiac();
}

function updateAllClocks() {
    const now = new Date();

    worldClocks.forEach(clockData => {
        const clockElement = document.getElementById(`clock-${clockData.timeZone.replace(/\//g, '-')}`);
        if (!clockElement) return;

        const options = {
            timeZone: clockData.timeZone,
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        };
        const dateOptions = {
            timeZone: clockData.timeZone,
            year: 'numeric', month: 'short', day: 'numeric'
        };

        const timeString = new Intl.DateTimeFormat('th-TH', options).format(now);
        const dateString = new Intl.DateTimeFormat('th-TH', dateOptions).format(now);
        
        // สำหรับ Night Mode
        const localHour = parseInt(new Intl.DateTimeFormat('th-TH', { 
            timeZone: clockData.timeZone, 
            hour: '2-digit', hourCycle: 'h23' 
        }).format(now));

        // ตรวจสอบกลางวัน/กลางคืน (19:00 - 05:59 คือกลางคืน)
        if (localHour >= 19 || localHour < 6) {
            clockElement.classList.add('night-mode');
        } else {
            clockElement.classList.remove('night-mode');
        }

        clockElement.querySelector('.time').textContent = timeString;
        clockElement.querySelector('.date-display').textContent = dateString;
    });

    // อัปเดตราศีปัจจุบัน (ถ้ามีฟังก์ชัน)
    updateCurrentZodiac();
}


// ==============================================
// 3. TIMER FUNCTIONS (ไม่เปลี่ยนแปลง)
// ==============================================

let countdownInterval;
let totalSeconds;
let isPaused = false;
let isRunning = false;
const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const alarmSound = document.getElementById('alarm-sound');

function initializeTimer() {
    // กำหนดค่าเริ่มต้นเมื่อโหลดหน้า
    if (timerDisplay) {
        timerDisplay.textContent = formatTime(5 * 60);
    }
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function startTimer() {
    const minutes = parseInt(document.getElementById('timer-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('timer-seconds').value) || 0;

    if (!isRunning && !isPaused) {
        // เริ่มต้นใหม่
        totalSeconds = (minutes * 60) + seconds;
        if (totalSeconds <= 0) {
            alert("กรุณาตั้งเวลาให้มากกว่า 0!");
            return;
        }
    }

    isRunning = true;
    isPaused = false;
    
    // ซ่อน input
    document.getElementById('timer-input-container').style.display = 'none';
    startButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';

    countdownInterval = setInterval(() => {
        if (!isPaused && totalSeconds > 0) {
            totalSeconds--;
            timerDisplay.textContent = formatTime(totalSeconds);
            
            if (totalSeconds === 0) {
                clearInterval(countdownInterval);
                isRunning = false;
                pauseButton.style.display = 'none';
                startButton.style.display = 'inline-block';
                document.getElementById('timer-input-container').style.display = 'flex';
                timerDisplay.textContent = formatTime(0);
                alarmSound.play();
                alert("หมดเวลาแล้ว!");
            }
        }
    }, 1000);
}

function pauseTimer() {
    isPaused = true;
    isRunning = false;
    clearInterval(countdownInterval);
    startButton.style.display = 'inline-block';
    startButton.textContent = '▶️ เล่นต่อ';
    pauseButton.style.display = 'none';
}

function resetTimer() {
    clearInterval(countdownInterval);
    isRunning = false;
    isPaused = false;
    totalSeconds = 5 * 60; // กลับไปค่าเริ่มต้นที่ 5 นาที
    
    document.getElementById('timer-minutes').value = 5;
    document.getElementById('timer-seconds').value = 0;
    
    timerDisplay.textContent = formatTime(totalSeconds);
    document.getElementById('timer-input-container').style.display = 'flex';
    startButton.textContent = '▶️ เริ่มจับเวลา';
    startButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
}


// ==============================================
// 4. QUIZ GAME FUNCTIONS (ไม่เปลี่ยนแปลง)
// ==============================================

const quizQuestions = [
    { question: "แม่น้ำที่ยาวที่สุดในโลกคือแม่น้ำอะไร?", options: ["แอมะซอน", "ไนล์", "แยงซี", "มิสซิสซิปปี"], answer: "ไนล์", difficulty: "easy" },
    { question: "ประเทศไทยมีกี่จังหวัดในปัจจุบัน (ไม่รวมกรุงเทพมหานคร)?", options: ["76", "77", "75", "78"], answer: "76", difficulty: "medium" },
    { question: "ใครเป็นผู้คิดค้นหลอดไฟฟ้า?", options: ["นิโคลา เทสลา", "อัลเบิร์ต ไอน์สไตน์", "โทมัส เอดิสัน", "กาลิเลโอ กาลิเลอี"], answer: "โทมัส เอดิสัน", difficulty: "easy" },
    { question: "ธาตุที่มีสัญลักษณ์ทางเคมีว่า 'Au' คือธาตุใด?", options: ["เงิน", "เหล็ก", "ทองคำ", "ปรอท"], answer: "ทองคำ", difficulty: "medium" },
    { question: "องค์กรสหประชาชาติ (UN) ก่อตั้งขึ้นเมื่อปี ค.ศ. ใด?", options: ["1939", "1945", "1950", "1929"], answer: "1945", difficulty: "hard" },
    { question: "สิ่งมีชีวิตใดที่สามารถอยู่ได้โดยไม่ต้องดื่มน้ำเลยตลอดชีวิต?", options: ["อูฐ", "จิงโจ้", "หนูจิงโจ้", "งู"], answer: "หนูจิงโจ้", difficulty: "hard" },
    { question: "ดาวเคราะห์ดวงใดในระบบสุริยะมีวงแหวนที่โดดเด่นที่สุด?", options: ["พฤหัสบดี", "อังคาร", "เสาร์", "ยูเรนัส"], answer: "เสาร์", difficulty: "easy" },
    { question: "ใครคือนักเขียนบทละครที่มีชื่อเสียงจากเรื่อง 'Romeo and Juliet'?", options: ["เจน ออสเตน", "ชาร์ลส์ ดิคเกนส์", "วิลเลียม เชกสเปียร์", "มาร์ค ทเวน"], answer: "วิลเลียม เชกสเปียร์", difficulty: "easy" },
    { question: "ก๊าซชนิดใดที่พืชใช้ในการสังเคราะห์แสง?", options: ["ออกซิเจน", "ไนโตรเจน", "คาร์บอนไดออกไซด์", "มีเทน"], answer: "คาร์บอนไดออกไซด์", difficulty: "easy" },
    { question: "หอคอยเอนที่เมืองปิซา (Leaning Tower of Pisa) อยู่ในประเทศใด?", options: ["ฝรั่งเศส", "อิตาลี", "สเปน", "เยอรมนี"], answer: "อิตาลี", difficulty: "easy" }
];

let currentQuestionIndex = 0;
let score = 0;
let quizTimeStart;
let quizTimerInterval;
let quizCountdownTimer;

const TIME_LIMITS = {
    easy: 30,
    medium: 45,
    hard: 60
};

function initializeQuiz() {
    document.getElementById('quiz-start-btn').addEventListener('click', startQuiz);
    loadLeaderboard();
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    
    document.getElementById('quiz-start-area').style.display = 'none';
    document.getElementById('quiz-game-area').style.display = 'block';
    document.getElementById('quiz-result-area').style.display = 'none';
    document.getElementById('quiz-leaderboard-area').style.display = 'block';

    quizTimeStart = new Date();
    showQuestion(quizQuestions[currentQuestionIndex]);
}

function showQuestion(q) {
    document.getElementById('quiz-question').textContent = `คำถามที่ ${currentQuestionIndex + 1} (${q.difficulty.toUpperCase()}): ${q.question}`;
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    // ตั้งเวลาจับเวลาตามความยาก
    clearInterval(quizCountdownTimer);
    let timeLeft = TIME_LIMITS[q.difficulty];
    document.getElementById('quiz-timer').textContent = `⏳ เวลา: ${timeLeft} วินาที (${q.difficulty.toUpperCase()})`;
    
    quizCountdownTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('quiz-timer').textContent = `⏳ เวลา: ${timeLeft} วินาที (${q.difficulty.toUpperCase()})`;
        
        if (timeLeft <= 0) {
            clearInterval(quizCountdownTimer);
            handleAnswer(null); // หมดเวลาถือว่าตอบผิด
        }
    }, 1000);

    q.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'quiz-option-btn';
        button.textContent = option;
        button.onclick = () => handleAnswer(option, q.answer);
        optionsContainer.appendChild(button);
    });
}

function handleAnswer(selectedOption, correctAnswer) {
    clearInterval(quizCountdownTimer);
    const optionsButtons = document.querySelectorAll('.quiz-option-btn');
    optionsButtons.forEach(btn => btn.disabled = true); // ปิดปุ่มทั้งหมดหลังการตอบ

    if (selectedOption === correctAnswer) {
        score++;
        // เน้นสีเขียวสำหรับคำตอบที่ถูกต้อง
        optionsButtons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.style.backgroundColor = '#2ecc71';
                btn.style.color = 'white';
            }
        });
    } else {
        // เน้นสีแดงสำหรับคำตอบที่ผิด และสีเขียวสำหรับคำตอบที่ถูกต้อง
        optionsButtons.forEach(btn => {
            if (btn.textContent === selectedOption) {
                btn.style.backgroundColor = '#e74c3c';
                btn.style.color = 'white';
            }
            if (btn.textContent === correctAnswer) {
                btn.style.backgroundColor = '#f1c40f'; // สีเหลืองเตือน
                btn.style.color = 'black';
            }
        });
    }
    
    document.getElementById('quiz-score').textContent = `คะแนน: ${score} / ${currentQuestionIndex + 1}`;

    // หน่วงเวลา 1.5 วินาที ก่อนไปคำถามถัดไป
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion(quizQuestions[currentQuestionIndex]);
        } else {
            endQuiz();
        }
    }, 1500);
}

function endQuiz() {
    const quizTimeEnd = new Date();
    const totalTimeMs = quizTimeEnd.getTime() - quizTimeStart.getTime();
    const totalTimeSeconds = Math.round(totalTimeMs / 1000);
    const timeFormat = formatTime(totalTimeSeconds);

    document.getElementById('quiz-game-area').style.display = 'none';
    document.getElementById('quiz-result-area').style.display = 'block';

    const resultHTML = `
        <h3>🎉 จบเกมแล้ว!</h3>
        <p style="font-size: 1.5em; font-weight: bold;">คะแนนรวม: ${score} / ${quizQuestions.length}</p>
        <p>เวลาที่ใช้ทั้งหมด: ${timeFormat}</p>
    `;
    document.getElementById('quiz-final-result').innerHTML = resultHTML;
    
    // จัดการ Top Score
    promptForScore(score, totalTimeSeconds, timeFormat);
    
    // แสดงปุ่มเริ่มใหม่
    document.getElementById('quiz-start-area').style.display = 'block';
    document.getElementById('quiz-start-btn').textContent = '▶️ เริ่มเกมใหม่';
}

function promptForScore(score, totalTimeSeconds, timeFormat) {
    const playerName = prompt("คุณทำคะแนนได้ดี! กรุณากรอกชื่อย่อเพื่อบันทึกสถิติ (3-10 ตัวอักษร):") || 'Anon';
    
    saveScore(score, totalTimeSeconds, timeFormat, playerName.substring(0, 10)); // ตัดชื่อให้ไม่เกิน 10 ตัว
}

// ==============================================
// 5. LEADERBOARD FUNCTIONS (ไม่เปลี่ยนแปลง)
// ==============================================

function saveScore(score, totalTimeSeconds, timeFormat, playerName) {
    const leaderboard = getLeaderboard();
    const newEntry = {
        name: playerName,
        score: score,
        timeSeconds: totalTimeSeconds,
        timeFormat: timeFormat,
        date: new Date().toLocaleDateString('th-TH')
    };
    
    leaderboard.push(newEntry);
    
    // เรียงลำดับ: คะแนนมาก่อน, เวลาใช้น้อยมาก่อน (เฉพาะกรณีคะแนนเท่ากัน)
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score; // คะแนนมาก่อน
        }
        return a.timeSeconds - b.timeSeconds; // เวลาใช้น้อยมาก่อน (เร็วกว่า)
    });

    // เก็บแค่ 10 อันดับแรก
    const top10 = leaderboard.slice(0, 10);
    localStorage.setItem('quizLeaderboard', JSON.stringify(top10));
    
    loadLeaderboard();
}

function getLeaderboard() {
    const leaderboardJson = localStorage.getItem('quizLeaderboard');
    return leaderboardJson ? JSON.parse(leaderboardJson) : [];
}

function loadLeaderboard() {
    const leaderboard = getLeaderboard();
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return; 

    tbody.innerHTML = '';
    document.getElementById('quiz-leaderboard-area').style.display = 'block';

    if (leaderboard.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">ยังไม่มีสถิติการเล่น</td></tr>';
        return;
    }

    leaderboard.forEach((entry, index) => {
        const row = tbody.insertRow();
        row.insertCell().textContent = index + 1;
        row.insertCell().textContent = entry.name;
        row.insertCell().textContent = `${entry.score} / ${quizQuestions.length}`;
        row.insertCell().textContent = entry.timeFormat;
        row.insertCell().textContent = entry.date;
    });
}
