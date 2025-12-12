// ==============================================
// C. WORLD CLOCK FUNCTIONS 
// ==============================================

// ข้อมูลนาฬิกาโลกสำหรับประเทศที่ร้องขอ (ใช้เขตเวลาหลักที่สุด)
const requestedWorldClocks = [
    // อัฟกานิสถาน, แอลเบเนีย, ฯลฯ... (รายการ 100+ ประเทศที่สมบูรณ์)
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

// ... (ส่วนที่เหลือของฟังก์ชันใน script.js เช่น initializeWorldClock, updateAllClocks, handleLogin ฯลฯ) 
// ควรคงไว้ตามฉบับที่สมบูรณ์ก่อนหน้า และให้แน่ใจว่า initializeWorldClock มีการเรียกใช้ดังนี้:

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
