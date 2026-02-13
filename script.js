// ============================================
// CONFIGURACIÓN GENERAL Y VARIABLES
// ============================================

const valentinesDay = new Date('2026-02-14T00:00:00').getTime();
let currentPhotoIndex = 0;
let gameActive = false;
let valentineAccepted = false;
let noButtonClickCount = 0;
let lastSwalTime = 0;

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
    }
    
    initCountdown();
    initGallery();
    initConfetti();
    initStrawberry();
    initSnoopy();
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
            grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
            gap: 10px;
            margin: 20px 0;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }
        @media (max-width: 768px) {
            .memory-card {
                font-size: 1.5rem;
            }
            .parejas-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                max-width: 300px;
            }
        }
        @media (max-width: 480px) {
            .memory-card {
                font-size: 1.2rem;
            }
            .parejas-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 6px;
                max-width: 250px;
            }
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
    // Agregar estilos responsive para trivia
    const style = document.createElement('style');
    style.textContent = `
        .swal2-actions {
            display: flex;
            flex-direction: column;
            gap: 15px;
            width: 100%;
            margin-top: 25px;
            align-items: center;
        }
        .swal2-confirm {
            width: 90% !important;
            max-width: 350px !important;
            padding: 14px 20px !important;
            font-size: 1rem !important;
            white-space: normal !important;
            height: auto !important;
        }
        @media (max-width: 480px) {
            .swal2-confirm {
                padding: 12px 15px !important;
                font-size: 0.9rem !important;
            }
            .swal2-popup {
                width: 90vw !important;
            }
        }
    `;
    document.head.appendChild(style);

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
                html: `<p style="font-size: 1.2rem; margin: 30px 0; padding: 20px 0;">${q.q}</p>`,
                icon: 'question',
                showCancelButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: function(modal) {
                    // Limpiar botones anteriores
                    const buttonsContainer = modal.querySelector('.swal2-actions');
                    if (buttonsContainer) {
                        buttonsContainer.innerHTML = '';
                        buttonsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px; width: 100%;';
                    }
                    
                    // Crear botones para cada opción
                    q.options.forEach((opt, i) => {
                        const btn = document.createElement('button');
                        btn.className = 'swal2-confirm swal2-styled';
                        btn.style.cssText = 'background: #f5576c; margin: 0; width: 100%; padding: 12px 20px; border-radius: 8px; border: none; color: white; cursor: pointer; font-weight: 600;';
                        btn.textContent = opt;
                        btn.onclick = () => handleTriviaAnswer(i, q.correct, currentQuestion, questions.length);
                        if (buttonsContainer) {
                            buttonsContainer.appendChild(btn);
                        }
                    });
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

    // Crear estilos para responsividad
    const style = document.createElement('style');
    style.textContent = `
        #gameArea {
            width: 100% !important;
            height: 400px;
            background: linear-gradient(135deg, #f093fb, #f5576c) !important;
            border-radius: 10px;
            position: relative;
            overflow: hidden;
            cursor: crosshair;
            margin: 10px 0;
        }
        @media (max-width: 768px) {
            #gameArea {
                height: 350px !important;
            }
        }
        @media (max-width: 480px) {
            #gameArea {
                height: 300px !important;
            }
        }
    `;
    document.head.appendChild(style);

    const html = `
        <h3>Recoge Corazones 💕</h3>
        <p id="heartScore" style="font-size: 1.2rem; margin: 15px 0;">Corazones recogidos: <strong>0</strong></p>
        <div id="gameArea"></div>
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
        // Intentar reproducir si está pausado
        if (audio.paused) {
            audio.play().catch(() => {
                // Silent catch
            });
        }
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

// ============================================
// FRESAS CAYENDO
// ============================================

function initStrawberry() {
    // Crear fresas inicial
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createStrawberry(), i * 150);
    }
    
    // Crear fresas continuamente cada cierto tiempo
    setInterval(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createStrawberry(), i * 200);
        }
    }, 4000);
}

function createStrawberry() {
    const confettiContainer = document.querySelector('.confetti-container');
    const strawberry = document.createElement('div');
    strawberry.className = 'strawberry';
    
    strawberry.textContent = '🍓';
    strawberry.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-duration: ${3 + Math.random() * 2}s;
        font-size: ${0.8 + Math.random() * 1.2}rem;
    `;

    confettiContainer.appendChild(strawberry);

    setTimeout(() => strawberry.remove(), 5000);
}

// Lanzar confeti cuando hacen clic en botones
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-start') || 
        e.target.classList.contains('juego-card')) {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => createConfetti(), i * 50);
        }
        for (let i = 0; i < 8; i++) {
            setTimeout(() => createStrawberry(), i * 75);
        }
    }
});

// ============================================
// STICKERS DE SNOOPY
// ============================================

const snoopyImages = [
    'https://www.pngplay.com/wp-content/uploads/13/Snoopy-Transparent-PNG.png',
    'https://www.pngkey.com/png/full/223-2237612_transparent-snoopy-png-snoopy-hug.png',
    'https://pngimg.com/uploads/snoopy/snoopy_PNG66.png',
    'https://pngimg.com/uploads/snoopy/snoopy_PNG26.png'
];

function initSnoopy() {
    const sections = ['inicio', 'galeria', 'timeline', 'juegos', 'mensaje'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const container = section.querySelector('.stickers-container');
        
        if (container) {
            const numStickers = window.innerWidth > 768 ? 3 : 2;
            for (let i = 0; i < numStickers; i++) {
                createSnoopySticker(container);
            }
        }
    });
}

function createSnoopySticker(container) {
    const sticker = document.createElement('div');
    sticker.className = 'sticker';
    
    const img = document.createElement('img');
    img.src = snoopyImages[Math.floor(Math.random() * snoopyImages.length)];
    img.alt = 'Snoopy';
    
    // Calcular posición aleatoria
    const randomX = Math.random() * 80 + 10; // 10% a 90%
    const randomY = Math.random() * 80 + 5;  // 5% a 85%
    const randomSize = Math.random() * 60 + 50; // 50px a 110px
    const randomDuration = Math.random() * 6 + 4; // 4s a 10s
    const randomRotation = Math.random() * 15 - 7.5;
    
    sticker.style.cssText = `
        left: ${randomX}%;
        top: ${randomY}%;
        width: ${randomSize}px;
        height: auto;
        animation-duration: ${randomDuration}s;
        transform: rotate(${randomRotation}deg);
    `;
    
    img.onload = function() {
        img.style.display = 'block';
    };
    
    img.onerror = function() {
        // No mostrar nada si la imagen no carga
        sticker.remove();
    };
    
    sticker.appendChild(img);
    container.appendChild(sticker);
}

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
    // Bloquear navegación si no ha aceptado ser San Valentín
    if (sectionId !== 'inicio' && !valentineAccepted) {
        Swal.fire({
            title: '¡Espera! 💕',
            text: '¡Primero tienes que responder la pregunta! ¿Serás mi San Valentín?',
            icon: 'question',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#f5576c'
        });
        // Hacer scroll de vuelta a inicio
        const element = document.getElementById('inicio');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }
    
    // Si es galeria, desmuteamos el audio e intentamos reproducir
    if (sectionId === 'galeria') {
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic) {
            bgMusic.muted = false;
            // Intentar reproducir solo si no está ya reproduciendo
            if (bgMusic.paused) {
                bgMusic.play().catch(() => {
                    // Silent catch - el audio se reproducirá cuando sea posible
                });
            }
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

// ============================================
// FUNCIONES PARA LA PREGUNTA VALENTINE
// ============================================

function acceptValentine() {
    valentineAccepted = true;
    
    // Lanzar confeti y fresas
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createConfetti(), i * 50);
    }
    for (let i = 0; i < 12; i++) {
        setTimeout(() => createStrawberry(), i * 60);
    }
    
    // Ocultar la pregunta de Valentine
    const valentineQuestion = document.querySelector('.valentine-question');
    if (valentineQuestion) {
        valentineQuestion.style.opacity = '0';
        valentineQuestion.style.transform = 'scale(0.8)';
        valentineQuestion.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            valentineQuestion.style.display = 'none';
        }, 500);
    }
    
    // Mostrar todas las otras secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        if (!section.classList.contains('inicio-section')) {
            setTimeout(() => {
                section.classList.add('revealed');
            }, 100 + index * 100);
        }
    });
    
    // Mostrar la navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        setTimeout(() => {
            navbar.classList.add('revealed');
        }, 300);
    }
    
    // Activar música y desplazarse después de un tiempo
    setTimeout(() => {
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic) {
            bgMusic.muted = false;
            if (bgMusic.paused) {
                bgMusic.play().catch(() => {});
            }
            document.getElementById('musicIcon').textContent = '🔊';
        }
        
        // Desplazarse a la galería
        scrollToSection('galeria');
    }, 1500);
}

function moveNoButton() {
    const noBtn = document.getElementById('btnNo');
    if (!noBtn) return;
    
    noButtonClickCount++;
    
    // Diferentes efectos según el intento
    const effects = [
        () => {
            // Moverse a una posición aleatoria
            const randomX = Math.random() * 200 - 100;
            const randomY = Math.random() * 200 - 100;
            noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
        },
        () => {
            // Hacerse más pequeño
            const size = Math.max(10, 100 - noButtonClickCount * 8);
            noBtn.style.fontSize = size + '%';
            noBtn.style.padding = (18 - noButtonClickCount * 2) + 'px ' + (50 - noButtonClickCount * 5) + 'px';
        },
        () => {
            // Girar
            noBtn.style.transform = `rotate(${noButtonClickCount * 45}deg)`;
        },
        () => {
            // Escala
            const scale = Math.max(0.1, 1 - noButtonClickCount * 0.15);
            noBtn.style.transform = `scale(${scale})`;
        }
    ];
    
    // Aplicar efecto aleatorio
    effects[Math.floor(Math.random() * effects.length)]();
    
    // Solo mostrar Swal en desktop (no en touch)
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    };
    
    // Si es dispositivo táctil, no mostrar Swal
    if (isTouchDevice()) {
        return;
    }
    
    // Mostrar mensajes divertidos solo en desktop
    const messages = [
        '¡No! 😊',
        '¡Inténtalo de nuevo!',
        '¡Vamos! 💕',
        '¡Es imposible hacer click aquí!',
        '¿De verdad lo intentas? 😄',
        '¡Dí que sí! ✨',
        '¡No hay escape! 🐶'
    ];
    
    // Solo mostrar Swal cada 2 segundos máximo
    const now = Date.now();
    if (noButtonClickCount % 2 === 0 && (now - lastSwalTime) > 2000) {
        lastSwalTime = now;
        Swal.fire({
            title: messages[Math.floor(Math.random() * messages.length)],
            icon: 'info',
            timer: 1500,
            showConfirmButton: false,
            position: 'top',
            didOpen: (modal) => {
                modal.style.zIndex = 9999;
            }
        });
    }
}
