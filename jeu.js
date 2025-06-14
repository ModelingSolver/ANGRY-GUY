let hero = document.getElementById('hero');
const heroEmojis = ['😠', '😑', '😃'];
let heroIndex = 0;
hero.textContent = heroEmojis[heroIndex];
let musique = document.getElementById('musique');
let coeurs = [];
let niveau = 1;
let chrono = 5;
let timer;

class Coeur {
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('coeur');
    this.element.textContent = '❤️';
    document.body.appendChild(this.element);

    this.x = Math.random() * (window.innerWidth - 50);
    this.y = Math.random() * (window.innerHeight - 50);
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    this.element.addEventListener('click', () => {
      this.element.remove();
      coeurs = coeurs.filter(c => c !== this);
      if (coeurs.length === 0) niveauSuivant();
    });
  }

  deplacer() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= window.innerWidth - 50) this.vx *= -1;
    if (this.y <= 0 || this.y >= window.innerHeight - 50) this.vy *= -1;

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

function creerCoeurs(n) {
  for (let i = 0; i < n; i++) {
    coeurs.push(new Coeur());
  }
}

function deplacerCoeurs() {
  coeurs.forEach(coeur => coeur.deplacer());
}

function detecterCollisions() {
  coeurs.forEach((coeur) => {
    const heroRect = hero.getBoundingClientRect();
    const coeurRect = coeur.element.getBoundingClientRect();

    const collision =
      heroRect.x < coeurRect.x + coeurRect.width &&
      heroRect.x + heroRect.width > coeurRect.x &&
      heroRect.y < coeurRect.y + coeurRect.height &&
      heroRect.y + heroRect.height > coeurRect.y;

    if (collision) {
      coeur.element.remove();
      coeurs = coeurs.filter(c => c !== coeur);

      heroIndex = (heroIndex + 1) % heroEmojis.length;
      hero.textContent = heroEmojis[heroIndex];

      if (heroIndex === 1) {
        musique.src = 'musique3.mp3';
        musique.play();
      }

      if (heroIndex === 2) {
        hero.style.fontSize = '200px';
        gameOver();
      }

      if (coeurs.length === 0) niveauSuivant();
    }
  });
}

function niveauSuivant() {
  niveau++;
  document.body.innerHTML = '<h1 style="color:white; text-align:center;">LEVEL COMPLETED</h1>';

  setTimeout(() => {
    document.body.innerHTML = `
      <div id="hero">${heroEmojis[heroIndex]}</div>
      <div id="chrono"></div>
      <audio id="musique" src="musique2.mp3" autoplay loop></audio>
    `;
    hero = document.getElementById('hero');
    musique = document.getElementById('musique');
    addHeroMovement();
    startGame();
  }, 2000);
}

function gameOver() {
  musique.src = 'musique_game_over.mp3';
  musique.play();
  document.body.innerHTML = '<h1 style="text-align:center; color:white;">Okay u loose so now u know u just can\'t have everything in life!!</h1>';
}

function startGame() {
  creerCoeurs(5 * niveau);
  chrono = 5;
  const chronoDiv = document.getElementById('chrono');
  chronoDiv.textContent = chrono;

  timer = setInterval(() => {
    chrono--;
    chronoDiv.textContent = chrono;
    if (chrono === 0) {
      clearInterval(timer);
      jeu();
    }
  }, 1000);
}

function jeu() {
  setInterval(deplacerCoeurs, 16);
  setInterval(detecterCollisions, 16);
}

function addHeroMovement() {
  let isDragging = false;
  hero.style.position = 'absolute';

  hero.addEventListener('mousedown', () => {
    isDragging = true;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      hero.style.left = `${event.clientX}px`;
      hero.style.top = `${event.clientY}px`;
    }
  });
}

addHeroMovement();
startGame();