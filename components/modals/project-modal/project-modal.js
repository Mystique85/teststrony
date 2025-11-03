
(function(){'use strict';if(window.ProjectModal)return;class ProjectModal{
        constructor(){this.modal=null;this.overlay=null;this.isOpen=false;this.projectData={};this.initialized=false;this._observer=null;this._openStartTime=null;this._isTransitioning=false;this.loadCSS();if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',()=>this.safeInit());}else{setTimeout(()=>this.safeInit(),100);}}

        loadCSS(){const cssPath='components/modals/project-modal/project-modal.css';const existingLink=document.querySelector(`link[href="${cssPath}"]`);if(existingLink)return;const link=document.createElement('link');link.rel='stylesheet';link.href=cssPath;link.onload=()=>{};link.onerror=()=>{};document.head.appendChild(link);}

        safeInit(){if(this.initialized)return;try{this.createModalStructure();this.setupEventListeners();this.integrateWithProjects();this.initialized=true;}catch(error){setTimeout(()=>this.safeInit(),500);}}

        createModalStructure() {
            const overlayId = 'projectModalOverlay';
            const modalId = 'projectModal';
            const existingOverlay = document.getElementById(overlayId);
            const existingModal = document.getElementById(modalId);
            const existingInstanceOverlay = document.getElementById('projectModalInstanceOverlay');
            const existingInstanceModal = document.getElementById('projectModalInstance');
            
            if (existingOverlay) existingOverlay.remove();
            if (existingModal) existingModal.remove();
            if (existingInstanceOverlay) existingInstanceOverlay.remove();
            if (existingInstanceModal) existingInstanceModal.remove();
            
            const modalHTML = `
                <div class="project-modal-overlay" id="${overlayId}">
                    <div class="project-modal-container" id="${modalId}">
                        <div class="project-modal-header">
                            <div class="project-modal-logo-title">
                                <img class="project-modal-logo" id="modalLogo" alt="Project Logo" onerror="this.style.display='none'">
                                <div class="project-title-section">
                                    <h2 class="project-modal-title" id="modalTitle">Loading Title...</h2>
                                    <p class="project-modal-subtitle" id="modalSubtitle">Loading Subtitle...</p>
                                </div>
                            </div>
                            <button class="project-modal-close" id="modalCloseBtn" aria-label="Close modal">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>

                        <div class="project-modal-content" id="modalContent">
                            <div class="project-modal-loading">Loading content...</div>
                        </div>

                        <div class="project-modal-footer">
                            <div class="project-modal-actions" id="modalActions">
                                <button class="project-modal-btn primary" disabled>Loading...</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.modal = document.getElementById(modalId);
            this.overlay = document.getElementById(overlayId);
            
            if (this.overlay) {
                this.overlay.style.display = 'none';
                this.overlay.style.opacity = '0';
            }
        }

        setupEventListeners() {
            const closeBtn = document.getElementById('modalCloseBtn');
            if (closeBtn) {
                closeBtn.replaceWith(closeBtn.cloneNode(true));
                const newCloseBtn = document.getElementById('modalCloseBtn');
                newCloseBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.close();
                });
            }

            if(this.overlay){this.overlay.addEventListener('click',(e)=>{e.stopPropagation();if(Date.now()-(this._openStartTime||0)<500)return;if(e.target===this.overlay)this.close();else e.stopPropagation();},false);}
            document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&this.isOpen)this.close();});
        }

        integrateWithProjects() {
            this.waitForCarousel();
        }

        waitForCarousel(){const maxAttempts=10;let attempts=0;const checkCarousel=()=>{attempts++;if(window.projectsCarousel&&window.projectsCarousel.isInitialized){this.makeCardsClickable();return;}if(attempts<maxAttempts)setTimeout(checkCarousel,300);else this.makeCardsClickable();};checkCarousel();}

        makeCardsClickable(){try{const cards=document.querySelectorAll('#projects .card');let clickableCards=0;cards.forEach((card,index)=>{if(this.addCardClickListener(card,index))clickableCards++;});}catch(error){}
        }

        addCardClickListener(card,index){if(card._hasModalClickListener)return false;card.style.cursor='pointer';const originalTransform=card.style.transform||'';const originalBoxShadow=card.style.boxShadow||'';card.addEventListener('mouseenter',()=>{if(!this.isOpen){card.style.transform='translateY(-5px) scale(1.02)';card.style.boxShadow='0 15px 30px rgba(0, 255, 136, 0.2)';}});card.addEventListener('mouseleave',()=>{if(!this.isOpen){card.style.transform=originalTransform;card.style.boxShadow=originalBoxShadow;}});

            card.addEventListener('click', (e) => {
                const ignoredElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
                const isIgnored = ignoredElements.some(selector => 
                    e.target.closest(selector) || e.target.tagName === selector
                );

                if (isIgnored) {
                    return;
                }

                try {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    const projectId = this.getProjectIdFromCard(card);
                    if (projectId) {
                        this._openStartTime = Date.now();
                        this._isTransitioning = false;
                        if (!this.isOpen) {
                            this.open(projectId);
                        }
                    }
                } catch (err) {}
            });

            card._hasModalClickListener = true;
            return true;
        }

        getProjectIdFromCard(card) {
            const title = card.querySelector('h3')?.textContent?.trim().toLowerCase();
            if (!title) return null;

            const projectMap = {
                'talent protocol': 'talent-protocol',
                'intract': 'intract', 
                'look hook': 'look-hook',
                'hellocelo': 'hello-celo',
                'hellovote': 'hello-vote',
                'your project here?': 'collaboration',
                'new project': 'coming-soon-1',
                'another network': 'coming-soon-2'
            };

            return projectMap[title] || null;
        }

        getProjectData(projectId) {
            const projects = {
                'talent-protocol': {
                    id: 'talent-protocol',
                    title: 'TALENT PROTOCOL',
                    subtitle: 'Twoja Reputacja w Świecie Web3',
                    logo: 'images/talent.logo.svg',
                    
                    sections: [
                        {
                            title: 'CZYM JEST TALENT PROTOCOL?',
                            icon: '🎯',
                            content: `Talent Protocol to platforma, która zmienia sposób, w jaki developerzy i twórcy prezentują swoją pracę w świecie Web3. Działa jak cyfrowy paszport zawodowy, który automatycznie aktualizuje się z Twoimi osiągnięciami na blockchainach, GitHubie i innych platformach. To nie jest statyczne CV - to żywy dowód Twoich umiejętności i wkładu w rozwój ekosystemu.`
                        },
                        {
                            title: 'CO ZYSKUJESZ JAKO UŻYTKOWNIK?',
                            icon: '💫',
                            benefits: [
                                {
                                    icon: '🏆',
                                    title: 'WERYFIKOWALNA REPUTACJA',
                                    description: 'Twój Builder Score pokazuje realny wpływ Twojej pracy. Projekty mogą łatwo zweryfikować Twoje umiejętności i doświadczenie.'
                                },
                                {
                                    icon: '💼',
                                    title: 'DOSTĘP DO OKAZJI',
                                    description: 'Otrzymuj zaproszenia do interesujących projektów, programów grantowych i możliwości współpracy dopasowanych do Twoich skills.'
                                },
                                {
                                    icon: '🌍',
                                    title: 'GLOBALNA SPOŁECZNOŚĆ',
                                    description: 'Dołącz do 11 milionów developerów budujących razem przyszłość pracy w Web3. Wymieniaj się doświadczeniami i współpracuj.'
                                }
                            ]
                        }
                    ],
                    stats: [
                        { number: "11M+", label: "Zaindeksowanych Developerów" },
                        { number: "1M+", label: "Aktywnych Talent Passports" },
                        { number: "40+", label: "Integracji z Platformami" }
                    ],
                    links: {
                        primary: { text: "🎯 STWÓRZ SWÓJ TALENT PASSPORT", url: "https://talentprotocol.com" },
                        secondary: { text: "📚 POZNAJ DOKUMENTACJĘ", url: "https://docs.talentprotocol.com" },
                        community: { text: "💬 DOŁĄCZ DO DISCORD", url: "https://discord.gg/talentprotocol" }
                    }
                }
            };

            return projects[projectId] || {
                id: projectId,
                title: projectId.toUpperCase().replace('-', ' '),
                subtitle: 'Project Details',
                logo: '',
                sections: [
                    {
                        title: 'INFORMACJA',
                        icon: 'ℹ️',
                        content: 'Szczegółowe informacje o tym projekcie wkrótce będą dostępne.'
                    }
                ],
                stats: [],
                links: {
                    primary: { text: "🌐 STRONA GŁÓWNA", url: "#" },
                    secondary: { text: "📚 DOKUMENTACJA", url: "#" },
                    community: { text: "💬 SPOŁECZNOŚĆ", url: "#" }
                }
            };
        }

        open(projectId) {
            if (!this.initialized) {
                return;
            }

            if (this.isOpen) {
                this.close();
                setTimeout(() => this.open(projectId), 300);
                return;
            }

            this._isTransitioning = true;
            this._openStartTime = Date.now();

            const projectData=this.getProjectData(projectId);this.projectData=projectData;this.renderModalContent();this.overlay.style.display='flex';this.overlay.style.opacity='0';document.body.style.overflow='hidden';void this.overlay.offsetWidth;requestAnimationFrame(()=>{this.overlay.style.opacity='1';this.overlay.classList.add('active');this.isOpen=true;this._isTransitioning=false;},10);
        }

        renderModalContent() {
            const{title,subtitle,logo,sections,stats,links}=this.projectData;const titleEl=document.getElementById('modalTitle');const subtitleEl=document.getElementById('modalSubtitle');if(titleEl)titleEl.textContent=title;if(subtitleEl)subtitleEl.textContent=subtitle;const logoImg=document.getElementById('modalLogo');if(logoImg&&logo){logoImg.src=logo;logoImg.alt=title;logoImg.style.display='block';}else if(logoImg){logoImg.style.display='none';}const contentEl=document.getElementById('modalContent');const actionsEl=document.getElementById('modalActions');if(contentEl)contentEl.innerHTML=this.generateContentHTML(sections,stats);if(actionsEl)actionsEl.innerHTML=this.generateActionsHTML(links);
        }

        generateContentHTML(sections, stats) {
            try {
                let html = '';
                sections.forEach(section => {
                    html += `
                        <div class="project-modal-section">
                            <h3 class="project-modal-section-title">
                                <span>${section.icon}</span>
                                ${section.title}
                            </h3>
                    `;

                    if (section.content) {
                        const formattedContent = section.content.replace(/\n/g, '<br>');
                        html += `<div class="project-modal-text">${formattedContent}</div>`;
                    }

                    if (section.benefits) {
                        html += `<div class="project-modal-benefits">`;
                        section.benefits.forEach(benefit => {
                            html += `
                                <div class="project-modal-benefit">
                                    <div class="project-modal-benefit-icon">${benefit.icon}</div>
                                    <div class="project-modal-benefit-content">
                                        <h4>${benefit.title}</h4>
                                        <p>${benefit.description}</p>
                                    </div>
                                </div>
                            `;
                        });
                        html += `</div>`;
                    }

                    html += `</div>`;
                });

                if (stats && stats.length > 0) {
                    html += `<div class="project-modal-section">
                        <h3 class="project-modal-section-title">
                            <span>📊</span>
                            STATYSTYKI
                        </h3>
                        <div class="project-modal-stats">`;
                    
                    stats.forEach(stat => {
                        html += `
                            <div class="project-modal-stat">
                                <div class="project-modal-stat-number">${stat.number}</div>
                                <div class="project-modal-stat-label">${stat.label}</div>
                            </div>
                        `;
                    });
                    
                    html += `</div></div>`;
                }

                return html;
            } catch (error) {
                return '<div class="project-modal-text">Błąd ładowania zawartości</div>';
            }
        }

        generateActionsHTML(links) {
            return `
                <a href="${links.primary.url}" class="project-modal-btn primary" target="_blank" rel="noopener">
                    ${links.primary.text}
                </a>
                <a href="${links.secondary.url}" class="project-modal-btn secondary" target="_blank" rel="noopener">
                    ${links.secondary.text}
                </a>
                <a href="${links.community.url}" class="project-modal-btn community" target="_blank" rel="noopener">
                    ${links.community.text}
                </a>
            `;
        }

        close(){if(!this.isOpen)return;const timeSinceOpen=Date.now()-(this._openStartTime||0);if(timeSinceOpen<300)return;this._isTransitioning=false;this.overlay.classList.remove('active');this.isOpen=false;document.body.style.overflow='';setTimeout(()=>{this.overlay.style.display='none';},300);}
    }

    window.ProjectModal=ProjectModal;window.projectModal=new ProjectModal();})();