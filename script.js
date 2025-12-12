// ==============================================
// 1. LOGIN & AUTHENTICATION FUNCTIONS
// ==============================================

// เรียกใช้งานฟังก์ชันเมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    // โหลดปุ่ม Login/Logout ใน Header
    loadAuthButton();

    // เรียกใช้งานฟังก์ชันเริ่มต้นตามหน้า
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

// ตรวจสอบและแสดงปุ่ม Log In/Out
function loadAuthButton() {
    const nav = document.querySelector('header nav');
    if (!nav) return;

    // ล้างปุ่มเดิมก่อน
    let existingButton = nav.querySelector('#auth-button');
    if (existingButton) {
        existingButton.remove();
    }

    const isLoggedIn = localStorage.getItem('loggedInUser');
    const authButton = document.createElement('a');
    authButton.id = 'auth-button';

    if (isLoggedIn) {
        authButton.href = '#';
        authButton.textContent = '➡️ Log Out';
        authButton.onclick = handleLogout;
        authButton.style.backgroundColor = '#e74c3c'; // สีแดง
    } else {
        // เฉพาะหน้าหลักเท่านั้นที่จะแสดงปุ่ม Log In ได้ถ้ายังไม่ได้ล็อกอิน
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
            return;
        }
        authButton.href = 'login.html';
        authButton.textContent = '✅ Log In';
        authButton.style.backgroundColor = '#1abc9c'; // สีเขียว
    }

    nav.appendChild(authButton);
}

// ฟังก์ชัน Log In
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

    // ดึงข้อมูลผู้ใช้จาก Local Storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // ล็อกอินสำเร็จ
        localStorage.setItem('loggedInUser', username);
        message.textContent = 'เข้าสู่ระบบสำเร็จ! กำลังนำทาง...';
        message.style.color = 'green';
        
        // หน่วงเวลา 1 วินาทีแล้วเปลี่ยนหน้า
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        message.textContent = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    }
}

// ฟังก์ชัน Log Out
function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem('loggedInUser');
    alert('ออกจากระบบสำเร็จ');
    // นำทางไปหน้า Login
    window.location.href = 'login.html';
}

// ฟังก์ชัน Register
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

    // ลงทะเบียนสำเร็จ
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    message.textContent = 'ลงทะเบียนสำเร็จ! กำลังนำไปหน้าล็อกอิน...';
    message.style.color = 'green';

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}


// ==============================================
// 2. PERSONAL INFO & NUMEROLOGY FUNCTIONS 
// ==============================================

function parseBirthdate(dateString) {
    // รูปแบบที่รองรับ: DD/MM/YYYY หรือ DD/MM/BBBB
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;

    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    // ถ้าปีเป็น พ.ศ. (มากกว่า 2500) ให้แปลงเป็น ค.ศ.
    if (year > 2500) {
        year -= 543;
    }

    // ตรวจสอบความถูกต้องเบื้องต้น (เช่น วันที่ต้องอยู่ในช่วง 1-31, เดือน 1-12)
    if (isNaN(day) || isNaN(month) || isNaN(year) || 
        day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
        return null;
    }

    // สร้างวัตถุ Date (ใช้เดือน - 1 เพราะ JavaScript นับเดือน 0-11)
    const date = new Date(year, month - 1, day);

    // ตรวจสอบว่าวันที่สร้างขึ้นถูกต้องตามที่กรอกหรือไม่ (เช่น 30 ก.พ. จะถูกแปลงเป็น 1 มี.ค.)
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        return null; // วันที่กรอกไม่สมเหตุสมผล (เช่น 30 กุมภาพันธ์)
    }

    return date;
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
    
    // 1. คำนวณอายุ
    let age = now.getFullYear() - birthYear;
    let months = now.getMonth() - birthMonth;
    let days = now.getDate() - birthDay;

    if (days < 0) {
        months--;
        // คำนวณจำนวนวันในเดือนที่แล้ว
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
    }
    
    if (months < 0) {
        age--;
        months += 12;
    }

    // 2. คำนวณราศี (โหราศาสตร์ตะวันตก)
    const zodiacSigns = [
        { name: "มังกร (Capricorn)", start: [1, 20] }, { name: "กุมภ์ (Aquarius)", start: [2, 19] },
        { name: "มีน (Pisces)", start: [3, 21] }, { name: "เมษ (Aries)", start: [4, 20] },
        { name: "พฤษภ (Taurus)", start: [5, 21] }, { name: "เมถุน (Gemini)", start: [6, 21] },
        { name: "กรกฎ (Cancer)", start: [7, 23] }, { name: "สิงห์ (Leo)", start: [8, 23] },
        { name: "กันย์ (Virgo)", start: [9, 23] }, { name: "ตุลย์ (Libra)", start: [10, 23] },
        { name: "พิจิก (Scorpio)", start: [11, 22] }, { name: "ธนู (Sagittarius)", start: [12, 22] }
    ];

    let zodiac = "";
    for (let i = 0; i < zodiacSigns.length; i++) {
        const nextIndex = (i + 1) % zodiacSigns.length;
        const startDay = zodiacSigns[i].start[1];
        const startMonth = zodiacSigns[i].start[0];
        const endDay = zodiacSigns[nextIndex].start[1] - 1; // สิ้นสุดก่อนเริ่มราศีถัดไป 1 วัน
        const endMonth = zodiacSigns[nextIndex].start[0];

        if (birthMonth + 1 === startMonth && birthDay >= startDay) {
             zodiac = zodiacSigns[i].name;
             break;
        } else if (birthMonth + 1 === endMonth && birthDay <= endDay) {
            zodiac = zodiacSigns[i].name;
            break;
        } else if (birthMonth + 1 === startMonth -1 && startMonth === 1) { // กรณีธนูข้ามปี
             if (birthDay >= startDay) {
                zodiac = zodiacSigns[i].name;
                break;
            }
        }
    }
    if (!zodiac) {
         // กรณีข้ามปี (มังกร/ธนู)
         if (birthMonth + 1 === 12 && birthDay >= 22) {
             zodiac = "ธนู (Sagittarius)";
         } else if (birthMonth + 1 === 1 && birthDay < 20) {
             zodiac = "มังกร (Capricorn)";
         }
    }


    // 3. วันที่เหลือจนถึงวันเกิดหน้า
    let nextBirthday = new Date(now.getFullYear(), birthMonth, birthDay);
    if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    const diffTime = Math.abs(nextBirthday.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
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

// ข้อมูลค่าตัวอักษรสำหรับเลขศาสตร์/ทักษา
const numerologyMap = {
    // ฐาน 1
    'ก': 1, 'ด': 1, 'ถ': 1, 'ท': 1, 'ภ': 1, 'ฤ': 1,
    // ฐาน 2
    'ข': 2, 'ช': 2, 'บ': 2, 'ป': 2, 'ง': 2, 'เ': 2,
    // ฐาน 3
    'จ': 3, 'ร': 3, 'ล': 3, 'ว': 3,
    // ฐาน 4
    'ค': 4, 'ธ': 4, 'ญ': 4, 'ฑ': 4, 'ฒ': 4, 'ม': 4, 'ห': 4,
    // ฐาน 5
    'น': 5, 'ย': 5, 'ศ': 5, 'ษ': 5, 'ส': 5, 'ฆ': 5, 'ฬ': 5, 'ฮ': 5,
    // ฐาน 6
    'ต': 6, 'ผ': 6, 'พ': 6, 'ฝ': 6,
    // ฐาน 7
    'ซ': 7, 'ซี': 7, 'อ': 7, 'โ': 7, 'ใ': 7, 'ไ': 7,
    // ฐาน 8
    'ฉ': 8, 'ล': 8, 'ฟ': 8, 'ห': 8, 'ฏ': 8, 'ฎ': 8, 'ษ': 8, 'ะ': 8, 'า': 8, 'ำ': 8,
    // สระและวรรณยุกต์ (ค่า 1)
    'ั': 1, 'ิ': 1, 'ี': 1, 'ุ': 1, 'ู': 1, 'เ': 2, 'แ': 2, 'โ': 7, 'ใ': 7, 'ไ': 7,
    '็': 1, '์': 1, '่': 1, '้': 2, '๊': 3, '๋': 4, 'ๆ': 1, 'ฯ': 1, // ค่าสระและวรรณยุกต์อาจต่างกันตามตำรา
    // ให้ค่าสระและวรรณยุกต์เป็น 1 เพื่อให้ผลรวมง่ายต่อการตรวจสอบ
    'ะ': 1, 'า': 1, 'ำ': 1, 'ิ': 1, 'ี': 1, 'ึ': 1, 'ื': 1, 'ุ': 1, 'ู': 1, 'เ': 1, 'แ': 1, 'โ': 1, 'ใ': 1, 'ไ': 1,
    'ๆ': 1, 'ฯ': 1, 'ํ': 1,
    '่': 1, '้': 1, '๊': 1, '๋': 1, '์': 1
};


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
         resultHtml += `<p style="font-size: 0.9em; color: #2ecc71;">* ผลรวมที่ได้นี้เป็นเพียงการคำนวณตามหลักเลขศาสตร์เบื้องต้น ไม่ควรนำไปใช้ตัดสินใจโดยเด็ดขาด</p>`;
    } else {
        resultHtml += `<p style="font-size: 0.9em; color: #2ecc71;">* ผลรวมที่ได้นี้เป็นเพียงการคำนวณตามหลักเลขศาสตร์เบื้องต้น</p>`;
    }
    
    resultDiv.innerHTML = resultHtml;
}

function calculateNameValue(text) {
    let total = 0;
    const cleanText = text.replace(/\s+/g, '').toUpperCase(); // ลบช่องว่างและแปลงเป็นตัวพิมพ์ใหญ่

    for (let char of cleanText) {
        const value = numerologyMap[char];
        if (value !== undefined) {
            total += value;
        } else if (char.match(/[A-Z0-9]/i)) {
             // ถ้าเป็นอักขระที่ไม่ใช่ภาษาไทย (อาจต้องข้ามหรือกำหนดค่าเพิ่มเติม)
        }
    }
    return total;
}

// ==============================================
// 3. WORLD CLOCK FUNCTIONS 
// ==============================================

// ข้อมูลนาฬิกาโลกสำหรับประเทศที่ร้องขอ (ใช้เขตเวลาหลักที่สุด)
const requestedWorldClocks = [
    { name: "อัฟกานิสถาน (Kabul)", timeZone: "Asia/Kabul" },
    { name: "แอลเบเนีย (Tirana)", timeZone: "Europe/Tirana" },
    { name: "แอลจีเรีย (Algiers)", timeZone: "Africa/Algiers" },
    { name: "อันดอร์รา (Andorra la Vella)", timeZone: "Europe/Andorra" },
    { name: "แองโกลา (Luanda)", timeZone: "Africa/Luanda" },
    { name: "แอนติกาและบาร์บูดา (St. John's)", timeZone: "America/Antigua" },
    { name: "อาร์เจนตินา (Buenos Aires)", timeZone: "America/Argentina/Buenos_Aires" },
    { name: "อาร์เมเนีย (Yerevan)", timeZone: "Asia/Yerevan" },
    { name: "ออสเตรเลีย (Sydney) - E", timeZone: "Australia/Sydney" }, 
    { name: "ออสเตรีย (Vienna)", timeZone: "Europe/Vienna" },
    { name: "อาเซอร์ไบจาน (Baku)", timeZone: "Asia/Baku" },
    { name: "บาฮามาส (Nassau)", timeZone: "America/Nassau" },
    { name: "บาห์เรน (Manama)", timeZone: "Asia/Bahrain" },
    { name: "บังกลาเทศ (Dhaka)", timeZone: "Asia/Dhaka" },
    { name: "บาร์เบโดส (Bridgetown)", timeZone: "America/Barbados" },
    { name: "เบลารุส (Minsk)", timeZone: "Europe/Minsk" },
    { name: "เบลเยียม (Brussels)", timeZone: "Europe/Brussels" },
    { name: "เบลีซ (Belmopan)", timeZone: "America/Belize" },
    { name: "เบนิน (Porto-Novo)", timeZone: "Africa/Porto-Novo" },
    { name: "ภูฏาน (Thimphu)", timeZone: "Asia/Thimphu" },
    { name: "โบลิเวีย (La Paz)", timeZone: "America/La_Paz" },
    { name: "บอสเนียและเฮอร์เซโกวีนา (Sarajevo)", timeZone: "Europe/Sarajevo" },
    { name: "บอตสวานา (Gaborone)", timeZone: "Africa/Gaborone" },
    { name: "บราซิล (Sao Paulo) - E", timeZone: "America/Sao_Paulo" }, 
    { name: "บรูไน (Bandar Seri Begawan)", timeZone: "Asia/Brunei" },
    { name: "บัลแกเรีย (Sofia)", timeZone: "Europe/Sofia" },
    { name: "บูร์กินาฟาโซ (Ouagadougou)", timeZone: "Africa/Ouagadougou" },
    { name: "บุรุนดี (Bujumbura)", timeZone: "Africa/Bujumbura" },
    { name: "กัมพูชา (Phnom Penh)", timeZone: "Asia/Phnom_Penh" },
    { name: "แคเมอรูน (Yaounde)", timeZone: "Africa/Douala" },
    { name: "แคนาดา (Toronto) - E", timeZone: "America/Toronto" }, 
    { name: "เคปเวิร์ด (Praia)", timeZone: "Atlantic/Cape_Verde" },
    { name: "สาธารณรัฐแอฟริกากลาง (Bangui)", timeZone: "Africa/Bangui" },
    { name: "ชาด (N'Djamena)", timeZone: "Africa/Ndjamena" },
    { name: "ชิลี (Santiago)", timeZone: "America/Santiago" },
    { name: "จีน (Shanghai)", timeZone: "Asia/Shanghai" },
    { name: "โคลอมเบีย (Bogota)", timeZone: "America/Bogota" },
    { name: "คอโมโรส (Moroni)", timeZone: "Indian/Comoro" },
    { name: "คองโก (สาธารณรัฐประชาธิปไตย) - Kinshasa", timeZone: "Africa/Kinshasa" },
    { name: "คองโก (สาธารณรัฐ) - Brazzaville", timeZone: "Africa/Brazzaville" },
    { name: "คอสตาริกา (San Jose)", timeZone: "America/Costa_Rica" },
    { name: "โครเอเชีย (Zagreb)", timeZone: "Europe/Zagreb" },
    { name: "คิวบา (Havana)", timeZone: "America/Havana" },
    { name: "ไซปรัส (Nicosia)", timeZone: "Asia/Nicosia" },
    { name: "เช็กเกีย (Prague)", timeZone: "Europe/Prague" },
    { name: "เดนมาร์ก (Copenhagen)", timeZone: "Europe/Copenhagen" },
    { name: "จิบูตี (Djibouti)", timeZone: "Africa/Djibouti" },
    { name: "โดมินิกา (Roseau)", timeZone: "America/Dominica" },
    { name: "สาธารณรัฐโดมินิกัน (Santo Domingo)", timeZone: "America/Santo_Domingo" },
    { name: "ติมอร์-เลสเต (Dili)", timeZone: "Asia/Dili" },
    { name: "เอกวาดอร์ (Guayaquil)", timeZone: "America/Guayaquil" },
    { name: "อียิปต์ (Cairo)", timeZone: "Africa/Cairo" },
    { name: "เอลซัลวาดอร์ (San Salvador)", timeZone: "America/El_Salvador" },
    { name: "อิเควทอเรียลกินี (Malabo)", timeZone: "Africa/Malabo" },
    { name: "เอริเทรีย (Asmara)", timeZone: "Africa/Asmara" },
    { name: "เอสโตเนีย (Tallinn)", timeZone: "Europe/Tallinn" },
    { name: "เอสวาตีนี (Mbabane)", timeZone: "Africa/Mbabane" },
    { name: "เอธิโอเปีย (Addis Ababa)", timeZone: "Africa/Addis_Ababa" },
    { name: "ฟิจิ (Suva)", timeZone: "Pacific/Fiji" },
    { name: "ฟินแลนด์ (Helsinki)", timeZone: "Europe/Helsinki" },
    { name: "ฝรั่งเศส (Paris)", timeZone: "Europe/Paris" },
    { name: "กาบอง (Libreville)", timeZone: "Africa/Libreville" },
    { name: "แกมเบีย (Banjul)", timeZone: "Africa/Banjul" },
    { name: "จอร์เจีย (Tbilisi)", timeZone: "Asia/Tbilisi" },
    { name: "เยอรมนี (Berlin)", timeZone: "Europe/Berlin" },
    { name: "กานา (Accra)", timeZone: "Africa/Accra" },
    { name: "กรีซ (Athens)", timeZone: "Europe/Athens" },
    { name: "เกรเนดา (St. George's)", timeZone: "America/Grenada" },
    { name: "กัวเตมาลา (Guatemala City)", timeZone: "America/Guatemala" },
    { name: "กินี (Conakry)", timeZone: "Africa/Conakry" },
    { name: "กินี-บิสเซา (Bissau)", timeZone: "Africa/Bissau" },
    { name: "กายอานา (Georgetown)", timeZone: "America/Guyana" },
    { name: "เฮติ (Port-au-Prince)", timeZone: "America/Port-au-Prince" },
    { name: "ฮอนดูรัส (Tegucigalpa)", timeZone: "America/Tegucigalpa" },
    { name: "ฮังการี (Budapest)", timeZone: "Europe/Budapest" },
    { name: "ไอซ์แลนด์ (Reykjavik)", timeZone: "Atlantic/Reykjavik" },
    { name: "อินเดีย (Kolkata)", timeZone: "Asia/Kolkata" },
    { name: "อินโดนีเซีย (Jakarta) - W", timeZone: "Asia/Jakarta" },
    { name: "อิหร่าน (Tehran)", timeZone: "Asia/Tehran" },
    { name: "อิรัก (Baghdad)", timeZone: "Asia/Baghdad" },
    { name: "ไอร์แลนด์ (Dublin)", timeZone: "Europe/Dublin" },
    { name: "อิสราเอล (Jerusalem)", timeZone: "Asia/Jerusalem" },
    { name: "อิตาลี (Rome)", timeZone: "Europe/Rome" },
    { name: "จาเมกา (Kingston)", timeZone: "America/Jamaica" },
    { name: "ญี่ปุ่น (Tokyo)", timeZone: "Asia/Tokyo" },
    { name: "จอร์แดน (Amman)", timeZone: "Asia/Amman" },
    { name: "คาซัคสถาน (Almaty) - E", timeZone: "Asia/Almaty" },
    { name: "เคนยา (Nairobi)", timeZone: "Africa/Nairobi" },
    { name: "คิริบาส (Tarawa) - W", timeZone: "Pacific/Tarawa" },
    { name: "โคโซโว (Pristina)", timeZone: "Europe/Belgrade" },
    { name: "คูเวต (Kuwait)", timeZone: "Asia/Kuwait" },
    { name: "คีร์กีซสถาน (Bishkek)", timeZone: "Asia/Bishkek" },
    { name: "ลาว (Vientiane)", timeZone: "Asia/Vientiane" },
    { name: "ลัตเวีย (Riga)", timeZone: "Europe/Riga" },
    { name: "เลบานอน (Beirut)", timeZone: "Asia/Beirut" },
    { name: "เลโซโท (Maseru)", timeZone: "Africa/Maseru" },
    { name: "ไลบีเรีย (Monrovia)", timeZone: "Africa/Monrovia" },
    { name: "ลิเบีย (Tripoli)", timeZone: "Africa/Tripoli" },
    { name: "ลิกเตนสไตน์ (Vaduz)", timeZone: "Europe/Vaduz" },
    { name: "ลิทัวเนีย (Vilnius)", timeZone: "Europe/Vilnius" },
    { name: "ลักเซมเบิร์ก (Luxembourg)", timeZone: "Europe/Luxembourg" },
    { name: "มาดากัสการ์ (Antananarivo)", timeZone: "Indian/Antananarivo" },
    { name: "มาลาวี (Lilongwe)", timeZone: "Africa/Blantyre" },
    { name: "มาเลเซีย (Kuala Lumpur)", timeZone: "Asia/Kuala_Lumpur" },
    { name: "มัลดีฟส์ (Malé)", timeZone: "Indian/Maldives" },
    { name: "มาลี (Bamako)", timeZone: "Africa/Bamako" },
    { name: "มอลตา (Valletta)", timeZone: "Europe/Malta" },
    { name: "หมู่เกาะมาร์แชลล์ (Majuro)", timeZone: "Pacific/Majuro" },
    { name: "มอริเตเนีย (Nouakchott)", timeZone: "Africa/Nouakchott" },
    { name: "มอริเชียส (Port Louis)", timeZone: "Indian/Mauritius" },
    { name: "เม็กซิโก (Mexico City)", timeZone: "America/Mexico_City" },
    { name: "ไมโครนีเซีย (Pohnpei) - E", timeZone: "Pacific/Pohnpei" },
    { name: "มอลโดวา (Chisinau)", timeZone: "Europe/Chisinau" },
    { name: "โมนาโก (Monaco)", timeZone: "Europe/Monaco" },
    { name: "มองโกเลีย (Ulaanbaatar)", timeZone: "Asia/Ulaanbaatar" },
    { name: "มอนเตเนโกร (Podgorica)", timeZone: "Europe/Podgorica" },
    { name: "โมร็อกโก (Casablanca)", timeZone: "Africa/Casablanca" },
    { name: "โมซัมบิก (Maputo)", timeZone: "Africa/Maputo" },
    { name: "เมียนมา (Yangon)", timeZone: "Asia/Yangon" },
    { name: "นามิเบีย (Windhoek)", timeZone: "Africa/Windhoek" },
    { name: "นาอูรู (Yaren)", timeZone: "Pacific/Nauru" },
    { name: "เนปาล (Kathmandu)", timeZone: "Asia/Kathmandu" },
    { name: "เนเธอร์แลนด์ (Amsterdam)", timeZone: "Europe/Amsterdam" },
    { name: "นิวซีแลนด์ (Auckland)", timeZone: "Pacific/Auckland" },
    { name: "นิการากัว (Managua)", timeZone: "America/Managua" },
    { name: "ไนเจอร์ (Niamey)", timeZone: "Africa/Niamey" },
    { name: "ไนจีเรีย (Lagos)", timeZone: "Africa/Lagos" },
    { name: "นอร์เวย์ (Oslo)", timeZone: "Europe/Oslo" },
    { name: "โอมาน (Muscat)", timeZone: "Asia/Muscat" },
    { name: "ปากีสถาน (Karachi)", timeZone: "Asia/Karachi" },
    { name: "ปาเลา (Ngerulmud)", timeZone: "Pacific/Palau" },
    { name: "ปานามา (Panama City)", timeZone: "America/Panama" },
    { name: "ปาปัวนิวกินี (Port Moresby)", timeZone: "Pacific/Port_Moresby" },
    { name: "ปารากวัย (Asuncion)", timeZone: "America/Asuncion" },
    { name: "เปรู (Lima)", timeZone: "America/Lima" },
    { name: "ฟิลิปปินส์ (Manila)", timeZone: "Asia/Manila" },
    { name: "โปแลนด์ (Warsaw)", timeZone: "Europe/Warsaw" },
    { name: "โปรตุเกส (Lisbon)", timeZone: "Europe/Lisbon" },
    { name: "กาตาร์ (Doha)", timeZone: "Asia/Qatar" },
    { name: "โรมาเนีย (Bucharest)", timeZone: "Europe/Bucharest" },
    { name: "รัสเซีย (Moscow) - Zone 2", timeZone: "Europe/Moscow" },
    { name: "รวันดา (Kigali)", timeZone: "Africa/Kigali" },
    { name: "เซนต์คิตส์และเนวิส (Basseterre)", timeZone: "America/St_Kitts" },
    { name: "เซนต์ลูเซีย (Castries)", timeZone: "America/St_Lucia" },
    { name: "เซนต์วินเซนต์และเกรนาดีนส์ (Kingstown)", timeZone: "America/St_Vincent" },
    { name: "ซามัว (Apia)", timeZone: "Pacific/Apia" },
    { name: "ซานมารีโน (San Marino)", timeZone: "Europe/San_Marino" },
    { name: "เซาตูเมและปรินซิปี (Sao Tome)", timeZone: "Africa/Sao_Tome" },
    { name: "ซาอุดีอาระเบีย (Riyadh)", timeZone: "Asia/Riyadh" },
    { name: "เซเนกัล (Dakar)", timeZone: "Africa/Dakar" },
    { name: "เซอร์เบีย (Belgrade)", timeZone: "Europe/Belgrade" },
    { name: "เซเชลส์ (Victoria)", timeZone: "Indian/Mahe" },
    { name: "เซียร์ราลีโอน (Freetown)", timeZone: "Africa/Freetown" },
    { name: "สิงคโปร์ (Singapore)", timeZone: "Asia/Singapore" },
    { name: "สโลวาเกีย (Bratislava)", timeZone: "Europe/Bratislava" },
    { name: "สโลวีเนีย (Ljubljana)", timeZone: "Europe/Ljubljana" },
    { name: "หมู่เกาะโซโลมอน (Honiara)", timeZone: "Pacific/Guadalcanal" },
    { name: "โซมาเลีย (Mogadishu)", timeZone: "Africa/Mogadishu" },
    { name: "แอฟริกาใต้ (Johannesburg)", timeZone: "Africa/Johannesburg" },
    { name: "เกาหลีใต้ (Seoul)", timeZone: "Asia/Seoul" },
    { name: "ซูดานใต้ (Juba)", timeZone: "Africa/Juba" },
    { name: "สเปน (Madrid)", timeZone: "Europe/Madrid" },
    { name: "ศรีลังกา (Colombo)", timeZone: "Asia/Colombo" },
    { name: "ซูดาน (Khartoum)", timeZone: "Africa/Khartoum" },
    { name: "ซูรินาม (Paramaribo)", timeZone: "America/Paramaribo" },
    { name: "สวีเดน (Stockholm)", timeZone: "Europe/Stockholm" },
    { name: "สวิตเซอร์แลนด์ (Zurich)", timeZone: "Europe/Zurich" },
    { name: "ซีเรีย (Damascus)", timeZone: "Asia/Damascus" },
    { name: "ไต้หวัน (Taipei)", timeZone: "Asia/Taipei" },
    { name: "ทาจิกิสถาน (Dushanbe)", timeZone: "Asia/Dushanbe" },
    { name: "แทนซาเนีย (Dar es Salaam)", timeZone: "Africa/Dar_es_Salaam" },
    { name: "ไทย (Bangkok)", timeZone: "Asia/Bangkok" },
    { name: "โตโก (Lome)", timeZone: "Africa/Lome" }
];

const worldClocks = requestedWorldClocks.sort((a, b) => a.name.localeCompare(b.name));

let clockInterval; 

function getThaiZodiacSign(date) {
    // ราศีของไทยตามปฏิทินสุริยคติ
    const signs = [
        { name: "เมษ", start: [4, 13] }, { name: "พฤษภ", start: [5, 14] },
        { name: "เมถุน", start: [6, 14] }, { name: "กรกฎ", start: [7, 15] },
        { name: "สิงห์", start: [8, 15] }, { name: "กันย์", start: [9, 15] },
        { name: "ตุล", start: [10, 15] }, { name: "พิจิก", start: [11, 14] },
        { name: "ธนู", start: [12, 14] }, { name: "มังกร", start: [1, 14] },
        { name: "กุมภ์", start: [2, 13] }, { name: "มีน", start: [3, 14] }
    ];

    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate();

    for (let i = 0; i < signs.length; i++) {
        const nextIndex = (i + 1) % signs.length;
        const startMonth = signs[i].start[0];
        const startDay = signs[i].start[1];
        const endMonth = signs[nextIndex].start[0];
        const endDay = signs[nextIndex].start[1] - 1;

        if (month === startMonth && day >= startDay) {
            return signs[i].name;
        } else if (month === endMonth && day <= endDay) {
            return signs[i].name;
        }
    }
    // กรณีที่โค้ดลูปข้างบนคำนวณไม่ครอบคลุมช่วงรอยต่อปี (มังกร/กุมภ์)
    if (month === 1 && day < 14) return "ธนู";
    if (month === 3 && day < 14) return "กุมภ์";
    
    return "ไม่ทราบราศี";
}

function displayTimeDifference() {
    const thaiTimeZone = 'Asia/Bangkok';
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();

    const thaiOffset = now.toLocaleString('en-US', { timeZone: thaiTimeZone, hourCycle: 'h24', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'shortOffset' }).match(/GMT([+-]\d+)/);
    const localOffset = now.toLocaleString('en-US', { timeZone: localTimeZone, hourCycle: 'h24', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'shortOffset' }).match(/GMT([+-]\d+)/);

    let diffText = 'ไม่สามารถคำนวณความแตกต่างของเวลาได้';
    
    if (thaiOffset && localOffset) {
        const thaiHours = parseInt(thaiOffset[1], 10);
        const localHours = parseInt(localOffset[1], 10);

        const diffHours = thaiHours - localHours;

        if (diffHours === 0) {
            diffText = `⏰ เวลาท้องถิ่นของคุณ (${localTimeZone}) ตรงกับเวลาในประเทศไทย (UTC${thaiOffset[1]})`;
        } else if (diffHours > 0) {
            diffText = `⏰ เวลาท้องถิ่นของคุณ (${localTimeZone}) **ช้ากว่า** เวลาในประเทศไทย (${thaiTimeZone}) อยู่ **${Math.abs(diffHours)}** ชั่วโมง`;
        } else {
            diffText = `⏰ เวลาท้องถิ่นของคุณ (${localTimeZone}) **เร็วกว่า** เวลาในประเทศไทย (${thaiTimeZone}) อยู่ **${Math.abs(diffHours)}** ชั่วโมง`;
        }
    }

    const differenceDiv = document.getElementById('time-difference');
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
    const thaiTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
    const thaiHours = thaiTime.getHours();

    worldClocks.forEach(clockData => {
        const timeZone = clockData.timeZone;
        const clockElement = document.getElementById(`clock-${timeZone.replace(/\//g, '-')}`);

        if (clockElement) {
            try {
                const dateOptions = {
                    timeZone: timeZone,
                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                    hourCycle: 'h23' // ใช้รูปแบบ 24 ชม.
                };
                const displayOptions = {
                    timeZone: timeZone,
                    year: 'numeric', month: 'short', day: 'numeric',
                };

                const timeString = now.toLocaleTimeString('th-TH', dateOptions);
                const dateString = now.toLocaleDateString('th-TH', displayOptions);
                
                // ตรวจสอบว่าเป็นเวลากลางคืนหรือไม่ (เพื่อเปลี่ยนสีพื้นหลัง)
                const targetTime = new Date(now.toLocaleString("en-US", { timeZone: timeZone }));
                const targetHours = targetTime.getHours();
                const isNight = (targetHours >= 20 || targetHours < 6); // 20:00 - 05:59 น.

                clockElement.querySelector('.time').textContent = timeString;
                clockElement.querySelector('.date-display').textContent = dateString;
                
                // อัปเดตโหมดกลางคืน
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

    // ล้างเนื้อหาเดิมก่อน (ถ้ามี)
    container.innerHTML = ''; 

    // สร้าง Header สำหรับตาราง 
    const headerRow = document.createElement('div');
    headerRow.className = 'clock-table-header';
    headerRow.innerHTML = `
        <div class="header-name">ประเทศ</div>
        <div class="header-time">เวลา</div>
        <div class="header-date">วันที่</div>
    `;
    container.appendChild(headerRow);

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

    updateAllClocks();
    clockInterval = setInterval(updateAllClocks, 1000);
    
    displayTimeDifference();
    updateCurrentZodiac();
}

// ==============================================
// 4. CONVERTER FUNCTIONS
// ==============================================

const exchangeRates = {
    // อัตราจำลองสำหรับ THB เป็นสกุลอื่น
    THB: { USD: 0.028, EUR: 0.025, JPY: 4.1, THB: 1 },
    USD: { THB: 35.7, EUR: 0.92, JPY: 147.2, USD: 1 },
    EUR: { THB: 38.8, USD: 1.08, JPY: 159.4, EUR: 1 },
    JPY: { THB: 0.24, USD: 0.0068, EUR: 0.0063, JPY: 1 }
};

function initializeConverter() {
    populateCurrencyOptions();
    showConverterSection('currency'); // แสดงส่วนแปลงค่าเงินเมื่อโหลดหน้า
}

function populateCurrencyOptions() {
    const fromSelect = document.getElementById('currency-from');
    const toSelect = document.getElementById('currency-to');
    
    // ล้างตัวเลือกเก่า
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
    
    // ตั้งค่าเริ่มต้น
    fromSelect.value = 'THB';
    toSelect.value = 'USD';
}

function showConverterSection(type) {
    document.querySelectorAll('.converter-section').forEach(section => {
        section.style.display = 'none';
    });
    const selectedSection = document.getElementById(`${type}-section`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
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

const unitConversions = {
    // m (เมตร) เป็นฐาน
    km: 1000,
    m: 1,
    cm: 0.01
};

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

    // แปลงหน่วยเริ่มต้นเป็นเมตรก่อน
    const valueInMeters = amount * fromFactor;
    // แปลงจากเมตรเป็นหน่วยปลายทาง
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

    // ตรวจสอบความถูกต้องของ Input
    if (input === "") {
        resultDiv.innerHTML = '<p style="color:red;">❌ กรุณาป้อนตัวเลข</p>';
        return;
    }

    let decimalValue;
    try {
        // แปลงเป็นเลขฐาน 10 (Decimal)
        decimalValue = parseInt(input, fromBase);
        if (isNaN(decimalValue)) {
            throw new Error("Invalid input for base");
        }
    } catch (e) {
        resultDiv.innerHTML = '<p style="color:red;">❌ รูปแบบตัวเลขไม่ถูกต้องสำหรับเลขฐานที่เลือก</p>';
        return;
    }

    // แปลงจากเลขฐาน 10 เป็นฐานปลายทาง
    const result = decimalValue.toString(toBase).toUpperCase();

    // สร้างคำอธิบายวิธีทำ
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

// ==============================================
// 5. QUIZ GAME FUNCTIONS
// ==============================================

const quizQuestions = [
    { question: "แม่น้ำที่ยาวที่สุดในโลกคือแม่น้ำใด?", options: ["แอมะซอน", "ไนล์", "แยงซี", "มิสซิสซิปปี"], answer: "ไนล์" },
    { question: "สิ่งมีชีวิตชนิดใดที่มีเซลล์สมองมากที่สุด?", options: ["ปลาวาฬ", "มนุษย์", "ช้าง", "โลมา"], answer: "ปลาวาฬ" },
    { question: "แสงเดินทางเร็วแค่ไหน (กิโลเมตรต่อวินาที)?", options: ["150,000", "299,792", "380,000", "450,000"], answer: "299,792" },
    { question: "ดาวเคราะห์ดวงใดในระบบสุริยะที่ร้อนที่สุด?", options: ["ดาวพุธ", "ดาวศุกร์", "ดาวอังคาร", "ดาวยูเรนัส"], answer: "ดาวศุกร์" },
    { question: "ใครเป็นผู้คิดค้นทฤษฎีสัมพัทธภาพ (Relativity)?", options: ["ไอแซค นิวตัน", "อัลเบิร์ต ไอน์สไตน์", "กาลิเลโอ กาลิเลอี", "สตีเฟน ฮอว์คิง"], answer: "อัลเบิร์ต ไอน์สไตน์" }
];

let currentQuestionIndex = 0;
let score = 0;
let quizTimer;
let startTime;
const TIME_LIMIT = 60; // 60 วินาทีต่อเกม

function initializeQuiz() {
    document.getElementById('quiz-start-btn').onclick = startQuiz;
    loadLeaderboard();
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('quiz-start-area').style.display = 'none';
    document.getElementById('quiz-result-area').style.display = 'none';
    document.getElementById('quiz-game-area').style.display = 'block';

    startTime = Date.now();
    updateQuizTimerDisplay();
    quizTimer = setInterval(updateQuizTimerDisplay, 1000);

    showQuestion();
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

    // สุ่มลำดับตัวเลือก
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
    // ปิดการใช้งานปุ่มทั้งหมดชั่วคราว
    document.querySelectorAll('.quiz-option-btn').forEach(btn => btn.disabled = true);

    if (selectedOption === correctAnswer) {
        score++;
        button.style.backgroundColor = '#2ecc71'; // ถูกต้อง (เขียว)
    } else {
        button.style.backgroundColor = '#e74c3c'; // ผิด (แดง)
        // เน้นคำตอบที่ถูกต้อง
        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.style.border = '2px solid #2ecc71';
            }
        });
    }

    document.getElementById('quiz-score').textContent = `คะแนน: ${score} / ${quizQuestions.length}`;

    // ไปคำถามถัดไปหลังจาก 1 วินาที
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
        // เปิดการใช้งานปุ่มอีกครั้ง (จะถูกรีเซ็ตใน showQuestion)
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

function saveScore(username, score, time) {
    let leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
    const date = new Date().toLocaleDateString('th-TH');

    leaderboard.push({ username, score, time, date });

    // เรียงลำดับ: คะแนนสูงสุดก่อน, ถ้าคะแนนเท่ากัน ดูเวลาที่น้อยกว่า
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.time - b.time;
    });

    // เก็บเฉพาะ 10 อันดับแรก
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
        row.insertCell().textContent = `${record.score} / ${quizQuestions.length}`;
        row.insertCell().textContent = `${record.time} วินาที`;
        row.insertCell().textContent = record.date;
    });
}

// Utility function: Fisher-Yates shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
