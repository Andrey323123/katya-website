// Основные переменные и константы
const CONFIG = {
    startDate: '2023-09-15', // Дата, когда вы познакомились с Катей
    secretCode: 20, // 4 буквы в имени × 5 суперсил = 20
    audioFiles: {
        main: 'music/song.mp3',
        happy: 'https://assets.mixkit.co/music/preview/mixkit-happy-day-583.mp3',
        dreamy: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3',
        magic: 'https://assets.mixkit.co/music/preview/mixkit-magic-sparkles-176.mp3',
        cozy: 'https://assets.mixkit.co/music/preview/mixkit-cozy-atmosphere-439.mp3'
    }
};

// Состояние приложения
let state = {
    currentSection: 'home',
    theme: 'light',
    audioPlaying: false,
    visualizerMode: 'heart',
    puzzleSequence: [],
    gameCompleted: false,
    attempts: 0,
    complimentsGenerated: 0,
    accuracyRecord: 0,
    totalLikes: 0,
    revealedReasons: 0
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startAnimations();
    createFloatingHearts();
    initializeParticles();
    loadReasons();
    initializeVisualizer();
});

// ===== ОСНОВНЫЕ ФУНКЦИИ =====

function initializeApp() {
    // Установка имени
    document.getElementById('mainName').textContent = 'Катя';
    
    // Загрузка имен на разных языках
    loadNameTranslations();
    
    // Настройка таймера
    updateFriendshipTimer();
    setInterval(updateFriendshipTimer, 60000); // Обновлять каждую минуту
    
    // Настройка аудио
    setupAudioPlayer();
    
    // Скрыть лоадер через 2 секунды
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('main-content').style.opacity = '1';
    }, 2000);
    
    // Инициализация AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
}

function setupEventListeners() {
    // Навигация
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Фильтр причин
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterReasons(filter);
        });
    });
    
    // Интерактивный мир
    document.querySelectorAll('.world-element').forEach(element => {
        element.addEventListener('click', () => {
            const elementId = element.id;
            showWorldDescription(elementId);
        });
    });
    
    // Генератор фото
    document.querySelectorAll('.gen-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const scenario = this.textContent.trim().toLowerCase();
            generatePhoto(scenario);
        });
    });
    
    // Мини-игра
    document.querySelectorAll('.puzzle-piece').forEach(piece => {
        piece.addEventListener('click', () => {
            const pieceNum = piece.getAttribute('data-piece');
            handlePuzzleClick(pieceNum);
        });
    });
    
    // Случайная причина
    document.querySelector('.random-btn').addEventListener('click', showRandomReason);
    
    // Секретный код
    document.getElementById('secretCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkSecretCode();
        }
    });
    
    // Громкость аудио
    document.getElementById('volumeSlider').addEventListener('input', function() {
        const audio = document.getElementById('mainAudio');
        audio.volume = this.value / 100;
    });
}

// ===== ИМЯ КАТИ НА РАЗНЫХ ЯЗЫКАХ =====

const NAME_TRANSLATIONS = [
    { language: 'Английский', name: 'Kate', flag: '🇬🇧', pronunciation: 'Кейт' },
    { language: 'Французский', name: 'Catherine', flag: '🇫🇷', pronunciation: 'Катрин' },
    { language: 'Испанский', name: 'Catalina', flag: '🇪🇸', pronunciation: 'Каталина' },
    { language: 'Итальянский', name: 'Caterina', flag: '🇮🇹', pronunciation: 'Катерина' },
    { language: 'Немецкий', name: 'Katharina', flag: '🇩🇪', pronunciation: 'Катарина' },
    { language: 'Японский', name: 'キャサリン', flag: '🇯🇵', pronunciation: 'Кясарйн' },
    { language: 'Корейский', name: '캐서린', flag: '🇰🇷', pronunciation: 'Кэсорин' },
    { language: 'Китайский', name: '凯特', flag: '🇨🇳', pronunciation: 'Кайтэ' },
    { language: 'Арабский', name: 'كاثرين', flag: '🇸🇦', pronunciation: 'Катрин' },
    { language: 'Хинди', name: 'कैथरीन', flag: '🇮🇳', pronunciation: 'Кайтрин' },
    { language: 'Греческий', name: 'Αικατερίνη', flag: '🇬🇷', pronunciation: 'Экатерини' },
    { language: 'Португальский', name: 'Catarina', flag: '🇵🇹', pronunciation: 'Катарина' },
    { language: 'Нидерландский', name: 'Katrijn', flag: '🇳🇱', pronunciation: 'Катрэйн' },
    { language: 'Шведский', name: 'Katarina', flag: '🇸🇪', pronunciation: 'Катарина' },
    { language: 'Польский', name: 'Katarzyna', flag: '🇵🇱', pronunciation: 'Катажина' },
    { language: 'Чешский', name: 'Kateřina', flag: '🇨🇿', pronunciation: 'Катержина' },
    { language: 'Венгерский', name: 'Katalin', flag: '🇭🇺', pronunciation: 'Каталин' },
    { language: 'Турецкий', name: 'Katerina', flag: '🇹🇷', pronunciation: 'Катерина' },
    { language: 'Иврит', name: 'קטיה', flag: '🇮🇱', pronunciation: 'Катья' },
    { language: 'Эльфийский', name: 'Celebrindal', flag: '🧝‍♀️', pronunciation: 'Келебриндаль' },
    { language: 'Драконий', name: 'Kæthæriin', flag: '🐉', pronunciation: 'Кэтэриин' },
    { language: 'Галактический', name: 'K-427', flag: '🚀', pronunciation: 'Кей-Фор-Ту-Севен' },
    { language: 'Волшебный', name: 'Sparkleheart', flag: '✨', pronunciation: 'Спарклхарт' }
];

function loadNameTranslations() {
    const nameList = document.getElementById('nameList');
    NAME_TRANSLATIONS.forEach((translation, index) => {
        const nameItem = document.createElement('div');
        nameItem.className = 'name-item';
        nameItem.innerHTML = `
            <div class="name-flag">${translation.flag}</div>
            <h4>${translation.language}</h4>
            <p class="name-text">${translation.name}</p>
            <p class="pronunciation">(${translation.pronunciation})</p>
        `;
        nameItem.style.animationDelay = `${index * 0.1}s`;
        nameList.appendChild(nameItem);
    });
}

function changeNameLanguage() {
    const nameList = document.getElementById('nameList');
    nameList.classList.toggle('show');
    
    // Анимация появления
    if (nameList.classList.contains('show')) {
        document.querySelectorAll('.name-item').forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
}

// ===== ТАЙМЕР ЗНАКОМСТВА =====

function updateFriendshipTimer() {
    const startDate = new Date(CONFIG.startDate);
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    const timerText = `${diffDays} дней, ${diffHours} часов, ${diffMinutes} минут`;
    document.getElementById('friendshipTimer').textContent = timerText;
    
    // Каждый день добавляем сердечко в фон
    if (diffDays > 0) {
        const hearts = document.querySelectorAll('.heart');
        if (hearts.length < diffDays * 2) {
            createFloatingHearts(diffDays * 2 - hearts.length);
        }
    }
}

// ===== АНИМАЦИИ И ЭФФЕКТЫ =====

function startAnimations() {
    // Анимация диаграммы
    setTimeout(() => {
        document.querySelectorAll('.diagram-item').forEach(item => {
            const value = item.getAttribute('data-value');
            const bar = item.querySelector('.diagram-bar');
            bar.style.height = `${value}%`;
            bar.setAttribute('data-value', value);
        });
        
        // Анимация качеств
        document.querySelectorAll('.quality-meter').forEach(meter => {
            const value = meter.getAttribute('data-quality');
            meter.style.setProperty('--width', `${value}%`);
        });
    }, 1000);
    
    // Автоматическая смена цвета фона
    setInterval(() => {
        if (!state.audioPlaying) return;
        const hue = Math.sin(Date.now() / 10000) * 60 + 300;
        document.documentElement.style.setProperty('--primary-color', `hsl(${hue}, 100%, 65%)`);
    }, 100);
}

function createFloatingHearts(count = 50) {
    const container = document.querySelector('.floating-hearts');
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 20 + 10}px`;
        heart.style.animationDelay = `${Math.random() * 15}s`;
        heart.style.animationDuration = `${Math.random() * 10 + 10}s`;
        container.appendChild(heart);
    }
}

function initializeParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    // Установка размеров canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Создание частиц
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            color: `hsl(${Math.random() * 60 + 300}, 100%, 65%)`,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    
    // Анимация частиц
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Обновление позиции
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Отскок от границ
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            // Рисование частицы
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
        });
        
        // Соединение частиц линиями
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 107, 139, ${0.2 * (1 - distance/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// ===== СМЕНА СЕКЦИЙ =====

function switchSection(sectionId) {
    // Обновление активной кнопки навигации
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === sectionId) {
            btn.classList.add('active');
        }
    });
    
    // Скрытие всех секций
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Показ выбранной секции
    const activeSection = document.getElementById(sectionId);
    activeSection.classList.add('active');
    
    // Прокрутка к секции
    activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Обновление состояния
    state.currentSection = sectionId;
    
    // Специальные эффекты для секций
    switch(sectionId) {
        case 'music':
            startVisualizer();
            break;
        case 'secret':
            shakeSecretLocks();
            break;
        case 'world':
            animateWorldScene();
            break;
    }
}

// ===== 100 ПРИЧИН =====

const REASONS_DATA = [
    // Улыбка (20 причин)
    { id: 1, category: 'smile', title: 'Искренность', 
      text: 'Её улыбка никогда не бывает фальшивой', icon: 'fas fa-smile-beam' },
    { id: 2, category: 'smile', title: 'Солнечность', 
      text: 'От её улыбки в помещении становится светлее', icon: 'fas fa-sun' },
    { id: 3, category: 'smile', title: 'Заразность', 
      text: 'Невозможно не улыбнуться в ответ', icon: 'fas fa-laugh-beam' },
    { id: 4, category: 'smile', title: 'Тёплая', 
      text: 'Согревает душу даже в самый холодный день', icon: 'fas fa-temperature-high' },
    { id: 5, category: 'smile', title: 'Лучистая', 
      text: 'Будто состоит из солнечных лучей', icon: 'fas fa-sunshine' },
    
    // Характер (30 причин)
    { id: 21, category: 'character', title: 'Доброта', 
      text: 'Видит хорошее даже в самых сложных людях', icon: 'fas fa-heart' },
    { id: 22, category: 'character', title: 'Честность', 
      text: 'Всегда говорит то, что думает, но с тактом', icon: 'fas fa-comment-alt' },
    { id: 23, category: 'character', title: 'Верность', 
      text: 'Если она друг, то это навсегда', icon: 'fas fa-handshake' },
    { id: 24, category: 'character', title: 'Сила духа', 
      text: 'Никогда не сдаётся, даже когда трудно', icon: 'fas fa-fist-raised' },
    { id: 25, category: 'character', title: 'Чувство юмора', 
      text: 'Умеет посмеяться над собой и ситуацией', icon: 'fas fa-theater-masks' },
    
    // Волшебство (25 причин)
    { id: 51, category: 'magic', title: 'Внутренний свет', 
      text: 'Будто у неё внутри живёт маленькое солнце', icon: 'fas fa-star' },
    { id: 52, category: 'magic', title: 'Энергетика', 
      text: 'Заряжает позитивом на расстоянии', icon: 'fas fa-bolt' },
    { id: 53, category: 'magic', title: 'Интуиция', 
      text: 'Часто знает, что ты чувствуешь, без слов', icon: 'fas fa-eye' },
    { id: 54, category: 'magic', title: 'Преображение', 
      text: 'Рядом с ней обычный день становится праздником', icon: 'fas fa-magic' },
    { id: 55, category: 'magic', title: 'Волшебный смех', 
      text: 'Её смех звучит как мелодия счастья', icon: 'fas fa-music' },
    
    // Влияние (25 причин)
    { id: 76, category: 'impact', title: 'Вдохновляет', 
      text: 'После общения с ней хочется творить', icon: 'fas fa-paint-brush' },
    { id: 77, category: 'impact', title: 'Успокаивает', 
      text: 'Её присутствие снимает любое напряжение', icon: 'fas fa-peace' },
    { id: 78, category: 'impact', title: 'Мотивирует', 
      text: 'Помогает поверить в собственные силы', icon: 'fas fa-rocket' },
    { id: 79, category: 'impact', title: 'Учит добру', 
      text: 'На её примере понимаешь, что такое настоящая доброта', icon: 'fas fa-hands-helping' },
    { id: 80, category: 'impact', title: 'Преображает мир', 
      text: 'Мир становится лучше просто от того, что она в нём есть', icon: 'fas fa-globe' }
];

// Добавляем ещё 95 причин (итого 100)
for (let i = 6; i <= 100; i++) {
    if (i <= 20) {
        REASONS_DATA.push({
            id: i,
            category: 'smile',
            title: `Улыбка ${i}`,
            text: `Особенность её улыбки номер ${i}`,
            icon: 'fas fa-grin'
        });
    } else if (i <= 50) {
        REASONS_DATA.push({
            id: i,
            category: 'character',
            title: `Качество ${i-20}`,
            text: `Замечательная черта характера номер ${i-20}`,
            icon: 'fas fa-gem'
        });
    } else if (i <= 75) {
        REASONS_DATA.push({
            id: i,
            category: 'magic',
            title: `Волшебство ${i-50}`,
            text: `Магическое свойство номер ${i-50}`,
            icon: 'fas fa-hat-wizard'
        });
    } else {
        REASONS_DATA.push({
            id: i,
            category: 'impact',
            title: `Влияние ${i-75}`,
            text: `Как она меняет мир номер ${i-75}`,
            icon: 'fas fa-hand-sparkles'
        });
    }
}

function loadReasons() {
    const grid = document.getElementById('reasonsGrid');
    REASONS_DATA.forEach(reason => {
        const card = document.createElement('div');
        card.className = `reason-card ${reason.category}`;
        card.innerHTML = `
            <div class="reason-number">${reason.id}</div>
            <div class="reason-content">
                <h4><i class="${reason.icon} reason-icon"></i> ${reason.title}</h4>
                <p>${reason.text}</p>
                <span class="reason-category">${getCategoryName(reason.category)}</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (!card.classList.contains('revealed')) {
                card.classList.add('revealed');
                state.revealedReasons++;
                updateReasonsCounter();
                createConfetti(card);
            }
        });
        
        grid.appendChild(card);
    });
    
    updateReasonsCounter();
}

function getCategoryName(category) {
    const categories = {
        'smile': 'Улыбка',
        'character': 'Характер',
        'magic': 'Волшебство',
        'impact': 'Влияние',
        'all': 'Все'
    };
    return categories[category] || category;
}

function filterReasons(filter) {
    // Обновление активной кнопки фильтра
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
    
    // Фильтрация карточек
    document.querySelectorAll('.reason-card').forEach(card => {
        if (filter === 'all' || card.classList.contains(filter)) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

function showRandomReason() {
    const cards = document.querySelectorAll('.reason-card');
    const visibleCards = Array.from(cards).filter(card => 
        card.style.display !== 'none' && !card.classList.contains('revealed')
    );
    
    if (visibleCards.length > 0) {
        const randomCard = visibleCards[Math.floor(Math.random() * visibleCards.length)];
        
        // Анимация выделения
        randomCard.style.animation = 'pulse 0.5s 3';
        randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            randomCard.click(); // Открываем карточку
        }, 1500);
    }
}

function updateReasonsCounter() {
    document.getElementById('reasonsCount').textContent = state.revealedReasons;
    
    // Анимация счётчика
    const counter = document.querySelector('.counter-number');
    counter.style.transform = 'scale(1.2)';
    setTimeout(() => {
        counter.style.transform = 'scale(1)';
    }, 300);
}

// ===== ГАЛЕРЕЯ И ФОТО =====

function generatePhoto(scenario) {
    const container = document.getElementById('generatedPhoto');
    const scenarios = {
        beach: {
            emoji: '🏖️',
            color: '#FFD166',
            text: 'Катя на пляже, наслаждающаяся закатом',
            details: 'Песок тёплый, море ласковое, а её улыбка ярче солнца'
        },
        space: {
            emoji: '🚀',
            color: '#6A67CE',
            text: 'Катя покоряет космос',
            details: 'Среди звёзд и галактик она находит свою собственную вселенную'
        },
        queen: {
            emoji: '👑',
            color: '#FF6B8B',
            text: 'Катя — королева дня',
            details: 'Её доброта и мудрость достойны королевского трона'
        },
        superhero: {
            emoji: '🦸‍♀️',
            color: '#06D6A0',
            text: 'Супер-Катя спасает мир',
            details: 'Её суперсила — делать людей счастливыми'
        }
    };
    
    const scene = scenarios[scenario] || scenarios.beach;
    
    container.innerHTML = `
        <div class="generated-scene" style="background: ${scene.color}">
            <div class="scene-emoji">${scene.emoji}</div>
            <div class="scene-text">
                <h3>${scene.text}</h3>
                <p>${scene.details}</p>
            </div>
            <div class="scene-effects">
                <div class="sparkle">✨</div>
                <div class="sparkle">⭐</div>
                <div class="sparkle">💫</div>
            </div>
        </div>
    `;
    
    // Анимация появления
    container.style.transform = 'scale(0.8)';
    container.style.opacity = '0';
    
    setTimeout(() => {
        container.style.transition = 'all 0.5s ease';
        container.style.transform = 'scale(1)';
        container.style.opacity = '1';
    }, 10);
    
    // Добавляем анимацию искр
    animateSparkles(container);
}

function changeFilter(filter) {
    const overlay = document.getElementById('filterOverlay');
    const photo = document.getElementById('sessionPhoto');
    
    // Убираем старые классы
    overlay.className = 'filter-overlay';
    photo.className = '';
    
    // Применяем новый фильтр
    switch(filter) {
        case 'vintage':
            overlay.style.backgroundColor = 'rgba(189, 147, 105, 0.3)';
            overlay.style.mixBlendMode = 'multiply';
            photo.style.filter = 'sepia(0.5) contrast(1.1)';
            break;
        case 'sunset':
            overlay.style.background = 'linear-gradient(45deg, rgba(255, 105, 180, 0.3), rgba(255, 165, 0, 0.3))';
            overlay.style.mixBlendMode = 'overlay';
            photo.style.filter = 'brightness(1.1) saturate(1.2)';
            break;
        case 'magic':
            overlay.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.2), rgba(138, 43, 226, 0.2))';
            overlay.style.mixBlendMode = 'lighten';
            photo.style.filter = 'hue-rotate(90deg) saturate(1.3)';
            break;
        default:
            overlay.style.backgroundColor = 'transparent';
            photo.style.filter = 'none';
    }
}

function likePhoto() {
    const likeCount = document.getElementById('likeCount');
    let count = parseInt(likeCount.textContent);
    count++;
    likeCount.textContent = count;
    
    // Анимация сердечка
    likeCount.style.transform = 'scale(1.5)';
    setTimeout(() => {
        likeCount.style.transform = 'scale(1)';
    }, 300);
    
    // Создаём летающие сердечки
    createFlyingHearts(10);
    
    // Обновляем общий счётчик
    state.totalLikes++;
    
    // Если много лайков - показываем достижение
    if (state.totalLikes === 10 || state.totalLikes === 50 || state.totalLikes === 100) {
        showAchievement(`🎉 ${state.totalLikes} суперлайков для Кати!`);
    }
}

function createFlyingHearts(count) {
    const button = document.querySelector('.like-btn');
    const rect = button.getBoundingClientRect();
    
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = `${rect.left + rect.width/2}px`;
        heart.style.top = `${rect.top}px`;
        heart.style.fontSize = '20px';
        heart.style.zIndex = '1000';
        heart.style.pointerEvents = 'none';
        heart.style.animation = `confettiRain 1.5s ease-out forwards`;
        heart.style.animationDelay = `${i * 0.1}s`;
        
        document.body.appendChild(heart);
        
        // Удаляем после анимации
        setTimeout(() => {
            heart.remove();
        }, 1500);
    }
}

// ===== МИР ЕЁ ГЛАЗАМИ =====

function showWorldDescription(elementId) {
    const descriptions = {
        sky: 'В её мире небо всегда цвета утренней зари, с розовыми облаками в форме сердечек',
        sun: 'Её солнце светит, но не обжигает, а согревает душу своими лучами',
        tree: 'Деревья в её мире цветут круглый год, а их листья шепчут слова поддержки',
        flower: 'Цветы распускаются от её улыбки и поворачиваются к ней, как к солнцу',
        bird: 'Птицы поют мелодии, которые она придумывает в своих мечтах'
    };
    
    const description = document.getElementById('worldDescription');
    description.textContent = descriptions[elementId] || 'Мир становится прекраснее от её присутствия';
    
    // Анимация текста
    description.style.background = 'rgba(255, 107, 139, 0.1)';
    description.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        description.style.transform = 'scale(1)';
    }, 300);
    
    // Анимация элемента
    const element = document.getElementById(elementId);
    element.style.transform = 'scale(1.2) rotate(10deg)';
    
    setTimeout(() => {
        element.style.transform = '';
    }, 500);
}

function animateWorldScene() {
    const elements = document.querySelectorAll('.world-element');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }, index * 200);
    });
}

// ===== ГЕНЕРАТОР КОМПЛИМЕНТОВ =====

const COMPLIMENTS = [
    "Ты как утреннее солнце — делаешь день ярче с первой же минуты",
    "В твоём присутствии проблемы кажутся меньше, а радости — больше",
    "Твоя улыбка могла бы заряжать города, если бы мы знали, как её подключить к сети",
    "Рядом с тобой хочется стать лучше, добрее и мудрее",
    "Ты умеешь слушать так, что кажется, будто ты слышишь не только слова, но и мысли",
    "Твой смех — самый искренний звук во вселенной",
    "В тебе сочетается мудрость веков и лёгкость бабочки",
    "Ты превращаешь обычные моменты в волшебные воспоминания",
    "Твоя энергия лечит плохое настроение на расстоянии",
    "Ты как хорошая книга — каждый раз открываешься новой интересной гранью"
];

const COMPLIMENT_PARTS = {
    beginnings: [
        "Ты как ",
        "В твоём присутствии ",
        "Твоя улыбка ",
        "Рядом с тобой ",
        "Ты умеешь ",
        "Твой смех ",
        "В тебе сочетается ",
        "Ты превращаешь ",
        "Твоя энергия ",
        "Ты словно "
    ],
    middles: [
        "утреннее солнце ",
        "стало светлее ",
        "могла бы заряжать города ",
        "хочется стать лучше ",
        "слушать так внимательно ",
        "самый искренний звук ",
        "мудрость и лёгкость ",
        "обычные моменты в волшебные ",
        "лечит плохое настроение ",
        "хорошая книга "
    ],
    endings: [
        "— делаешь день ярче",
        "и радости — больше",
        "если бы мы знали как",
        "добрее и мудрее",
        "что слышишь даже мысли",
        "во вселенной",
        "бабочки и слона",
        "воспоминания",
        "на расстоянии",
        "открываешься новой гранью"
    ]
};

function generateCompliment() {
    state.complimentsGenerated++;
    
    // Случайно выбираем тип генерации
    const type = Math.random();
    let compliment;
    
    if (type < 0.3) {
        // Готовый комплимент
        compliment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    } else if (type < 0.7) {
        // Сгенерированный из частей
        const begin = COMPLIMENT_PARTS.beginnings[Math.floor(Math.random() * COMPLIMENT_PARTS.beginnings.length)];
        const middle = COMPLIMENT_PARTS.middles[Math.floor(Math.random() * COMPLIMENT_PARTS.middles.length)];
        const end = COMPLIMENT_PARTS.endings[Math.floor(Math.random() * COMPLIMENT_PARTS.endings.length)];
        compliment = begin + middle + end;
    } else {
        // Случайная генерация
        const adjectives = ["прекрасная", "удивительная", "невероятная", "волшебная", "солнечная", "лучистая", "добрая", "мудрая", "заботливая", "вдохновляющая"];
        const nouns = ["улыбка", "душа", "энергия", "мудрость", "доброта", "сила", "лёгкость", "теплота", "радость", "мечта"];
        const actions = ["освещает", "согревает", "вдохновляет", "преображает", "исцеляет", "радует", "успокаивает", "мотивирует", "окрыляет", "заряжает"];
        
        const adj1 = adjectives[Math.floor(Math.random() * adjectives.length)];
        const adj2 = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        compliment = `Твоя ${adj1} ${noun} ${action} всех вокруг своей ${adj2} энергией`;
    }
    
    // Обновляем результат
    const result = document.getElementById('complimentResult');
    result.innerHTML = `<i class="fas fa-quote-left"></i> ${compliment} <i class="fas fa-quote-right"></i>`;
    
    // Анимация
    result.style.transform = 'scale(0.8)';
    result.style.opacity = '0';
    
    setTimeout(() => {
        result.style.transition = 'all 0.5s ease';
        result.style.transform = 'scale(1)';
        result.style.opacity = '1';
        
        // Случайные эмодзи
        const emojis = ['💖', '✨', '🌟', '⭐', '💫', '🎀', '🌸', '🌺', '🌼', '🥰'];
        for (let i = 0; i < 5; i++) {
            createFloatingEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        }
    }, 10);
    
    // Обновляем статистику
    updateComplimentStats();
    
    // Показываем уведомление каждые 5 комплиментов
    if (state.complimentsGenerated % 5 === 0) {
        showNotification(`Создано уже ${state.complimentsGenerated} комплиментов для Кати!`);
    }
}

function updateComplimentStats() {
    document.getElementById('complimentCount').textContent = state.complimentsGenerated;
    
    // Обновляем рекорд точности (просто для веселья)
    if (Math.random() > 0.7) {
        state.accuracyRecord = Math.min(100, state.accuracyRecord + Math.floor(Math.random() * 10));
        document.getElementById('accuracyRecord').textContent = state.accuracyRecord + '%';
    }
}

// ===== МУЗЫКА И АУДИО =====

function setupAudioPlayer() {
    const audio = document.getElementById('mainAudio');
    const playBtn = document.getElementById('playBtn');
    
    audio.addEventListener('play', () => {
        state.audioPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        startVisualizer();
    });
    
    audio.addEventListener('pause', () => {
        state.audioPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    audio.addEventListener('ended', () => {
        state.audioPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    // Настройка громкости
    audio.volume = 0.5;
}

function playMusic() {
    const audio = document.getElementById('mainAudio');
    const playBtn = document.getElementById('playBtn');
    
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        document.getElementById('nowPlaying').textContent = 'Играет: Саундтрек для Кати';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function pauseMusic() {
    const audio = document.getElementById('mainAudio');
    audio.pause();
}

function stopMusic() {
    const audio = document.getElementById('mainAudio');
    audio.pause();
    audio.currentTime = 0;
    document.getElementById('nowPlaying').textContent = 'Готово к воспроизведению';
}

function changeVolume(delta) {
    const audio = document.getElementById('mainAudio');
    const newVolume = Math.max(0, Math.min(1, audio.volume + delta));
    audio.volume = newVolume;
    document.getElementById('volumeSlider').value = newVolume * 100;
}

function playMood(mood) {
    // В реальном проекте здесь было бы переключение треков
    const moods = {
        happy: 'Утренняя радость',
        dreamy: 'Мечтательное настроение',
        magic: 'Волшебный момент',
        cozy: 'Уютный вечер'
    };
    
    document.getElementById('nowPlaying').textContent = `Играет: ${moods[mood]}`;
    
    // Анимация для выбранного трека
    document.querySelectorAll('.mood-track').forEach(track => {
        track.classList.remove('active');
    });
    
    const activeTrack = document.querySelector(`.mood-track[data-mood="${mood}"]`);
    activeTrack.classList.add('active');
    
    // Создаём визуальные эффекты в зависимости от настроения
    switch(mood) {
        case 'happy':
            createFloatingEmoji('😊', 10);
            break;
        case 'dreamy':
            createFloatingEmoji('☁️', 10);
            break;
        case 'magic':
            createFloatingEmoji('✨', 15);
            break;
        case 'cozy':
            createFloatingEmoji('☕', 10);
            break;
    }
}

// ===== ВИЗУАЛИЗАТОР АУДИО =====

let visualizerAnimation;
let audioContext;
let analyser;
let source;
let dataArray;
let bufferLength;

function initializeVisualizer() {
    const canvas = document.getElementById('visualizerCanvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function startVisualizer() {
    if (visualizerAnimation) {
        cancelAnimationFrame(visualizerAnimation);
    }
    
    const canvas = document.getElementById('visualizerCanvas');
    const ctx = canvas.getContext('2d');
    
    function draw() {
        if (!state.audioPlaying) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        switch(state.visualizerMode) {
            case 'heart':
                drawHearts(ctx, canvas);
                break;
            case 'stars':
                drawStars(ctx, canvas);
                break;
            case 'particles':
                drawParticles(ctx, canvas);
                break;
        }
        
        visualizerAnimation = requestAnimationFrame(draw);
    }
    
    draw();
}

function changeVisualizerMode(mode) {
    state.visualizerMode = mode;
    
    // Обновление активной кнопки
    document.querySelectorAll('.viz-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.viz-btn[onclick*="${mode}"]`).classList.add('active');
    
    if (state.audioPlaying) {
        startVisualizer();
    }
}

function drawHearts(ctx, canvas) {
    const time = Date.now() / 1000;
    const heartCount = 20;
    
    for (let i = 0; i < heartCount; i++) {
        const x = (i / heartCount) * canvas.width;
        const y = canvas.height / 2 + Math.sin(time * 2 + i * 0.5) * 30;
        const size = 20 + Math.sin(time * 3 + i) * 10;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time + i * 0.2);
        
        // Рисуем сердечко
        ctx.fillStyle = `hsl(${(time * 50 + i * 20) % 360}, 100%, 65%)`;
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.bezierCurveTo(size/2, -size, size, 0, 0, size/2);
        ctx.bezierCurveTo(-size, 0, -size/2, -size, 0, -size/2);
        ctx.fill();
        
        ctx.restore();
    }
}

function drawStars(ctx, canvas) {
    const time = Date.now() / 1000;
    const starCount = 50;
    
    for (let i = 0; i < starCount; i++) {
        const x = (Math.sin(time * 0.5 + i) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.7 + i * 0.3) * 0.5 + 0.5) * canvas.height;
        const size = 5 + Math.sin(time * 2 + i) * 4;
        const points = 5;
        const innerRadius = size * 0.4;
        const outerRadius = size;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time + i);
        
        ctx.fillStyle = `hsl(${(time * 100 + i * 10) % 360}, 100%, 65%)`;
        ctx.beginPath();
        
        for (let j = 0; j < points * 2; j++) {
            const radius = j % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * j) / points;
            ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Свечение
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        
        ctx.restore();
    }
}

function drawParticles(ctx, canvas) {
    const time = Date.now() / 1000;
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time;
        const radius = 50 + Math.sin(time * 2 + i * 0.1) * 30;
        const x = canvas.width / 2 + Math.cos(angle) * radius;
        const y = canvas.height / 2 + Math.sin(angle) * radius;
        const size = 3 + Math.sin(time * 3 + i * 0.2) * 2;
        
        // Цветовая градиента
        const hue = (time * 50 + i * 5) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
        
        // Рисуем частицу
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Хвост частицы
        const tailLength = 10;
        ctx.beginPath();
        ctx.moveTo(x, y);
        const tailX = x - Math.cos(angle) * tailLength;
        const tailY = y - Math.sin(angle) * tailLength;
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = size / 2;
        ctx.stroke();
    }
}

// ===== СЕКРЕТНАЯ КОМНАТА =====

function checkSecretCode() {
    const input = document.getElementById('secretCode');
    const code = parseInt(input.value);
    const secretContent = document.getElementById('secretContent');
    const attemptCount = document.getElementById('attemptCount');
    
    state.attempts++;
    attemptCount.textContent = state.attempts;
    
    if (code === CONFIG.secretCode) {
        // Правильный код
        secretContent.innerHTML = `
            <div class="secret-unlocked">
                <i class="fas fa-trophy" style="font-size: 4rem; color: #FFD166; margin-bottom: 1rem;"></i>
                <h3 style="color: #06D6A0;">Секретная комната открыта!</h3>
                <p>Ты разгадал загадку и доказал, что действительно знаешь Катю!</p>
                
                <div class="secret-treasure">
                    <div class="treasure-item">
                        <i class="fas fa-crown"></i>
                        <p>Её королевский титул: Принцесса Доброты</p>
                    </div>
                    <div class="treasure-item">
                        <i class="fas fa-key"></i>
                        <p>Секретная суперсила: Умение читать сердца</p>
                    </div>
                    <div class="treasure-item">
                        <i class="fas fa-map"></i>
                        <p>Координаты её волшебного места: 54.7° с.ш., 20.5° в.д.</p>
                    </div>
                </div>
                
                <div class="secret-message">
                    <p><strong>Личное послание:</strong></p>
                    <p>Катя — это не просто имя. Это состояние души, источник света и вдохновения для всех, кто её знает. Мир стал лучше с её появлением.</p>
                </div>
                
                <button class="generate-btn" onclick="createSecretFireworks()">
                    <i class="fas fa-fireworks"></i> Запустить праздничный фейерверк
                </button>
            </div>
        `;
        
        secretContent.classList.add('show');
        input.disabled = true;
        
        // Создаём эффект открытия
        createConfetti(secretContent, 100);
        playSecretSound();
        
    } else {
        // Неправильный код
        input.style.borderColor = '#EF4444';
        input.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
        
        if (state.attempts >= 3) {
            input.disabled = true;
            secretContent.innerHTML = `
                <div class="secret-locked">
                    <i class="fas fa-lock" style="font-size: 3rem; color: #EF4444;"></i>
                    <p>Слишком много попыток! Комната заблокирована.</p>
                    <p>Подсказка: 4 буквы в имени × 5 главных суперсил</p>
                    <button class="footer-btn" onclick="resetSecretRoom()">
                        <i class="fas fa-redo"></i> Попробовать снова
                    </button>
                </div>
            `;
            secretContent.classList.add('show');
        }
    }
}

function shakeSecretLocks() {
    const locks = document.querySelectorAll('.secret-header i');
    locks.forEach(lock => {
        lock.style.animation = 'lockShake 0.5s 3';
    });
}

function resetSecretRoom() {
    const input = document.getElementById('secretCode');
    const secretContent = document.getElementById('secretContent');
    const attemptCount = document.getElementById('attemptCount');
    
    input.value = '';
    input.disabled = false;
    input.style.borderColor = '';
    secretContent.innerHTML = '';
    secretContent.classList.remove('show');
    state.attempts = 0;
    attemptCount.textContent = '0';
}

function playSecretSound() {
    // В реальном проекте здесь было бы воспроизведение звука
    createFloatingEmoji('🎉', 20);
    createFloatingEmoji('✨', 20);
    createFloatingEmoji('🌟', 20);
}

function createSecretFireworks() {
    const colors = ['#FF6B8B', '#FFD166', '#06D6A0', '#118AB2', '#6A67CE'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 30 + 20;
            
            createFirework(x, y, color, size);
        }, i * 100);
    }
}

function createFirework(x, y, color, size) {
    const particles = 20;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1000';
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 10px ${color}`;
        
        const angle = (i / particles) * Math.PI * 2;
        const distance = size;
        const duration = 1;
        
        particle.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'ease-out'
        });
        
        container.appendChild(particle);
    }
    
    document.body.appendChild(container);
    
    setTimeout(() => {
        container.remove();
    }, 1000);
}

// ===== МИНИ-ИГРА: СОБЕРИ УЛЫБКУ =====

function handlePuzzleClick(pieceNum) {
    const puzzleSequence = state.puzzleSequence;
    puzzleSequence.push(pieceNum);
    
    // Подсвечиваем кусочек
    const piece = document.querySelector(`.puzzle-piece[data-piece="${pieceNum}"]`);
    piece.classList.add('solved');
    
    // Проверяем последовательность
    const correctSequence = ['1', '2', '3', '4'];
    const currentSequence = puzzleSequence.map(n => n.toString());
    
    if (currentSequence.join('') === correctSequence.join('').substring(0, currentSequence.length)) {
        // Правильная последовательность
        if (currentSequence.length === correctSequence.length) {
            // Игра завершена
            state.gameCompleted = true;
            document.getElementById('gameResult').innerHTML = `
                <i class="fas fa-trophy"></i> Ура! Ты собрал улыбку Кати!
                <p style="font-size: 0.9rem; margin-top: 10px;">Теперь она светит ещё ярче!</p>
            `;
            
            // Создаём эффект победы
            createConfetti(document.getElementById('puzzleGame'), 30);
            showNotification('🎮 Уровень пройден! Ты мастер собирать улыбки!');
        }
    } else {
        // Неправильная последовательность
        document.getElementById('gameResult').textContent = 'Попробуй ещё раз!';
        puzzleSequence.length = 0;
        
        // Сбрасываем кусочки
        document.querySelectorAll('.puzzle-piece').forEach(p => {
            p.classList.remove('solved');
        });
    }
}

// ===== ФУНКЦИИ ФУТЕРА =====

function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    state.theme = newTheme;
    
    // Анимация перехода
    document.body.style.transition = 'all 0.5s ease';
    
    // Показываем уведомление
    const themeName = newTheme === 'dark' ? 'ночной' : 'дневной';
    showNotification(`Переключено в ${themeName} режим`);
}

function makeItRainHearts() {
    const heartCount = 100;
    const container = document.querySelector('.floating-hearts');
    
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '❤️';
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = '-50px';
            heart.style.fontSize = `${Math.random() * 25 + 15}px`;
            heart.style.animation = `confettiRain 3s linear forwards`;
            heart.style.animationDelay = `${Math.random() * 2}s`;
            
            container.appendChild(heart);
            
            // Удаляем после анимации
            setTimeout(() => {
                heart.remove();
            }, 3000);
        }, i * 50);
    }
    
    showNotification('💖 Дождь из сердец активирован!');
}

function showSurprise() {
    const surprises = [
        "Знаешь, у Кати есть суперспособность: она умеет находить красоту в обычных вещах",
        "Катя могла бы выиграть чемпионат мира по искренним комплиментам",
        "Если бы смех Кати превратить в энергию, её хватило бы на освещение небольшого города",
        "Учёные доказали: 5 минут общения с Катюшей = +100 к настроению на весь день",
        "Катин внутренний свет настолько яркий, что ей не нужен фонарик в темноте"
    ];
    
    const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
    showModal("Секретный факт о Кате", randomSurprise, "fas fa-gift");
}

function shareSite() {
    if (navigator.share) {
        navigator.share({
            title: 'Сайт для Кати',
            text: 'Посмотри, какой крутой сайт я сделал для самой особенной Кати!',
            url: window.location.href
        });
    } else {
        // Копируем ссылку в буфер обмена
        navigator.clipboard.writeText(window.location.href);
        showNotification('Ссылка скопирована в буфер обмена!');
    }
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

function createConfetti(element, count = 50) {
    const rect = element.getBoundingClientRect();
    const emojis = ['✨', '⭐', '🌟', '💫', '🎉', '🎊', '💖', '🥰', '😊', '🌸'];
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.position = 'fixed';
        confetti.style.left = `${rect.left + Math.random() * rect.width}px`;
        confetti.style.top = `${rect.top}px`;
        confetti.style.fontSize = `${Math.random() * 20 + 15}px`;
        confetti.style.zIndex = '1000';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = `confettiRain 2s ease-out forwards`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 2000);
    }
}

function createFloatingEmoji(emoji, count = 5) {
    const container = document.querySelector('.floating-hearts');
    
    for (let i = 0; i < count; i++) {
        const element = document.createElement('div');
        element.textContent = emoji;
        element.style.position = 'fixed';
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.fontSize = `${Math.random() * 30 + 20}px`;
        element.style.opacity = '0.8';
        element.style.zIndex = '1000';
        element.style.pointerEvents = 'none';
        element.style.animation = `float 5s ease-in-out forwards`;
        
        container.appendChild(element);
        
        setTimeout(() => {
            element.remove();
        }, 5000);
    }
}

function animateSparkles(container) {
    const sparkles = container.querySelectorAll('.sparkle');
    sparkles.forEach((sparkle, index) => {
        sparkle.style.animation = `float 2s ease-in-out infinite`;
        sparkle.style.animationDelay = `${index * 0.5}s`;
    });
}

function showModal(title, message, icon = 'fas fa-info-circle') {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-header">
                <i class="${icon}"></i>
                <h2>${title}</h2>
            </div>
            <div class="modal-body">
                ${message}
            </div>
            <button class="generate-btn" onclick="this.closest('.modal').remove()">
                <i class="fas fa-check"></i> Понятно!
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Показываем модальное окно
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Закрытие по клику на крестик
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
    
    // Закрытие по клику на фон
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient);
        color: white;
        padding: 15px 25px;
        border-radius: 15px;
        box-shadow: 0 5px 20px rgba(255, 107, 139, 0.3);
        z-index: 10000;
        animation: fadeIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showAchievement(message) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement';
    achievement.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <i class="fas fa-trophy" style="font-size: 2rem; color: #FFD166;"></i>
            <div>
                <h4 style="margin: 0; color: white;">Достижение!</h4>
                <p style="margin: 5px 0 0 0; color: white;">${message}</p>
            </div>
        </div>
    `;
    
    achievement.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        padding: 20px;
        border-radius: 15px;
        border-left: 5px solid #FFD166;
        z-index: 10000;
        animation: slideUp 0.5s ease forwards, slideDown 0.5s ease 3s forwards;
    `;
    
    // Добавляем CSS для анимаций
    if (!document.querySelector('#achievement-styles')) {
        const style = document.createElement('style');
        style.id = 'achievement-styles';
        style.textContent = `
            @keyframes slideUp {
                to { transform: translateX(-50%) translateY(0); }
            }
            @keyframes slideDown {
                to { transform: translateX(-50%) translateY(100px); opacity: 0; }
            }
            @keyframes fadeOut {
                to { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(achievement);
    
    setTimeout(() => {
        achievement.remove();
    }, 3500);
}

// ===== ОБРАБОТКА ОШИБОК И ФОЛЛБЭКИ =====

window.addEventListener('error', function(e) {
    console.log('Произошла ошибка:', e.error);
    // В реальном проекте здесь была бы отправка ошибок на сервер
});

// Фоллбэк для аудио
function setupAudioFallback() {
    const audio = document.getElementById('mainAudio');
    audio.addEventListener('error', function() {
        showNotification('⚠️ Аудиофайл не загружен. Проверьте папку music/');
    });
}

// Проверка поддержки функций
function checkBrowserCompatibility() {
    if (!('animate' in document.documentElement)) {
        showModal('Информация', 'Ваш браузер не поддерживает некоторые анимации. Рекомендуем обновить браузер для полного опыта.', 'fas fa-exclamation-triangle');
    }
}

// Вызываем проверку при загрузке
setTimeout(checkBrowserCompatibility, 3000);

// ===== ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ И "ПРИКОЛЫ" =====

// Случайные всплывающие сообщения
setInterval(() => {
    if (Math.random() > 0.7) {
        const messages = [
            "Катя сейчас, наверное, улыбается!",
            "Помни: мир стал ярче, когда в нём появилась Катя",
            "Факт: смех Кати увеличивает продолжительность жизни",
            "Знаешь, почему так светло? Это Катя где-то поблизости!",
            "Проверено: один комплимент Кате = +10 к карме"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        createFloatingMessage(randomMessage);
    }
}, 30000);

function createFloatingMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(255, 107, 139, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 10px;
        font-size: 0.9rem;
        z-index: 999;
        animation: floatMessage 10s ease-in-out forwards;
        max-width: 200px;
        text-align: center;
    `;
    
    // Добавляем CSS для анимации
    if (!document.querySelector('#message-styles')) {
        const style = document.createElement('style');
        style.id = 'message-styles';
        style.textContent = `
            @keyframes floatMessage {
                0% { transform: translateY(100px) translateX(0); opacity: 0; }
                10% { transform: translateY(0) translateX(0); opacity: 1; }
                90% { transform: translateY(0) translateX(0); opacity: 1; }
                100% { transform: translateY(-100px) translateX(100px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.remove();
    }, 10000);
}

// Изменение курсора при наведении на особые элементы
document.addEventListener('DOMContentLoaded', function() {
    const specialElements = document.querySelectorAll('.puzzle-piece, .gen-btn, .like-btn, .world-element');
    
    specialElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.style.cursor = 'pointer';
        });
        
        el.addEventListener('mouseleave', () => {
            document.body.style.cursor = 'default';
        });
    });
});

// Пасхалка: секретная комбинация клавиш
let konamiCode = [];
const secretCombo = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    if (konamiCode.length > secretCombo.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === secretCombo.join(',')) {
        // Активация пасхалки
        showModal('🎮 Секретная пасхалка!', 
            'Ты нашёл секретную комбинацию! Награда: бесконечный дождь из сердец и звёзд!', 
            'fas fa-gamepad');
        
        // Запускаем спецэффекты
        makeItRainHearts();
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createFloatingEmoji('⭐', 5);
            }, i * 200);
        }
        
        // Сбрасываем код
        konamiCode = [];
    }
});

// Функция для изменения темы сайта по времени суток
function updateThemeByTime() {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 20;
    
    if (isNight && state.theme !== 'dark') {
        toggleDarkMode();
    } else if (!isNight && state.theme === 'dark') {
        toggleDarkMode();
    }
}

// Проверяем время при загрузке и каждые 10 минут
updateThemeByTime();
setInterval(updateThemeByTime, 600000);

// Финальная инициализация
setupAudioFallback();

// Глобальный экспорт функций для HTML
window.changeNameLanguage = changeNameLanguage;
window.generatePhoto = generatePhoto;
window.changeFilter = changeFilter;
window.likePhoto = likePhoto;
window.showRandomReason = showRandomReason;
window.generateCompliment = generateCompliment;
window.playMusic = playMusic;
window.pauseMusic = pauseMusic;
window.stopMusic = stopMusic;
window.changeVolume = changeVolume;
window.playMood = playMood;
window.changeVisualizerMode = changeVisualizerMode;
window.checkSecretCode = checkSecretCode;
window.createSecretFireworks = createSecretFireworks;
window.toggleDarkMode = toggleDarkMode;
window.makeItRainHearts = makeItRainHearts;
window.showSurprise = showSurprise;
window.shareSite = shareSite;

console.log('✨ Сайт для Кати успешно загружен! Готов к волшебству! ✨');