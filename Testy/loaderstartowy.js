class ComponentLoader {
    constructor() {
        this.loadedComponents = new Set();
        this.componentStyles = new Set();
    }

    async initialize() {
        try {
            
            this.addRippleStyles();
            
            
            document.addEventListener('click', this.createRippleEffect.bind(this));
            
            
            
            await this.loadPageStructure();
            
        } catch (error) {
            console.error('Failed to initialize page:', error);
            this.showErrorState();
        }
    }

    addRippleStyles() {
        
        if (!document.querySelector('style[data-ripple]')) {
            const rippleStyle = document.createElement('style');
            rippleStyle.setAttribute('data-ripple', 'true');
            rippleStyle.textContent = `
                @keyframes ripple {
                    0% {
                        transform: scale(0.5);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(3);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleStyle);
            
        }
    }

    async loadPageStructure() {
        
        const sections = [
            'sections/projects/projects',  
            'components/header/header',
            'components/ticker/ticker',
            'components/sidebar/sidebar',
            'sections/about-project/about-project',
            'sections/community/community',
            'components/footer/footer'
        ];

        for (const section of sections) {
            await this.loadSection(section);
            
        }
        
        
        const placeholder = document.querySelector('.loading-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

    
        
        this.initializeComponents();
    }

    async loadSection(sectionPath) {
        try {
            
            const htmlResponse = await fetch(`${sectionPath}.html`);
            if (!htmlResponse.ok) throw new Error(`HTML not found: ${sectionPath}`);
            
            const html = await htmlResponse.text();
            document.getElementById('mainContent').innerHTML += html;

            
            

            
            await this.loadJS(`${sectionPath}.js`);

            this.loadedComponents.add(sectionPath);
            
        } catch (error) {
            console.warn(`Could not load ${sectionPath}:`, error);
            
        }
    }

    async loadJS(jsPath) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = jsPath;
            script.type = 'module';
            script.onload = resolve;
            script.onerror = () => {
                console.warn(`JS not found: ${jsPath}`);
                resolve(); 
            };
            document.body.appendChild(script);
        });
    }

    initializeComponents() {
        
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
        
    
    }

    createRippleEffect(e) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${e.clientX - 25}px;
            top: ${e.clientY - 25}px;
            width: 50px;
            height: 50px;
            border: 2px solid #00ff88;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            animation: ripple 1s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 1000);
    }

    showErrorState() {
        const content = document.getElementById('mainContent');
        content.innerHTML = `
            <div class="flex items-center justify-center min-h-screen text-center">
                <div>
                    <h2 class="text-accent-neon mb-4 text-2xl">Błąd ładowania</h2>
                    <p class="text-text-gray">Odśwież stronę lub spróbuj ponownie później.</p>
                </div>
            </div>
        `;
    }
}


const loader = new ComponentLoader();
loader.initialize();