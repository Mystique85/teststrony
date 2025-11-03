
class GMPopover {
    constructor() {
        this.popover = null;
        this.gmButton = null;
        this.isOpen = false;
        this.particles = [];
        
        this.init();
    }

    init() {
        this.createPopover();
        this.setupEventListeners();
        this.setupParticles();
    }

    createPopover() {
        
    }

    setupEventListeners() {
        
        document.addEventListener('click', (e) => {
            const gmBtn = e.target.closest('.nav-gm-btn');
            if (gmBtn) {
                e.preventDefault();
                e.stopPropagation();
                this.toggle(gmBtn);
            }
            
            
            if (e.target.closest('.close-popover-btn')) {
                this.close();
            }
        });

        
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.gm-popover-container') && !e.target.closest('.nav-gm-btn')) {
                this.close();
            }
        });

        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('gradient-text-hover')) {
                this.animateText(e.target);
            }
        });
    }

    setupParticles() {
        
        this.createDynamicParticles();
    }

    createDynamicParticles() {
        const container = document.querySelector('.floating-particles');
        if (!container) return;

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createParticle(container);
            }, i * 1000);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'dynamic-particle absolute w-2 h-2 bg-accent-neon rounded-full opacity-0';
        
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        particle.style.left = `${startX}%`;
        particle.style.top = `${startY}%`;
        
        container.appendChild(particle);

        
        const animation = particle.animate([
            { 
                opacity: 0,
                transform: 'scale(0) translate(0, 0)'
            },
            { 
                opacity: 0.8,
                transform: 'scale(1) translate(20px, -30px)'
            },
            { 
                opacity: 0,
                transform: 'scale(0) translate(40px, -60px)'
            }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });

        animation.onfinish = () => {
            particle.remove();
            
            setTimeout(() => this.createParticle(container), 1000 + Math.random() * 2000);
        };

        this.particles.push(particle);
    }

    animateText(element) {
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 300);
    }

    toggle(button) {
        if (this.isOpen) {
            this.close();
        } else {
            this.open(button);
        }
    }

    open(button) {
        this.isOpen = true;
        this.gmButton = button;
        
        const popover = document.querySelector('.gm-popover-container');
        if (!popover) return;
        
        
        this.positionPopover(button, popover);
        
        
        popover.classList.remove('hidden');
        popover.style.opacity = '0';
        popover.style.transform = 'translateY(-10px) scale(0.95)';
        
        
        requestAnimationFrame(() => {
            popover.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            popover.style.opacity = '1';
            popover.style.transform = 'translateY(0) scale(1)';
        });
        
    
    }

    positionPopover(button, popover) {
        const rect = button.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();
        
        
        
        
        let top = rect.bottom + 10;
        
        
        let left = rect.left + (rect.width / 2) - (popoverRect.width / 2);
        left = left - 142;
        
        
        
        const rightEdge = window.innerWidth - popoverRect.width - 20;
        if (left > rightEdge) {
            left = rightEdge;
            
        }
        
        
        if (left < 20) {
            left = 20;
            
        }
        
        
        popover.style.top = `${top}px`;
        popover.style.left = `${left}px`;
        
        
    }

    close() {
        this.isOpen = false;
        const popover = document.querySelector('.gm-popover-container');
        if (popover) {
            
            popover.style.opacity = '0';
            popover.style.transform = 'translateY(-10px) scale(0.95)';
            
            setTimeout(() => {
                popover.classList.add('hidden');
                
                popover.style.opacity = '';
                popover.style.transform = '';
            }, 300);
        }
    }

    destroy() {
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particles = [];
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.gmPopover = new GMPopover();
    });
} else {
    window.gmPopover = new GMPopover();
}