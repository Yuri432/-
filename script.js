// script.js - ฉบับสมบูรณ์ (รวมทุกฟังก์ชัน)

// =================================================================
// 1. DATA (ข้อมูลหลัก)
// =================================================================

// ข้อมูลสำหรับ Converter: Currency (อัตราแลกเปลี่ยนจำลอง)
const exchangeRates = {
    THB: { USD: 0.028, EUR: 0.025, JPY: 4.1, THB: 1 },
    USD: { THB: 35.7, EUR: 0.92, JPY: 147.2, USD: 1 },
    EUR: { THB: 38.8, USD: 1.08, JPY: 159.4, EUR: 1 },
    JPY: { THB: 0.24, USD: 0.0068, EUR: 0.0063, JPY: 1 }
};

// ข้อมูลสำหรับ Converter: Unit (ฐานเมตร)
const unitConversions = {
    km: 1000,
    m: 1,
    cm: 0.01
};

// ข้อมูลสำหรับ World Clock: เวลาหลักทั่วโลก
const requestedWorldClocks = [
    { name: "อัฟกานิสถาน (Kabul)", timeZone: "Asia/Kabul" },
    { name: "ออสเตรเลีย (Sydney)", timeZone: "Australia/Sydney" }, 
    { name: "บราซิล (Sao Paulo)", timeZone: "America/Sao_Paulo" }, 
    { name: "แคนาดา (Toronto)", timeZone: "America/Toronto" }, 
    { name: "จีน (Shanghai)", timeZone: "Asia/Shanghai" },
    { name: "ฝรั่งเศส (Paris)", timeZone: "Europe/Paris" },
    { name: "เยอรมนี (Berlin)", timeZone: "Europe/Berlin" },
    { name: "อินเดีย (Kolkata)", timeZone: "Asia/Kolkata" },
    { name: "อินโดนีเซีย (Jakarta)", timeZone: "Asia/Jakarta" },
    { name: "ญี่ปุ่น (Tokyo)", timeZone: "Asia/Tokyo" },
    { name: "เกาหลีใต้ (Seoul)", timeZone: "Asia/Seoul" },
    { name: "มาเลเซีย (Kuala Lumpur)", timeZone: "Asia/Kuala_Lumpur" },
    { name: "นิวซีแลนด์ (Auckland)", timeZone: "Pacific/Auckland" },
    { name: "ฟิลิปปินส์ (Manila)", timeZone: "Asia/Manila" },
    { name: "รัสเซีย (Moscow)", timeZone: "Europe/Moscow" },
    { name: "สิงคโปร์ (Singapore)", timeZone: "Asia/Singapore" },
    { name: "แอฟริกาใต้ (Johannesburg)", timeZone: "Africa/Johannesburg" },
    { name: "สเปน (Madrid)", timeZone: "Europe/Madrid" },
    { name: "ไทย (Bangkok)", timeZone: "Asia/Bangkok" },
    { name: "สหรัฐอเมริกา (New York)", timeZone: "America/New_York" },
    { name: "สหราชอาณาจักร (London)", timeZone: "Europe/London" },
];
const worldClocks = requestedWorldClocks.sort((a, b) => a.name.localeCompare(b.name));
let clockInterval; 

// ข้อมูลสำหรับ Personal Info: Numerology (เลขศาสตร์)
// ข้อมูลการให้ค่าตัวเลขตามหลักเลขศาสตร์สำหรับอักขระไทย (จำลอง)
const numerologyMap = {
    'ก': 1, 'ด': 1, 'ถ': 1, 'ท': 1, 'ภ': 1, 'ฤ': 1,
    'ข': 2, 'ช': 2, 'บ': 2, 'ป': 2, 'ง': 2, 'เ': 2,
    'จ': 3, 'ร': 3, 'ล': 3, 'ว': 3,
    'ค': 4, 'ธ': 4, 'ญ': 4, 'ฑ': 4, 'ฒ': 4, 'ม': 4, 'ห': 4,
    'น': 5, 'ย': 5, 'ศ': 5, 'ษ': 5, 'ส': 5, 'ฆ': 5, 'ฬ': 5, 'ฮ': 5,
    'ต': 6, 'ผ': 6, 'พ': 6, 'ฝ': 6,
    'ซ': 7, 'ซี': 7, 'อ': 7, 'โ': 7, 'ใ': 7, 'ไ': 7,
    'ฉ': 8, 'ล': 8, 'ฟ': 8, 'ฏ': 8, 'ฎ': 8, 'ะ': 8, 'า': 8, 'ำ': 8,
    'ั': 1, 'ิ': 1, 'ี': 1, 'ุ': 1, 'ู': 1, '่': 1, '้': 1, '๊': 1, '๋': 1, '์': 1,
    'ๆ': 1, 'ฯ': 1, 'ํ': 1
};


// ข้อมูลสำหรับ Quiz Game: คำถาม 30 ข้อ
const originalQuizQuestions = [
    { question: "แม่น้ำที่ยาวที่สุดในโลกคือแม่น้ำใด?", options: ["แอมะซอน", "ไนล์", "แยงซี", "มิสซิสซิปปี"], answer: "ไนล์" },
    { question: "สิ่งมีชีวิตชนิดใดที่มีเซลล์สมองมากที่สุด?", options: ["ปลาวาฬ", "มนุษย์", "ช้าง", "โลมา"], answer: "ปลาวาฬ" },
    { question: "แสงเดินทางเร็วแค่ไหน (กิโลเมตรต่อวินาที)?", options: ["150,000", "299,792", "380,000", "450,000"], answer: "299,792" },
    { question: "ดาวเคราะห์ดวงใดในระบบสุริยะที่ร้อนที่สุด?", options: ["ดาวพุธ", "ดาวศุกร์", "ดาวอังคาร", "ดาวยูเรนัส"], answer: "ดาวศุกร์" },
    { question: "ใครเป็นผู้คิดค้นทฤษฎีสัมพัทธภาพ?", options: ["ไอแซค นิวตัน", "อัลเบิร์ต ไอน์สไตน์", "กาลิเลโอ กาลิเลอี", "สตีเฟน ฮอว์คิง"], answer: "อัลเบิร์ต ไอน์สไตน์" },
    
    { question: "ประเทศใดมีจำนวนประชากรมากที่สุดในโลก?", options: ["อินเดีย", "จีน", "สหรัฐอเมริกา", "อินโดนีเซีย"], answer: "อินเดีย" },
    { question: "องค์ประกอบทางเคมีที่เบาที่สุดคืออะไร?", options: ["ออกซิเจน", "คาร์บอน", "ไฮโดรเจน", "ฮีเลียม"], answer: "ไฮโดรเจน" },
    { question: "กีฬาโอลิมปิกสมัยใหม่เริ่มขึ้นในปีใด?", options: ["1896", "1900", "1924", "1948"], answer: "1896" },
    { question: "หัวใจมนุษย์มีกี่ห้อง?", options: ["2", "3", "4", "5"], answer: "4" },
    { question: "ใครวาดภาพ 'Mona Lisa'?", options: ["แวน โก๊ะ", "ปิกัสโซ่", "เลโอนาร์โด ดา วินชี", "มิเคลันเจโล"], answer: "เลโอนาร์โด ดา วินชี" },

    { question: "เมืองหลวงของประเทศแคนาดาคือที่ใด?", options: ["โตรอนโต", "แวนคูเวอร์", "มอนทรีออล", "ออตตาวา"], answer: "ออตตาวา" },
    { question: "ทวีปที่ใหญ่ที่สุดในโลกคือทวีปใด?", options: ["แอฟริกา", "ยุโรป", "เอเชีย", "อเมริกาเหนือ"], answer: "เอเชีย" },
    { question: "อวัยวะใดทำหน้าที่ปั๊มเลือดทั่วร่างกาย?", options: ["ปอด", "ตับ", "ไต", "หัวใจ"], answer: "หัวใจ" },
    { question: "อะไรคือหน่วยวัดความต้านทานไฟฟ้า?", options: ["แอมแปร์", "โวลต์", "โอห์ม", "วัตต์"], answer: "โอห์ม" },
    { question: "ใครเขียนบทละคร 'Romeo and Juliet'?", options: ["เชคสเปียร์", "เจน ออสติน", "ชาร์ลส์ ดิกคินส์", "มาร์ค ทเวน"], answer: "เชคสเปียร์" },
    
    { question: "น้ำเดือดที่อุณหภูมิเท่าไหร่ที่ระดับน้ำทะเล (เซลเซียส)?", options: ["90°C", "100°C", "110°C", "120°C"], answer: "100°C" },
    { question: "ธาตุที่มีสัญลักษณ์ 'Au' คืออะไร?", options: ["เงิน", "ทองคำ", "เหล็ก", "ทองแดง"], answer: "ทองคำ" },
    { question: "ปีแสงคือหน่วยวัดอะไร?", options: ["ความเร็ว", "ระยะทาง", "เวลา", "มวล"], answer: "ระยะทาง" },
    { question: "สัตว์เลี้ยงลูกด้วยนมชนิดใดที่บินได้?", options: ["นก", "ค้างคาว", "กระรอกบิน", "เพนกวิน"], answer: "ค้างคาว" },
    { question: "เมืองหลวงของประเทศอียิปต์คือที่ใด?", options: ["อเล็กซานเดรีย", "ลักซอร์", "ไคโร", "กิซ่า"], answer: "ไคโร" },
    
    { question: "ประเทศใดเป็นที่ตั้งของหอไอเฟล?", options: ["อิตาลี", "สเปน", "ฝรั่งเศส", "เยอรมนี"], answer: "ฝรั่งเศส" },
    { question: "ใครคือประธานาธิบดีคนแรกของสหรัฐอเมริกา?", options: ["โธมัส เจฟเฟอร์สัน", "จอห์น อดัมส์", "จอร์จ วอชิงตัน", "อับราฮัม ลินคอล์น"], answer: "จอร์จ วอชิงตัน" },
    { question: "ทะเลทรายที่ใหญ่ที่สุดในโลกคือที่ใด?", options: ["โกบี", "คาราฮารี", "ซาฮารา", "แอนตาร์กติก"], answer: "แอนตาร์กติก" },
    { question: "ปีใดที่มนุษย์เหยียบดวงจันทร์เป็นครั้งแรก?", options: ["1965", "1969", "1971", "1975"], answer: "1969" },
    { question: "อะไรคือพืชที่สามารถผลิตไฟฟ้าได้?", options: ["ต้นกระบองเพชร", "สาหร่าย", "ไม่สามารถผลิตได้", "ต้นไม้ทุกชนิด"], answer: "สาหร่าย" },

    { question: "การปฏิวัติอุตสาหกรรมเริ่มขึ้นในประเทศใด?", options: ["ฝรั่งเศส", "สหรัฐอเมริกา", "เยอรมนี", "สหราชอาณาจักร"], answer: "สหราชอาณาจักร" },
    { question: "แบคทีเรียถูกค้นพบโดยใคร?", options: ["หลุยส์ ปาสเตอร์", "โรเบิร์ต คอค", "แอนโทนี ฟาน เลเวนฮุก", "ชาลส์ ดาร์วิน"], answer: "แอนโทนี ฟาน เลเวนฮุก" },
    { question: "สีผสมหลักในการพิมพ์ (CMYK) คืออะไรบ้าง?", options: ["แดง เขียว น้ำเงิน ดำ", "ฟ้า ม่วง เหลือง ดำ", "แดง เหลือง น้ำเงิน", "ไซอัน มาเจนต้า เหลือง ดำ"], answer: "ไซอัน มาเจนต้า เหลือง ดำ" },
    { question: "สนามบินที่วุ่นวายที่สุดในโลก (วัดจากผู้โดยสาร) คือที่ไหน?", options: ["ปักกิ่ง", "แอตแลนตา", "ลอนดอน ฮีทโธรว์", "ดูไบ"], answer: "แอตแลนตา" },
    { question: "สิ่งมีชีวิตที่ถูกเรียกว่า 'ราชาแห่งสัตว์' คืออะไร?", options: ["เสือ", "หมี", "สิงโต", "จระเข้"], answer: "สิงโต" }
];
let quizQuestions = []; // Array ที่ใช้เก็บ 10 ข้อที่ถูกสุ่มมาในแต่ละรอบ
let currentQuestionIndex = 0;
let score = 0;
let quizTimer;
let startTime;
const TIME_LIMIT = 60; // 60 วินาที

// =================================================================
// 2. AUTHENTICATION FUNCTIONS (Login, Register, Logout)
// =================================================================

function handleLogin() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const message = document.getElementById('login-message');

    const username = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!username || !password) {
        message.textContent = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', username);
        message.textContent = 'เข้าสู่ระบบสำเร็จ! กำลังนำทาง...';
        message.style.color = '#2ecc71';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        message.textContent = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
        message.style.color = '#e74c3c';
    }
}

function handleRegister() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const confirmPassword = document.getElementById('reg-confirm-password').value.trim();
    const message = document.getElementById('register-message');

    if (!username || !password || !confirmPassword) {
        message.textContent = 'กรุณากรอกข้อมูลให้ครบถ้วน';
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
        return;
    }

    if (password.length < 6) {
        message.textContent = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.username === username)) {
        message.textContent = 'ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว กรุณาเลือกชื่ออื่น';
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    message.textContent = 'ลงทะเบียนสำเร็จ! กำลังนำไปหน้าล็อกอิน...';
    message.style.color = '#2ecc71';

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem('loggedInUser');
    alert('ออกจากระบบสำเร็จ');
    window.location.href = 'login.html';
}

function loadAuthButton() {
    const nav = document.querySelector('header nav');
    const isLoggedIn = localStorage.getItem('loggedInUser');

    // ลบปุ่มเดิมออกก่อน (ถ้ามี)
    let existingButton = document.getElementById('auth-button');
    if (existingButton) {
        existingButton.remove();
    }

    const authButton = document.createElement('a');
    authButton.id = 'auth-button';

    if (isLoggedIn) {
        authButton.href = '#';
        authButton.textContent = '➡️ Log Out';
        authButton.onclick = handleLogout;
        authButton.style.backgroundColor = '#e74c3c'; // สีแดง
    } else {
        // ไม่แสดงปุ่มบนหน้า Login/Register เพื่อป้องกันการซ้ำซ้อน
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
            return;
        }
        authButton.href = 'login.html';
        authButton.textContent = '✅ Log In';
        authButton.style.backgroundColor = '#1abc9c'; // สีเขียว
    }

    if (nav) {
        nav.appendChild(authButton);
    }
    
    // อัปเดตข้อความต้อนรับ
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        welcomeMessage.innerHTML = isLoggedIn 
            ? `👋 ยินดีต้อนรับกลับ ${isLoggedIn}!` 
            : `👋 ยินดีต้อนรับสู่ MyToolbox`;
    }
}

// =================================================================
// 3. PERSONAL INFO & NUMEROLOGY FUNCTIONS
// =================================================================

function parseBirthdate(dateString) {
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;

    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    // แปลง พ.ศ. ให้เป็น ค.ศ. หากปีมากกว่า 2500 (สมมติว่าเป็นปี พ.ศ.)
    if (year > 2500) {
        year -= 543;
    }

    if (isNaN(day) || isNaN(month) || isNaN(year) || 
        day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
        return null;
    }

    // สร้าง Date object
    const date = new Date(year, month - 1, day);

    // ตรวจสอบความถูกต้องของวัน-เดือน-ปี เช่น 30 ก.พ.
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        return null;
    }

    return date;
}

function calculateZodiacSign(birthdate) {
    const birthMonth = birthdate.getMonth(); // 0-11
    const birthDay = birthdate.getDate();

    const zodiacSigns = [
        { name: "มังกร (Capricorn)", start: [1, 20] }, { name: "กุมภ์ (Aquarius)", start: [2, 19] },
        { name: "มีน (Pisces)", start: [3, 21] }, { name: "เมษ (Aries)", start: [4, 20] },
        { name: "พฤษภ (Taurus)", start: [5, 21] }, { name: "เมถุน (Gemini)", start: [6, 21] },
        { name: "กรกฎ (Cancer)", start: [7, 23] }, { name: "สิงห์ (Leo)", start: [8, 23] },
        { name: "กันย์ (Virgo)", start: [9, 23] }, { name: "ตุลย์ (Libra)", start: [10, 23] },
        { name: "พิจิก (Scorpio)", start: [11, 22] }, { name: "ธนู (Sagittarius)", start: [12, 22] }
    ];

    let zodiac = "ไม่พบราศี";

    for (let i = 0; i < zodiacSigns.length; i++) {
        const sign = zodiacSigns[i];
        const nextSign = zodiacSigns[(i + 1) % zodiacSigns.length];
        
        const startMonth = sign.start[0];
        const startDay = sign.start[1];
        
        // Month + 1 เนื่องจาก getMonth() คืนค่า 0-11
        const currentMonth = birthMonth + 1;

        if (currentMonth === startMonth && birthDay >= startDay) {
            zodiac = sign.name;
            break;
        }
        
        // สำหรับราศีที่ข้ามปี (มังกร ธนู)
        if (currentMonth === (nextSign.start[0] - 1 + 12) % 12 + 1 && birthDay < nextSign.start[1]) {
            zodiac = sign.name;
            break;
        }
    }
    
    // แก้ไขขอบเขตธนู/มังกร (เนื่องจากวนลูปไม่ครอบคลุมช่วงสิ้นปี)
    if (birthMonth === 11 && birthDay >= 22) { zodiac = "ธนู (Sagittarius)"; }
    if (birthMonth === 0 && birthDay < 20) { zodiac = "มังกร (Capricorn)"; }

    return zodiac;
}

function calculatePersonalInfo() {
    const dateString = document.getElementById('birthdate-input').value.trim();
    const resultDiv = document.getElementById('personal-result');
    resultDiv.innerHTML = '';
    
    const birthdate = parseBirthdate(dateString);

    if (!birthdate) {
        resultDiv.innerHTML = '<p style="color:red;">❌ รูปแบบวันเดือนปีเกิดไม่ถูกต้อง หรือไม่สมเหตุสมผล (ใช้ DD/MM/YYYY หรือ DD/MM/BBBB)</p>';
        return;
    }

    const now = new Date();
    const birthYear = birthdate.getFullYear();
    const birthMonth = birthdate.getMonth();
    const birthDay = birthdate.getDate();
    
    let age = now.getFullYear() - birthYear;
    let months = now.getMonth() - birthMonth;
    let days = now.getDate() - birthDay;

    // ปรับวันและเดือน
    if (days < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
    }
    if (months < 0) {
        age--;
        months += 12;
    }

    const zodiac = calculateZodiacSign(birthdate);

    // นับวันถึงวันเกิดถัดไป
    let nextBirthday = new Date(now.getFullYear(), birthMonth, birthDay);
    if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    const diffTime = Math.abs(nextBirthday.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // การแสดงผล
    const birthdateAD = birthdate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const birthdateBE = (birthYear + 543) + '/' + (birthMonth + 1).toString().padStart(2, '0') + '/' + birthDay.toString().padStart(2, '0');

    resultDiv.innerHTML = `
        <h3>🎉 ผลการคำนวณข้อมูลวันเกิด</h3>
        <p><strong>วันเกิด (ค.ศ.):</strong> ${birthdateAD} (${birthdateBE} พ.ศ.)</p>
        <p><strong>อายุ:</strong> **${age}** ปี ${months} เดือน ${days} วัน</p>
        <p><strong>ราศี (ตะวันตก):</strong> 🌟 **${zodiac}**</p>
        <p style="color: #27ae60;">เหลืออีก **${diffDays}** วัน จนกว่าจะถึงวันเกิดครั้งหน้าของคุณ!</p>
    `;
}

function calculateNameValue(text) {
    let total = 0;
    const cleanText = text.replace(/\s+/g, '').toUpperCase();

    for (let char of cleanText) {
        const value = numerologyMap[char];
        if (value !== undefined) {
            total += value;
        }
    }
    return total;
}

function calculateNumerology() {
    const name = document.getElementById('name-input').value.trim();
    const surname = document.getElementById('surname-input').value.trim();
    const resultDiv = document.getElementById('numerology-result');
    resultDiv.innerHTML = '';
    
    if (!name && !surname) {
        resultDiv.innerHTML = '<p style="color:red;">❌ กรุณากรอกชื่อ หรือ นามสกุล เพื่อทำนายเลขศาสตร์</p>';
        return;
    }

    let nameTotal = calculateNameValue(name);
    let surnameTotal = calculateNameValue(surname);
    let grandTotal = nameTotal + surnameTotal;
    
    let resultHtml = '<h3>🔮 ผลทำนายเลขศาสตร์เบื้องต้น (ผลรวม)</h3>';

    if (name) {
        resultHtml += `<p><strong>ชื่อ: ${name}</strong> (ผลรวม: **${nameTotal}**)</p>`;
    }
    if (surname) {
        resultHtml += `<p><strong>นามสกุล: ${surname}</strong> (ผลรวม: **${surnameTotal}**)</p>`;
    }
    if (name && surname) {
         resultHtml += `<p style="font-size: 1.2em; color: #e67e22;"><strong>ผลรวมทั้งหมด (ชื่อ-นามสกุล):</strong> **${grandTotal}**</p>`;
    }
    
    resultHtml += `<p style="font-size: 0.9em; color: #2ecc71;">* ผลรวมที่ได้นี้เป็นเพียงการคำนวณตามหลักเลขศาสตร์เบื้องต้น</p>`;
    
    resultDiv.innerHTML = resultHtml;
}

// =================================================================
// 4. WORLD CLOCK FUNCTIONS
// =================================================================

function getThaiZodiacSign(date) {
    const signs = [
        { name: "เมษ", start: [4, 13] }, { name: "พฤษภ", start: [5, 14] },
        { name: "เมถุน", start: [6, 14] }, { name: "กรกฎ", start: [7, 15] },
        { name: "สิงห์", start: [8, 15] }, { name: "กันย์", start: [9, 15] },
        { name: "ตุล", start: [10, 15] }, { name: "พิจิก", start: [11, 14] },
        { name: "ธนู", start: [12, 14] }, { name: "มังกร", start: [1, 14] },
        { name: "กุมภ์", start: [2, 13] }, { name: "มีน", start: [3, 14] }
    ];

    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (let i = 0; i < signs.length; i++) {
        const sign = signs[i];
        if (month === sign.start[0] && day >= sign.start[1]) {
            return sign.name;
        }
    }
    // หากไม่เข้าเงื่อนไขใดเลย แสดงว่าเป็นราศีของเดือนถัดไปที่ยังไม่ถึงวันเริ่มต้น
    const currentSignIndex = signs.findIndex(s => s.start[0] === month);
    if (currentSignIndex === -1) return "ไม่ทราบราศี"; // should not happen

    const previousSignIndex = (currentSignIndex - 1 + signs.length) % signs.length;
    return signs[previousSignIndex].name;
}

function displayTimeDifference() {
    const thaiTimeZone = 'Asia/Bangkok';
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();

    const getOffset = (timeZone) => {
        const dateString = now.toLocaleString('en-US', { timeZone: timeZone, timeZoneName: 'shortOffset' });
        const match = dateString.match(/GMT([+-]\d+)/);
        if (match) return parseInt(match[1], 10);
        return null;
    };

    const thaiHours = getOffset(thaiTimeZone);
    const localHours = getOffset(localTimeZone);
    const differenceDiv = document.getElementById('time-difference');

    let diffText = 'ไม่สามารถคำนวณความแตกต่างของเวลาได้';
    
    if (thaiHours !== null && localHours !== null) {
        const diffHours = thaiHours - localHours;

        if (diffHours === 0) {
            diffText = `⏰ เวลาท้องถิ่นของคุณ (${localTimeZone}) ตรงกับเวลาในประเทศไทย (UTC+0${thaiHours})`;
        } else if (diffHours > 0) {
            diffText = `⏰ เวลาท้องถิ่นของคุณ (${localTimeZone}) **ช้ากว่า** เวลาในประเทศไทย (${thaiTimeZone}) อยู่ **${Math.abs(diffHours)}** ชั่วโมง`;
        } else {
            diffText = `⏰ เวลาท้องถิ่นของคุณ (${localTimeZone}) **เร็วกว่า** เวลาในประเทศไทย (${thaiTimeZone}) อยู่ **${Math.abs(diffHours)}** ชั่วโมง`;
        }
    }

    if (differenceDiv) {
        differenceDiv.innerHTML = `<p>${diffText}</p>`;
    }
}

function updateCurrentZodiac() {
    const now = new Date();
    const thaiZodiac = getThaiZodiacSign(now);

    const currentZodiacDiv = document.getElementById('current-zodiac');
    if (currentZodiacDiv) {
        currentZodiacDiv.innerHTML = `<p>✨ **ราศีปัจจุบันในประเทศไทย (สุริยคติ):** **${thaiZodiac}**</p>`;
    }
}

function updateAllClocks() {
    const now = new Date();
    const container = document.getElementById('clock-display-container');
    if (!container) return; 

    worldClocks.forEach(clockData => {
        const timeZone = clockData.timeZone;
        const clockElement = document.getElementById(`clock-${timeZone.replace(/\//g, '-')}`);

        if (clockElement) {
            try {
                const dateOptions = {
                    timeZone: timeZone,
                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                    hourCycle: 'h23'
                };
                const displayOptions = {
                    timeZone: timeZone,
                    year: 'numeric', month: 'short', day: 'numeric',
                };

                const timeString = now.toLocaleTimeString('th-TH', dateOptions);
                const dateString = now.toLocaleDateString('th-TH', displayOptions);
                
                // ตรวจสอบว่าเป็นกลางคืนหรือไม่ (20:00 - 05:59)
                const targetTime = new Date(now.toLocaleString("en-US", { timeZone: timeZone }));
                const targetHours = targetTime.getHours();
                const isNight = (targetHours >= 20 || targetHours < 6);

                clockElement.querySelector('.time').textContent = timeString;
                clockElement.querySelector('.date-display').textContent = dateString;
                
                if (isNight) {
                    clockElement.classList.add('night-mode');
                } else {
                    clockElement.classList.remove('night-mode');
                }

            } catch (error) {
                clockElement.querySelector('.time').textContent = 'Error';
                clockElement.querySelector('.date-display').textContent = 'Error';
                console.error(`Error updating clock for ${timeZone}:`, error);
            }
        }
    });
}

function initializeWorldClock() {
    const container = document.getElementById('clock-display-container');
    if (!container) return; 

    if (clockInterval) {
        clearInterval(clockInterval);
    }

    container.innerHTML = ''; 

    // สร้าง Header
    const headerRow = document.createElement('div');
    headerRow.className = 'clock-table-header';
    headerRow.innerHTML = `
        <div class="header-name">ประเทศ</div>
        <div class="header-time">เวลา</div>
        <div class="header-date">วันที่</div>
    `;
    container.appendChild(headerRow);

    // สร้างแถวนาฬิกา
    worldClocks.forEach(clockData => {
        const clockDiv = document.createElement('div');
        clockDiv.className = 'clock-row'; 
        clockDiv.id = `clock-${clockData.timeZone.replace(/\//g, '-')}`; 
        clockDiv.innerHTML = `
            <div class="clock-name">${clockData.name}</div>
            <div class="time">--:--:--</div>
            <div class="date-display">--/--/----</div>
        `;
        container.appendChild(clockDiv);
    });

    // เริ่มอัปเดต
    updateAllClocks();
    clockInterval = setInterval(updateAllClocks, 1000);
    
    displayTimeDifference();
    updateCurrentZodiac();
}

// =================================================================
// 5. CONVERTER FUNCTIONS
// =================================================================

function populateCurrencyOptions() {
    const fromSelect = document.getElementById('currency-from');
    const toSelect = document.getElementById('currency-to');
    
    if (!fromSelect || !toSelect) return;

    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    const currencies = [
        { code: 'THB', name: 'THB - บาทไทย' },
        { code: 'USD', name: 'USD - ดอลลาร์สหรัฐ' },
        { code: 'EUR', name: 'EUR - ยูโร' },
        { code: 'JPY', name: 'JPY - เยนญี่ปุ่น' }
    ];

    currencies.forEach(currency => {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency.code;
        optionFrom.textContent = currency.name;
        fromSelect.appendChild(optionFrom);

        const optionTo = optionFrom.cloneNode(true);
        toSelect.appendChild(optionTo);
    });
    
    fromSelect.value = 'THB';
    toSelect.value = 'USD';
}

function showConverterSection(type) {
    document.querySelectorAll('.converter-section').forEach(section => {
        section.style.display = 'none';
    });
    document.querySelectorAll('.converter-tabs button').forEach(button => {
        button.style.backgroundColor = 'var(--border-color)';
        button.style.color = 'var(--text-color)';
    });

    const selectedSection = document.getElementById(`${type}-section`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        document.querySelector(`.converter-tabs button[onclick*="'${type}'"]`).style.backgroundColor = 'var(--primary-color)';
        document.querySelector(`.converter-tabs button[onclick*="'${type}'"]`).style.color = 'white';
    }
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('currency-amount').value);
    const from = document.getElementById('currency-from').value;
    const to = document.getElementById('currency-to').value;
    const resultDiv = document.getElementById('currency-result');

    if (isNaN(amount) || amount <= 0) {
        resultDiv.innerHTML = '<p style="color:red;">❌ กรุณากรอกจำนวนเงินที่ถูกต้อง</p>';
        return;
    }

    if (!exchangeRates[from] || !exchangeRates[from][to]) {
        resultDiv.innerHTML = '<p style="color:red;">❌ ไม่พบอัตราแลกเปลี่ยนสำหรับคู่สกุลเงินนี้ (เป็นอัตราจำลอง)</p>';
        return;
    }

    const rate = exchangeRates[from][to];
    const result = amount * rate;

    resultDiv.innerHTML = `
        <p><strong>ผลลัพธ์:</strong></p>
        <p style="font-size: 1.5em; font-weight: bold; color: #3498db;">${amount.toFixed(2)} ${from} = **${result.toFixed(2)} ${to}**</p>
        <p style="font-size: 0.9em;">อัตราแลกเปลี่ยน (จำลอง): 1 ${from} = ${rate.toFixed(4)} ${to}</p>
    `;
}

function convertUnit() {
    const amount = parseFloat(document.getElementById('unit-amount').value);
    const fromUnit = document.getElementById('unit-from').value;
    const toUnit = document.getElementById('unit-to').value;
    const resultDiv = document.getElementById('unit-result');

    if (isNaN(amount) || amount < 0) {
        resultDiv.innerHTML = '<p style="color:red;">❌ กรุณากรอกจำนวนที่ถูกต้อง</p>';
        return;
    }

    const fromFactor = unitConversions[fromUnit];
    const toFactor = unitConversions[toUnit];

    if (!fromFactor || !toFactor) {
        resultDiv.innerHTML = '<p style="color:red;">❌ ไม่รองรับหน่วยวัดนี้</p>';
        return;
    }

    const valueInMeters = amount * fromFactor;
    const result = valueInMeters / toFactor;

    resultDiv.innerHTML = `
        <p><strong>ผลลัพธ์:</strong></p>
        <p style="font-size: 1.5em; font-weight: bold; color: #3498db;">${amount} ${fromUnit} = **${result.toFixed(3)} ${toUnit}**</p>
        <p style="font-size: 0.9em;">การคำนวณ: (${amount} * ${fromFactor}) / ${toFactor}</p>
    `;
}

function convertBase() {
    const input = document.getElementById('base-input').value.trim();
    const fromBase = parseInt(document.getElementById('base-from').value);
    const toBase = parseInt(document.getElementById('base-to').value);
    const resultDiv = document.getElementById('base-result');

    if (input === "") {
        resultDiv.innerHTML = '<p style="color:red;">❌ กรุณาป้อนตัวเลข</p>';
        return;
    }

    let decimalValue;
    try {
        decimalValue = parseInt(input, fromBase);
        if (isNaN(decimalValue)) {
            throw new Error("Invalid input for base");
        }
    } catch (e) {
        resultDiv.innerHTML = '<p style="color:red;">❌ รูปแบบตัวเลขไม่ถูกต้องสำหรับเลขฐานที่เลือก</p>';
        return;
    }

    const result = decimalValue.toString(toBase).toUpperCase();

    const tutorialHtml = `
        <div class="conversion-tutorial-box">
            <h4>📈 วิธีคำนวณ</h4>
            <div class="tutorial-step">
                1. แปลงจากฐาน **${fromBase}** เป็นฐาน 10 (Decimal): **${decimalValue}**
            </div>
            <div class="tutorial-step">
                2. แปลงจากฐาน 10 (Decimal) เป็นฐาน **${toBase}**
            </div>
        </div>
    `;

    resultDiv.innerHTML = `
        <p><strong>ผลลัพธ์:</strong></p>
        <p style="font-size: 1.5em; font-weight: bold; color: #3498db;">(${input})${fromBase} = **(${result})${toBase}**</p>
        ${tutorialHtml}
    `;
}

function initializeConverter() {
    populateCurrencyOptions();
    showConverterSection('currency');
}

// =================================================================
// 6. QUIZ GAME FUNCTIONS
// =================================================================

// Utility function: Fisher-Yates shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function saveScore(username, score, time) {
    let leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
    const date = new Date().toLocaleDateString('th-TH');

    leaderboard.push({ username, score, time, date });

    // เรียงตามคะแนนมากไปน้อย ถ้าคะแนนเท่ากันเรียงตามเวลาที่ใช้น้อยไปมาก
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.time - b.time;
    });

    // เก็บแค่ 10 อันดับแรก
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('quizLeaderboard', JSON.stringify(leaderboard));
}

function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (leaderboard.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">ยังไม่มีสถิติคะแนน</td></tr>';
        return;
    }

    leaderboard.forEach((record, index) => {
        const row = tbody.insertRow();
        row.insertCell().textContent = index + 1;
        row.insertCell().textContent = record.username;
        row.insertCell().textContent = `${record.score} / ${quizQuestions.length > 0 ? quizQuestions.length : 10}`;
        row.insertCell().textContent = `${record.time} วินาที`;
        row.insertCell().textContent = record.date;
    });
}

function showQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        endQuiz();
        return;
    }

    const q = quizQuestions[currentQuestionIndex];
    document.getElementById('quiz-question').textContent = `คำถามที่ ${currentQuestionIndex + 1}: ${q.question}`;
    document.getElementById('quiz-score').textContent = `คะแนน: ${score} / ${quizQuestions.length}`;

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    const shuffledOptions = shuffleArray([...q.options]);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'quiz-option-btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(option, q.answer, button);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedOption, correctAnswer, button) {
    document.querySelectorAll('.quiz-option-btn').forEach(btn => btn.disabled = true);

    if (selectedOption === correctAnswer) {
        score++;
        button.style.backgroundColor = '#2ecc71'; // Correct: Green
        button.style.color = 'white';
    } else {
        button.style.backgroundColor = '#e74c3c'; // Wrong: Red
        button.style.color = 'white';
        // เน้นคำตอบที่ถูกต้อง
        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.style.border = '2px solid #2ecc71';
                btn.style.backgroundColor = '#d1e7dd';
                btn.style.color = '#0f5132';
            }
        });
    }

    document.getElementById('quiz-score').textContent = `คะแนน: ${score} / ${quizQuestions.length}`;

    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
        document.querySelectorAll('.quiz-option-btn').forEach(btn => btn.disabled = false);
    }, 1000);
}

function updateQuizTimerDisplay() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = TIME_LIMIT - elapsed;
    const timerDisplay = document.getElementById('quiz-timer');

    if (remaining <= 0) {
        timerDisplay.textContent = '⏳ เวลา: หมดเวลา!';
        endQuiz();
    } else {
        timerDisplay.textContent = `⏳ เวลา: ${remaining} วินาที`;
    }
}

function endQuiz() {
    clearInterval(quizTimer);
    const totalTime = TIME_LIMIT - Math.max(0, TIME_LIMIT - Math.floor((Date.now() - startTime) / 1000));
    const finalResultDiv = document.getElementById('quiz-final-result');
    const username = localStorage.getItem('loggedInUser') || 'Guest';

    document.getElementById('quiz-game-area').style.display = 'none';
    document.getElementById('quiz-result-area').style.display = 'block';

    finalResultDiv.innerHTML = `
        <h3>เกมจบลงแล้ว!</h3>
        <p style="font-size: 1.5em; color: #2ecc71; font-weight: bold;">คะแนนของคุณ: **${score}** / ${quizQuestions.length}</p>
        <p>ใช้เวลาไปทั้งหมด: **${totalTime}** วินาที</p>
        <p>บันทึกสถิติในชื่อ: **${username}**</p>
        <button onclick="startQuiz()" class="action-btn" style="margin-top: 20px;">เริ่มเกมใหม่</button>
    `;
    
    saveScore(username, score, totalTime);
    loadLeaderboard();
}

function startQuiz() {
    // 1. สุ่มคำถาม 10 ข้อ
    const shuffledQuestions = shuffleArray([...originalQuizQuestions]);
    quizQuestions = shuffledQuestions.slice(0, 10);
    
    // 2. รีเซ็ตค่าและแสดงหน้าจอ
    currentQuestionIndex = 0;
    score = 0;
    
    document.getElementById('quiz-start-area').style.display = 'none';
    document.getElementById('quiz-result-area').style.display = 'none';
    document.getElementById('quiz-game-area').style.display = 'block';

    // 3. เริ่ม Timer
    if (quizTimer) {
        clearInterval(quizTimer);
    }
    startTime = Date.now();
    updateQuizTimerDisplay();
    quizTimer = setInterval(updateQuizTimerDisplay, 1000);

    // 4. เริ่มคำถามแรก
    showQuestion();
}

function initializeQuiz() {
    const startButton = document.getElementById('quiz-start-btn');
    if (startButton) {
        startButton.onclick = startQuiz;
    }
    loadLeaderboard();
}


// =================================================================
// 7. INITIALIZATION (การเรียกใช้งานฟังก์ชันเมื่อโหลดหน้า)
// =================================================================

// กำหนดให้ฟังก์ชันสามารถเรียกใช้ได้จาก HTML โดยตรง (Global Scope)
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.calculatePersonalInfo = calculatePersonalInfo;
window.calculateNumerology = calculateNumerology;
window.showConverterSection = showConverterSection;
window.convertCurrency = convertCurrency;
window.convertUnit = convertUnit;
window.convertBase = convertBase;
window.startQuiz = startQuiz; // สำหรับปุ่มเริ่มเกมใหม่ในหน้า Quiz

document.addEventListener('DOMContentLoaded', () => {
    // 1. โหลดปุ่ม Login/Logout เสมอ
    loadAuthButton();

    // 2. เริ่มต้นฟังก์ชันตามหน้าที่ของแต่ละหน้า (โดยการตรวจหา Element หลัก)
    if (document.getElementById('world-clock')) {
        initializeWorldClock();
    }
    
    if (document.getElementById('converter-suite')) {
        initializeConverter();
    }
    
    if (document.getElementById('quiz')) {
        initializeQuiz();
    }
});
