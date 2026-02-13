// ============================================
// CONFIGURACIÓN GENERAL Y VARIABLES
// ============================================

const valentinesDay = new Date('2026-02-14T00:00:00').getTime();
let currentPhotoIndex = 0;
let gameActive = false;
let audioInitialized = false;

// ARRAY DE MOMENTOS - SOPORTA IMÁGENES Y VIDEOS
// ==========================================
// FORMATO: { type: 'image' | 'video', src: 'URL', alt: 'descripción' }
// 
// EJEMPLOS DE USO:
// 
// 1. IMÁGENES LOCALES (en carpeta del proyecto):
//    { type: 'image', src: 'fotos/foto1.jpg', alt: 'Mi foto' }
//    { type: 'image', src: 'fotos/foto2.png', alt: 'Otra foto' }
//
// 2. IMÁGENES DE INTERNET (URLs completas):
//    { type: 'image', src: 'https://ejemplo.com/foto.jpg', alt: 'Foto online' }
//
// 3. VIDEOS DESDE URL:
//    { type: 'video', src: 'https://ejemplo.com/video.mp4', alt: 'Mi video' }
//
// 4. VIDEOS LOCALES:
//    { type: 'video', src: 'videos/mi-video.mp4', alt: 'Video grabado' }
//
// 5. VIDEOS DE YOUTUBE (embed):
//    { type: 'youtube', src: 'https://www.youtube.com/embed/ID_VIDEO', alt: 'Video YouTube' }
//
// ¿CÓMO AGREGAR TUS ARCHIVOS LOCALES?
// 1. Crea carpetas en c:\xampp-8\htdocs\sanvalentin.github.io\fotos y \videos
// 2. Sube tus archivos allí
// 3. Usa las rutas relativas en el array
//
const photos = [
    { type: 'video', src: 'videos/VID-20260206-WA0023.mp4', alt: 'Video 1' },
    { type: 'video', src: 'videos/VID-20260206-WA0024.mp4', alt: 'Video 2' },
    { type: 'video', src: 'videos/VID-20260206-WA0025.mp4', alt: 'Video 3' },
    { type: 'video', src: 'videos/VID-20260206-WA0026.mp4', alt: 'Video 4' }
];

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar audio de fondo
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.volume = 0.2; // 40% de volumen
        bgMusic.currentTime = 150; // Iniciar en 2:30 (150 segundos)
        
        // Reproducir al primer clic del usuario
        const playMusic = function() {
            if (!audioInitialized) {
                bgMusic.play().catch(err => {
                    console.log('Error al reproducir audio:', err);
                });
                audioInitialized = true;
                document.removeEventListener('click', playMusic);
                document.removeEventListener('touchstart', playMusic);
            }
        };
        
        document.addEventListener('click', playMusic);
        document.addEventListener('touchstart', playMusic);
    }
    
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
    
    // Crear elementos de foto/video
    photos.forEach((media, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        
        let html = '';
        
        if (media.type === 'image') {
            html = `<img src="${media.src}" alt="${media.alt}" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else if (media.type === 'video') {
            html = `<video style="width: 100%; height: 100%; object-fit: contain; background: #000; transform: rotate(-90deg);" autoplay muted>
                <source src="${media.src}" type="video/mp4">
                Tu navegador no soporta videos
            </video>`;
        } else if (media.type === 'youtube') {
            html = `<iframe style="width: 100%; height: 100%; border: none;" 
                src="${media.src}" 
                allowfullscreen></iframe>`;
        }
        
        item.innerHTML = html;
        
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

    // Pausar video actual
    const currentVideo = items[currentPhotoIndex].querySelector('video');
    if (currentVideo) currentVideo.pause();

    // Remover clases
    items.forEach(item => item.classList.remove('active', 'prev'));

    // Calcular nuevo índice
    currentPhotoIndex = (currentPhotoIndex - 1 + total) % total;

    // Especial: si volvemos al primero desde el último
    const prevIndex = (currentPhotoIndex - 1 + total) % total;

    items[currentPhotoIndex].classList.add('active');
    items[prevIndex].classList.add('prev');

    // Reproducir nuevo video
    const newVideo = items[currentPhotoIndex].querySelector('video');
    if (newVideo) {
        newVideo.currentTime = 0;
        newVideo.play();
    }

    document.getElementById('currentPhoto').textContent = currentPhotoIndex + 1;
}

function nextPhoto() {
    const items = document.querySelectorAll('.carousel-item');
    const total = items.length;

    // Pausar video actual
    const currentVideo = items[currentPhotoIndex].querySelector('video');
    if (currentVideo) currentVideo.pause();

    // Remover clases
    items.forEach(item => item.classList.remove('active', 'prev'));

    // Calcular nuevo índice
    currentPhotoIndex = (currentPhotoIndex + 1) % total;
    const prevIndex = (currentPhotoIndex - 1 + total) % total;

    items[currentPhotoIndex].classList.add('active');
    items[prevIndex].classList.add('prev');

    // Reproducir nuevo video
    const newVideo = items[currentPhotoIndex].querySelector('video');
    if (newVideo) {
        newVideo.currentTime = 0;
        newVideo.play();
    }

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
            q: '¿Cuál fue el día donde pasó todo?',
            options: ['31 de enero', '30 de enero', '24 de enero'],
            correct: 1
        },
        {
            q: '¿Dónde fue nuestro primer beso? 💫',
            options: ['Museo Metropolitano de Lima', 'Parque', 'MegaPlaza'],
            correct: 2
        },
        {
            q: 'Del 1 al 10 ¿Cuánto crees que me encantas?',
            options: ['5', '10', '∞'],
            correct: 2
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

    if (audio.muted) {
        audio.muted = false;
        icon.textContent = '🔊';
        musicPlaying = true;
    } else {
        audio.muted = true;
        icon.textContent = '🔇';
        musicPlaying = false;
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
    // Si es galeria, desmuteamos el audio
    if (sectionId === 'galeria') {
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic) {
            bgMusic.muted = false;
            document.getElementById('musicIcon').textContent = '🔊';
        }
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
        const targetPosition = element.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000; // 1 segundo de duración
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function para movimiento suave
            const easeInOutQuad = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;
            
            window.scrollTo(0, startPosition + distance * easeInOutQuad);

            if (elapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
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
