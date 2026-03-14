document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. محرك المؤشر السحري (مستقل ومضاد للـ RTL)
       ========================================================================== */
    const cursor = document.getElementById('magic-cursor');
    const particlesContainer = document.getElementById('particles-container');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

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
        
        cursor.style.transform = `translate3d(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%), 0)`;
        
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if(distance > 5) {
            const svg = cursor.querySelector('svg');
            svg.style.transform = `rotate(${angle}deg) scale(${1 + distance/100})`;
            svg.style.transition = 'transform 0.1s linear';
        } else {
            const svg = cursor.querySelector('svg');
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
            cursor.style.filter = 'drop-shadow(0 0 20px #FFF) brightness(1.5)';
            cursor.querySelector('svg').style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.filter = 'drop-shadow(0 0 10px var(--glow-color))';
            cursor.querySelector('svg').style.transform = 'scale(1)';
        });
    });

    /* ==========================================================================
       2. تتبع المسار وشريط التقدم
       ========================================================================== */
    const sections = document.querySelectorAll('.section');
    const trackerDots = document.querySelectorAll('.tracker-dot');
    const statusBar = document.getElementById('system-status-bar');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        statusBar.style.width = `${(scrollY / docHeight) * 100}%`;
        backToTopBtn.style.display = scrollY > 500 ? 'flex' : 'none';

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

    /* ==========================================================================
       3. النوافذ المنبثقة للمشاريع
       ========================================================================== */
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalTitle = document.getElementById('modal-project-title');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isAr = document.documentElement.getAttribute('lang') === 'ar';
            modalTitle.textContent = btn.getAttribute(isAr ? 'data-project-ar' : 'data-project-en');
            modal.classList.add('active');
            
            const rect = btn.getBoundingClientRect();
            for(let i=0; i<20; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
        });
    });

    function closeModal() { modal.classList.remove('active'); }
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });

    /* ==========================================================================
       4. نظام اللغات، الثيم، وعمى الألوان
       ========================================================================== */
    let currentLang = 'ar';
    const langBtn = document.getElementById('lang-toggle');
    const htmlTag = document.documentElement;

    function updateLanguage() {
        const isAr = currentLang === 'ar';
        htmlTag.setAttribute('lang', isAr ? 'ar' : 'en');
        htmlTag.setAttribute('dir', isAr ? 'rtl' : 'ltr');
        
        document.querySelectorAll('.translate').forEach(el => {
            el.textContent = el.getAttribute(isAr ? 'data-ar' : 'data-en');
        });
        
        document.querySelectorAll('.translate-placeholder').forEach(el => {
            el.setAttribute('placeholder', el.getAttribute(isAr ? 'data-placeholder-ar' : 'data-placeholder-en'));
        });

        document.querySelectorAll('.translate-list').forEach(ul => {
            const items = ul.getAttribute(isAr ? 'data-ar' : 'data-en').split('|');
            ul.innerHTML = '';
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = '✧ ' + item;
                ul.appendChild(li);
            });
        });
    }

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        updateLanguage();
        createExplosion(langBtn);
    });

    const themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('day-mode');
        themeToggleBtn.querySelector('.icon').textContent = document.body.classList.contains('day-mode') ? '☀️' : '🌙';
        createExplosion(themeToggleBtn);
    });

    const colorblindBtn = document.getElementById('colorblind-toggle');
    colorblindBtn.addEventListener('click', () => {
        document.body.classList.toggle('colorblind-mode');
        createExplosion(colorblindBtn);
    });

    function createExplosion(btn) {
        const rect = btn.getBoundingClientRect();
        for(let i=0; i<15; i++) createParticle(rect.left + rect.width/2, rect.top + rect.height/2);
    }

    /* ==========================================================================
       5. تأثير الآلة الكاتبة الأولي (تم الإصلاح لضمان عدم التكرار)
       ========================================================================== */
    const prologueTextElement = document.getElementById('prologue-text');
    // نحدد النص الأصلي بناءً على اللغة المختارة حالياً عند تحميل الصفحة
    let originalText = currentLang === 'ar' ? prologueTextElement.getAttribute('data-ar') : prologueTextElement.getAttribute('data-en');
    
    prologueTextElement.textContent = ''; // تفريغ العنصر تماماً قبل البدء
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < originalText.length) {
            prologueTextElement.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 35);
        }
    }

    // ملاحظة: تأكدي أن updateLanguage() لا تقوم بتغيير نص prologue-text أثناء عمل دالة الكتابة
    updateLanguage(); 
    
    // تشغيل التأثير بعد ثانية واحدة من تحميل الصفحة
    setTimeout(typeWriter, 1000);


    /* ==========================================================================
       6. نموذج التواصل الحقيقي (FormSubmit AJAX)
       ========================================================================== */
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
                message: document.getElementById('summoner-msg').value,
                _captcha: "false" // منع ظهور صفحة التحقق
            };

            // إرسال البيانات مباشرة إلى إيميلك
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
                    summonForm.classList.add('hidden');
                    successMessage.classList.remove('hidden');
                    
                    const rect = successMessage.getBoundingClientRect();
                    for(let i=0; i<30; i++) {
                        setTimeout(() => {
                            createParticle(rect.left + rect.width/2 + (Math.random()*100-50), rect.top + rect.height/2 + (Math.random()*100-50));
                        }, i * 50);
                    }
                }, 500);

                setTimeout(() => {
                    summonForm.reset();
                    successMessage.classList.add('hidden');
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
                console.log(error);
                alert(isAr ? 'تعثرت التعويذة! تأكدي من اتصالك بالإنترنت وحاولي مجدداً.' : 'Spell failed! Check your connection and try again.');
                summonBtn.innerHTML = originalBtnText;
                summonBtn.disabled = false;
            });
        });
    }
});