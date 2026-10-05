(() => {
  const pad = (value) => String(value).padStart(2, '0');
  const beforeTitles = [
    'แผงคอยล์เย็น', 'ชุดคอยล์ด้านใน', 'ช่องลมและครีบคอยล์', 'พัดลมแอร์',
    'แผ่นกรองอากาศ', 'คอยล์เย็นก่อน–หลังล้าง', 'รางน้ำและทางลม', 'ชุดพัดลมโพรงกระรอก',
    'คราบฝุ่นสะสมในเครื่อง', 'ชิ้นส่วนภายในเครื่อง', 'จุดสกปรกก่อนล้าง', 'งานล้างคอยล์ละเอียด',
    'หลังทำความสะอาดแผงคอยล์', 'ล้างช่องลมและบานสวิง', 'ตรวจความสะอาดหลังบริการ', 'ภาพรวมผลงานก่อน–หลัง'
  ];
  const beforeDescriptions = [
    'เปรียบเทียบคราบฝุ่นบนแผงคอยล์ก่อนล้างกับสภาพหลังทำความสะอาด ลมจึงผ่านได้ดีขึ้น',
    'ทำความสะอาดฝุ่นและคราบตามครีบคอยล์ พร้อมตรวจครีบที่อาจพับหรืออุดตัน',
    'ลดสิ่งสกปรกที่สะสมตามช่องลม เพื่อให้การกระจายลมเย็นสม่ำเสมอขึ้น',
    'ล้างคราบที่ใบพัดและตรวจการหมุน เสียง และแรงสั่นก่อนส่งมอบงาน',
    'แผ่นกรองที่สะอาดช่วยให้อากาศไหลผ่านได้มากขึ้นและลดฝุ่นในเครื่อง',
    'ตัวอย่างงานล้างคอยล์เย็นแบบละเอียดจากหน้างานจริง',
    'ตรวจรางน้ำและทางลมพร้อมล้างคราบที่กีดขวางการระบายอากาศ',
    'ล้างชุดพัดลมให้สะอาดและทดสอบแรงลมหลังประกอบกลับ',
    'คราบฝุ่นสะสมที่ทำให้แอร์ทำงานหนักและส่งลมได้ลดลง',
    'ตัวอย่างชิ้นส่วนภายในที่ต้องถอดตรวจตามสภาพของเครื่อง',
    'เปรียบเทียบจุดที่มีคราบก่อนเริ่มงานกับผลลัพธ์หลังล้าง',
    'เก็บรายละเอียดตามร่องครีบและจุดที่มองเห็นยากภายในเครื่อง',
    'ตรวจแผงคอยล์หลังล้างเพื่อยืนยันว่าทางลมสะอาดขึ้น',
    'ทำความสะอาดช่องลมและบานสวิง พร้อมตรวจการเปิดปิด',
    'ตรวจซ้ำทุกจุดและเก็บพื้นที่ให้เรียบร้อยก่อนส่งมอบงาน',
    'รวมตัวอย่างผลงานก่อน–หลังจากชิ้นส่วนหลายตำแหน่งของแอร์'
  ];
  const reviewDescriptions = [
    'รีวิวจากลูกค้าที่ประทับใจความสะอาดและการเก็บรายละเอียดของทีมช่าง',
    'เสียงจากผู้ใช้บริการที่ชื่นชอบการทำงานเป็นขั้นตอนและการให้คำแนะนำ',
    'รีวิวหลังรับบริการล้างแอร์ พร้อมความรู้สึกต่อความสุภาพของทีมงาน',
    'ความคิดเห็นจากลูกค้าที่เลือกใช้บริการ Celar Air อีกครั้ง',
    'รีวิวการดูแลพื้นที่และความเรียบร้อยระหว่างเข้าบริการ',
    'ความประทับใจเรื่องความเย็นและแรงลมหลังล้างแอร์',
    'รีวิวจากลูกค้าที่ได้รับคำอธิบายก่อนเริ่มงานอย่างชัดเจน',
    'เสียงตอบรับต่อการตรวจเช็กและทดสอบเครื่องหลังทำความสะอาด',
    'รีวิวจากลูกค้าที่ไว้วางใจให้ทีมช่างดูแลแอร์ในบ้าน',
    'ความคิดเห็นหลังใช้บริการกับทีมช่างมืออาชีพ',
    'รีวิวการนัดหมายที่สะดวกและการเข้าบริการตรงเวลา',
    'เสียงจากลูกค้าที่ชอบความละเอียดของงานล้างแอร์',
    'รีวิวการดูแลแอร์ให้สะอาดและใช้งานได้นานขึ้น',
    'ความคิดเห็นหลังทีมงานตรวจจุดสำคัญครบถ้วน',
    'รีวิวประสบการณ์การใช้บริการ Celar Air จากลูกค้าจริง',
    'เสียงตอบรับต่อการบริการที่ใส่ใจตั้งแต่เริ่มจนจบงาน',
    'รีวิวหลังช่างเก็บงานและทดสอบเครื่องเรียบร้อย',
    'ความคิดเห็นจากผู้ใช้บริการที่แนะนำทีมช่างให้คนใกล้ตัว',
    'รีวิวเรื่องความสะอาด ความสุภาพ และความเป็นมืออาชีพ',
    'เสียงจากลูกค้าที่กลับมาใช้บริการซ้ำ',
    'ขอบคุณทุกรีวิวที่ช่วยให้ทีม Celar Air พัฒนางานต่อไป'
  ];
  const beforeItems = beforeTitles.map((title, index) => ({kind: 'ผลงานก่อน–หลัง', src: `assets/before-after/full-${pad(index + 1)}.jpg`, title, description: beforeDescriptions[index]}));
  const reviewItems = reviewDescriptions.map((description, index) => ({kind: 'รีวิวลูกค้า', src: `assets/reviews/full-${pad(index + 1)}.jpg`, title: `รีวิวจากลูกค้า Celar Air รายที่ ${index + 1}`, description}));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lightbox = document.querySelector('#review-lightbox');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxTitle = document.querySelector('#lightbox-title');
  const lightboxDescription = document.querySelector('#lightbox-description');
  const lightboxClose = document.querySelector('#lightbox-close');

  const openLightbox = (button) => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = button.dataset.gallerySrc;
    lightboxImage.alt = button.dataset.galleryTitle || 'ภาพรายละเอียด';
    if (lightboxTitle) lightboxTitle.textContent = button.dataset.galleryTitle || 'รายละเอียดภาพ';
    if (lightboxDescription) lightboxDescription.textContent = button.dataset.galleryDescription || '';
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
    else lightbox.setAttribute('open', '');
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    if (typeof lightbox.close === 'function' && lightbox.open) lightbox.close();
    else lightbox.removeAttribute('open');
    if (lightboxImage) lightboxImage.removeAttribute('src');
  };
  const createCard = (item, index) => {
    const figure = document.createElement('figure');
    figure.className = 'carousel-slide gallery-card';
    const button = document.createElement('button');
    button.className = 'gallery-open'; button.type = 'button';
    button.dataset.gallerySrc = item.src; button.dataset.galleryTitle = item.title; button.dataset.galleryDescription = item.description;
    button.setAttribute('aria-label', `เปิด${item.title}ขนาดใหญ่`);
    button.addEventListener('click', () => openLightbox(button));
    const badge = document.createElement('span'); badge.className = 'gallery-badge'; badge.textContent = item.kind;
    const image = document.createElement('img'); image.src = item.src; image.alt = item.title; image.loading = index < 5 ? 'eager' : 'lazy'; image.decoding = 'async';
    const zoom = document.createElement('span'); zoom.className = 'gallery-zoom'; zoom.textContent = 'ดูรายละเอียด ↗';
    button.append(badge, image, zoom);
    const caption = document.createElement('figcaption'); const title = document.createElement('strong'); title.textContent = item.title; const description = document.createElement('span'); description.textContent = item.description; caption.append(title, description);
    figure.append(button, caption); return figure;
  };

  const setupCarousel = (root, items) => {
    if (!root) return;
    const track = root.querySelector('[data-gallery-track]'); const status = root.querySelector('[data-carousel-status]'); const previous = root.querySelector('[data-carousel-prev]'); const next = root.querySelector('[data-carousel-next]');
    if (!track || !items.length) return;
    items.forEach((item, index) => track.append(createCard(item, index)));
    const originalSlides = Array.from(track.children); const clone = originalSlides[0].cloneNode(true); clone.setAttribute('aria-hidden', 'true'); track.append(clone);
    let position = 0; let timer = 0; let resetTimer = 0; let paused = false;
    const stepSize = () => { const first = track.firstElementChild; if (!first) return 0; return first.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).gap) || 0); };
    const setActive = () => { originalSlides.forEach((slide, index) => slide.classList.toggle('is-active', index === (position % items.length))); if (status) status.textContent = `${(position % items.length) + 1} / ${items.length}`; };
    const render = (animate = true) => { track.style.transition = animate ? '' : 'none'; track.style.transform = `translate3d(${-position * stepSize()}px, 0, 0)`; setActive(); };
    const restart = () => { window.clearInterval(timer); if (!paused && !reduceMotion.matches) timer = window.setInterval(() => move(1), 4200); };
    const move = (delta) => {
      if (resetTimer) window.clearTimeout(resetTimer); position += delta;
      if (position < 0) { position = items.length - 1; render(false); requestAnimationFrame(() => render(true)); }
      else render(true);
      if (position === items.length) resetTimer = window.setTimeout(() => { position = 0; render(false); }, 720);
      restart();
    };
    const pause = () => { paused = true; window.clearInterval(timer); }; const resume = () => { paused = false; restart(); };
    next?.addEventListener('click', () => move(1)); previous?.addEventListener('click', () => move(-1));
    root.addEventListener('mouseenter', pause); root.addEventListener('mouseleave', resume); root.addEventListener('focusin', pause); root.addEventListener('focusout', (event) => { if (!root.contains(event.relatedTarget)) resume(); });
    root.querySelector('.carousel-viewport')?.addEventListener('touchstart', pause, {passive: true}); root.querySelector('.carousel-viewport')?.addEventListener('touchend', resume, {passive: true});
    window.addEventListener('resize', () => render(false)); render(false);
    const observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) { paused = false; restart(); } else pause(); }, {threshold: .2}); observer.observe(root);
  };

  setupCarousel(document.querySelector('[data-carousel="before-after"]'), beforeItems);
  setupCarousel(document.querySelector('[data-carousel="reviews"]'), reviewItems);
  lightboxClose?.addEventListener('click', closeLightbox); document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightbox?.open) closeLightbox(); });

  document.body.classList.add('motion-enabled');
  const revealItems = document.querySelectorAll('.content-section, .services, .ac-explorer'); revealItems.forEach((element) => element.classList.add('motion-reveal'));
  const revealObserver = new IntersectionObserver((entries, observer) => { entries.forEach((entry) => { if (!entry.isIntersecting) return; entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }); }, {threshold: .14, rootMargin: '0px 0px -8%'});
  revealItems.forEach((element) => revealObserver.observe(element));
})();
