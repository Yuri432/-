// ข้อมูล Time Zones ที่ต้องการแสดงผล (สามารถเพิ่ม/ลบประเทศอื่นได้ง่ายๆ ที่นี่)
const TIMEZONES = {
    // ใช้ออฟเซ็ต (offset) เพื่อความแม่นยำในการคำนวณส่วนต่างเวลา
    thai: { id: 'Asia/Bangkok', name: '🇹🇭 กรุงเทพฯ, ประเทศไทย', offset: 7, city: 'ไทย' },
    japan: { id: 'Asia/Tokyo', name: '🇯🇵 โตเกียว, ญี่ปุ่น', offset: 9, city: 'ญี่ปุ่น' },
    // ตัวอย่าง: ซิดนีย์
    sydney: { id: 'Australia/Sydney', name: '🇦🇺 ซิดนีย์, ออสเตรเลีย', offset: 11, city: 'ซิดนีย์' } 
};

// ฟังก์ชันช่วยในการตรวจสอบว่าเป็นเวลากลางคืนหรือไม่ (19:00 - 05:59 น.)
const isNight = (hour) => hour >= 19 || hour < 6;

// --- 1. ฟังก์ชันสร้าง HTML สำหรับนาฬิกา (Run เพียงครั้งเดียว) ---
function createClockElements() {
    const container = document.getElementById('clock-display-container');
    container.innerHTML = ''; 

    for (const key in TIMEZONES) {
        const zone = TIMEZONES[key];
        
        // สร้าง HTML string สำหรับนาฬิกาแต่ละอัน
        // ใช้ key ใน id เพื่อให้ JS อัปเดตได้ง่าย
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

// --- 2. ฟังก์ชันอัปเดตเวลาและธีม (Run ทุกวินาที) ---
function updateClocks() {
    // กำหนดรูปแบบวันที่ที่เน้นภาษาไทยเพื่อความเสถียร
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

        // ดึงเวลา: ใช้ออปชันที่ชัดเจน (th-TH, 24-hour)
        const timeString = date.toLocaleTimeString('th-TH', { 
            timeZone: zone.id, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
        });
        
        // ดึงวันที่: ใช้ออปชันที่ชัดเจน (th-TH)
        const dateString = date.toLocaleDateString('th-TH', {
            timeZone: zone.id,
            ...dateOptions
        });

        // ดึงชั่วโมง (เป็นตัวเลข) สำหรับธีมกลางวัน/กลางคืน
        const hourNumeric = parseInt(date.toLocaleTimeString('en-US', {
            timeZone: zone.id,
            hour: 'numeric',
            hour12: false
        }));

        // อัปเดต HTML
        document.getElementById(`${key}-time`).textContent = timeString;
        document.getElementById(`${key}-date`).textContent = dateString;
        
        // จัดการธีมกลางวัน/กลางคืน
        const clockElement = document.getElementById(`${key}-clock`);
        if (isNight(hourNumeric)) {
            clockElement.classList.add('night-mode');
        } else {
            clockElement.classList.remove('night-mode');
        }

        // เก็บ Offset สำหรับคำนวณส่วนต่างไทย-ญี่ปุ่น
        if (key === 'thai') thaiOffset = zone.offset;
        if (key === 'japan') japanOffset = zone.offset;
    }

    // --- 3. คำนวณส่วนต่างเวลา ไทย vs ญี่ปุ่น (ส่วนแสดงผล Ayunum) ---
    const diffHours = japanOffset - thaiOffset; 
    const diffMinutes = Math.abs(diffHours * 60);

    const diffDisplayElement = document.getElementById('time-difference');
    
    if (diffHours > 0) {
        // ญี่ปุ่นเร็วกว่าไทย
        diffDisplayElement.innerHTML = `ญี่ปุ่นเร็วกว่าไทย <span style="color:#e74c3c;">${diffHours} ชั่วโมง</span> (${diffMinutes} นาที)`;
    } else if (diffHours < 0) {
        // ไทยเร็วกว่าญี่ปุ่น
         diffDisplayElement.innerHTML = `ไทยเร็วกว่าญี่ปุ่น <span style="color:#e74c3c;">${Math.abs(diffHours)} ชั่วโมง</span> (${diffMinutes} นาที)`;
    } else {
         // เวลาเท่ากัน
         diffDisplayElement.innerHTML = `เวลาเท่ากัน`;
    }
}

// -----------------------------------------------------
// --- การเริ่มต้น (Entry Point) ---
// -----------------------------------------------------

// 1. สร้างโครงสร้างนาฬิกาทั้งหมด
createClockElements();

// 2. อัปเดตเวลาทันที
updateClocks();

// 3. ตั้งเวลาให้ทำงานซ้ำทุก 1 วินาที
setInterval(updateClocks, 1000);
