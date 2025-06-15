let hero = document.getElementById('hero');
const heroEmojis = ['😠', '😑', '😃'];
let heroIndex = 0;
hero.textContent = heroEmojis[heroIndex];
let coeurs = [];
let niveau = 1;
let chrono = 5;
let timer;
let gameIntervals = [];

class Coeur {
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('coeur');
    this.element.textContent = '❤️';
    document.body.appendChild(this.element);

    this.x = Math.random() * (window.innerWidth - 50);
    this.y = Math.random() * (window.innerHeight - 50);
    this.vx = (Math.random() - 0.5) * 16;
    this.vy = (Math.random() - 0.5) * 16;

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
  coeurs.forEach(c => c.element.remove());
  coeurs = [];
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

      if (heroIndex === 2) {
        hero.style.fontSize = '200px';
        gameOver();
      }

      if (coeurs.length === 0) niveauSuivant();
    }
  });
}

function clearGameIntervals() {
  gameIntervals.forEach(id => clearInterval(id));
  gameIntervals = [];
}

function niveauSuivant() {
  clearGameIntervals();
  niveau++;
  document.body.innerHTML = '<h1 style="color:white; text-align:center;">LEVEL COMPLETED</h1>';

  setTimeout(() => {
    document.body.innerHTML = `
      <div id="video-background">
        <iframe
          id="video"
          src="https://www.youtube.com/embed/zglLlECZMro?autoplay=1&mute=1&loop=1"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
      </div>
      <div id="hero">${heroEmojis[heroIndex]}</div>
      <div id="chrono"></div>
    `;

    // Activation son au premier clic/touch
    function activerSon() {
      const iframe = document.getElementById('video');
      if (!iframe) return;

      // Supprimer "mute=1" de l'URL pour activer le son
      if (iframe.src.includes('mute=1')) {
        iframe.src = iframe.src.replace('mute=1', 'mute=0');
      }

      document.removeEventListener('click', activerSon);
      document.removeEventListener('touchstart', activerSon);
    }
    document.addEventListener('click', activerSon);
    document.addEventListener('touchstart', activerSon);

    // Récupérer les éléments après modification du DOM
    hero = document.getElementById('hero');
    addHeroMovement();
    startGame();
  }, 2000);
}


function gameOver() {
  clearGameIntervals();
  document.body.innerHTML = `
    <div id="image-background">
      <img 
        src="https://s1.qwant.com/thumbr/474x355/3/a/2f6d6b69d75be20030edfcb55f936d0ea7d3c71defd1932cd88b181548b3d9/th.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%3Fid%3DOIP.HvCpPIqpqSgmasyZc-Fz7AHaFj%26r%3D0%26pid%3DApi&q=0&b=1&p=0&a=0" 
        alt="Game Over Image" 
        style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: -1;">
    </div>
    <h1 style="text-align:center; color:white; font-size:80px; position: absolute; top: 50px; left: 50%; transform: translateX(-50%); z-index: 10; text-shadow: 3px 3px 5px black;">GAME OVER</h1>
    <h2 style="text-align:center; color:white; font-size:30px; position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 10;">
      Okay u loose so now u know u just can't have everything in life!!
    </h2>
  `;
}




function startGame() {
  creerCoeurs(5 * niveau);
  chrono = 5;
  const chronoDiv = document.getElementById('chrono');
  chronoDiv.textContent = chrono;

  if(timer) clearInterval(timer);
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
  clearGameIntervals();
  gameIntervals.push(setInterval(deplacerCoeurs, 16));
  gameIntervals.push(setInterval(detecterCollisions, 16));
}

function addHeroMovement() {
  let isDragging = false;
  hero.style.position = 'absolute';

  hero.addEventListener('mousedown', () => {
    isDragging = true;
    hero.style.cursor = 'grabbing';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    hero.style.cursor = 'grab';
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const offsetX = hero.offsetWidth / 2;
      const offsetY = hero.offsetHeight / 2;
      hero.style.left = `${event.clientX - offsetX}px`;
      hero.style.top = `${event.clientY - offsetY}px`;
    }
  });
}

addHeroMovement();
startGame();
