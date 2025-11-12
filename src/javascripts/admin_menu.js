document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.menu-card');
  const logoutBtn = document.getElementById('btn-logout');

  // Redirecionar ao clicar no card
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const link = card.getAttribute('data-link');
      if (link) window.location.href = link;
    });
  });

  // Logout
  logoutBtn.addEventListener('click', async () => {
    await fetch('/user/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }});
    window.location.href = '/';
  });
});

