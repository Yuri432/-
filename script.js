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
// 🔮 ข้อมูลฐานระบบทำนายชื่อ (ทักษา)
// ==============================================

// ข้อมูลทักษา (อักษรแบ่งตามหมวดหมู่)
const TAKSA_RULES = {
    // 0: อาทิตย์, 1: จันทร์, 2: อังคาร, 3: พุธ, 4: พฤหัส, 5: ศุกร์, 6: เสาร์, 7: พุธกลางคืน (ราหู)
    
    // Key: [บริวาร, อายุ, เดช, ศรี, มูละ, อุตสาหะ, มนตรี, กาลกิณี (Kala)] (character sets)
    0: { 
        day: "วันอาทิตย์", 
        rules: ["อห", "กขคฆง", "จฉชซฌญ", "ฎฏฐฑฒณ", "ตถทธน", "บปผฝพฟภม", "ยรลว", "ศษสหฬฮ"],
        vowels: "ะาิีึืุูเแอโอไอใ", 
        kala: "ศษสหฬฮ",
        kalaType: "อักขระ"
    },
    1: { 
        day: "วันจันทร์", 
        rules: ["กขคฆง", "จฉชซฌญ", "ฎฏฐฑฒณ", "ตถทธน", "บปผฝพฟภม", "ยรลว", "ศษสหฬฮ", "อห"],
        vowels: "ะาิีึืุูเแอโอไอใ", 
        kala: "อะอาอิอีอุอูเแอโอไอใ", 
        kalaType: "สระและอักขระ อ ห"
    },
    2: { 
        day: "วันอังคาร", 
        rules: ["จฉชซฌญ", "ฎฏฐฑฒณ", "ตถทธน", "บปผฝพฟภม", "ยรลว", "ศษสหฬฮ", "อห", "กขคฆง"],
        kala: "กขคฆง",
        kalaType: "อักขระ"
    },
    3: { 
        day: "วันพุธ (กลางวัน)", 
        rules: ["ฎฏฐฑฒณ", "ตถทธน", "บปผฝพฟภม", "ยรลว", "ศษสหฬฮ", "อห", "กขคฆง", "จฉชซฌญ"],
        kala: "จฉชซฌญ",
        kalaType: "อักขระ"
    },
    4: { 
        day: "วันพฤหัสบดี", 
        rules: ["ตถทธน", "บปผฝพฟภม", "ยรลว", "ศษสหฬฮ", "อห", "กขคฆง", "จฉชซฌญ", "ฎฏฐฑฒณ"],
        kala: "ฎฏฐฑฒณ",
        kalaType: "อักขระ"
    },
    5: { 
        day: "วันศุกร์", 
        rules: ["บปผฝพฟภม", "ยรลว", "ศษสหฬฮ", "อห", "กขคฆง", "จฉชซฌญ", "ฎฏฐฑฒณ", "ตถทธน"],
        kala: "ตถทธน",
        kalaType: "อักขระ"
    },
    6: { 
        day: "วันเสาร์", 
        rules: ["ยรลว", "ศษสหฬฮ", "อห", "กขคฆง", "จฉชซฌญ", "ฎฏฐฑฒณ", "ตถทธน", "บปผฝพฟภม"],
        kala: "บปผฝพฟภม",
        kalaType: "อักขระ"
    },
    7: { 
        day: "วันพุธ (กลางคืน/ราหู)", 
        rules: ["ศษสหฬฮ", "อห", "กขคฆง", "จฉชซฌญ", "ฎฏฐฑฒณ", "ตถทธน", "บปผฝพฟภม", "ยรลว"],
        kala: "ยรลว",
        kalaType: "อักขระ"
    },
};

const TAKSA_NAMES = ["บริวาร (ผู้คนรอบตัว)", "อายุ (สุขภาพ)", "เดช (อำนาจ/บารมี)", "ศรี (สิริมงคล/โชคลาภ)", "มูละ (ทรัพย์สิน/การเงิน)", "อุตสาหะ (ความพยายาม/ผลสำเร็จ)", "มนตรี (ผู้อุปถัมภ์/ผู้ใหญ่)", "กาลกิณี (อับโชค/ความขัดแย้ง)"];


function getDayOfWeek(date) {
    const dayIndex = date.getDay(); // 0 (Sun) - 6 (Sat)
    const hour = date.getHours();

    // กฎพิเศษสำหรับวันพุธกลางคืน (ราหู)
    if (dayIndex === 3) { // Wednesday
        if (hour >= 18) return 7; // Wednesday Night (Rahu: 18:00 - 23:59)
        return 3; // Wednesday Day (00:00 - 17:59)
    }
    
    return dayIndex; 
}

function analyzeTaksā(birthDate, name, surname) {
    // ปรับชื่อให้เป็นอักษรไทยล้วน
    const fullName = (name + surname).replace(/\s+/g, '');
    const birthDayIndex = getDayOfWeek(birthDate);
    const taksaData = TAKSA_RULES[birthDayIndex];
    
    let kalaCharacters = [];
    let characterBreakdown = {};

    if (!taksaData) {
        return { error: 'ไม่สามารถระบุหลักทักษาได้', day: 'ไม่ทราบ' };
    }

    const kalaSet = taksaData.kala;
    const allChars = [];
    
    for (const char of fullName) {
        let category = 'ไม่จัดประเภท';
        let isKala = false;
        
        // 1. ตรวจสอบ กาลกิณี (Kala)
        if (kalaSet.includes(char)) {
            kalaCharacters.push(char);
            category = 'กาลกิณี';
            isKala = true;
        } 
        
        // 2. ตรวจสอบหมวดหมู่อื่นๆ (บริวาร, ศรี, ฯลฯ)
        if (!isKala) {
            for(let i=0; i<taksaData.rules.length; i++) {
                if (taksaData.rules[i].includes(char)) {
                    category = TAKSA_NAMES[i];
                    break;
                }
            }
            // หากไม่ใช่ตัวอักษรใดเลย (เช่น วรรณยุกต์/สระ ที่อยู่นอกชุดตัวอย่าง)
            if (category === 'ไม่จัดประเภท' && taksaData.vowels && taksaData.vowels.includes(char)) {
                 if (birthDayIndex === 0) { // สระคือ บริวาร วันอาทิตย์
                    category = TAKSA_NAMES[0];
                } else if (birthDayIndex === 1) { // สระคือ กาลกิณี วันจันทร์
                    if (char !== 'เ' && char !== 'แ' && char !== 'โ' && char !== 'ไ' && char !== 'ใ') { 
                        isKala = true;
                        kalaCharacters.push(char);
                        category = 'กาลกิณี';
                    } else {
                         isKala = true;
                         kalaCharacters.push(char);
                         category = 'กาลกิณี';
                    }
                } else {
                    category = 'สระ/วรรณยุกต์';
                }
            } else if (category === 'ไม่จัดประเภท') {
                category = 'สระ/วรรณยุกต์';
            }
        }
        
        if (!characterBreakdown[category]) {
            characterBreakdown[category] = [];
        }
        characterBreakdown[category].push(char);
    }
    
    return {
        day: taksaData.day,
        birthDayIndex: birthDayIndex,
        kalaCharacters: kalaCharacters,
        isKala: kalaCharacters.length > 0,
        breakdown: characterBreakdown
    };
}


// ==============================================
// 🔮 ฟังก์ชันทำนายชื่อ-นามสกุล (หลักเลขศาสตร์)
// ==============================================

// ตารางเลขศาสตร์ (Numerology Table)
const THAI_NUMEROLOGY_VALUES = {
    // 1: ก, ด, ถ, ท, ภ, อ, สระ-อะ, สระ-อา, ไม้หันอากาศ, 
    'ก': 1, 'ด': 1, 'ถ': 1, 'ท': 1, 'ภ': 1, 'อ': 1, 'ะ': 1, 'า': 1, 'ั': 6, 'ำ': 1, 'ฤ': 1,
    // 2: ข, ช, บ, ป, ง, สระ-เอ, สระ-แอ, สระ-ใอ, สระ-ไอ, วรรณยุกต์-่, วรรณยุกต์-้, วรรณยุกต์-๊, วรรณยุกต์-๋
    'ข': 2, 'ช': 2, 'บ': 2, 'ป': 2, 'ง': 2, 'เ': 2, 'แ': 2, 'ใ': 2, 'ไ': 2, '่': 2, '้': 2, '๊': 2, '๋': 2,
    // 3: จ, ร, ย, ว, สระ-อี, สระ-อึ, สระ-อือ, สระ-โอ
    'จ': 3, 'ร': 3, 'ย': 3, 'ว': 3, 'ี': 3, 'ึ': 3, 'ื': 3, 'โ': 5,
    // 4: ต, น, ธ, ซ, ศ, ษ, ณ, ฒ, สระ-อุ, สระ-อู, ไม้ไต่คู้, ตัวการันต์
    'ต': 4, 'น': 4, 'ธ': 4, 'ซ': 4, 'ศ': 4, 'ษ': 4, 'ณ': 4, 'ฒ': 4, 'ุ': 4, 'ู': 4, '็': 4, '์': 0, 'ฯ': 0, ' ': 0,
    // 5: ฆ, ค, ฉ, ฑ, ม, ห, ฮ, สระ-โอ
    'ฆ': 5, 'ค': 5, 'ฉ': 5, 'ฑ': 5, 'ม': 5, 'ห': 5, 'ฮ': 5,
    // 6: ผ, พ, ฝ, ฟ, ภ, ม, ย, ศ, ส
    'ผ': 6, 'พ': 6, 'ฝ': 6, 'ฟ': 6, 'ม': 6, 'ย': 6, 'ศ': 6, 'ส': 6,
    // 7: ซ, ฐ, ฑ, ฒ, ร, ิ
    'ซ': 7, 'ฐ': 7, 'ฑ': 7, 'ฒ': 7, 'ร': 7, 'ิ': 4,
    // 8: ซ, ศ, ส, ห
    'ซ': 8, 'ศ': 8, 'ส': 8, 'ห': 8,
    // 9: ฎ, ฐ, ธ, ป, ผ, ฝ, พ, ฟ, ภ, ร, ล, ว, ศ, ส, ห, อ, ฮ, สระ-อี, สระ-อือ, สระ-อึ
    'ฎ': 9, 'ฐ': 9, 'ธ': 9, 'ป': 9, 'ผ': 9, 'ฝ': 9, 'พ': 9, 'ฟ': 9, 'ภ': 9, 'ร': 9, 'ล': 9, 'ว': 9, 'ศ': 9, 'ส': 9, 'ห': 9, 'อ': 9, 'ฮ': 9, 'เ': 9, 'แ': 9, 'โ': 9, 'ไ': 9, 'ใ': 9
    // *หมายเหตุ: การคำนวณเลขศาสตร์มีหลายตำรา บางอักษรอาจมีค่าแตกต่างกัน
};


// คำทำนายผลรวมเลขศาสตร์ (ตัวอย่างเลข 19 - 30)
const NUMEROLOGY_MEANINGS = {
    19: { title: "19: ดาวจันทร์คู่ดาวอาทิตย์ (ความสำเร็จสูง)", detail: "เป็นเลขดีมาก มักนำมาซึ่งความสำเร็จ โชคลาภ และตำแหน่งหน้าที่การงานที่สูงส่ง มักได้รับการช่วยเหลือจากผู้ใหญ่และมีไหวพริบดีเยี่ยม" },
    22: { title: "22: จันทร์คู่ (ความอ่อนไหว/ขาดความแน่นอน)", detail: "เป็นเลขที่ไม่ดี มักประสบปัญหาในชีวิตคู่ การเงินไม่มั่นคง มีอุปสรรคเข้ามาบ่อยครั้ง อาจต้องเผชิญกับความผิดหวังซ้ำ ๆ" },
    24: { title: "24: โชคลาภและความอุดมสมบูรณ์", detail: "เป็นเลขดีมาก มักมีชีวิตที่สุขสบาย มีคู่ครองที่ดี มีความมั่งคั่งและสมบูรณ์พูนสุข แต่บางครั้งขาดความกระตือรือร้น" },
    29: { title: "29: ความก้าวหน้าอย่างรวดเร็ว (ความสามารถรอบด้าน)", detail: "เป็นเลขดีมาก มีความสามารถรอบด้าน ฉลาดหลักแหลม มักได้รับการสนับสนุนจากผู้ใหญ่ ทำให้ประสบความสำเร็จในหน้าที่การงานอย่างรวดเร็ว" },
    // สำหรับเลขอื่น ๆ จะใช้การทำนายพื้นฐาน
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
    const birthdateInput = document.getElementById('birthdate-input'); // ดึงวันเกิด
    const resultDiv = document.getElementById('numerology-result');
    
    const name = nameInput.value;
    const surname = surnameInput.value;
    const dateValue = birthdateInput.value;

    // *** 1. ตรวจสอบ CAPTCHA ***
    if (typeof grecaptcha !== 'undefined') {
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            resultDiv.innerHTML = '<p style="color:red; font-weight:bold;">❌ กรุณาทำเครื่องหมายที่ช่อง "ฉันไม่ใช่โปรแกรมอัตโนมัติ" ก่อนทำนาย</p>';
            return;
        }
        grecaptcha.reset(); // รีเซ็ต CAPTCHA หลังการตรวจสอบ
    }
    // *** สิ้นสุดการตรวจสอบ CAPTCHA ***

    if (!name && !surname) {
        resultDiv.innerHTML = '<p style="color:red;">⚠️ กรุณาป้อนชื่อและ/หรือนามสกุล (ภาษาไทย)</p>';
        return;
    }

    if (!dateValue) {
        resultDiv.innerHTML = '<p style="color:red;">⚠️ กรุณาป้อนวันเกิดของคุณในส่วนด้านบนก่อนทำนายหลักทักษา</p>';
        return;
    }

    // เตรียมวันเกิดสำหรับ ทักษา
    const parts = dateValue.split('-'); 
    let year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; 
    const day = parseInt(parts[2]);

    const currentCEYear = new Date().getFullYear(); 

    if (year > currentCEYear + 10) { 
        year = year - 543; // แปลง พ.ศ. เป็น ค.ศ.
    }
    
    const birthDate = new Date(year, month, day);

    if (isNaN(birthDate.getTime())) {
        resultDiv.innerHTML = '<p style="color:red;">⚠️ รูปแบบวันที่ไม่ถูกต้อง</p>';
        return;
    }


    // 2. คำนวณเลขศาสตร์
    const nameSum = getNumerologySum(name);
    const surnameSum = getNumerologySum(surname);
    const totalSum = nameSum + surnameSum;

    const meaning = NUMEROLOGY_MEANINGS[totalSum] || { 
        title: `เลข ${totalSum}: คำทำนายโดยรวม`, 
        detail: `ผลรวมเลขศาสตร์ ${totalSum} เป็นการบ่งชี้ถึงแนวโน้มชีวิต ควรตรวจสอบความหมายของเลขนี้เพิ่มเติมตามตำราที่เชื่อถือ` 
    };
    
    let singleSum = totalSum;
    if (singleSum > 9) {
        singleSum = (totalSum - 1) % 9 + 1; // ลดทอนเป็นเลข 1-9
    }


    // 3. วิเคราะห์โหราศาสตร์ (ทักษา)
    const taksaResult = analyzeTaksā(birthDate, name, surname);
    
    let taksaHtml = ``;
    if (taksaResult.isKala) {
        taksaHtml += `<p style="color:#e74c3c; font-weight:bold;">❌ คำเตือน: ชื่อนี้มีอักขระกาลกิณี (${taksaResult.kalaCharacters.join(', ')})</p>`;
        taksaHtml += `<p style="font-size: 0.9em;">(อักขระที่ห้ามใช้ตามหลักทักษาสำหรับคนเกิด${taksaResult.day})</p>`;
    } else {
        taksaHtml += `<p style="color:#28a745; font-weight:bold;">✅ ชื่อนี้ไม่มีอักขระกาลกิณี</p>`;
    }

    // 4. การวิเคราะห์อักษร
    let breakdownHtml = `<h4>การวิเคราะห์อักษร (ตามหลักทักษา):</h4>`;
    breakdownHtml += `<ul style="list-style-type: none; padding-left: 0;">`;
    
    const displayOrder = TAKSA_NAMES.slice(0, 7).concat(['กาลกิณี', 'สระ/วรรณยุกต์', 'ไม่จัดประเภท']);

    displayOrder.forEach(category => {
        if (taksaResult.breakdown[category]) {
            const chars = taksaResult.breakdown[category].join(', ');
            let color = '#34495e';
            if (category === 'กาลกิณี') color = '#e74c3c';
            if (category === TAKSA_NAMES[3]) color = '#28a745'; // ศรี
            
            breakdownHtml += `<li><span style="color:${color}; font-weight:bold;">${category}:</span> ${chars}</li>`;
        }
    });

    breakdownHtml += `</ul>`;


    // 5. แสดงผลลัพธ์
    resultDiv.innerHTML = `
        <h3>📜 ผลการทำนายชื่อ-นามสกุล (แบบสมบูรณ์)</h3>
        
        <div class="result-box numerology-meaning" style="border-left-color: ${taksaResult.isKala ? '#e74c3c' : '#28a745'};">
            <h4>🌟 โหราศาสตร์ (หลักทักษา) - สำหรับคนเกิด${taksaResult.day}:</h4>
            ${taksaHtml}
        </div>

        <div class="result-box numerology-result-total">
            <h4>✨ เลขศาสตร์ (ผลรวมชื่อ+นามสกุล): <span style="font-size: 1.5em; color: #e74c3c;">${totalSum}</span></h4>
            <p><strong>ผลรวมเลขเดี่ยว:</strong> ${singleSum} (ใช้ทำนายแนวโน้มชีวิต)</p>
            <p><strong>คำทำนาย:</strong> ${meaning.title}</p>
            <p style="font-size: 0.9em;">${meaning.detail}</p>
        </div>

        <div class="result-box numerology-breakdown">
            ${breakdownHtml}
        </div>
    `;
};


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
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
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
    const minutes = document.getElementById('timer-minutes') ? document.getElementById('timer-minutes').value : 5;
    const seconds = document.getElementById('timer-seconds') ? document.getElementById('timer-seconds').value : 0;
    
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
