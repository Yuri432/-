// ข้อมูล Time Zones ที่ใช้งานได้
const TIMEZONES = {
    thai: { id: 'Asia/Bangkok', name: '🇹🇭 กรุงเทพฯ, ประเทศไทย', offset: 7 }, // UTC+7
    japan: { id: 'Asia/Tokyo', name: '🇯🇵 โตเกียว, ญี่ปุ่น', offset: 9 }      // UTC+9
};

// ฟังก์ชันช่วยในการตรวจสอบว่าเป็นเวลากลางคืนหรือไม่ (19:00 - 05:59 น.)
const isNight = (hour) => hour >= 19 || hour < 6;

function updateClocks() {
    // กำหนดรูปแบบการแสดงวันที่
    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    // --- ฟังก์ชันสำหรับอัปเดตนาฬิกาเดียว (ลดโค้ดซ้ำซ้อน) ---
    function updateClock(zoneKey) {
        const zone = TIMEZONES[zoneKey];
        const date = new Date();

        // ดึงเวลาในรูปแบบ Local Time String ตาม TimeZone
        const timeString = date.toLocaleTimeString('th-TH', { 
            timeZone: zone.id, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
        });
        
        // ดึงวันที่ในรูปแบบ Local Date String ตาม TimeZone
        const dateString = date.toLocaleDateString('th-TH', {
            timeZone: zone.id,
            ...dateOptions
        });

        // ดึงชั่วโมง (เป็นตัวเลข) เพื่อใช้ในการกำหนดธีมกลางวัน/กลางคืน
        const hourNumeric = parseInt(date.toLocaleTimeString('en-US', {
            timeZone: zone.id,
            hour: 'numeric',
            hour12: false
        }));

        // อัปเดต HTML
        document.getElementById(`${zoneKey}-time`).textContent = timeString;
        document.getElementById(`${zoneKey}-date`).textContent = dateString;
        
        // จัดการธีมกลางวัน/กลางคืน
        const clockElement = document.getElementById(`${zoneKey}-clock`);
        if (isNight(hourNumeric)) {
            clockElement.classList.add('night-mode');
        } else {
            clockElement.classList.remove('night-mode');
        }
        
        // คืนค่า UTC offset
        return zone.offset;
    }

    // --- อัปเดตนาฬิกาทั้งสองและรับ UTC Offset กลับมา ---
    const thaiOffset = updateClock('thai');
    const japanOffset = updateClock('japan');

    // --- 3. คำนวณส่วนต่างเวลา (Time Difference) ---
    const diffHours = japanOffset - thaiOffset; 
    const diffMinutes = Math.abs(diffHours * 60);

    const diffDisplayElement = document.getElementById('time-difference');
    
    // แสดงผลส่วนต่าง
    if (diffHours > 0) {
        // ญี่ปุ่นเร็วกว่าไทย (+2 ชั่วโมง)
        diffDisplayElement.innerHTML = `ญี่ปุ่นเร็วกว่าไทย <span style="color:#e74c3c;">${diffHours} ชั่วโมง</span> (${diffMinutes} นาที)`;
    } else if (diffHours < 0) {
        // ไทยเร็วกว่าญี่ปุ่น (ไม่น่าเกิดขึ้นในเคสนี้)
         diffDisplayElement.innerHTML = `ไทยเร็วกว่าญี่ปุ่น <span style="color:#e74c3c;">${Math.abs(diffHours)} ชั่วโมง</span> (${diffMinutes} นาที)`;
    } else {
        // เวลาเท่ากัน
         diffDisplayElement.innerHTML = `เวลาเท่ากัน`;
    }
}

// เรียกใช้ฟังก์ชันทันทีและตั้งเวลาให้ทำงานซ้ำทุก 1 วินาที
updateClocks();
setInterval(updateClocks, 1000);
