// ============================================
// CONFIGURACIÓN GENERAL Y VARIABLES
// ============================================

const valentinesDay = new Date('2026-02-14T00:00:00').getTime();
let currentPhotoIndex = 0;
let gameActive = false;

// Array con fotografías placeholder (cambiar por tus fotos reales)
const photos = [
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516989126618-dc45a87c18c6?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1513642200688-c52646db42da?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1427751494785-cd51b57ec289?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518367150022-96b0ced48c4e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1514895221402-d7502aff88ea?w=600&h=400&fit=crop'
];

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initGallery();
    initConfetti();
});

// ============================================
// CUENTA REGRESIVA
// ============================================

function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = valentinesDay - now;

    const dias = Math.floor(distance / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('dias').textContent = String(dias).padStart(2, '0');
    document.getElementById('horas').textContent = String(horas).padStart(2, '0');
    document.getElementById('minutos').textContent = String(minutos).padStart(2, '0');
    document.getElementById('segundos').textContent = String(segundos).padStart(2, '0');

    // Si llegó el día, mostrar mensaje especial
    if (distance < 0) {
        document.querySelector('.countdown-title').textContent = '¡¡¡FELIZ DÍA DE SAN VALENTÍN!!!';
    }
}

// ============================================
// GALERÍA DE FOTOS 3D
// ============================================

function initGallery() {
    const carouselTrack = document.getElementById('carouselTrack');
    const totalPhotos = photos.length;
    
    // Crear elementos de foto
    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.innerHTML = `<img src="${photo}" alt="Momento ${index + 1}">`;
        
        if (index === 0) {
            item.classList.add('active');
        }
        
        carouselTrack.appendChild(item);
    });

    document.getElementById('totalPhotos').textContent = totalPhotos;
}

function previousPhoto() {
    const items = document.querySelectorAll('.carousel-item');
    const total = items.length;

    // Remover clases
    items.forEach(item => item.classList.remove('active', 'prev'));

    // Calcular nuevo índice
    currentPhotoIndex = (currentPhotoIndex - 1 + total) % total;

    // Especial: si volvemos al primero desde el último
    const prevIndex = (currentPhotoIndex - 1 + total) % total;

    items[currentPhotoIndex].classList.add('active');
    items[prevIndex].classList.add('prev');

    document.getElementById('currentPhoto').textContent = currentPhotoIndex + 1;
}

function nextPhoto() {
    const items = document.querySelectorAll('.carousel-item');
    const total = items.length;

    // Remover clases
    items.forEach(item => item.classList.remove('active', 'prev'));

    // Calcular nuevo índice
    currentPhotoIndex = (currentPhotoIndex + 1) % total;
    const prevIndex = (currentPhotoIndex - 1 + total) % total;

    items[currentPhotoIndex].classList.add('active');
    items[prevIndex].classList.add('prev');

    document.getElementById('currentPhoto').textContent = currentPhotoIndex + 1;
}

// ============================================
// LÍNEA DE TIEMPO
// ============================================

function expandTimeline(element) {
    const items = document.querySelectorAll('.timeline-item');
    const content = element.querySelector('.timeline-content');
    
    // Cerrar todos los demás
    items.forEach(item => {
        if (item !== element) {
            item.querySelector('.timeline-content').style.maxHeight = null;
        }
    });

    // Toggle actual
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + 20 + 'px';
    }
}

// ============================================
// MINI JUEGOS
// ============================================

function startGame(gameType) {
    const modal = document.getElementById('gameModal');
    const gameContent = document.getElementById('gameContent');
    gameActive = true;

    modal.classList.remove('hidden');

    if (gameType === 'parejas') {
        loadParejasGame(gameContent);
    } else if (gameType === 'trivia') {
        loadTriviaGame(gameContent);
    } else if (gameType === 'corazones') {
        loadCorazonesGame(gameContent);
    }
}

function closeGame() {
    const modal = document.getElementById('gameModal');
    modal.classList.add('hidden');
    gameActive = false;
}

// Juego 1: Parejas Románticas
function loadParejasGame(container) {
    const emojis = ['❤️', '💕', '💑', '🌹', '💍', '👩‍❤️‍👨'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    let flipped = [];
    let matched = 0;

    const html = `
        <h3>Parejas Románticas 🎴</h3>
        <p>Encuentra las parejas de emojis</p>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0;">
            ${cards.map((emoji, i) => `
                <button class="memory-card" onclick="flipCard(this, '${emoji}', ${i})">
                    <span style="font-size: 2rem;">?</span>
                </button>
            `).join('')}
        </div>
        <div id="gameStatus">Aciertos: ${matched}/${emojis.length}</div>
    `;

    container.innerHTML = html;

    // Agregar estilos específicos del juego
    const style = document.createElement('style');
    style.textContent = `
        .memory-card {
            width: 100%;
            aspect-ratio: 1;
            border: 2px solid #f5576c;
            background: linear-gradient(135deg, #f093fb, #f5576c);
            color: white;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 2rem;
        }
        .memory-card:hover {
            transform: scale(1.05);
        }
        .memory-card.flipped {
            background: white;
            color: #333;
        }
    `;
    document.head.appendChild(style);
}

// Juego 2: Trivia
function loadTriviaGame(container) {
    const questions = [
        {
            q: '¿Cuántos cabezazos nos dimos el primer día? 😄',
            options: ['Uno', 'Dos', 'Tres'],
            correct: 0
        },
        {
            q: '¿Cuál es tu mayor cualidad? 💫',
            options: ['Tu ternura', 'Tu fuerza', 'Tu magia'],
            correct: 2
        },
        {
            q: '¿Cuántos "te quiero" te he dicho hoy?',
            options: ['1000+', 'infinitos', 'más que estrellas'],
            correct: 1
        }
    ];

    let currentQuestion = 0;
    let score = 0;

    function showQuestion() {
        const q = questions[currentQuestion];
        const html = `
            <h3>Trivia del Amor ❓</h3>
            <p style="font-size: 1.2rem; margin: 20px 0; color: #333;">${q.q}</p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${q.options.map((opt, i) => `
                    <button onclick="selectAnswer(${i}, ${q.correct})" 
                        style="padding: 12px; border: 2px solid #f5576c; background: white; 
                        border-radius: 8px; cursor: pointer; transition: all 0.3s;"
                        onmouseover="this.style.background='#f5576c'; this.style.color='white';"
                        onmouseout="this.style.background='white'; this.style.color='#333';">
                        ${opt}
                    </button>
                `).join('')}
            </div>
            <p style="margin-top: 20px; color: #666;">Pregunta ${currentQuestion + 1}/${questions.length}</p>
        `;
        container.innerHTML = html;
    }

    showQuestion();

    window.selectAnswer = function(selected, correct) {
        if (selected === correct) {
            score++;
            alert('¡Correcto! 🎉');
        } else {
            alert('Casi, casi... ❤️');
        }

        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            container.innerHTML = `
                <h3>¡Fin del Trivia! 🏆</h3>
                <p style="font-size: 2rem; color: #f5576c; margin: 20px 0;">${score}/${questions.length}</p>
                <p>Eres increíble, mi amor ❤️</p>
                <button onclick="closeGame()" 
                    style="padding: 10px 20px; background: #f5576c; color: white; border: none; 
                    border-radius: 8px; cursor: pointer; margin-top: 20px;">
                    Cerrar
                </button>
            `;
        }
    };
}

// Juego 3: Recoge Corazones
function loadCorazonesGame(container) {
    const gameArea = document.createElement('div');
    gameArea.style.cssText = `
        width: 100%;
        height: 300px;
        background: linear-gradient(135deg, #f093fb, #f5576c);
        border-radius: 10px;
        position: relative;
        overflow: hidden;
        cursor: crosshair;
    `;

    let score = 0;
    const scoreDisplay = document.createElement('p');
    scoreDisplay.textContent = `Corazones recogidos: ${score}`;
    scoreDisplay.style.marginBottom = '15px';

    const html = `
        <h3>Recoge Corazones 💕</h3>
        ${scoreDisplay.outerHTML}
        <div id="gameArea" style="width: 100%; height: 300px; background: linear-gradient(135deg, #f093fb, #f5576c); 
            border-radius: 10px; position: relative; overflow: hidden; cursor: crosshair; margin: 10px 0;"></div>
        <button onclick="closeGame()" 
            style="padding: 10px 20px; background: #f5576c; color: white; border: none; 
            border-radius: 8px; cursor: pointer; width: 100%; margin-top: 15px;">
            Finalizar
        </button>
    `;

    container.innerHTML = html;

    const gameAreaEl = container.querySelector('#gameArea');

    function createHeart() {
        const heart = document.createElement('div');
        heart.textContent = '❤️';
        heart.style.cssText = `
            position: absolute;
            font-size: 2rem;
            cursor: pointer;
            left: ${Math.random() * 90}%;
            top: ${Math.random() * 90}%;
            user-select: none;
        `;

        heart.onclick = (e) => {
            e.stopPropagation();
            score++;
            scoreDisplay.textContent = `Corazones recogidos: ${score}`;
            heart.remove();
            createHeart();
        };

        gameAreaEl.appendChild(heart);

        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
                createHeart();
            }
        }, 2000);
    }

    for (let i = 0; i < 3; i++) {
        createHeart();
    }
}

// ============================================
// MÚSICA
// ============================================

let musicPlaying = false;

function toggleMusic() {
    const audio = document.getElementById('bgMusic');
    const icon = document.getElementById('musicIcon');

    if (musicPlaying) {
        audio.pause();
        icon.textContent = '🔇';
        musicPlaying = false;
    } else {
        audio.play().catch(() => {
            console.log('No se puede reproducir automáticamente. Intenta hacer clic nuevamente.');
        });
        icon.textContent = '🔊';
        musicPlaying = true;
    }
}

// ============================================
// CONFETI
// ============================================

function initConfetti() {
    // Crear confeti inicial
    for (let i = 0; i < 30; i++) {
        setTimeout(() => createConfetti(), i * 100);
    }
}

function createConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    const colors = ['❤️', '💕', '💫', '✨', '🌹'];
    const emoji = colors[Math.floor(Math.random() * colors.length)];
    
    confetti.textContent = emoji;
    confetti.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-duration: ${2 + Math.random() * 1}s;
        font-size: ${1 + Math.random() * 1.5}rem;
    `;

    confettiContainer.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3000);
}

// Lanzar confeti cuando hacen clic en botones
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-start') || 
        e.target.classList.contains('juego-card')) {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => createConfetti(), i * 50);
        }
    }
});

// ============================================
// NAVEGACIÓN SUAVE
// ============================================

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// EFECTOS ADICIONALES
// ============================================

// Agregar efecto al pasar el mouse en el timeline
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.style.cursor = 'pointer';
    });
});

// Crear corazones flotantes ocasionales
setInterval(() => {
    if (Math.random() > 0.8) {
        createConfetti();
    }
}, 3000);
