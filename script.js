document.addEventListener('DOMContentLoaded', () => {
    // โหลดฟังก์ชันตามหน้าปัจจุบัน
    if (document.getElementById('personal-info')) {
        // initializePersonalInfo(); // ไม่มีฟังก์ชันเริ่มต้นที่จำเป็น
    } else if (document.getElementById('world-clock')) {
        initializeWorldClock();
    } else if (document.getElementById('converter-suite')) { 
        initializeConverter();
    } else if (document.getElementById('quiz')) {
        initializeQuiz();
    }
});


// ==============================================
// 1. PERSONAL INFO & NUMEROLOGY FUNCTIONS 
// (ไม่แสดงซ้ำ)
// ==============================================

function getZodiacSign(day, month) {
    if ((month === 4 && day >= 19) || (month === 5 && day <= 18)) return "ราศีเมษ (Aries) ♈";
    if ((month === 5 && day >= 19) || (month === 6 && day <= 18)) return "ราศีพฤษภ (Taurus) ♉";
    if ((month === 6 && day >= 19) || (month === 7 && day <= 19)) return "ราศีเมถุน (Gemini) ♊";
    if ((month === 7 && day >= 20) || (month === 8 && day <= 16)) return "ราศีกรกฎ (Cancer) ♋";
    if ((month === 8 && day >= 17) || (month === 9 && day <= 16)) return "ราศีสิงห์ (Leo) ♌";
    if ((month === 9 && day >= 17) || (month === 10 && day <= 16)) return "ราศีกันย์ (Virgo) ♍";
    if ((month === 10 && day >= 17) || (month === 11 && day <= 15)) return "ราศีตุลย์ (Libra) ♎";
    if ((month === 11 && day >= 16) || (month === 12 && day <= 15)) return "ราศีพิจิก (Scorpio) ♏";
    if ((month === 12 && day >= 16) || (month === 1 && day <= 14)) return "ราศีธนู (Sagittarius) ♐";
    if ((month === 1 && day >= 15) || (month === 2 && day <= 12)) return "ราศีมังกร (Capricorn) ♑";
    if ((month === 2 && day >= 13) || (month === 3 && day <= 14)) return "ราศีกุมภ์ (Aquarius) ♒";
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

    if (year > 2500) {
        year -= 543;
    }
    
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    if (birthDate > today) {
        resultDiv.innerHTML = '<p style="color:red;">วันเกิดไม่สามารถเป็นอนาคตได้ กรุณาตรวจสอบปี</p>';
        return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    let nextBirthday = new Date(today.getFullYear(), month - 1, day);
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const timeDiff = nextBirthday.getTime() - today.getTime();
    const daysUntilBirthday = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const zodiac = getZodiacSign(day, month);

    resultDiv.innerHTML = `
        <h3>✅ ผลการคำนวณข้อมูลส่วนบุคคล</h3>
        <p><strong>วันเกิดของคุณ:</strong> ${day} / ${month} / ${year + 543} (พ.ศ. ${year + 543})</p>
        <p><strong>ราศีของคุณ:</strong> ${zodiac}</p>
        <p><strong>อายุ:</strong> ${age} ปี</p>
        <p><strong>วันเกิดที่ใกล้จะถึง:</strong> เหลืออีก ${daysUntilBirthday} วัน</p>
    `;
}

const numerologyMap = {
    'ก': 1, 'ด': 1, 'ถ': 1, 'ภ': 1, 'ฤ': 1, 'า': 1,
    'ข': 2, 'ช': 2, 'บ': 2, 'ป': 2, 'ง': 2, 'ฝ': 2, 'แ': 2, 'ใ': 2, 'ไ': 2,
    'ค': 3, 'ต': 3, 'จ': 3, 'ร': 3, 'ว': 3, 'ษ': 3,
    'ฆ': 4, 'ฑ': 4, 'ธ': 4, 'น': 4, 'ย': 4, 'ศ': 4, 'ส': 4, 'ห': 4, 'ฬ': 4, 'อ': 4,
    'ต': 5, 'ฌ': 5, 'ณ': 5, 'ม': 5, 'ฮ': 5, 'เ': 5, 'โ': 5, 'ฯ': 5,
    'ฉ': 6, 'ท': 6, 'ผ': 6, 'พ': 6, 'ฟ': 6, 'ห': 6, 'อ': 6,
    'ซ': 7, 'ซี': 7, 'ญ': 7, 'ร': 7,
    'ฏ': 8, 'ฐ': 8, 'ย': 8, 'ล': 8, 'ว': 8,
    'ะ': 0, 'ิ': 0, 'ี': 0, 'ึ': 0, 'ื': 0, 'ุ': 0, 'ู': 0, '็': 0, '์': 0, 'ำ': 0, 'ๆ': 0
};

function getNumerologyValue(text) {
    if (!text) return 0;
    
    let total = 0;
    const cleanText = text.trim().toLowerCase();

    for (const char of cleanText) {
        if (numerologyMap[char] !== undefined) {
            total += numerologyMap[char];
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
// 2. WORLD CLOCK FUNCTIONS 
// (ไม่แสดงซ้ำ)
// ==============================================

const worldClocks = [
    { name: "ไทย (Bangkok)", timeZone: "Asia/Bangkok" },
    { name: "จีน (Shanghai)", timeZone: "Asia/Shanghai" },
    { name: "ญี่ปุ่น (Tokyo)", timeZone: "Asia/Tokyo" },
    { name: "เกาหลีใต้ (Seoul)", timeZone: "Asia/Seoul" },
    { name: "สหรัฐอเมริกา (New York)", timeZone: "America/New_York" },
    { name: "สหราชอาณาจักร (London)", timeZone: "Europe/London" },
];

let clockInterval;

function getThaiZodiacSign(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    return getZodiacSign(day, month); 
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
    
    const nowInBangkok = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
    const bangkokDate = new Date(nowInBangkok);
    const zodiac = getThaiZodiacSign(bangkokDate);
    
    zodiacDiv.textContent = `ราศีปัจจุบันในประเทศไทย: ${zodiac}`;
}


function initializeWorldClock() {
    const container = document.getElementById('clock-display-container');
    if (!container) return; 

    worldClocks.forEach(clockData => {
        const clockDiv = document.createElement('div');
        clockDiv.className = 'clock';
        clockDiv.id = `clock-${clockData.timeZone.replace(/\//g, '-')}`; 
        clockDiv.innerHTML = `
            <h2>${clockData.name}</h2>
            <div class="time">--:--:--</div>
            <div class="date-display">--/--/----</div>
        `;
        container.appendChild(clockDiv);
    });

    updateAllClocks();
    clockInterval = setInterval(updateAllClocks, 1000);
    
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
        
        const localHour = parseInt(new Intl.DateTimeFormat('th-TH', { 
            timeZone: clockData.timeZone, 
            hour: '2-digit', hourCycle: 'h23' 
        }).format(now));

        if (localHour >= 19 || localHour < 6) {
            clockElement.classList.add('night-mode');
        } else {
            clockElement.classList.remove('night-mode');
        }

        clockElement.querySelector('.time').textContent = timeString;
        clockElement.querySelector('.date-display').textContent = dateString;
    });

    updateCurrentZodiac();
}


// ==============================================
// 3. CONVERTER SUITE FUNCTIONS 
// ==============================================

const currencyRates = {
    // อัตราแลกเปลี่ยนเทียบกับ 1 USD (ค่าจำลอง)
    USD: 1.0,
    THB: 35.0,
    EUR: 0.92,
    JPY: 145.0,
    CNY: 7.2,
    GBP: 0.81
};

const unitConversionFactors = {
    // แปลงหน่วยความยาวเป็น เมตร (m)
    m: 1,
    km: 1000,
    cm: 0.01
};

function initializeConverter() {
    const fromSelect = document.getElementById('currency-from');
    const toSelect = document.getElementById('currency-to');
    
    if (fromSelect && toSelect) {
        for (const code in currencyRates) {
            const name = code;
            fromSelect.add(new Option(name, code));
            toSelect.add(new Option(name, code));
        }
        fromSelect.value = 'USD';
        toSelect.value = 'THB';
    }
    
    showConverterSection('currency');
}

function showConverterSection(type) {
    const sections = ['currency', 'unit', 'base'];
    sections.forEach(sec => {
        const element = document.getElementById(`${sec}-section`);
        if (element) {
            element.style.display = (sec === type) ? 'block' : 'none';
        }
    });
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('currency-amount').value);
    const from = document.getElementById('currency-from').value;
    const to = document.getElementById('currency-to').value;
    const resultDiv = document.getElementById('currency-result');

    if (isNaN(amount) || amount <= 0 || !currencyRates[from] || !currencyRates[to]) {
        resultDiv.innerHTML = '<p style="color:red;">กรุณาป้อนจำนวนเงินที่ถูกต้อง</p>';
        return;
    }

    const amountInUSD = amount / currencyRates[from];
    const finalAmount = amountInUSD * currencyRates[to];
    
    resultDiv.innerHTML = `
        <p><strong>ผลลัพธ์:</strong> ${amount.toLocaleString()} ${from} = 
        <strong>${finalAmount.toFixed(4).toLocaleString()} ${to}</strong></p>
    `;
}

function convertUnit() {
    const amount = parseFloat(document.getElementById('unit-amount').value);
    const from = document.getElementById('unit-from').value;
    const to = document.getElementById('unit-to').value;
    const resultDiv = document.getElementById('unit-result');

    if (isNaN(amount) || amount < 0 || !unitConversionFactors[from] || !unitConversionFactors[to]) {
        resultDiv.innerHTML = '<p style="color:red;">กรุณาป้อนจำนวนที่ถูกต้อง</p>';
        return;
    }

    const amountInMeter = amount * unitConversionFactors[from];
    const finalAmount = amountInMeter / unitConversionFactors[to];

    const unitNameMap = {
        m: 'เมตร', km: 'กิโลเมตร', cm: 'เซนติเมตร'
    };

    resultDiv.innerHTML = `
        <p><strong>ผลลัพธ์:</strong> ${amount.toLocaleString()} ${unitNameMap[from]} = 
        <strong>${finalAmount.toFixed(4).toLocaleString()} ${unitNameMap[to]}</strong></p>
    `;
}

function convertBase() {
    const inputStr = document.getElementById('base-input').value.trim();
    const fromBase = parseInt(document.getElementById('base-from').value);
    const toBase = parseInt(document.getElementById('base-to').value);
    const resultDiv = document.getElementById('base-result');
    let tutorialHTML = ''; 

    if (inputStr === "") {
        resultDiv.innerHTML = '<p style="color:red;">กรุณาป้อนตัวเลข</p>';
        return;
    }

    try {
        // ===========================================
        // ขั้นตอนที่ 1: แปลงจากฐานต้นทาง (N) ไปเป็นฐาน 10 (Decimal)
        // ===========================================
        let decimalValue = 0;
        let isDecimalValid = true;
        const digits = '0123456789ABCDEF';
        let conversionString = [];

        tutorialHTML += '<h4>ขั้นตอนที่ 1: แปลงจากฐาน ' + fromBase + ' เป็นฐาน 10</h4>';
        tutorialHTML += '<p>ใช้การกระจายพจน์ โดยคูณเลขแต่ละหลักด้วย ' + fromBase + ' ยกกำลังตำแหน่ง</p>';
        tutorialHTML += '<div class="tutorial-step">';

        for (let i = 0; i < inputStr.length; i++) {
            const char = inputStr[inputStr.length - 1 - i].toUpperCase(); 
            let value = digits.indexOf(char);

            if (value === -1 || value >= fromBase) {
                isDecimalValid = false;
                break;
            }

            const term = value * Math.pow(fromBase, i);
            decimalValue += term;

            let charDisplay = (fromBase === 16 && value >= 10) ? char : value;

            conversionString.unshift(`(${charDisplay} &times; ${fromBase}^{${i}})`);
        }

        if (!isDecimalValid) {
            resultDiv.innerHTML = '<p style="color:red;">รูปแบบตัวเลขฐานต้นทางไม่ถูกต้อง หรือตัวเลขเกินขอบเขตของฐาน ' + fromBase + '</p>';
            return;
        }

        tutorialHTML += '<p>' + conversionString.join(' + ') + '</p>';
        tutorialHTML += '<p>= ' + decimalValue + '</p></div>';
        
        
        // ===========================================
        // ขั้นตอนที่ 2: แปลงจากฐาน 10 เป็นฐานปลายทาง (M)
        // ===========================================
        const targetBase = toBase;
        const finalResult = decimalValue.toString(targetBase).toUpperCase();
        let currentDecimal = decimalValue;
        let remainderHistory = [];
        let finalResultReverse = [];

        tutorialHTML += '<h4>ขั้นตอนที่ 2: แปลงจากฐาน 10 เป็นฐาน ' + targetBase + '</h4>';
        tutorialHTML += '<p>ใช้การหารสั้นด้วยฐาน ' + targetBase + ' และเก็บเศษจากการหาร</p>';
        tutorialHTML += '<div class="tutorial-step">';
        
        if (targetBase !== 10) {
            if (currentDecimal === 0) {
                 tutorialHTML += '<p>0 / ' + targetBase + ' ได้เศษ 0</p>';
            }
            while (currentDecimal > 0) {
                const remainder = currentDecimal % targetBase;
                const nextQuotient = Math.floor(currentDecimal / targetBase);
                
                const remainderChar = digits[remainder]; 

                remainderHistory.push({
                    current: currentDecimal,
                    quotient: nextQuotient,
                    remainder: remainder,
                    char: remainderChar
                });
                
                finalResultReverse.push(remainderChar);
                currentDecimal = nextQuotient;
            }

            if (remainderHistory.length === 0 && decimalValue !== 0) {
                // Should not happen, but for safety
                finalResultReverse.push('0');
            } else if (decimalValue === 0) {
                 finalResultReverse.push('0');
            }

            remainderHistory.forEach(history => {
                tutorialHTML += `<p>${history.current} &divide; ${targetBase} = ${history.quotient} (เศษ ${history.remainder} หรือ ${history.char})</p>`;
            });
            
            tutorialHTML += '<p><strong>อ่านเศษจากล่างขึ้นบน:</strong> ' + finalResultReverse.reverse().join('') + '</p></div>';

        } else {
             tutorialHTML += `<p>ฐานปลายทางคือ 10 (Decimal) ดังนั้นค่าคือ ${decimalValue} ทันที</p></div>`;
        }

        // ===========================================
        // สรุปผลลัพธ์
        // ===========================================

        const baseDisplay = baseNameMap[targetBase];

        resultDiv.innerHTML = `
            <h3>✅ ผลลัพธ์: (${inputStr})<sub>${fromBase}</sub> = (${finalResult})<sub>${targetBase}</sub></h3>
            <div class="result-summary">
                <p><strong>ผลลัพธ์สุดท้าย:</strong> ${finalResult} (ฐาน ${targetBase} - ${baseDisplay})</p>
            </div>
            
            <div class="conversion-tutorial-box">
                <h4>📚 วิธีทำโดยละเอียด</h4>
                ${tutorialHTML}
            </div>
        `;
    } catch (e) {
        resultDiv.innerHTML = '<p style="color:red;">เกิดข้อผิดพลาดในการแปลง: ตรวจสอบตัวเลขและฐานให้ถูกต้อง</p>';
    }
}


// ==============================================
// 4. QUIZ GAME FUNCTIONS & LEADERBOARD 
// (ไม่แสดงซ้ำ)
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
    
    clearInterval(quizCountdownTimer);
    let timeLeft = TIME_LIMITS[q.difficulty];
    document.getElementById('quiz-timer').textContent = `⏳ เวลา: ${timeLeft} วินาที (${q.difficulty.toUpperCase()})`;
    
    quizCountdownTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('quiz-timer').textContent = `⏳ เวลา: ${timeLeft} วินาที (${q.difficulty.toUpperCase()})`;
        
        if (timeLeft <= 0) {
            clearInterval(quizCountdownTimer);
            handleAnswer(null); 
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
    optionsButtons.forEach(btn => btn.disabled = true); 

    if (selectedOption === correctAnswer) {
        score++;
        optionsButtons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.style.backgroundColor = '#2ecc71';
                btn.style.color = 'white';
            }
        });
    } else {
        optionsButtons.forEach(btn => {
            if (btn.textContent === selectedOption) {
                btn.style.backgroundColor = '#e74c3c';
                btn.style.color = 'white';
            }
            if (btn.textContent === correctAnswer) {
                btn.style.backgroundColor = '#f1c40f'; 
                btn.style.color = 'black';
            }
        });
    }
    
    document.getElementById('quiz-score').textContent = `คะแนน: ${score} / ${currentQuestionIndex + 1}`;

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
    
    promptForScore(score, totalTimeSeconds, timeFormat);
    
    document.getElementById('quiz-start-area').style.display = 'block';
    document.getElementById('quiz-start-btn').textContent = '▶️ เริ่มเกมใหม่';
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} นาที ${seconds} วินาที`;
}

function promptForScore(score, totalTimeSeconds, timeFormat) {
    const playerName = prompt("คุณทำคะแนนได้ดี! กรุณากรอกชื่อย่อเพื่อบันทึกสถิติ (3-10 ตัวอักษร):") || 'Anon';
    
    saveScore(score, totalTimeSeconds, timeFormat, playerName.substring(0, 10)); 
}

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
    
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score; 
        }
        return a.timeSeconds - b.timeSeconds; 
    });

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
