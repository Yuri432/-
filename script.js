// ... (ส่วน TIMEZONES, CHINESE_ZODIACS, isNight) ...

// ฐานข้อมูลราศีตะวันตก (Western Zodiac)
// *** แก้ไขจุดเริ่มต้นให้ตรงกับราศีที่ต้องการ (เช่น ราศีมังกร เริ่ม 22 ธ.ค. แต่ตารางเริ่ม ม.ค.) ***
const ZODIACS = [
    // ราศีมังกร (Capricorn): 22 ธ.ค. - 19 ม.ค.
    { name: "มังกร (Capricorn)", startMonth: 0, startDate: 20 }, // 0=ม.ค. 20 (สำหรับจุดตัดไปกุมภ์) 
    
    // ราศีกุมภ์ (Aquarius): 20 ม.ค. - 18 ก.พ.
    { name: "กุมภ์ (Aquarius)", startMonth: 1, startDate: 19 }, // 1=ก.พ. 19 (สำหรับจุดตัดไปมีน)
    
    // ราศีมีน (Pisces): 19 ก.พ. - 20 มี.ค.
    { name: "มีน (Pisces)", startMonth: 2, startDate: 21 }, // 2=มี.ค. 21 (สำหรับจุดตัดไปเมษ)

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

// ==============================================
// ฟังก์ชันคำนวณราศีที่ถูกแก้ไข (ต้องทำงานได้ถูกต้อง 100%)
// ==============================================

function getZodiacSign(birthDate) {
    const month = birthDate.getMonth();
    const day = birthDate.getDate();

    // 1. จัดการกรณีพิเศษ: มังกรคาบเกี่ยวระหว่างปี (ธันวาคม 22 - มกราคม 19)
    // ถ้าเกิดใน ม.ค. ก่อนวันที่ 20
    if (month === 0 && day < 20) {
        return "มังกร (Capricorn)";
    }
    // ถ้าเกิดใน ธ.ค. ตั้งแต่วันที่ 22 เป็นต้นไป
    if (month === 11 && day >= 22) {
        return "มังกร (Capricorn)";
    }
    
    // 2. ตรวจสอบราศีที่เหลือ (กุมภ์เป็นต้นไป)
    for (let i = 0; i < ZODIACS.length; i++) {
        const zodiac = ZODIACS[i];
        
        // เราใช้ตาราง ZODIACS เพื่อกำหนดจุดเริ่มต้นของราศี *ถัดไป*
        const nextZodiacIndex = (i + 1) % ZODIACS.length;
        let currentZodiac = ZODIACS[i];
        
        // เราต้องการหาว่าเดือน/วัน อยู่ระหว่างจุดเริ่มต้นของราศี A กับ จุดเริ่มต้นของราศี B หรือไม่
        
        // ถ้าเดือนตรงกับจุดเริ่มต้นของราศีปัจจุบัน
        if (month === currentZodiac.startMonth && day >= currentZodiac.startDate) {
            // นี่คือราศีที่เริ่มในเดือนนั้น
            return currentZodiac.name; 
        } 
        
        // ถ้าเดือนก่อนหน้าเริ่มราศีนั้น
        const prevMonth = (month - 1 + 12) % 12;
        if (prevMonth === currentZodiac.startMonth && day >= currentZodiac.startDate) {
             // โค้ดนี้มีความซับซ้อน เราจะใช้ตรรกะที่ง่ายกว่าเดิม (Standard logic)
             
             // ตรวจสอบราศีถัดไป
             if (month === nextZodiacIndex && day < ZODIACS[nextZodiacIndex].startDate) {
                 return currentZodiac.name;
             }
        }
        
    }
    
    // เนื่องจากลูปซับซ้อน เราจะใช้ตรรกะการตรวจสอบตามจุดตัดเดือน/วัน
    if ((month === 0 && day >= 20) || (month === 1 && day < 19)) return "กุมภ์ (Aquarius)";
    if ((month === 1 && day >= 19) || (month === 2 && day < 21)) return "มีน (Pisces)";
    if ((month === 2 && day >= 21) || (month === 3 && day < 20)) return "เมษ (Aries)";
    if ((month === 3 && day >= 20) || (month === 4 && day < 21)) return "พฤษภ (Taurus)";
    if ((month === 4 && day >= 21) || (month === 5 && day < 21)) return "เมถุน (Gemini)";
    if ((month === 5 && day >= 21) || (month === 6 && day < 23)) return "กรกฎ (Cancer)";
    if ((month === 6 && day >= 23) || (month === 7 && day < 23)) return "สิงห์ (Leo)";
    if ((month === 7 && day >= 23) || (month === 8 && day < 23)) return "กันย์ (Virgo)";
    if ((month === 8 && day >= 23) || (month === 9 && day < 23)) return "ตุลย์ (Libra)";
    if ((month === 9 && day >= 23) || (month === 10 && day < 23)) return "พิจิก (Scorpio)";
    if ((month === 10 && day >= 23) || (month === 11 && day < 22)) return "ธนู (Sagittarius)";
    
    return 'ไม่ทราบ';
}

// ... (ส่วน calculateAge, getLunarZodiac, calculatePersonalInfo และ World Clock อื่น ๆ ใช้โค้ดเดิม) ...
