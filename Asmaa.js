document.addEventListener('DOMContentLoaded', () => {

    /* ================= 1. محرك المؤشر السحري المحدث (Smooth fixed movement) ================= */
    const cursor = document.getElementById('magic-cursor');
    const particlesContainer = document.getElementById('particles-container');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    // استخدام clientX و clientY لحركة المؤشر بسلاسة أثناء التمرير
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (Math.random() > 0.6) createParticle(mouseX, mouseY);
    });

    function createParticle(x, y) {
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
        const easing = 0.15;
        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;
        
        // استخدام translate3d لتحديث الموقع بشكل ثابت دون أن يختفي عند عمل Scroll
        cursor.style.transform = `translate3d(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%), 0)`;
        
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const distance = Math.sqrt(dx*dx + dy*dy);
        const svg = cursor.querySelector('svg');
        
        if(distance > 5) {
            svg.style.transform = `rotate(${angle}deg) scale(${1 + distance/100})`;
            svg.style.transition = 'transform 0.1s linear';
        } else {
            svg.style.transform = `rotate(0deg) scale(1)`;
            svg.style.transition = 'transform 0.5s ease-out';
        }
        requestAnimationFrame(animateCursorLoop);
    }
    animateCursorLoop();

    document.addEventListener('mousedown', (e) => {
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
            cursor.querySelector('svg').style.fill = 'rgba(212, 175, 55, 0.5)';
            cursor.querySelector('svg').style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.querySelector('svg').style.fill = '#FFF7D6';
            cursor.querySelector('svg').style.transform = 'scale(1)';
        });
    });

    /* ================= 2. شريط التقدم وتتبع المسار ================= */
    const statusBar = document.getElementById('system-status-bar');
    const sections = document.querySelectorAll('.section');
    const trackerDots = document.querySelectorAll('.tracker-dot');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        statusBar.style.width = `${(scrollY / docHeight) * 100}%`;
        backToTopBtn.style.display = scrollY > 500 ? 'flex' : 'none';

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

    /* ================= 3. النافذة المنبثقة المحدثة للمشاريع (Modal) ================= */
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
            
            // قراءة العنوان
            modalTitle.textContent = btn.getAttribute(isAr ? 'data-project-ar' : 'data-project-en');
            
            // قراءة الصورة للتحقق من نوع المشروع
            const imageSrc = btn.getAttribute('data-image');
            
            if (imageSrc && imageSrc !== "") {
                // إذا كان هناك صورة (مثل مشروع UQU Dine)، نعرض التفاصيل
                modalDate.textContent = btn.getAttribute(isAr ? 'data-date-ar' : 'data-date-en') || '';
                modalRole.textContent = btn.getAttribute(isAr ? 'data-role-ar' : 'data-role-en') || '';
                modalDesc.textContent = btn.getAttribute(isAr ? 'data-desc-ar' : 'data-desc-en') || '';
                modalImage.src = imageSrc;
                
                modalDetails.style.display = 'block';
                modalComingSoon.style.display = 'none';
            } else {
                // إذا لم يكن هناك صورة (مثل مشروع بلدي)، نظهر رسالة "في طور التكوين"
                modalDetails.style.display = 'none';
                modalComingSoon.style.display = 'block';
            }

            modal.classList.add('active');
            modal.classList.remove('hidden');
            
            // إعادة التمرير للأعلى في حالة تم التمرير مسبقاً داخل المودال
            const scrollBody = modal.querySelector('.modal-scrollable-body');
            if (scrollBody) scrollBody.scrollTop = 0;
            
            const rect = btn.getBoundingClientRect();
            for(let i=0; i<20; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.classList.add('hidden'), 300);
        });
    }

    /* ================= 4. اللغات والتأثيرات والآلة الكاتبة ================= */
    const langToggle = document.getElementById('lang-toggle');
    const prologueTextElement = document.getElementById('prologue-text');
    let currentLang = 'ar';
    let typeWriterTimeout;
    let isTyping = false;

    function updateLanguage() {
        const isAr = currentLang === 'ar';
        document.documentElement.setAttribute('lang', isAr ? 'ar' : 'en');
        document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
        langToggle.querySelector('.icon').textContent = isAr ? 'EN' : 'ع';
        
        document.querySelectorAll('.translate').forEach(el => {
            const newText = el.getAttribute(isAr ? 'data-ar' : 'data-en');
            if (newText && el.id !== 'prologue-text') {
                el.textContent = newText;
            }
        });

        document.querySelectorAll('.translate-placeholder').forEach(el => {
            const newText = el.getAttribute(isAr ? 'data-placeholder-ar' : 'data-placeholder-en');
            if(newText) el.placeholder = newText;
        });

        document.querySelectorAll('.translate-list').forEach(ul => {
            const items = ul.getAttribute(isAr ? 'data-ar' : 'data-en').split('|');
            ul.innerHTML = '';
            items.forEach(itemText => {
                const li = document.createElement('li');
                li.textContent = itemText;
                ul.appendChild(li);
            });
        });

        if (isTyping) {
            prologueTextElement.textContent = ''; 
        }
    }

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            updateLanguage();
            typeWriter();
            const rect = langToggle.getBoundingClientRect();
            for(let i=0; i<15; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
        });
    }

    function typeWriter() {
        const isAr = currentLang === 'ar';
        const text = prologueTextElement.getAttribute(isAr ? 'data-ar' : 'data-en');
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

    updateLanguage();
    setTimeout(typeWriter, 1000);

    /* ================= 5. تغيير الثيم وعمى الألوان ================= */
    const themeToggle = document.getElementById('theme-toggle');
    const colorblindToggle = document.getElementById('colorblind-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('day-mode');
            themeToggle.querySelector('.icon').textContent = document.body.classList.contains('day-mode') ? '☀️' : '🌙';
            const rect = themeToggle.getBoundingClientRect();
            for(let i=0; i<15; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
        });
    }
    
    if (colorblindToggle) {
        colorblindToggle.addEventListener('click', () => {
            document.body.classList.toggle('colorblind-mode');
            const rect = colorblindToggle.getBoundingClientRect();
            for(let i=0; i<15; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
        });
    }

    /* ================= 6. نموذج الاستدعاء المباشر ================= */
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
            summonBtn.innerHTML = isAr ? '<span>جاري الإرسال عبر الأثير...</span><span class="btn-sparkle">⏳</span>' : '<span>Sending through the ether...</span><span class="btn-sparkle">⏳</span>';
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
                    
                    successMessage.style.display = 'block'; 
                    successMessage.classList.remove('hidden');
                    successMessage.classList.add('show');
                    
                    const rect = successMessage.getBoundingClientRect();
                    for(let i=0; i<30; i++) {
                        setTimeout(() => {
                            createParticle(rect.left + rect.width/2 + (Math.random()*100-50), rect.top + rect.height/2 + (Math.random()*100-50));
                        }, i * 50);
                    }
                }, 500);

                setTimeout(() => {
                    summonForm.reset();
                    successMessage.style.display = 'none';
                    successMessage.classList.add('hidden');
                    successMessage.classList.remove('show');
                    
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
                alert(isAr ? 'تعثرت التعويذة! تأكدي من اتصالك بالإنترنت وحاولي مجدداً.' : 'Spell failed! Check your connection and try again.');
                summonBtn.innerHTML = originalBtnText;
                summonBtn.disabled = false;
            });
        });
    }
});