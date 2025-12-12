// script.js - ฉบับแก้ไข (Fix: ปีนักษัตร, ราศี, World Clock Initialization)

// =================================================================
// 1. DATA (ข้อมูลหลัก)
// ... (ส่วน Data เหมือนเดิม)
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

// ข้อมูลสำหรับ World Clock: เวลาหลักทั่วโลก (อัปเดตตามรายชื่อประเทศที่ร้องขอ)
const requestedWorldClocks = [
    // ... (ข้อมูลประเทศยาวเหมือนเดิม)
    { name: "อัฟกานิสถาน (Kabul)", timeZone: "Asia/Kabul" },
    { name: "แอลเบเนีย (Tirane)", timeZone: "Europe/Tirane" },
    { name: "แอลจีเรีย (Algiers)", timeZone: "Africa/Algiers" },
    { name: "อันดอร์รา (Andorra la Vella)", timeZone: "Europe/Andorra" },
    { name: "แองโกลา (Luanda)", timeZone: "Africa/Luanda" },
    { name: "แอนทีกาและบาร์บิวดา (St. John's)", timeZone: "America/Port_of_Spain" },
    { name: "อาร์เจนตินา (Buenos Aires)", timeZone: "America/Argentina/Buenos_Aires" },
    { name: "อาร์มีเนีย (Yerevan)", timeZone: "Asia/Yerevan" },
    { name: "ออสเตรเลีย (Sydney)", timeZone: "Australia/Sydney" },
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
    { name: "บราซิล (Sao Paulo)", timeZone: "America/Sao_Paulo" },
    { name: "บรูไน (Bandar Seri Begawan)", timeZone: "Asia/Brunei" },
    { name: "บัลแกเรีย (Sofia)", timeZone: "Europe/Sofia" },
    { name: "บูร์กินาฟาโซ (Ouagadougou)", timeZone: "Africa/Ouagadougou" },
    { name: "บุรุนดี (Bujumbura)", timeZone: "Africa/Bujumbura" },
    { name: "กัมพูชา (Phnom Penh)", timeZone: "Asia/Phnom_Penh" },
    { name: "แคเมอรูน (Yaounde)", timeZone: "Africa/Douala" },
    { name: "แคนาดา (Toronto)", timeZone: "America/Toronto" },
    { name: "กาบูเวร์ดี (Praia)", timeZone: "Atlantic/Cape_Verde" },
    { name: "สาธารณรัฐแอฟริกากลาง (Bangui)", timeZone: "Africa/Bangui" },
    { name: "ชาด (N'Djamena)", timeZone: "Africa/Ndjamena" },
    { name: "ชิลี (Santiago)", timeZone: "America/Santiago" },
    { name: "จีน (Shanghai)", timeZone: "Asia/Shanghai" },
    { name: "โคลอมเบีย (Bogota)", timeZone: "America/Bogota" },
    { name: "คอโมโรส (Moroni)", timeZone: "Indian/Comoro" },
    { name: "สาธารณรัฐคองโก (Brazzaville)", timeZone: "Africa/Brazzaville" },
    { name: "คอสตาริกา (San Jose)", timeZone: "America/Costa_Rica" },
    { name: "โครเอเชีย (Zagreb)", timeZone: "Europe/Zagreb" },
    { name: "คิวบา (Havana)", timeZone: "America/Havana" },
    { name: "ไซปรัส (Nicosia)", timeZone: "Asia/Nicosia" },
    { name: "เช็กเกีย (Prague)", timeZone: "Europe/Prague" },
    { name: "เดนมาร์ก (Copenhagen)", timeZone: "Europe/Copenhagen" },
    { name: "จิบูตี (Djibouti)", timeZone: "Africa/Djibouti" },
    { name: "ดอมินีกา (Roseau)", timeZone: "America/Dominica" },
    { name: "สาธารณรัฐโดมินิกัน (Santo Domingo)", timeZone: "America/Santo_Domingo" },
    { name: "เอกวาดอร์ (Quito)", timeZone: "America/Guayaquil" },
    { name: "อียิปต์ (Cairo)", timeZone: "Africa/Cairo" },
    { name: "เอลซัลวาดอร์ (San Salvador)", timeZone: "America/El_Salvador" },
    { name: "อิเควทอเรียลกินี (Malabo)", timeZone: "Africa/Malabo" },
    { name: "เอริเทรีย (Asmara)", timeZone: "Africa/Asmara" },
    { name: "เอสโตเนีย (Tallinn)", timeZone: "Europe/Tallinn" },
    { name: "เอสวาตินี (Mbabane)", timeZone: "Africa/Mbabane" },
    { name: "เอธิโอเปีย (Addis Ababa)", timeZone: "Africa/Addis_Ababa" },
    { name: "ฟีจี (Suva)", timeZone: "Fiji" },
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
    { name: "อินโดนีเซีย (Jakarta)", timeZone: "Asia/Jakarta" },
    { name: "อิหร่าน (Tehran)", timeZone: "Asia/Tehran" },
    { name: "อิรัก (Baghdad)", timeZone: "Asia/Baghdad" },
    { name: "ไอร์แลนด์ (Dublin)", timeZone: "Europe/Dublin" },
    { name: "อิสราเอล (Jerusalem)", timeZone: "Asia/Jerusalem" },
    { name: "อิตาลี (Rome)", timeZone: "Europe/Rome" },
    { name: "โกตดิวัวร์ (Abidjan)", timeZone: "Africa/Abidjan" },
    { name: "จาเมกา (Kingston)", timeZone: "America/Jamaica" },
    { name: "ญี่ปุ่น (Tokyo)", timeZone: "Asia/Tokyo" },
    { name: "จอร์แดน (Amman)", timeZone: "Asia/Amman" },
    { name: "คาซัคสถาน (Almaty)", timeZone: "Asia/Almaty" },
    { name: "เคนยา (Nairobi)", timeZone: "Africa/Nairobi" },
    { name: "คิริบาส (Tarawa)", timeZone: "Pacific/Tarawa" },
    { name: "เกาหลีเหนือ (Pyongyang)", timeZone: "Asia/Pyongyang" },
    { name: "เกาหลีใต้ (Seoul)", timeZone: "Asia/Seoul" },
    { name: "โคโซโว (Pristina)", timeZone: "Europe/Belgrade" },
    { name: "คูเวต (Kuwait City)", timeZone: "Asia/Kuwait" },
    { name: "คีร์กีซสถาน (Bishkek)", timeZone: "Asia/Bishkek" },
    { name: "ลาว (Vientiane)", timeZone: "Asia/Vientiane" },
    { name: "ลัตเวีย (Riga)", timeZone: "Europe/Riga" },
    { name: "เลบานอน (Beirut)", timeZone: "Asia/Beirut" },
    { name: "เลโซโท (Maseru)", timeZone: "Africa/Maseru" },
    { name: "ไลบีเรีย (Monrovia)", timeZone: "Africa/Monrovia" },
    { name: "ลิเบีย (Tripoli)", timeZone: "Africa/Tripoli" },
    { name: "ลิกเตนสไตน์ (Vaduz)", timeZone: "Europe/Zurich" }, 
    { name: "ไทย (Bangkok)", timeZone: "Asia/Bangkok" } 
];
const worldClocks = requestedWorldClocks.sort((a, b) => a.name.localeCompare(b.name));
let clockInterval; 

// ข้อมูลสำหรับ Personal Info: Numerology (เลขศาสตร์)
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

// ข้อมูลสำหรับ Quiz Game: คำถาม 30 ข้อ (ใช้เพื่อสุ่ม 10 ข้อ)
const originalQuizQuestions = [
    // ... (ข้อมูลคำถาม Quiz เหมือนเดิม)
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
let quizQuestions = []; 
let currentQuestionIndex = 0;
let score = 0;
let quizTimer;
let startTime;
const TIME_LIMIT = 60; // 60 วินาที
const MAX_QUIZ_QUESTIONS = 10; // จำนวนคำถามสูงสุดที่สุ่มมาเล่น


// =================================================================
// 2. MESSAGE HANDLER (กล่องข้อความแจ้งเตือน)
// ... (ส่วน Message Handler เหมือนเดิม)
// =================================================================

function displayMessage(type, message, elementId) {
    const box = document.getElementById(elementId);
    if (!box) return;

    box.style.display = 'block';
    
    box.classList.remove('message-success', 'message-error', 'message-warning', 'message-area');

    if (elementId === 'login-message' || elementId === 'register-message') {
        box.classList.add('message-area');
        box.innerHTML = `<p style="color: ${type === 'success' ? '#2ecc71' : '#e74c3c'};">${message}</p>`; 
    } else {
        box.classList.add('message-box', `message-${type}`);
        box.innerHTML = `<p>${message}</p>`;
    }
}

// =================================================================
// 3. AUTHENTICATION FUNCTIONS (Login, Register, Logout)
// ... (ส่วน Authentication เหมือนเดิม)
// =================================================================

function handleLogin() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!username || !password) {
        displayMessage('error', 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน', 'login-message');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', username);
        displayMessage('success', 'เข้าสู่ระบบสำเร็จ! กำลังนำทาง...', 'login-message');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        displayMessage('error', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'login-message');
    }
}

function handleRegister() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const confirmPassword = document.getElementById('reg-confirm-password').value.trim();

    if (!username || !password || !confirmPassword) {
        displayMessage('error', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'register-message');
        return;
    }

    if (password !== confirmPassword) {
        displayMessage('error', 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน', 'register-message');
        return;
    }

    if (password.length < 6) {
        displayMessage('error', 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'register-message');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.username === username)) {
        displayMessage('error', 'ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว กรุณาเลือกชื่ออื่น', 'register-message');
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    displayMessage('success', 'ลงทะเบียนสำเร็จ! กำลังนำไปหน้าล็อกอิน...', 'register-message');

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
        authButton.style.backgroundColor = '#e74c3c'; 
    } else {
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
            return;
        }
        authButton.href = 'login.html';
        authButton.textContent = '✅ Log In';
        authButton.style.backgroundColor = '#1abc9c'; 
    }

    if (nav) {
        nav.appendChild(authButton);
    }
    
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        welcomeMessage.innerHTML = isLoggedIn 
            ? `👋 ยินดีต้อนรับกลับ **${isLoggedIn}**!` 
            : `👋 ยินดีต้อนรับสู่ MyToolbox`;
    }
}

// =================================================================
// 4. PERSONAL INFO & NUMEROLOGY FUNCTIONS
// =================================================================

function parseBirthdate(dateString) {
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;

    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    // ตรวจสอบและแปลงปี พ.ศ. ให้เป็น ค.ศ.
    if (year > 2500) {
        year -= 543;
    }

    if (isNaN(day) || isNaN(month) || isNaN(year) || 
        day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
        return null;
    }

    // สร้าง Date object โดยใช้ปี ค.ศ.
    const date = new Date(year, month - 1, day);

    // ตรวจสอบความถูกต้องของวัน/เดือน/ปีที่ป้อน
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        return null;
    }

    return date;
}

// 🛑 แก้ไข: ปรับปรุงการคำนวณราศีให้แม่นยำขึ้น
function calculateZodiacSign(birthdate) {
    const month = birthdate.getMonth() + 1; // 1-12
    const day = birthdate.getDate();

    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "กุมภ์ (Aquarius)";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "มีน (Pisces)";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "เมษ (Aries)";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "พฤษภ (Taurus)";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "เมถุน (Gemini)";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "กรกฎ (Cancer)";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "สิงห์ (Leo)";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "กันย์ (Virgo)";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "ตุลย์ (Libra)";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "พิจิก (Scorpio)";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "ธนู (Sagittarius)";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "มังกร (Capricorn)";
    
    return "ไม่พบราศี"; // ควรไม่เกิดขึ้น
}

// 🛑 แก้ไข: ใช้ปี ค.ศ. ที่แปลงแล้วในการคำนวณปีนักษัตร
function calculateZodiacYear(yearAD) {
    const zodiacs = [
        'ชวด (หนู)', 'ฉลู (วัว)', 'ขาล (เสือ)', 'เถาะ (กระต่าย)', 
        'มะโรง (งูใหญ่)', 'มะเส็ง (งูเล็ก)', 'มะเมีย (ม้า)', 'มะแม (แพะ)', 
        'วอก (ลิง)', 'ระกา (ไก่)', 'จอ (หมา)', 'กุน (หมู)'
    ];

    // ปีนักษัตรเริ่มที่ปี 4 (มะโรง) ดังนั้นใช้ (yearAD - 3) % 12
    let remainder = (yearAD - 3) % 12;

    if (remainder < 0) {
        remainder += 12;
    }

    return zodiacs[remainder];
}


function calculatePersonalInfo() {
    const dateString = document.getElementById('birthdate-input').value.trim();
    const resultDiv = document.getElementById('personal-result');
    resultDiv.innerHTML = '';
    
    const birthdate = parseBirthdate(dateString);

    if (!birthdate) {
        displayMessage('error', '❌ รูปแบบวันเดือนปีเกิดไม่ถูกต้อง หรือไม่สมเหตุสมผล (ใช้ DD/MM/YYYY หรือ DD/MM/BBBB)', 'main-message-box');
        return;
    }
    
    document.getElementById('main-message-box').style.display = 'none';

    const now = new Date();
    const birthYearAD = birthdate.getFullYear(); // ปี ค.ศ. ที่แปลงแล้ว
    const birthMonth = birthdate.getMonth();
    const birthDay = birthdate.getDate();
    
    // คำนวณอายุ
    let age = now.getFullYear() - birthYearAD;
    let months = now.getMonth() - birthMonth;
    let days = now.getDate() - birthDay;

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
    const zodiacYear = calculateZodiacYear(birthYearAD); // ใช้ปี ค.ศ. ที่แปลงแล้ว

    // คำนวณวันเกิดครั้งถัดไป
    let nextBirthday = new Date(now.getFullYear(), birthMonth, birthDay);
    if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    const diffTime = Math.abs(nextBirthday.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const birthdateAD = birthdate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const birthdateBE = (birthYearAD + 543) + '/' + (birthMonth + 1).toString().padStart(2, '0') + '/' + birthDay.toString().padStart(2, '0');

    resultDiv.innerHTML = `
        <h3>🎉 ผลการคำนวณข้อมูลวันเกิด</h3>
        <p><strong>วันเกิด (ค.ศ.):</strong> ${birthdateAD} (${birthdateBE} พ.ศ.)</p>
        <p><strong>อายุ:</strong> **${age}** ปี ${months} เดือน ${days} วัน</p>
        <p><strong>ปีนักษัตร:</strong> 🐉 **${zodiacYear}**</p>
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
        displayMessage('error', '❌ กรุณากรอกชื่อ หรือ นามสกุล เพื่อทำนายเลขศาสตร์', 'main-message-box');
        return;
    }
    
    document.getElementById('main-message-box').style.display = 'none';

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
// 5. CONVERTER FUNCTIONS
// ... (ส่วน Converter เหมือนเดิม)
// =================================================================

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
    showConverterTab('currency'); 
}

function showConverterTab(tabName) {
    document.querySelectorAll('.converter-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(`${tabName}-converter`).style.display = 'block';

    document.querySelectorAll('.converter-tabs button').forEach(button => {
        button.style.backgroundColor = ''; 
        button.style.color = 'var(--text-color)';
    });

    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
        activeTab.style.backgroundColor = 'var(--primary-color)';
        activeTab.style.color = 'white';
    }
}

// =================================================================
// 6. WORLD CLOCK FUNCTIONS
// =================================================================

function updateWorldClocks() {
    const container = document.getElementById('world-clock-container');
    if (!container) {
        // console.warn("World Clock container element 'world-clock-container' not found.");
        return; 
    }
    
    // Clear content only if it's the first run or if content needs refresh
    if (container.innerHTML === '' || container.querySelector('.clock-table-header')) {
        container.innerHTML = '';
        
        const header = document.createElement('div');
        header.className = 'clock-table-header';
        header.innerHTML = '<div>เมือง</div><div>เวลา</div><div>วันที่</div>';
        container.appendChild(header);
    } else {
        // If updating an existing table, reuse existing rows for performance
        // (For simplicity in this example, we re-render everything, but checking for existence is the key fix)
    }

    const now = new Date();

    worldClocks.forEach(clock => {
        // หาแถวที่มีอยู่หรือสร้างใหม่
        let row = container.querySelector(`.clock-row[data-timezone="${clock.timeZone}"]`);
        let isNewRow = false;
        if (!row) {
            row = document.createElement('div');
            row.className = 'clock-row';
            row.setAttribute('data-timezone', clock.timeZone);
            isNewRow = true;
        }

        try {
            const timeOptions = { 
                timeZone: clock.timeZone, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
            };
            const dateOptions = { 
                timeZone: clock.timeZone, 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            };

            let localTime, localDate;
            try {
                // ต้องใช้ 'en-US' หรือ 'th-TH' เพื่อให้เบราว์เซอร์รองรับการแสดงผล
                localTime = now.toLocaleTimeString('en-US', timeOptions); 
                localDate = now.toLocaleDateString('th-TH', dateOptions);
            } catch (e) {
                // หาก TimeZone ไม่ถูกต้อง จะแสดง Error แทน
                localTime = 'Error: TimeZone';
                localDate = 'Error';
            }

            // ตรวจสอบกลางวัน/กลางคืน
            const hour = parseInt(localTime.substring(0, 2), 10);
            const isNight = hour < 6 || hour >= 18; 

            row.className = `clock-row ${isNight ? 'night-mode' : ''}`;
            
            if (isNewRow) {
                row.innerHTML = `
                    <div class="clock-name">${clock.name}</div>
                    <div class="time">${localTime}</div>
                    <div class="date-display">${localDate}</div>
                `;
                container.appendChild(row);
            } else {
                 // อัปเดตเฉพาะข้อมูลเวลา/วันที่ เพื่อประสิทธิภาพ
                row.querySelector('.time').textContent = localTime;
                row.querySelector('.date-display').textContent = localDate;
            }


        } catch (error) {
            console.error(`Error updating time for ${clock.name}:`, error);
        }
    });
}

function initializeWorldClock() {
    const container = document.getElementById('world-clock');
    if (container && document.getElementById('world-clock-container')) { 
        // รันครั้งแรกทันที
        updateWorldClocks(); 
        // รันซ้ำทุกวินาที
        if (!clockInterval) {
            clockInterval = setInterval(updateWorldClocks, 1000); 
        }
    } else {
        // console.error("Could not initialize World Clock: Missing 'world-clock' or 'world-clock-container' in HTML.");
    }
}

// =================================================================
// 7. QUIZ GAME FUNCTIONS
// ... (ส่วน Quiz Game เหมือนเดิม)
// =================================================================

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    quizQuestions = shuffleArray([...originalQuizQuestions]).slice(0, MAX_QUIZ_QUESTIONS);
    currentQuestionIndex = 0;
    score = 0;
    
    document.getElementById('quiz-start-area').style.display = 'none';
    document.getElementById('quiz-game-area').style.display = 'block';
    
    clearInterval(quizTimer);
    startTime = Date.now();
    quizTimer = setInterval(updateTimer, 1000);

    displayQuestion();
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = TIME_LIMIT - elapsed;
    const timerElement = document.getElementById('quiz-timer');
    
    if (remaining <= 0) {
        clearInterval(quizTimer);
        endQuiz('หมดเวลา!');
        timerElement.textContent = `⏰ หมดเวลา!`;
    } else {
        timerElement.textContent = `⏰ เหลือเวลา: ${remaining} วินาที`;
    }
}

function displayQuestion() {
    const questionData = quizQuestions[currentQuestionIndex];
    if (!questionData) {
        endQuiz();
        return;
    }

    document.getElementById('quiz-question').textContent = `${currentQuestionIndex + 1}. ${questionData.question}`;
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    const shuffledOptions = shuffleArray([...questionData.options]);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'quiz-option-btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(option, questionData.answer, button);
        optionsContainer.appendChild(button);
    });

    document.getElementById('quiz-score').textContent = `คะแนน: ${score}`;
    document.getElementById('quiz-question-number').textContent = `คำถามที่: ${currentQuestionIndex + 1} / ${quizQuestions.length}`;
}

function checkAnswer(selectedOption, correctAnswer, button) {
    document.querySelectorAll('.quiz-option-btn').forEach(btn => btn.disabled = true);
    
    if (selectedOption === correctAnswer) {
        score++;
        button.style.backgroundColor = 'var(--secondary-color)'; 
        button.style.color = 'white';
    } else {
        button.style.backgroundColor = 'var(--error-color)'; 
        button.style.color = 'white';
        
        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.style.backgroundColor = 'var(--warning-color)'; 
            }
        });
    }

    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 1000); 
}

function endQuiz(reason = 'จบคำถามทั้งหมด') {
    clearInterval(quizTimer);
    const finalTime = Math.floor((Date.now() - startTime) / 1000);

    const totalQuestions = quizQuestions.length > 0 ? quizQuestions.length : MAX_QUIZ_QUESTIONS; 
    saveScore(score, finalTime, totalQuestions);
    
    document.getElementById('quiz-game-area').style.display = 'none';
    const resultArea = document.getElementById('quiz-result-area');
    resultArea.style.display = 'block';

    let message = `<h2>${reason}!</h2>`;
    message += `<p>คุณทำได้: **${score}** คะแนน จาก ${totalQuestions} ข้อ</p>`;
    message += `<p>ใช้เวลาไป: **${finalTime}** วินาที</p>`;
    message += `<button onclick="restartQuiz()" class="action-btn" style="background-color: var(--secondary-color);">เล่นอีกครั้ง</button>`;
    
    resultArea.innerHTML = message;

    loadLeaderboard();
}

function restartQuiz() {
    document.getElementById('quiz-result-area').style.display = 'none';
    document.getElementById('quiz-start-area').style.display = 'block';
    document.getElementById('quiz-timer').textContent = `⏰ เหลือเวลา: ${TIME_LIMIT} วินาที`;
}

function saveScore(finalScore, finalTime, totalQuestions) {
    const playerName = localStorage.getItem('loggedInUser') || 'Guest';
    let leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
    
    leaderboard.push({ name: playerName, score: finalScore, time: finalTime, total: totalQuestions, date: new Date().toLocaleDateString('th-TH') });
    
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.time - b.time;
    });
    
    leaderboard = leaderboard.slice(0, 10);
    
    localStorage.setItem('quizLeaderboard', JSON.stringify(leaderboard));
}

function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
    const leaderboardBody = document.getElementById('leaderboard-body');
    if (!leaderboardBody) return;

    leaderboardBody.innerHTML = '';
    
    leaderboard.forEach((record, index) => {
        const total = record.total || MAX_QUIZ_QUESTIONS; 
        const row = leaderboardBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = record.name;
        row.insertCell(2).textContent = `${record.score} / ${total}`; 
        row.insertCell(3).textContent = `${record.time} วินาที`;
        row.insertCell(4).textContent = record.date;
    });
}

function initializeQuiz() {
    const quizArea = document.getElementById('quiz');
    if (quizArea) {
        if (document.getElementById('quiz-game-area') && document.getElementById('quiz-result-area') && document.getElementById('quiz-start-area')) {
             document.getElementById('quiz-game-area').style.display = 'none';
             document.getElementById('quiz-result-area').style.display = 'none';
             document.getElementById('quiz-start-area').style.display = 'block';
             document.getElementById('quiz-timer').textContent = `⏰ เหลือเวลา: ${TIME_LIMIT} วินาที`;
             loadLeaderboard();
        } else {
            // console.error("Missing required quiz HTML elements (quiz-start-area, quiz-game-area, quiz-result-area)");
        }
    }
}

// =================================================================
// 8. INITIALIZATION (การเรียกใช้งานฟังก์ชันเมื่อโหลดหน้า)
// =================================================================

function updateFooterText() {
    const footerTextElement = document.getElementById('footer-text');
    if (footerTextElement) {
        footerTextElement.textContent = '© 2025 MyToolbox Project. All rights reserved.'; 
    }
}

// Global Scope Export
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.calculatePersonalInfo = calculatePersonalInfo;
window.calculateNumerology = calculateNumerology;
window.convertCurrency = convertCurrency;
window.convertUnit = convertUnit;
window.convertBase = convertBase;
window.showConverterTab = showConverterTab;
window.startQuiz = startQuiz;
window.restartQuiz = restartQuiz;

document.addEventListener('DOMContentLoaded', () => {
    // 1. โหลดปุ่ม Login/Logout
    loadAuthButton();
    
    // 2. อัปเดตข้อความ Footer
    updateFooterText();

    // 3. เริ่มต้นฟังก์ชันตามหน้าที่ของแต่ละหน้า
    if (document.getElementById('world-clock')) { 
        initializeWorldClock(); 
    } else if (document.getElementById('converter-suite')) { 
        initializeConverter(); 
    } else if (document.getElementById('quiz')) { 
        initializeQuiz(); 
    }
});
