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
// Juego 1: Parejas Románticas
function loadParejasGame(container) {
    const emojis = ['❤️', '💕', '💑', '🌹', '💍', '👩‍❤️‍👨'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    let flipped = [];
    let matched = 0;
    let lockBoard = false;

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
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .memory-card:hover {
            transform: scale(1.05);
        }
        .memory-card.flipped {
            background: white;
            color: #333;
        }
        .parejas-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin: 20px 0;
        }
    `;
    document.head.appendChild(style);

    const html = `
        <h3>Parejas Románticas 🎴</h3>
        <p>Encuentra las parejas de emojis</p>
        <div id="matchStatus" style="margin: 15px 0; font-size: 1.1rem;">Aciertos: <strong id="matchCount">0</strong>/${emojis.length}</div>
        <div class="parejas-grid" id="gameGrid"></div>
    `;

    container.innerHTML = html;

    const gameGrid = container.querySelector('#gameGrid');
    const matchCountEl = container.querySelector('#matchCount');

    // Crear tarjetas
    cards.forEach((emoji, index) => {
        const card = document.createElement('button');
        card.className = 'memory-card';
        card.setAttribute('data-emoji', emoji);
        card.setAttribute('data-index', index);
        card.innerHTML = '<span>?</span>';
        
        card.addEventListener('click', function() {
            if (lockBoard || card.classList.contains('flipped')) return;

            const cardEmoji = card.getAttribute('data-emoji');
            card.classList.add('flipped');
            card.querySelector('span').textContent = cardEmoji;
            flipped.push({ el: card, emoji: cardEmoji });

            if (flipped.length === 2) {
                lockBoard = true;
                if (flipped[0].emoji === flipped[1].emoji) {
                    matched++;
                    matchCountEl.textContent = matched;
                    flipped = [];
                    lockBoard = false;

                    if (matched === emojis.length) {
                        setTimeout(() => {
                            Swal.fire({
                                title: '¡Ganaste! 🎉',
                                text: 'Encontraste todas las parejas',
                                icon: 'success',
                                confirmButtonColor: '#f5576c',
                                confirmButtonText: 'Cerrar'
                            }).then(() => {
                                closeGame();
                            });
                        }, 500);
                    }
                } else {
                    setTimeout(() => {
                        flipped[0].el.classList.remove('flipped');
                        flipped[0].el.querySelector('span').textContent = '?';
                        flipped[1].el.classList.remove('flipped');
                        flipped[1].el.querySelector('span').textContent = '?';
                        flipped = [];
                        lockBoard = false;
                    }, 600);
                }
            }
        });
        
        gameGrid.appendChild(card);
    });
}

// Juego 2: Trivia con SweetAlert
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
        if (currentQuestion < questions.length) {
            const q = questions[currentQuestion];
            
            Swal.fire({
                title: 'Trivia del Amor ❓',
                html: `<p style="font-size: 1.2rem; margin: 20px 0;">${q.q}</p>`,
                icon: 'question',
                showCancelButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: function(modal) {
                    // Limpiar botones anteriores
                    const buttonsContainer = modal.querySelector('.swal2-actions');
                    if (buttonsContainer) {
                        buttonsContainer.innerHTML = '';
                    }
                    
                    // Crear botones para cada opción
                    const buttonsHTML = q.options.map((opt, i) => 
                        `<button class="swal2-confirm swal2-styled" style="background: #f5576c; margin: 5px;" onclick="handleTriviaAnswer(${i}, ${q.correct}, ${currentQuestion}, ${questions.length})">${opt}</button>`
                    ).join('');
                    
                    if (buttonsContainer) {
                        buttonsContainer.innerHTML = buttonsHTML;
                    }
                }
            });
        } else {
            showTriviaResult();
        }
    }

    window.handleTriviaAnswer = function(selected, correct, current, total) {
        if (selected === correct) {
            score++;
            Swal.fire({
                title: '¡Correcto! 🎉',
                text: 'Excelente respuesta, mi amor',
                icon: 'success',
                confirmButtonColor: '#f5576c',
                timer: 1500,
                timerProgressBar: true
            }).then(() => {
                currentQuestion++;
                showQuestion();
            });
        } else {
            Swal.fire({
                title: 'Casi, casi... ❤️',
                text: 'La respuesta correcta era: ' + questions[current].options[correct],
                icon: 'error',
                confirmButtonColor: '#f5576c',
                timer: 2000,
                timerProgressBar: true
            }).then(() => {
                currentQuestion++;
                showQuestion();
            });
        }
    };

    function showTriviaResult() {
        Swal.fire({
            title: '¡Fin del Trivia! 🏆',
            html: `<p style="font-size: 2rem; color: #f5576c; margin: 20px 0;">${score}/${questions.length}</p><p>Eres increíble, mi amor ❤️</p>`,
            icon: 'success',
            confirmButtonColor: '#f5576c',
            confirmButtonText: 'Cerrar'
        }).then(() => {
            closeGame();
        });
    }

    showQuestion();
}

// Juego 3: Recoge Corazones
function loadCorazonesGame(container) {
    let score = 0;

    const html = `
        <h3>Recoge Corazones 💕</h3>
        <p id="heartScore" style="font-size: 1.2rem; margin: 15px 0;">Corazones recogidos: <strong>0</strong></p>
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
    const scoreDisplay = container.querySelector('#heartScore');

    function createHeart() {
        const heart = document.createElement('div');
        heart.textContent = '❤️';
        heart.style.cssText = `
            position: absolute;
            font-size: 2.5rem;
            cursor: pointer;
            left: ${Math.random() * 85}%;
            top: ${Math.random() * 85}%;
            user-select: none;
            transition: all 0.1s;
        `;

        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            score++;
            scoreDisplay.innerHTML = `Corazones recogidos: <strong>${score}</strong>`;
            heart.style.transform = 'scale(1.3) rotate(360deg)';
            setTimeout(() => heart.remove(), 100);
            createHeart();
        });

        heart.addEventListener('mouseover', () => {
            heart.style.transform = 'scale(1.1)';
        });

        heart.addEventListener('mouseout', () => {
            heart.style.transform = 'scale(1)';
        });

        gameAreaEl.appendChild(heart);

        // Desaparecer después de 2.5 segundos
        setTimeout(() => {
            if (heart.parentNode) {
                heart.style.opacity = '0.3';
                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.remove();
                        if (gameAreaEl.parentNode) {
                            createHeart();
                        }
                    }
                }, 200);
            }
        }, 2500);
    }

    // Crear 3 corazones iniciales
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createHeart(), i * 300);
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
// SOPORTE PARA SWIPE EN GALERÍA (MÓVIL)
// ============================================

let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe izquierda = siguiente foto
        nextPhoto();
    } else if (touchEndX > touchStartX + 50) {
        // Swipe derecha = foto anterior
        previousPhoto();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel-3d');
    
    if (carousel) {
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
    }
});

// ============================================
// DETECTAR DISPOSITIVO MÓVIL
// ============================================

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Ajustar interactividad para móviles
document.addEventListener('DOMContentLoaded', function() {
    if (isMobileDevice()) {
        // Agregar clase al body para estilos específicos de móvil
        document.body.classList.add('mobile-device');
        
        // Desactivar hover effects en móvil
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) {
                .carousel-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-50%);
                }
                
                .juego-card:hover {
                    transform: none;
                }
                
                .nav-btn:hover {
                    background: rgba(255,255,255,0.2);
                    transform: none;
                }
                
                .music-toggle:hover {
                    transform: none;
                }
            }
        `;
        document.head.appendChild(style);
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
