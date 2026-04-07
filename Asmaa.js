document.addEventListener('DOMContentLoaded', () => {

    /* ================= 1. إعدادات شاشة الترحيب الدائمة والوضع الافتراضي ================= */
    let currentLang = localStorage.getItem('asmaa_lang') || 'ar';
    let isDayMode = localStorage.getItem('asmaa_theme') === 'day';
    let isColorblind = localStorage.getItem('asmaa_colorblind') === 'true';
    let isProMode = false; // يبدأ دائماً كإبداعي حتى يختار الزائر

    const welcomeScreen = document.getElementById('welcome-screen');
    const btnCreative = document.getElementById('btn-creative-mode');
    const btnPro = document.getElementById('btn-pro-mode');

    if (isDayMode) document.body.classList.add('day-mode');
    if (isColorblind) document.body.classList.add('colorblind-mode');
    
    // إظهار شاشة الترحيب دائماً
    if (welcomeScreen) {
        welcomeScreen.style.display = 'flex';
        setTimeout(() => {
            welcomeScreen.style.opacity = '1';
            welcomeScreen.style.visibility = 'visible';
        }, 50);
    }

    if (btnCreative) {
        btnCreative.addEventListener('click', () => {
            isProMode = false;
            document.body.classList.remove('professional-mode');
            const proBtn = document.getElementById('pro-toggle');
            if(proBtn) {
                proBtn.querySelector('.icon').textContent = '💼';
                proBtn.setAttribute('data-tooltip', 'الوضع الرسمي');
            }
            finalizeWelcome();
        });
    }

    if (btnPro) {
        btnPro.addEventListener('click', () => {
            isProMode = true;
            document.body.classList.add('professional-mode');
            const proBtn = document.getElementById('pro-toggle');
            if(proBtn) {
                proBtn.querySelector('.icon').textContent = '✨';
                proBtn.setAttribute('data-tooltip', 'الوضع السحري');
            }
            finalizeWelcome();
        });
    }

    function finalizeWelcome() {
        if (welcomeScreen) {
            welcomeScreen.style.opacity = '0';
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
            }, 800);
        }
        
        updateLanguage();
        setTimeout(typeWriter, 500);
        
        if(!isProMode && typeof createParticle === 'function') {
             for(let i=0; i<15; i++) createParticle(window.innerWidth/2, window.innerHeight/2);
        }
    }

    /* ================= 2. محرك المؤشر السحري ================= */
    const cursor = document.getElementById('magic-cursor');
    const particlesContainer = document.getElementById('particles-container');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener('mousemove', (e) => {
        if (isProMode) return; 
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (Math.random() > 0.6) createParticle(mouseX, mouseY);
    });

    function createParticle(x, y) {
        if(!particlesContainer) return;
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.transform = `translate3d(${x}px, ${y}px, 0)`; 
        particlesContainer.appendChild(particle);
        
        let opacity = 1;
        let posY = y;
        let posX = x;
        const speedY = Math.random() * 2 + 1;
        const speedX = (Math.random() - 0.5) * 2;
        
        function animateParticle() {
            opacity -= 0.02;
            posY += speedY;
            posX += speedX;
            particle.style.opacity = opacity;
            particle.style.transform = `translate3d(${posX}px, ${posY}px, 0) scale(${opacity})`;
            
            if (opacity > 0) requestAnimationFrame(animateParticle);
            else particle.remove();
        }
        requestAnimationFrame(animateParticle);
    }

    function animateCursorLoop() {
        if (isProMode) {
            requestAnimationFrame(animateCursorLoop);
            return;
        }
        const easing = 0.15;
        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;
        
        if (cursor) {
            cursor.style.transform = `translate3d(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%), 0)`;
            
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const distance = Math.sqrt(dx*dx + dy*dy);
            const svg = cursor.querySelector('svg');
            
            if(svg) {
                if(distance > 5) {
                    svg.style.transform = `rotate(${angle}deg) scale(${1 + distance/100})`;
                    svg.style.transition = 'transform 0.1s linear';
                } else {
                    svg.style.transform = `rotate(0deg) scale(1)`;
                    svg.style.transition = 'transform 0.5s ease-out';
                }
            }
        }
        requestAnimationFrame(animateCursorLoop);
    }
    animateCursorLoop();

    document.addEventListener('mousedown', (e) => {
        if (isProMode) return; 
        const ripple = document.createElement('div');
        ripple.classList.add('cursor-click-effect');
        ripple.style.left = '0'; ripple.style.top = '0';
        ripple.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
        document.body.appendChild(ripple);
        for(let i=0; i<10; i++) createParticle(e.clientX, e.clientY);
        setTimeout(() => ripple.remove(), 600);
    });

    const interactables = document.querySelectorAll('button, a, input, textarea, .tarot-card-container, .tracker-dot, .potion-card, .spell-chapter, .social-portal-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if(isProMode || !cursor) return;
            const svg = cursor.querySelector('svg');
            if(svg) {
                svg.style.fill = 'rgba(212, 175, 55, 0.5)';
                svg.style.transform = 'scale(1.5)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if(isProMode || !cursor) return;
            const svg = cursor.querySelector('svg');
            if(svg) {
                svg.style.fill = '#FFF7D6';
                svg.style.transform = 'scale(1)';
            }
        });
    });

    /* ================= 3. شريط التقدم وتتبع المسار ================= */
    const statusBar = document.getElementById('system-status-bar');
    const sections = document.querySelectorAll('.section');
    const trackerDots = document.querySelectorAll('.tracker-dot');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if(statusBar) statusBar.style.width = `${(scrollY / docHeight) * 100}%`;
        if(backToTopBtn) backToTopBtn.style.display = scrollY > 500 ? 'flex' : 'none';

        let current = '';
        sections.forEach(section => {
            if (scrollY >= (section.offsetTop - section.clientHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        trackerDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href').includes(current)) dot.classList.add('active');
        });
    });

    /* ================= 4. النافذة المنبثقة للمشاريع (Modal) ================= */
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalTitle = document.getElementById('modal-project-title');
    const modalDetails = document.getElementById('modal-project-details');
    const modalDate = document.getElementById('modal-project-date');
    const modalRole = document.getElementById('modal-project-role');
    const modalDesc = document.getElementById('modal-project-desc');
    const modalImage = document.getElementById('modal-project-image');
    const modalComingSoon = document.getElementById('modal-coming-soon');
    
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const isAr = document.documentElement.getAttribute('lang') === 'ar';
            
            let titleText;
            if(isProMode && btn.hasAttribute(isAr ? 'data-pro-ar' : 'data-pro-en')) {
                titleText = btn.getAttribute(isAr ? 'data-pro-ar' : 'data-pro-en');
            } else {
                titleText = btn.getAttribute(isAr ? 'data-project-ar' : 'data-project-en');
            }
            if(modalTitle) modalTitle.textContent = titleText;
            
            const imageSrc = btn.getAttribute('data-image');
            
            if (imageSrc && imageSrc !== "") {
                if(modalDate) modalDate.textContent = btn.getAttribute(isAr ? 'data-date-ar' : 'data-date-en') || '';
                if(modalRole) modalRole.textContent = btn.getAttribute(isAr ? 'data-role-ar' : 'data-role-en') || '';
                if(modalDesc) modalDesc.textContent = btn.getAttribute(isAr ? 'data-desc-ar' : 'data-desc-en') || '';
                if(modalImage) modalImage.src = imageSrc;
                
                if(modalDetails) modalDetails.style.display = 'block';
                if(modalComingSoon) modalComingSoon.style.display = 'none';
            } else {
                if(modalDetails) modalDetails.style.display = 'none';
                if(modalComingSoon) modalComingSoon.style.display = 'block';
            }

            if(modal) {
                modal.classList.add('active');
                modal.classList.remove('hidden');
            }
            
            const scrollBody = modal ? modal.querySelector('.modal-scrollable-body') : null;
            if (scrollBody) scrollBody.scrollTop = 0;
            
            if(!isProMode) {
                const rect = btn.getBoundingClientRect();
                for(let i=0; i<20; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
            }
        });
    });

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.classList.add('hidden'), 300);
        });
    }

    /* ================= 5. نظام اللغات والتأثيرات ================= */
    const langToggle = document.getElementById('lang-toggle');
    const prologueTextElement = document.getElementById('prologue-text');
    let typeWriterTimeout;
    let isTyping = false;

    function updateLanguage() {
        const isAr = currentLang === 'ar';
        document.documentElement.setAttribute('lang', isAr ? 'ar' : 'en');
        document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
        if(langToggle) langToggle.querySelector('.icon').textContent = isAr ? 'EN' : 'ع';
        
        document.querySelectorAll('.translate').forEach(el => {
            let newText;
            if(isProMode && el.hasAttribute(isAr ? 'data-pro-ar' : 'data-pro-en')) {
                newText = el.getAttribute(isAr ? 'data-pro-ar' : 'data-pro-en');
            } else {
                newText = el.getAttribute(isAr ? 'data-ar' : 'data-en');
            }
            if (newText && el.id !== 'prologue-text') {
                el.textContent = newText;
            }
        });

        document.querySelectorAll('.translate-placeholder').forEach(el => {
            let newText;
            if(isProMode && el.hasAttribute(isAr ? 'data-pro-ar' : 'data-pro-en')) {
                newText = el.getAttribute(isAr ? 'data-pro-ar' : 'data-pro-en');
            } else {
                newText = el.getAttribute(isAr ? 'data-placeholder-ar' : 'data-placeholder-en');
            }
            if(newText) el.placeholder = newText;
        });

        document.querySelectorAll('.translate-list').forEach(ul => {
            let itemsString;
            if(isProMode && ul.hasAttribute(isAr ? 'data-pro-ar' : 'data-pro-en')) {
                itemsString = ul.getAttribute(isAr ? 'data-pro-ar' : 'data-pro-en');
            } else {
                itemsString = ul.getAttribute(isAr ? 'data-ar' : 'data-en');
            }
            if(!itemsString) return;
            const items = itemsString.split('|');
            ul.innerHTML = '';
            items.forEach(itemText => {
                const li = document.createElement('li');
                li.textContent = (isProMode ? '- ' : '✧ ') + itemText;
                ul.appendChild(li);
            });
        });

        if (isTyping && prologueTextElement) {
            prologueTextElement.textContent = ''; 
        }
    }

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            localStorage.setItem('asmaa_lang', currentLang);
            updateLanguage();
            typeWriter();
            if(!isProMode) {
                const rect = langToggle.getBoundingClientRect();
                for(let i=0; i<15; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
            }
        });
    }

    function typeWriter() {
        if(!prologueTextElement) return;
        const isAr = currentLang === 'ar';
        let text;
        if(isProMode && prologueTextElement.hasAttribute(isAr ? 'data-pro-ar' : 'data-pro-en')) {
            text = prologueTextElement.getAttribute(isAr ? 'data-pro-ar' : 'data-pro-en');
        } else {
            text = prologueTextElement.getAttribute(isAr ? 'data-ar' : 'data-en');
        }
        
        if(!text) return;
        prologueTextElement.innerHTML = '';
        let i = 0;
        clearTimeout(typeWriterTimeout);
        isTyping = true;
        
        function type() {
            if (i < text.length) {
                prologueTextElement.innerHTML += text.charAt(i);
                i++;
                typeWriterTimeout = setTimeout(type, 30); 
            } else {
                isTyping = false;
            }
        }
        type();
    }

    /* ================= 6. تبديل الوضع الاحترافي، الثيم، وعمى الألوان ================= */
    const proToggleBtn = document.getElementById('pro-toggle');
    if (proToggleBtn) {
        proToggleBtn.addEventListener('click', () => {
            isProMode = !isProMode;
            if(isProMode) {
                document.body.classList.add('professional-mode');
                proToggleBtn.querySelector('.icon').textContent = '✨';
                proToggleBtn.setAttribute('data-tooltip', 'الوضع السحري');
            } else {
                document.body.classList.remove('professional-mode');
                proToggleBtn.querySelector('.icon').textContent = '💼';
                proToggleBtn.setAttribute('data-tooltip', 'الوضع الرسمي');
            }
            
            updateLanguage();
            typeWriter();
            
            if(!isProMode) {
                const rect = proToggleBtn.getBoundingClientRect();
                for(let i=0; i<15; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
            }
        });
    }

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('day-mode');
            isDayMode = document.body.classList.contains('day-mode');
            localStorage.setItem('asmaa_theme', isDayMode ? 'day' : 'night');
            themeToggleBtn.querySelector('.icon').textContent = isDayMode ? '☀️' : '🌙';
            if(!isProMode) {
                const rect = themeToggleBtn.getBoundingClientRect();
                for(let i=0; i<15; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
            }
        });
    }
    
    const colorblindBtn = document.getElementById('colorblind-toggle');
    if (colorblindBtn) {
        colorblindBtn.addEventListener('click', () => {
            document.body.classList.toggle('colorblind-mode');
            isColorblind = document.body.classList.contains('colorblind-mode');
            localStorage.setItem('asmaa_colorblind', isColorblind);
            if(!isProMode) {
                const rect = colorblindBtn.getBoundingClientRect();
                for(let i=0; i<15; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
            }
        });
    }

    /* ================= 7. نموذج الاستدعاء المباشر ================= */
    const summonForm = document.getElementById('summon-form');
    const successMessage = document.getElementById('summon-success'); 
    const summonBtn = document.getElementById('summon-btn');

    if (summonForm) {
        summonForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!summonForm.checkValidity()) {
                summonForm.reportValidity();
                return;
            }

            const originalBtnText = summonBtn.innerHTML;
            const isAr = document.documentElement.getAttribute('lang') === 'ar';
            summonBtn.innerHTML = isAr ? '<span>جاري الإرسال...</span><span class="btn-sparkle">⏳</span>' : '<span>Sending...</span><span class="btn-sparkle">⏳</span>';
            summonBtn.disabled = true;

            const formData = {
                name: document.getElementById('summoner-name').value,
                email: document.getElementById('summoner-email').value,
                message: document.getElementById('summoner-message').value, 
                _captcha: "false"
            };

            fetch("https://formsubmit.co/ajax/Asmaawork57@outlook.sa", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                summonForm.style.transition = 'all 0.5s ease';
                summonForm.style.transform = 'scale(0.8)';
                summonForm.style.opacity = '0';
                
                setTimeout(() => {
                    summonForm.style.display = 'none';
                    summonForm.classList.add('hidden');
                    
                    if(successMessage) {
                        successMessage.style.display = 'block'; 
                        successMessage.classList.remove('hidden');
                        successMessage.classList.add('show');
                        
                        if(!isProMode) {
                            const rect = successMessage.getBoundingClientRect();
                            for(let i=0; i<30; i++) {
                                setTimeout(() => {
                                    createParticle(rect.left + rect.width/2 + (Math.random()*100-50), rect.top + rect.height/2 + (Math.random()*100-50));
                                }, i * 50);
                            }
                        }
                    }
                }, 500);

                setTimeout(() => {
                    summonForm.reset();
                    if(successMessage) {
                        successMessage.style.display = 'none';
                        successMessage.classList.add('hidden');
                        successMessage.classList.remove('show');
                    }
                    
                    summonForm.style.display = 'block'; 
                    summonForm.classList.remove('hidden');
                    
                    summonBtn.innerHTML = originalBtnText;
                    summonBtn.disabled = false;
                    
                    requestAnimationFrame(() => {
                        summonForm.style.transform = 'scale(1)';
                        summonForm.style.opacity = '1';
                    });
                }, 6000);
            })
            .catch(error => {
                alert(isAr ? 'تعثر الإرسال! تأكدي من الاتصال.' : 'Failed! Check your connection.');
                summonBtn.innerHTML = originalBtnText;
                summonBtn.disabled = false;
            });
        });
    }
});
