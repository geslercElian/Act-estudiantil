// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVEGACIÓN MÓVIL =====
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // ===== NAVEGACIÓN SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            // Cerrar menú móvil si está abierto
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });

    // ===== EFECTO SCROLL EN HEADER =====
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // ===== SISTEMA DE PESTAÑAS =====
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remover clase active de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // ===== GALERÍA DE IMÁGENES =====
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-image');
    const imageTitle = document.getElementById('image-title');
    const imageDescription = document.getElementById('image-description');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remover clase active de todas las miniaturas
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Agregar clase active a la miniatura clickeada
            this.classList.add('active');
            
            // Actualizar imagen principal
            const newSrc = this.src.replace('w=100', 'w=1280');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            
            if (mainImage) {
                mainImage.src = newSrc;
                mainImage.alt = this.alt;
            }
            
            if (imageTitle) {
                imageTitle.textContent = title;
            }
            
            if (imageDescription) {
                imageDescription.textContent = description;
            }
        });
    });

    // ===== ANIMACIONES AL HACER SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observar todas las tarjetas
    document.querySelectorAll('.card, .cultura-card, .stat-card, .fact-card').forEach(card => {
        observer.observe(card);
    });

    // ===== CONTADOR ANIMADO PARA ESTADÍSTICAS =====
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Formatear números
            if (target >= 1000000) {
                element.textContent = (current / 1000000).toFixed(1) + 'M';
            } else if (target >= 1000) {
                element.textContent = (current / 1000).toFixed(0) + 'K';
            } else if (target < 1) {
                element.textContent = Math.round(current * 100) + '%';
            } else {
                element.textContent = Math.round(current).toLocaleString();
            }
        }, 16);
    };

    // Observar estadísticas para animarlas cuando entren en vista
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                
                // Extraer número del texto
                let targetNumber;
                if (text.includes('%')) {
                    targetNumber = parseFloat(text) / 100;
                } else if (text.includes('M')) {
                    targetNumber = parseFloat(text) * 1000000;
                } else if (text.includes('K')) {
                    targetNumber = parseFloat(text) * 1000;
                } else {
                    targetNumber = parseInt(text.replace(/,/g, ''));
                }
                
                if (!isNaN(targetNumber)) {
                    animateCounter(element, targetNumber);
                    statsObserver.unobserve(element);
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // ===== LAZY LOADING PARA IMÁGENES =====
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('fade-in-up');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // ===== EFECTOS DE HOVER MEJORADOS =====
    const cards = document.querySelectorAll('.card, .cultura-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== NAVEGACIÓN ACTIVA =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav);

    // ===== FORMULARIO DE PARTICIPACIÓN (simulado) =====
    const participateButtons = document.querySelectorAll('a[href="#"]:not(.social-links a)');
    
    participateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simular acción
            const originalText = this.textContent;
            this.textContent = 'Cargando...';
            this.style.opacity = '0.7';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.textContent = '¡Gracias por tu interés!';
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.opacity = '1';
                    this.style.pointerEvents = 'auto';
                }, 2000);
            }, 1000);
        });
    });

    // ===== MEJORAS DE ACCESIBILIDAD =====
    
    // Navegación por teclado para pestañas
    tabButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const nextIndex = e.key === 'ArrowRight' 
                    ? (index + 1) % tabButtons.length 
                    : (index - 1 + tabButtons.length) % tabButtons.length;
                
                tabButtons[nextIndex].focus();
                tabButtons[nextIndex].click();
            }
        });
    });

    // Navegación por teclado para galería
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const nextIndex = e.key === 'ArrowRight' 
                    ? (index + 1) % thumbnails.length 
                    : (index - 1 + thumbnails.length) % thumbnails.length;
                
                thumbnails[nextIndex].focus();
            }
        });
    });

    // ===== DETECCIÓN DE PREFERENCIAS DE MOVIMIENTO =====
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Desactivar animaciones para usuarios que prefieren movimiento reducido
        document.documentElement.style.setProperty('--transicion', 'none');
        
        // Remover animaciones de scroll
        document.querySelectorAll('*').forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }

    // ===== MANEJO DE ERRORES DE IMÁGENES =====
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
            this.alt = 'Imagen no disponible';
        });
    });

    // ===== INICIALIZACIÓN COMPLETA =====
    console.log('🇳🇮 Raíces de Nicaragua - Sitio web cargado correctamente');
    
    // Disparar evento personalizado cuando todo esté listo
    const readyEvent = new CustomEvent('nicaraguaReady', {
        detail: { message: 'Sitio web de Raíces de Nicaragua listo' }
    });
    document.dispatchEvent(readyEvent);
});

// ===== FUNCIONES GLOBALES =====

// Función para cambiar tema (por si se quiere implementar modo oscuro)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Función para compartir contenido (Web Share API)
function shareContent(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).catch(err => console.log('Error al compartir:', err));
    } else {
        // Fallback para navegadores que no soportan Web Share API
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--azul-bandera);
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    if (type === 'error') {
        notification.style.background = 'var(--rojo-cultura)';
    } else if (type === 'success') {
        notification.style.background = 'var(--verde-cultura)';
    }
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Función para validar formularios (para uso futuro)
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('Por favor ingresa un email válido');
    }
    
    if (!formData.message || formData.message.trim().length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    return errors;
}

// Función para cargar contenido dinámico (para uso futuro)
function loadContent(section) {
    const contentMap = {
        'tradiciones': {
            title: 'Tradiciones Nicaragüenses',
            content: 'Contenido sobre tradiciones...'
        },
        'danzas': {
            title: 'Danzas Tradicionales',
            content: 'Contenido sobre danzas...'
        },
        'musica': {
            title: 'Música Nicaragüense',
            content: 'Contenido sobre música...'
        }
    };
    
    return contentMap[section] || null;
}

// Función para manejar el estado de carga
function setLoadingState(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.style.pointerEvents = 'none';
    } else {
        element.classList.remove('loading');
        element.style.pointerEvents = 'auto';
    }
}

// ===== MANEJO DE EVENTOS PERSONALIZADOS =====
document.addEventListener('nicaraguaReady', function(e) {
    console.log('✅', e.detail.message);
    
    // Aquí se pueden agregar inicializaciones adicionales
    // como conexiones a APIs, carga de datos dinámicos, etc.
});

// ===== OPTIMIZACIONES DE RENDIMIENTO =====

// Debounce para eventos de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce al scroll
const debouncedScroll = debounce(() => {
    // Funciones que se ejecutan en scroll
    updateActiveNav();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ===== COMPATIBILIDAD CON NAVEGADORES ANTIGUOS =====

// Polyfill para IntersectionObserver
if (!window.IntersectionObserver) {
    // Fallback simple para navegadores antiguos
    document.querySelectorAll('.card, .cultura-card, .stat-card, .fact-card').forEach(card => {
        card.classList.add('fade-in-up');
    });
}

// Polyfill para CustomEvent
if (typeof window.CustomEvent !== 'function') {
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    window.CustomEvent = CustomEvent;
}

// ===== FUNCIONES DE UTILIDAD =====

// Función para formatear números
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toLocaleString();
}

// Función para detectar dispositivo móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para obtener posición de scroll
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

// ===== CONFIGURACIÓN FINAL =====

// Configurar comportamiento de enlaces externos
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }
});

// Mensaje de bienvenida en consola
console.log(`
🇳🇮 ¡Bienvenido a Raíces de Nicaragua! 🇳🇮

Este sitio web celebra la rica cultura y educación de Nicaragua.
Desarrollado con HTML, CSS y JavaScript vanilla.

Características:
- Diseño responsivo
- Navegación suave
- Galería interactiva
- Animaciones optimizadas
- Accesibilidad mejorada
- Tipografías Merriweather y Montserrat
- Sistema de pestañas
- Animaciones suaves
- Diseño completamente responsivo
- Navegación móvil
- Efectos de scroll

¡Explora y descubre las maravillas de Nicaragua!
`);