// Конфигурация письма
const LETTER_CONFIG = {
    typingSpeed: 30, // мс между символами
    pauseSpeed: 1000, // мс на паузах
    maxSpeed: 10, // минимальная скорость
    minSpeed: 100 // максимальная скорость
};

// Текст письма для Кати
const LETTER_TEXT = `Привет, Кать.

Возможно, стоило просто написать тебе обычное сообщение в телеграмм всю суть, 
но я, возможно, испугался. А может, просто хочу сделать все немного красивее. 
Но не суть.

В последние 2 дня что-то произошло, и наше общение и взаимодействия прекратились. 
Я не виню тебя в этом и в целом не знаю, что у тебя в жизни. 
Лишь знаю, что у тебя все хорошо — ты сама так мне ответила вчера.

Я хочу сказать, что я не буду тебе надоедать, если тебе это не нужно, 
но я всегда рядом, если я тебе нужен. Захочешь поболтать — либо все что угодно.

Знаешь, возможно, сейчас все это выглядит странно — и мое поведение, 
и "доброе утро", "спокойной ночи". Но мне захотелось стабильности 
во взаимоотношениях с тобой.

Встречая тебя из поезда, я понял, что ты такая же милая и хорошая девочка, 
что играла со мной в фортнайт, сидела в дискорде и просто болтала обо всем.

Я сделал много говна в этом году, и думаю, большинство — тебе. 
Мне очень стыдно за свои действия, но прошлое не переиграть, 
и я могу лишь быть лучше сейчас.

Встречая тебя, увидел не просто Катю, одногруппницу и знакомую, 
а ту девочку, которая своим присутствием украшает мир вокруг меня. 
Пройдя с тобой, я вкушал каждое твое слово, каждый твой взгляд.

Спасибо тебе за то, что ты есть, и за то, что ты делала казалось бы 
обычную прогулку в холодную погоду не такой уж холодной — благодаря тебе.

Я всегда на связи, рядом, если тебе это нужно. Если же нет — я все понимаю. 
Не думал, что буду когда-нибудь ссылаться на "Белые Ночи", но я как долбанный 
мечтатель, который радовался каждой минутой, проведенной с той самой девушкой.

Надеюсь, конец будет не таким же, как в этом романе.`;

// Состояние приложения
let state = {
    isTyping: false,
    isPaused: false,
    currentIndex: 0,
    typingInterval: null,
    currentSpeed: LETTER_CONFIG.typingSpeed,
    heartCount: 0,
    totalChars: 0,
    startTime: null,
    musicPlaying: false
};

// DOM элементы
const elements = {
    envelope: document.getElementById('envelope'),
    letterContainer: document.getElementById('letterContainer'),
    typewriterText: document.getElementById('typewriterText'),
    cursor: document.getElementById('cursor'),
    progressFill: document.getElementById('progressFill'),
    currentWord: document.getElementById('currentWord'),
    totalWords: document.getElementById('totalWords'),
    currentDate: document.getElementById('currentDate'),
    secretModal: document.getElementById('secretModal'),
    secretDate: document.getElementById('secretDate'),
    totalChars: document.getElementById('totalChars'),
    readingTime: document.getElementById('readingTime'),
    heartCount: document.getElementById('heartCount'),
    musicToggle: document.getElementById('musicToggle'),
    volumeSlider: document.getElementById('volumeSlider'),
    musicTrack: document.getElementById('musicTrack'),
    typewriterSound: document.getElementById('typewriterSound'),
    pageTurnSound: document.getElementById('pageTurnSound'),
    pauseBtn: document.getElementById('pauseBtn'),
    resumeBtn: document.getElementById('resumeBtn'),
    speedUpBtn: document.getElementById('speedUpBtn'),
    resetBtn: document.getElementById('resetBtn'),
    heartBtn: document.getElementById('heartBtn'),
    replyYes: document.getElementById('replyYes'),
    replyMaybe: document.getElementById('replyMaybe'),
    replySecret: document.getElementById('replySecret'),
    heartsContainer: document.getElementById('heartsContainer'),
    sparklesContainer: document.getElementById('sparklesContainer')
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    createFloatingLetters();
    startCandleAnimation();
});

// Основная инициализация
function initializeApp() {
    // Устанавливаем текущую дату
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    elements.currentDate.textContent = now.toLocaleDateString('ru-RU', options);
    elements.secretDate.textContent = now.toLocaleDateString('ru-RU');
    
    // Рассчитываем общее количество слов
    const wordCount = LETTER_TEXT.split(/\s+/).length;
    elements.totalWords.textContent = wordCount;
    elements.currentWord.textContent = '0';
    
    // Настраиваем звуки
    elements.typewriterSound.volume = 0.3;
    elements.pageTurnSound.volume = 0.5;
    elements.musicTrack.volume = elements.volumeSlider.value / 100;
    
    // Запускаем отсчёт времени
    state.startTime = new Date();
    
    // Создаём эффекты
    setInterval(createRandomSparkle, 3000);
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Открытие конверта
    elements.envelope.addEventListener('click', openEnvelope);
    
    // Контролы печати
    elements.pauseBtn.addEventListener('click', pauseTyping);
    elements.resumeBtn.addEventListener('click', resumeTyping);
    elements.speedUpBtn.addEventListener('click', speedUpTyping);
    elements.resetBtn.addEventListener('click', resetTyping);
    elements.heartBtn.addEventListener('click', sendHeart);
    
    // Музыка
    elements.musicToggle.addEventListener('click', toggleMusic);
    elements.volumeSlider.addEventListener('input', changeVolume);
    
    // Ответы
    elements.replyYes.addEventListener('click', () => handleReply('yes'));
    elements.replyMaybe.addEventListener('click', () => handleReply('maybe'));
    elements.replySecret.addEventListener('click', showSecretModal);
    
    // Секретные взаимодействия
    document.addEventListener('keydown', handleSecretKey);
    
    // Модальное окно
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.addEventListener('click', (e) => {
        if (e.target === elements.secretModal) {
            closeModal();
        }
    });
    
    // Обновление статистики
    setInterval(updateStats, 1000);
}

// Создание плавающих букв
function createFloatingLetters() {
    const letters = 'КатяЛюбовьПисьмоСердцеНадежда'.split('');
    const container = document.querySelector('.floating-letters');
    
    letters.forEach((letter, index) => {
        const letterEl = document.createElement('div');
        letterEl.className = 'floating-letter';
        letterEl.textContent = letter;
        letterEl.style.left = `${Math.random() * 100}%`;
        letterEl.style.top = `${Math.random() * 100}%`;
        letterEl.style.animationDelay = `${Math.random() * 20}s`;
        letterEl.style.animationDuration = `${Math.random() * 10 + 10}s`;
        letterEl.style.fontSize = `${Math.random() * 20 + 15}px`;
        letterEl.style.opacity = `${Math.random() * 0.2 + 0.1}`;
        container.appendChild(letterEl);
    });
}

// Анимация свечи
function startCandleAnimation() {
    const flame = document.querySelector('.candle-flame');
    setInterval(() => {
        const scaleX = 0.9 + Math.random() * 0.2;
        const scaleY = 0.8 + Math.random() * 0.4;
        flame.style.transform = `translateX(-50%) scale(${scaleX}, ${scaleY})`;
    }, 100);
}

// Открытие конверта
function openEnvelope() {
    // Проигрываем звук перелистывания
    elements.pageTurnSound.currentTime = 0;
    elements.pageTurnSound.play().catch(e => console.log("Автовоспроизведение заблокировано"));
    
    // Прячем конверт с анимацией
    elements.envelope.style.opacity = '0';
    elements.envelope.style.transform = 'scale(0.8) rotate(-10deg)';
    
    setTimeout(() => {
        elements.envelope.style.display = 'none';
        elements.letterContainer.style.display = 'block';
        
        // Начинаем печатать письмо
        startTyping();
    }, 500);
    
    // Создаём эффект открытия
    createConfetti();
}

// Начало печати письма
function startTyping() {
    if (state.isTyping) return;
    
    state.isTyping = true;
    state.isPaused = false;
    
    // Начинаем печатать
    state.typingInterval = setInterval(typeNextCharacter, state.currentSpeed);
    
    // Обновляем UI
    elements.pauseBtn.disabled = false;
    elements.resumeBtn.disabled = true;
}

// Печать следующего символа
function typeNextCharacter() {
    if (state.currentIndex >= LETTER_TEXT.length) {
        finishTyping();
        return;
    }
    
    // Получаем текущий символ
    const char = LETTER_TEXT[state.currentIndex];
    
    // Добавляем символ в текст
    elements.typewriterText.textContent += char;
    
    // Проигрываем звук печатной машинки (случайно)
    if (Math.random() > 0.7 && char !== ' ' && char !== '\n') {
        elements.typewriterSound.currentTime = 0;
        elements.typewriterSound.play().catch(e => {});
    }
    
    // Анимация курсора
    animateCursor();
    
    // Обновляем прогресс
    updateTypingProgress();
    
    // Переходим к следующему символу
    state.currentIndex++;
    state.totalChars++;
    
    // Прокручиваем к курсору
    scrollToCursor();
}

// Анимация курсора
function animateCursor() {
    elements.cursor.style.animation = 'none';
    setTimeout(() => {
        elements.cursor.style.animation = 'blink 1s infinite';
    }, 10);
}

// Обновление прогресса печати
function updateTypingProgress() {
    const progress = (state.currentIndex / LETTER_TEXT.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
    
    // Обновляем счётчик слов
    const currentText = elements.typewriterText.textContent;
    const words = currentText.split(/\s+/).filter(word => word.length > 0);
    elements.currentWord.textContent = words.length;
}

// Прокрутка к курсору
function scrollToCursor() {
    const container = document.querySelector('.typewriter-container');
    const textHeight = elements.typewriterText.scrollHeight;
    
    if (textHeight > container.clientHeight) {
        container.scrollTop = textHeight - container.clientHeight + 50;
    }
}

// Завершение печати
function finishTyping() {
    clearInterval(state.typingInterval);
    state.isTyping = false;
    
    // Скрываем курсор
    elements.cursor.style.display = 'none';
    
    // Показываем сообщение о завершении
    showCompletionMessage();
    
    // Обновляем UI
    elements.pauseBtn.disabled = true;
    elements.resumeBtn.disabled = true;
}

// Пауза печати
function pauseTyping() {
    if (!state.isTyping || state.isPaused) return;
    
    clearInterval(state.typingInterval);
    state.isPaused = true;
    
    // Обновляем UI
    elements.pauseBtn.disabled = true;
    elements.resumeBtn.disabled = false;
    
    // Анимация паузы
    elements.cursor.style.animation = 'none';
    elements.cursor.style.opacity = '0.5';
}

// Продолжение печати
function resumeTyping() {
    if (!state.isPaused) return;
    
    state.isPaused = false;
    state.typingInterval = setInterval(typeNextCharacter, state.currentSpeed);
    
    // Обновляем UI
    elements.pauseBtn.disabled = false;
    elements.resumeBtn.disabled = true;
    
    // Возвращаем курсор
    elements.cursor.style.opacity = '1';
    elements.cursor.style.animation = 'blink 1s infinite';
}

// Ускорение печати
function speedUpTyping() {
    if (state.currentSpeed <= LETTER_CONFIG.maxSpeed) return;
    
    state.currentSpeed -= 10;
    if (state.currentSpeed < LETTER_CONFIG.maxSpeed) {
        state.currentSpeed = LETTER_CONFIG.maxSpeed;
    }
    
    if (state.isTyping && !state.isPaused) {
        clearInterval(state.typingInterval);
        state.typingInterval = setInterval(typeNextCharacter, state.currentSpeed);
    }
    
    // Эффект ускорения
    createSpeedEffect();
}

// Сброс печати
function resetTyping() {
    clearInterval(state.typingInterval);
    
    state.isTyping = false;
    state.isPaused = false;
    state.currentIndex = 0;
    state.currentSpeed = LETTER_CONFIG.typingSpeed;
    
    // Очищаем текст
    elements.typewriterText.textContent = '';
    elements.cursor.style.display = 'inline-block';
    elements.cursor.style.animation = 'blink 1s infinite';
    elements.progressFill.style.width = '0%';
    elements.currentWord.textContent = '0';
    
    // Обновляем UI
    elements.pauseBtn.disabled = false;
    elements.resumeBtn.disabled = true;
    
    // Перезапускаем через секунду
    setTimeout(() => {
        startTyping();
    }, 1000);
}

// Отправка сердечка
function sendHeart() {
    state.heartCount++;
    
    // Создаём летающее сердечко
    createFlyingHeart();
    
    // Обновляем счётчик
    updateHeartCount();
    
    // Эффект при отправке
    elements.heartBtn.style.animation = 'heartbeat 0.5s';
    setTimeout(() => {
        elements.heartBtn.style.animation = '';
    }, 500);
}

// Создание летающего сердечка
function createFlyingHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-effect';
    heart.innerHTML = '💖';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.bottom = '0';
    heart.style.fontSize = `${Math.random() * 20 + 20}px`;
    
    elements.heartsContainer.appendChild(heart);
    
    // Удаляем после анимации
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

// Создание искорок
function createRandomSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-effect';
    sparkle.innerHTML = '✨';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.fontSize = `${Math.random() * 15 + 10}px`;
    
    elements.sparklesContainer.appendChild(sparkle);
    
    // Удаляем после анимации
    setTimeout(() => {
        sparkle.remove();
    }, 2000);
}

// Эффект ускорения
function createSpeedEffect() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const spark = document.createElement('div');
            spark.innerHTML = '⚡';
            spark.style.position = 'absolute';
            spark.style.left = '50%';
            spark.style.top = '50%';
            spark.style.fontSize = '1.5rem';
            spark.style.color = '#f1c40f';
            spark.style.zIndex = '100';
            spark.style.pointerEvents = 'none';
            spark.style.animation = `sparkleFloat 1s ease-out forwards`;
            spark.style.animationDelay = `${i * 0.1}s`;
            
            document.body.appendChild(spark);
            
            setTimeout(() => spark.remove(), 1000);
        }, i * 100);
    }
}

// Показать сообщение о завершении
function showCompletionMessage() {
    const message = document.createElement('div');
    message.className = 'completion-message';
    message.innerHTML = `
        <div style="
            background: rgba(46, 204, 113, 0.1);
            border: 2px dashed #2ecc71;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
            animation: fadeIn 0.5s ease;
        ">
            <i class="fas fa-check-circle" style="font-size: 2rem; color: #2ecc71; margin-bottom: 10px;"></i>
            <p style="color: #27ae60; font-weight: bold; margin: 0;">
                Письмо написано! 💌
            </p>
            <p style="color: #7f8c8d; font-size: 0.9rem; margin-top: 5px;">
                Катя, это письмо теперь принадлежит тебе...
            </p>
        </div>
    `;
    
    const controls = document.querySelector('.letter-controls');
    controls.parentNode.insertBefore(message, controls);
}

// Обновление статистики
function updateStats() {
    if (!state.startTime) return;
    
    // Время чтения
    const now = new Date();
    const diffMs = now - state.startTime;
    const diffMins = Math.floor(diffMs / 60000);
    elements.readingTime.textContent = diffMins;
    
    // Количество символов
    elements.totalChars.textContent = state.totalChars;
    
    // Количество сердец
    elements.heartCount.textContent = state.heartCount;
}

// Управление музыкой
function toggleMusic() {
    if (state.musicPlaying) {
        elements.musicTrack.pause();
        elements.musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        elements.musicToggle.style.background = '#3498db';
    } else {
        elements.musicTrack.play().catch(e => {
            console.log("Автовоспроизведение музыки заблокировано");
            // Показываем подсказку
            showMusicHint();
        });
        elements.musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        elements.musicToggle.style.background = '#e74c3c';
    }
    state.musicPlaying = !state.musicPlaying;
}

function changeVolume() {
    elements.musicTrack.volume = elements.volumeSlider.value / 100;
}

function showMusicHint() {
    const hint = document.createElement('div');
    hint.className = 'music-hint';
    hint.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 3000;
            text-align: center;
            max-width: 300px;
            animation: modalPop 0.3s ease;
        ">
            <i class="fas fa-volume-up" style="font-size: 2rem; color: #3498db; margin-bottom: 10px;"></i>
            <p style="margin-bottom: 15px;">Нажми на кнопку музыки, чтобы включить фоновую мелодию</p>
            <button onclick="this.parentElement.remove()" style="
                background: #3498db;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
            ">
                Понятно
            </button>
        </div>
    `;
    document.body.appendChild(hint);
}

// Обработка ответов
function handleReply(type) {
    let message, color, icon;
    
    switch(type) {
        case 'yes':
            message = 'Спасибо, что прочитала 💖 Это значит для меня очень много...';
            color = '#e74c3c';
            icon = 'fas fa-heart';
            break;
        case 'maybe':
            message = 'Спасибо за внимание к этим словам ✨ Они искренние...';
            color = '#f39c12';
            icon = 'fas fa-star';
            break;
        default:
            return;
    }
    
    // Показываем сообщение
    showReplyMessage(message, color, icon);
    
    // Создаём эффект
    createConfetti();
    
    // Отключаем кнопки ответов
    document.querySelectorAll('.reply-envelope').forEach(btn => {
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
    });
}

function showReplyMessage(message, color, icon) {
    const replyMsg = document.createElement('div');
    replyMsg.className = 'reply-message';
    replyMsg.innerHTML = `
        <div style="
            background: ${color}15;
            border: 2px solid ${color};
            border-radius: 10px;
            padding: 25px;
            margin: 20px 0;
            text-align: center;
            animation: fadeIn 0.5s ease;
        ">
            <i class="${icon}" style="font-size: 2.5rem; color: ${color}; margin-bottom: 15px;"></i>
            <p style="color: ${color}; font-weight: bold; font-size: 1.1rem; margin: 0;">
                ${message}
            </p>
        </div>
    `;
    
    const replySection = document.querySelector('.reply-section');
    replySection.parentNode.insertBefore(replyMsg, replySection);
}

// Секретные функции
function handleSecretKey(e) {
    if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        createMagicEffect();
    }
    
    // Секретная комбинация: K A T Y A
    if (e.key.toLowerCase() === 'k') {
        setTimeout(() => {
            if (e.key.toLowerCase() === 'a') {
                setTimeout(() => {
                    if (e.key.toLowerCase() === 't') {
                        setTimeout(() => {
                            if (e.key.toLowerCase() === 'y') {
                                setTimeout(() => {
                                    if (e.key.toLowerCase() === 'a') {
                                        activateSecretMode();
                                    }
                                }, 500);
                            }
                        }, 500);
                    }
                }, 500);
            }
        }, 500);
    }
}

function createMagicEffect() {
    // Создаём магические искры
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const spark = document.createElement('div');
            spark.innerHTML = '✨';
            spark.style.position = 'fixed';
            spark.style.left = `${Math.random() * 100}%`;
            spark.style.top = `${Math.random() * 100}%`;
            spark.style.fontSize = `${Math.random() * 20 + 15}px`;
            spark.style.zIndex = '2000';
            spark.style.pointerEvents = 'none';
            spark.style.animation = `sparkleFloat 2s ease-out forwards`;
            
            document.body.appendChild(spark);
            
            setTimeout(() => spark.remove(), 2000);
        }, i * 50);
    }
    
    // Воспроизводим магический звук (если есть)
    if (elements.typewriterSound) {
        elements.typewriterSound.currentTime = 0;
        elements.typewriterSound.play().catch(e => {});
    }
}

function activateSecretMode() {
    // Активируем секретный режим
    document.body.style.animation = 'colorChange 10s infinite';
    
    // Показываем секретное сообщение
    setTimeout(() => {
        showSecretModal();
    }, 1000);
    
    // Создаём огоньки
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createFlyingHeart();
        }, i * 100);
    }
}

// Модальное окно
function showSecretModal() {
    elements.secretModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    elements.secretModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Фейерверк
function createFireworks() {
    const colors = ['#e74c3c', '#3498db', '#9b59b6', '#f1c40f', '#2ecc71'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 30 + 20;
            
            createFirework(x, y, color, size);
        }, i * 100);
    }
    
    closeModal();
}

function createFirework(x, y, color, size) {
    const particles = 12;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.pointerEvents = 'none';
    container.style.zIndex = '2000';
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 10px ${color}`;
        
        const angle = (i / particles) * Math.PI * 2;
        const distance = size;
        const duration = 1 + Math.random() * 0.5;
        
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
    }, 1500);
}

// Конфетти при открытии
function createConfetti() {
    const emojis = ['💖', '✨', '🌟', '💌', '📜', '💫', '🌸', '🎀'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.position = 'fixed';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '0';
            confetti.style.fontSize = `${Math.random() * 20 + 15}px`;
            confetti.style.zIndex = '1000';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `heartFloat 3s ease-out forwards`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
}

// Обновление счётчика сердец
function updateHeartCount() {
    elements.heartCount.textContent = state.heartCount;
    
    // Каждые 10 сердец - спецэффект
    if (state.heartCount > 0 && state.heartCount % 10 === 0) {
        createFireworks();
    }
}

// Добавляем CSS для анимации смены цвета
const style = document.createElement('style');
style.textContent = `
    @keyframes colorChange {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Экспортируем функции для HTML
window.toggleMusic = toggleMusic;
window.createFireworks = createFireworks;
window.showSecretModal = showSecretModal;
window.closeModal = closeModal;

console.log('💌 Письмо для Кати готово к отправке!');
