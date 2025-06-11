const startButton = document.getElementById('start');
const quitButton = document.getElementById('quit');

startButton.addEventListener('click', () => {
  window.location.href = 'jeu.html';
});

quitButton.addEventListener('click', () => {
 window.close();
});