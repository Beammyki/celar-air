(() => {
  if (document.querySelector('.floating-contact')) return;

  const panel = document.createElement('aside');
  panel.className = 'floating-contact';
  panel.setAttribute('aria-label', 'ช่องทางติดต่อด่วน');
  panel.innerHTML = `
    <a class="floating-contact-link floating-line" href="https://line.me/" target="_blank" rel="noopener noreferrer">
      <span class="floating-mascot" aria-hidden="true"><img src="assets/celar-mascot-line.png" alt=""></span>
      <span class="floating-copy"><b>แอดไลน์ทันที</b><small>คุยกับทีม Celar Air</small></span>
      <span class="floating-icon" aria-hidden="true">LINE</span>
    </a>
    <a class="floating-contact-link floating-call" href="tel:0971328999">
      <span class="floating-mascot" aria-hidden="true"><img src="assets/celar-mascot-phone.png" alt=""></span>
      <span class="floating-copy"><b>โทรปรึกษาทันที</b><small>097-132-8999</small></span>
      <span class="floating-icon" aria-hidden="true">☎</span>
    </a>`;
  document.body.appendChild(panel);
})();
