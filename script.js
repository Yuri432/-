function updateClocks() {
    // กำหนดรูปแบบการแสดงวันที่ (ชื่อวัน, วันที่, เดือน, ปี)
    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    // ฟังก์ชันช่วยในการตรวจสอบว่าเป็นเวลากลางคืนหรือไม่ (19:00 - 05:59 น.)
    const isNight = (hour) => hour >= 19 || hour < 6;

    // --- 1. ประเทศไทย (Asia/Bangkok) ---
    const thaiTime = new Date().toLocaleTimeString('th-TH', { 
        timeZone: 'Asia/Bangkok', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    });
    const thaiDate = new Date().toLocaleDateString('th-TH', {
        timeZone: 'Asia/Bangkok',
        ...dateOptions
    });
    // ดึงชั่วโมงเพื่อใช้ในการกำหนดธีม
    const thaiHour = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Bangkok',
        hour: 'numeric',
        hour12: false
    });
    
    // อัปเดต HTML สำหรับไทย
    document.getElementById('thai-time').textContent = thaiTime;
    document.getElementById('thai-date').textContent = thaiDate;
    
    // จัดการธีมกลางวัน/กลางคืนสำหรับไทย
    const thaiClockElement = document.getElementById('thai-clock');
    if (isNight(parseInt(thaiHour))) {
        thaiClockElement.classList.add('night-mode');
    } else {
        thaiClockElement.classList.remove('night-mode');
    }

    // --- 2. ประเทศญี่ปุ่น (Asia/Tokyo) ---
    const japanTime = new Date().toLocaleTimeString('ja-JP', { 
        timeZone: 'Asia/Tokyo', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    });
    const japanDate = new Date().toLocaleDateString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        ...dateOptions
    });
    // ดึงชั่วโมงเพื่อใช้ในการกำหนดธีม
    const japanHour = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Tokyo',
        hour: 'numeric',
        hour12: false
    });
    
    // อัปเดต HTML สำหรับญี่ปุ่น
    document.getElementById('japan-time').textContent = japanTime;
    document.getElementById('japan-date').textContent = japanDate;
    
    // จัดการธีมกลางวัน/กลางคืนสำหรับญี่ปุ่น
    const japanClockElement = document.getElementById('japan-clock');
    if (isNight(parseInt(japanHour))) {
        japanClockElement.classList.add('night-mode');
    } else {
        japanClockElement.classList.remove('night-mode');
    }
}

// เรียกใช้ฟังก์ชันทันทีและตั้งเวลาให้ทำงานซ้ำทุก 1 วินาที
updateClocks();
setInterval(updateClocks, 1000);
