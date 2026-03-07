/**
 * Script de Animação "Digital Rain" (Quadrados Caindo)
 * Adaptado para a paleta de cores tecnológica do portfólio.
 */

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// Variáveis globais de controle
let width, height;
let particles = [];

// Paleta de cores da animação (Tons de Amarelo/Destaque)
const colors = ['#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00'];

/**
 * Atualiza dimensões do canvas
 */
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

/**
 * Classe Square: Representa cada quadrado individual na chuva digital
 */
class Square {
    constructor() {
        this.init();
    }

    // Inicializa ou reseta as propriedades
    init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height; // Começa acima da tela
        this.size = Math.random() * 15 + 5;        // Entre 5 e 20px
        this.speed = Math.random() * 2 + 0.5;      // Velocidade de queda
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.8 + 0.4;  // Transparência
    }

    // Atualiza lógica a cada frame
    update() {
        this.y += this.speed;
        
        // Reset ao atingir o fim da tela
        if (this.y > height) {
            this.init();
            this.y = -20;
        }
    }

    // Desenha no Canvas
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        
        // Desenha contorno
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        
        // Efeito Glitch/Piscar (2% de chance por frame)
        if (Math.random() > 0.98) {
           ctx.fillStyle = this.color;
           ctx.fillRect(this.x, this.y, this.size, this.size);
        }
        
        ctx.globalAlpha = 1;
    }
}

/**
 * Popula o array de partículas baseado no tamanho da janela
 */
function initParticles() {
    particles = [];
    const particleCount = Math.floor(width / 12); 
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Square());
    }
}

/**
 * Loop principal de animação
 */
function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animate);
}

// Event Listeners para responsividade
window.addEventListener('resize', () => {
    resize();
    initParticles();
});

// Inicialização ao carregar a página
window.onload = () => {
    resize();
    initParticles();
    animate();
};
