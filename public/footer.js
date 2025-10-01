
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.fd-toggle');

  function closeAll(exceptId){
    document.querySelectorAll('.fd-menu').forEach(menu => {
      if (menu.id !== exceptId) {
        menu.hidden = true;
        const btn = document.querySelector(`.fd-toggle[aria-controls="${menu.id}"]`);
        if (btn) btn.setAttribute('aria-expanded','false');
      }
    });
  }

  toggles.forEach(btn => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!menu) return;

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      closeAll(menu.id);
      btn.setAttribute('aria-expanded', String(!open));
      menu.hidden = open; // hide if open, show if closed
    });
  });

  // optional: click outside closes all
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.footer-dropdown')) closeAll();
  });

  // Esc closes any open menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
});
