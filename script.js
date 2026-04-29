/*
  ==========================================================================
  ÍNDICE DO ARQUIVO (JavaScript)
  1. COMPORTAMENTO DE NAVEGAÇÃO E TEMA
  2. MOTOR DE ANIMAÇÃO (Canvas API - Efeito Espacial)
     - Configurações e Variáveis
     - Classe Star (Estrelas Geométricas)
     - Classe ShootingStar (Cometas)
     - Inicialização e Ciclo de Animação
  ==========================================================================
*/

/* 1. COMPORTAMENTO DE NAVEGAÇÃO E TEMA: Sincronização e persistência de UI */

window.addEventListener("scroll", () => {
  const backBtn = document.getElementById("back-btn");
  const themeBtn = document.getElementById("theme-toggle-btn");

  if (window.innerWidth <= 768) {
    if (window.scrollY > 50) {
      backBtn.classList.add("scrolled");
      themeBtn.classList.add("scrolled");
    } else {
      backBtn.classList.remove("scrolled");
      themeBtn.classList.remove("scrolled");
    }
  } else {
    backBtn.classList.remove("scrolled");
    themeBtn.classList.remove("scrolled");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
  if (window.refreshSpace) window.refreshSpace();
});

const themeToggle = document.getElementById("theme-toggle-btn");
const body = document.body;

if (localStorage.getItem("theme") === "light") {
  body.classList.add("light-mode");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const isLight = body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    if (window.refreshSpace) window.refreshSpace();
  });
}

/* 2. MOTOR DE ANIMAÇÃO: Renderização do fundo espacial interativo */
const canvas = document.getElementById("bg-canvas");

if (canvas) {
  const ctx = canvas.getContext("2d");
  let width, height;
  let stars = [];
  let shootingStars = [];

  const darkStarColors = [
    "#ffffff",
    "#fff4e6",
    "#ffdd00",
    "#ffaa00",
    "#ffcc80",
    "#e6f2ff",
  ];

  const lightStarColors = [
    "#150136",
    "#090024",
    "#5752ff",
    "#3b35cc",
    "#8b87ff",
    "#17005c",
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  /* 2.1 Classe Star: Gerencia o comportamento das estrelas descendentes */
  class Star {
    constructor() {
      this.init();
    }

    init() {
      this.type = Math.floor(Math.random() * 3) + 1;
      let baseSize = Math.random() * 2 + 0.5;

      if (this.type === 1) this.size = baseSize * 2.5;
      else if (this.type === 2) this.size = baseSize * 1.8;
      else this.size = baseSize * 1.2;

      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseSpeedX = (Math.random() - 0.5) * 0.1;
      this.baseSpeedY = baseSize * 0.4 + 0.2;

      const isLightMode = document.body.classList.contains("light-mode");
      const activeColors = isLightMode ? lightStarColors : darkStarColors;
      this.color =
        activeColors[Math.floor(Math.random() * activeColors.length)];

      this.maxOpacity = Math.random() * 0.7 + 0.3;
      this.opacity = this.maxOpacity;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinklePhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.baseSpeedX;
      this.y += this.baseSpeedY;
      this.twinklePhase += this.twinkleSpeed;
      this.opacity =
        (Math.sin(this.twinklePhase) * 0.5 + 0.5) * this.maxOpacity;

      if (this.y > height + 20) {
        this.y = -20;
        this.x = Math.random() * width;
      }
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
    }

    draw() {
      const alpha = this.opacity;
      ctx.globalAlpha = alpha * 0.2;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = alpha;
      this._drawFourPointStar(this.x, this.y, this.size);
      ctx.globalAlpha = 1.0;
    }

    /* 
       Desenha uma estrela de 4 pontas geométrica
       x, y: centro da estrela
       s: tamanho base
    */
    _drawFourPointStar(x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y - s * 2.5);
      ctx.lineTo(x + s * 0.4, y - s * 0.4);
      ctx.lineTo(x + s * 2.5, y);
      ctx.lineTo(x + s * 0.4, y + s * 0.4);
      ctx.lineTo(x, y + s * 2.5);
      ctx.lineTo(x - s * 0.4, y + s * 0.4);
      ctx.lineTo(x - s * 2.5, y);
      ctx.lineTo(x - s * 0.4, y - s * 0.4);
      ctx.closePath();
      ctx.fill();
    }
  }

  /* 2.2 Classe ShootingStar: Gerencia os cometas aleatórios */
  class ShootingStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.active = false;
      if (Math.random() > 0.993) {
        this.active = true;
        this.x = Math.random() * width;
        this.y = -50;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 5 + 3);
        this.speedY = Math.random() * 5 + 7;
        this.len = Math.random() * 80 + 30;
        this.opacity = 1;
      }
    }
    update() {
      if (!this.active) {
        this.reset();
        return;
      }
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= 0.015;
      if (
        this.opacity <= 0 ||
        this.y > height ||
        this.x < 0 ||
        this.x > width
      ) {
        this.active = false;
      }
    }
    draw() {
      if (!this.active) return;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - this.speedX * (this.len / 5),
        this.y - this.speedY * (this.len / 5),
      );
      ctx.lineWidth = this.size;
      ctx.lineCap = "round";
      let grad = ctx.createLinearGradient(
        this.x,
        this.y,
        this.x - this.speedX * (this.len / 10),
        this.y - this.speedY * (this.len / 10),
      );
      if (document.body.classList.contains("light-mode")) {
        grad.addColorStop(0, `rgba(21, 1, 54, ${this.opacity})`);
        grad.addColorStop(1, `rgba(87, 82, 255, 0)`);
      } else {
        grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        grad.addColorStop(1, `rgba(255, 170, 0, 0)`);
      }
      ctx.strokeStyle = grad;
      ctx.stroke();
    }
  }

  /* 2.3 Gerenciamento e Ciclo de Animação */
  function initSpace() {
    resize();
    stars = [];
    shootingStars = [];
    const calculatedStars = Math.floor((width * height) / 12000);
    const numStars = Math.min(calculatedStars, 150);
    for (let i = 0; i < numStars; i++) {
      stars.push(new Star());
    }
    for (let i = 0; i < 2; i++) {
      shootingStars.push(new ShootingStar());
    }
  }

  window.refreshSpace = initSpace;

  function animate() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach((star) => {
      star.update();
      star.draw();
    });
    shootingStars.forEach((sStar) => {
      sStar.update();
      sStar.draw();
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", initSpace);
  initSpace();
  animate();
}
