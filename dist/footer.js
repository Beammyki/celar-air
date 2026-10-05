(() => {
  const footer = document.querySelector('.foot');
  if (!footer) return;

  footer.innerHTML = `
    <div class="wrap footer-grid">
      <div class="footer-about">
        <a class="brand footer-brand" href="index.html">
          <i class="mark" aria-hidden="true">❄</i>
          <span>Celar Air<br><small>เซล่าร์ แอร์</small></span>
        </a>
        <p>บริการล้าง ซ่อม ติดตั้ง และจำหน่ายแอร์ ดูแลบ้าน คอนโด และสำนักงาน โดยทีมช่าง Celar Air</p>
        <a class="footer-cta" href="contact.html">ติดต่อเรา</a>
        <div class="footer-social" aria-label="ช่องทางติดต่อ">
          <a href="tel:0971328999" aria-label="โทรหา Celar Air">☎</a>
          <a href="https://line.me/" target="_blank" rel="noopener noreferrer" aria-label="แอดไลน์">LINE</a>
          <a href="mailto:celarair@gmail.com" aria-label="ส่งอีเมล">✉</a>
        </div>
      </div>
      <nav class="footer-col" aria-label="บริการ">
        <h3>บริการ</h3>
        <a href="services.html">บริการของเรา</a>
        <a href="index.html#cleaning">ล้างแอร์</a>
        <a href="index.html#inside-ac">ล้างตรงไหน…สำคัญอย่างไร?</a>
        <a href="prices.html">ขอประเมินราคา</a>
      </nav>
      <nav class="footer-col" aria-label="เมนูหลัก">
        <h3>เมนูหลัก</h3>
        <a href="index.html">หน้าแรก</a>
        <a href="services.html">บริการ</a>
        <a href="prices.html">ราคา</a>
        <a href="about.html">เกี่ยวกับเรา</a>
        <a href="contact.html">ติดต่อเรา</a>
      </nav>
      <nav class="footer-col" aria-label="หัวข้อในหน้าแรก">
        <h3>หัวข้อในหน้าแรก</h3>
        <a href="index.html#workflow">ขั้นตอนการทำงาน</a>
        <a href="index.html#before-after">ผลงานก่อน–หลัง</a>
        <a href="index.html#why-celar-air">ทำไมต้อง Celar Air</a>
        <a href="index.html#reviews">รีวิวจากลูกค้า</a>
        <a href="index.html#faq">คำถามที่พบบ่อย</a>
        <a href="index.html#articles">บทความ</a>
      </nav>
    </div>
    <div class="wrap footer-bottom"><span>© 2026 Celar Air</span><span>บริการแอร์ครบวงจร นครปฐม</span></div>`;
})();
