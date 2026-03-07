    <!-- ==========================================
         SCRIPT DA ANIMAÇÃO (Digital Rain Customizado)
         ========================================== -->
      
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');

        // Variáveis globais de controle do Canvas
        let width, height;
        let particles = [];

        // Paleta de cores da animação sincronizada com a NOVA PALETA DO CSS:
        // Cores: Tons de Amarelo
        const colors = [ '#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00'];

        /* --- FUNÇÕES DE CONTROLE DO CANVAS --- */
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        /* --- CLASSE PRINCIPAL: SQUARE (PARTÍCULAS) --- */
        class Square {
            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * width;
                this.y = Math.random() * height - height;
                this.size = Math.random() * 15 + 5;
                this.speed = Math.random() * 2 + 0.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.8 + 0.4;
            }

            update() {
                this.y += this.speed;
                if (this.y > height) {
                    this.init();
                    this.y = -20;
                }
            }

            draw() {
                ctx.globalAlpha = this.opacity;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.5;
                
                ctx.strokeRect(this.x, this.y, this.size, this.size);
                
                // Ocasionalmente pisca
                if (Math.random() > 0.98) {
                    ctx.fillStyle = this.color;
                    ctx.fillRect(this.x, this.y, this.size, this.size);
                }
                
                ctx.globalAlpha = 1;
            }
        }

        /* --- INICIALIZAÇÃO E LOOP DE ANIMAÇÃO --- */
        function initParticles() {
            particles = [];
            const particleCount = Math.floor(width / 10);
            
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Square());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            requestAnimationFrame(animate);
        }

        /* --- EVENT LISTENERS --- */
        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        // Inicia a animação quando a página carrega
        window.onload = () => {
            resize();
            initParticles();
            animate();
        };
