(() => {
  const buttons = [...document.querySelectorAll('[data-detail-title]')];
  if (!buttons.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'service-dialog';
  dialog.innerHTML = `
    <div class="service-dialog-shell">
      <button class="service-dialog-close" type="button" aria-label="ปิดรายละเอียด">×</button>
      <span class="tag" data-dialog-tag>รายละเอียดบริการ</span>
      <h2 data-dialog-title></h2>
      <div class="service-dialog-body" data-dialog-body></div>
      <a class="btn" href="contact.html">คุยกับทีมช่าง →</a>
    </div>`;
  document.body.appendChild(dialog);

  const title = dialog.querySelector('[data-dialog-title]');
  const body = dialog.querySelector('[data-dialog-body]');
  const close = dialog.querySelector('.service-dialog-close');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      title.textContent = button.dataset.detailTitle || '';
      body.innerHTML = button.dataset.detailBody || '';
      dialog.showModal();
    });
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
