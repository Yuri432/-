// ข้อมูล Time Zones ที่ต้องการแสดงผล (สามารถเพิ่ม/ลบประเทศอื่นได้ง่ายๆ ที่นี่)
const TIMEZONES = {
    thai: { id: 'Asia/Bangkok', name: '🇹🇭 กรุงเทพฯ, ประเทศไทย', offset: 7, city: 'ไทย' },
    japan: { id: 'Asia/Tokyo', name: '🇯🇵 โตเกียว, ญี่ปุ่น', offset: 9, city: 'ญี่ปุ่น' },
    sydney: { id: 'Australia/Sydney', name: '🇦🇺 ซิดนีย์, ออสเตรเลีย', offset: 11, city: 'ซิดนีย์' } 
};

// ฟังก์ชันช่วยในการตรวจสอบว่าเป็นเวลากลางคืนหรือไม่ (19:00 - 05:59 น.)
const isNight = (hour) => hour >= 19 || hour < 6;

// --- ฟังก์ชันใหม่: คำนวณและแสดงผลปีนักษัตร ---
function displayZodiacYear() {
    // ดึงปีปัจจุบันตามปฏิทินไทย (พ.ศ.)
    // Note: JavaScript Date().getFullYear() จะให้ปี ค.ศ.
    const currentCEYear = new Date().getFullYear(); 
    const currentBEYear = currentCEYear + 543;
    
    // อาร์เรย์ของปีนักษัตรตามลำดับ (เริ่มจากปีชวด/หนู)
    const zodiacs = [
        "ปีชวด (หนู)", "ปีฉลู (วัว)", "ปีขาล (เสือ)", "ปีเถาะ (กระต่าย)", 
        "ปีมะโรง (งูใหญ่/มังกร)", "ปีมะเส็ง (งูเล็ก)", "ปีมะเมีย (ม้า)", "ปีมะแม (แพะ)", 
        "ปีวอก (ลิง)", "ปีระกา (ไก่)", "ปีจอ (สุนัข)", "ปีกุน (หมู)"
    ];
    
    // สูตรคำนวณ: (ปี พ.ศ. + 9) % 12 เพื่อให้สอดคล้องกับวัฏจักรนักษัตรไทย (ชวด = 0)
    const zodiacIndex = (currentBEYear + 9) % 12;

    const currentZodiac = zodiacs[zodiacIndex];
    
    document.getElementById('current-zodiac').textContent = `ปีนักษัตร: ${currentZodiac}`;
}

// --- ฟังก์ชันสร้าง HTML สำหรับนาฬิกา (Run เพียงครั้งเดียว) ---
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

// --- ฟังก์ชันอัปเดตเวลาและธีม (Run ทุกวินาที) ---
function updateClocks() {
    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    let thaiOffset = 0;
    let japanOffset = 0; 

    for (const key in TIMEZONES) {
        const zone = TIMEZONES[key];
        const date = new Date();

        // ดึงเวลา
        const timeString = date.toLocaleTimeString('th-TH', { 
            timeZone: zone.id, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
        });
        
        // ดึงวันที่
        const dateString = date.toLocaleDateString('th-TH', {
            timeZone: zone.id,
            ...dateOptions
        });

        // ดึงชั่วโมงสำหรับธีมกลางวัน/กลางคืน
        const hourNumeric = parseInt(date.toLocaleTimeString('en-US', {
            timeZone: zone.id,
            hour: 'numeric',
            hour12: false
        }));

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

    // --- 3. คำนวณส่วนต่างเวลา ไทย vs ญี่ปุ่น ---
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

// 2. แสดงผลปีนักษัตร
displayZodiacYear();

// 3. อัปเดตเวลาทันที
updateClocks();

// 4. ตั้งเวลาให้ทำงานซ้ำทุก 1 วินาที
setInterval(updateClocks, 1000);
