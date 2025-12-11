// ฟังก์ชันสำหรับดึงเวลาและแสดงผล
function updateClocks() {
    // 1. เวลาประเทศไทย (Bangkok: Asia/Bangkok, UTC+7)
    const thaiTime = new Date().toLocaleTimeString('th-TH', {
        timeZone: 'Asia/Bangkok',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // ใช้รูปแบบ 24 ชั่วโมง
    });
    document.getElementById('thai-time').textContent = thaiTime;

    // 2. เวลาประเทศญี่ปุ่น (Tokyo: Asia/Tokyo, UTC+9)
    const japanTime = new Date().toLocaleTimeString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // ใช้รูปแบบ 24 ชั่วโมง
    });
    document.getElementById('japan-time').textContent = japanTime;
}

// เรียกใช้ฟังก์ชันทันทีเมื่อโหลดหน้าเว็บ
updateClocks();

// ตั้งให้เรียกใช้ฟังก์ชันทุกๆ 1 วินาที เพื่ออัปเดตเวลา
setInterval(updateClocks, 1000);
