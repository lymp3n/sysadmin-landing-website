// Мобильное меню
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Three.js 3D сцена
let scene, camera, renderer, controls;

function init3DScene() {
    // Создание сцены
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    
    // Создание камеры
    const canvas = document.getElementById('canvas3d');
    camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.z = 10;
    
    // Создание рендерера
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    canvas.appendChild(renderer.domElement);
    
    // Добавление OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Добавление освещения
    const ambientLight = new THREE.AmbientLight(0x00ff9d, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x0095ff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x00ff9d, 1, 100);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);
    
    // Создание 3D объектов, представляющих IT-инфраструктуру
    createServerRack();
    createNetworkElements();
    createFloatingParticles();
    
    // Анимация
    function animate() {
        requestAnimationFrame(animate);
        
        // Обновление контролов
        controls.update();
        
        // Анимация плавающих элементов
        animateFloatingElements();
        
        // Рендеринг сцены
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Обработка изменения размера окна
    window.addEventListener('resize', onWindowResize);
}

function createServerRack() {
    // Основание стойки
    const rackGeometry = new THREE.BoxGeometry(3, 5, 2);
    const rackMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.7,
        roughness: 0.3
    });
    const rack = new THREE.Mesh(rackGeometry, rackMaterial);
    rack.position.y = -0.5;
    rack.castShadow = true;
    rack.receiveShadow = true;
    scene.add(rack);
    
    // Серверные блоки внутри стойки
    const serverCount = 6;
    for (let i = 0; i < serverCount; i++) {
        const serverGeometry = new THREE.BoxGeometry(2.8, 0.3, 1.8);
        const serverMaterial = new THREE.MeshStandardMaterial({ 
            color: i % 2 === 0 ? 0x666666 : 0x888888,
            metalness: 0.8,
            roughness: 0.2
        });
        const server = new THREE.Mesh(serverGeometry, serverMaterial);
        server.position.y = -2 + i * 0.6;
        server.castShadow = true;
        server.receiveShadow = true;
        
        // Индикаторы на серверах
        const indicatorGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const indicatorMaterial = new THREE.MeshBasicMaterial({ 
            color: i % 3 === 0 ? 0xff0000 : (i % 3 === 1 ? 0x00ff00 : 0xffff00)
        });
        const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicator.position.set(1.2, -2 + i * 0.6, 0.8);
        scene.add(indicator);
        
        scene.add(server);
    }
    
    // Верхний элемент стойки
    const topGeometry = new THREE.BoxGeometry(3.2, 0.2, 2.2);
    const topMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        metalness: 0.9,
        roughness: 0.1
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 2.5;
    top.castShadow = true;
    top.receiveShadow = true;
    scene.add(top);
}

// Массив для хранения плавающих элементов
let floatingElements = [];

function createNetworkElements() {
    // Создание плавающих сетевых элементов
    const elementCount = 12;
    
    for (let i = 0; i < elementCount; i++) {
        let geometry, material;
        
        // Разные типы элементов (символизирующие технологии из проекта)
        if (i % 4 === 0) {
            // Сфера (Docker)
            geometry = new THREE.SphereGeometry(0.2, 16, 16);
            material = new THREE.MeshStandardMaterial({ 
                color: 0x0095ff, // Docker blue
                metalness: 0.7,
                roughness: 0.3,
                emissive: 0x0095ff,
                emissiveIntensity: 0.2
            });
        } else if (i % 4 === 1) {
            // Цилиндр (Linux сервер)
            geometry = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8);
            material = new THREE.MeshStandardMaterial({ 
                color: 0x00ff9d, // Linux green
                metalness: 0.7,
                roughness: 0.3,
                emissive: 0x00ff9d,
                emissiveIntensity: 0.2
            });
        } else if (i % 4 === 2) {
            // Куб (Ansible)
            geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            material = new THREE.MeshStandardMaterial({ 
                color: 0xff0095, // Ansible red
                metalness: 0.7,
                roughness: 0.3,
                emissive: 0xff0095,
                emissiveIntensity: 0.2
            });
        } else {
            // Тор (Сеть/VPN)
            geometry = new THREE.TorusGeometry(0.2, 0.08, 16, 100);
            material = new THREE.MeshStandardMaterial({ 
                color: 0xffff00, // Network yellow
                metalness: 0.7,
                roughness: 0.3,
                emissive: 0xffff00,
                emissiveIntensity: 0.2
            });
        }
        
        const element = new THREE.Mesh(geometry, material);
        
        // Позиционирование элементов по спирали
        const angle = (i / elementCount) * Math.PI * 2;
        const radius = 4 + Math.sin(i * 0.5) * 0.5;
        element.position.x = Math.cos(angle) * radius;
        element.position.y = Math.sin(angle * 2) * 1.5;
        element.position.z = Math.sin(angle) * radius;
        
        element.castShadow = true;
        scene.add(element);
        
        // Сохраняем данные для анимации
        floatingElements.push({
            mesh: element,
            angle: angle,
            radius: radius,
            speed: 0.5 + Math.random() * 0.5,
            floatHeight: 0.5 + Math.random() * 1,
            rotationSpeed: 0.01 + Math.random() * 0.02
        });
    }
}

function animateFloatingElements() {
    const time = Date.now() * 0.001;
    
    floatingElements.forEach((element, index) => {
        element.angle += 0.005 * element.speed;
        
        // Плавное движение по орбите
        element.mesh.position.x = Math.cos(element.angle + time * 0.2) * element.radius;
        element.mesh.position.y = Math.sin(element.angle * 2 + time * 0.3) * element.floatHeight;
        element.mesh.position.z = Math.sin(element.angle + time * 0.1) * element.radius;
        
        // Вращение
        element.mesh.rotation.x += element.rotationSpeed * 0.5;
        element.mesh.rotation.y += element.rotationSpeed;
    });
}

function createFloatingParticles() {
    // Создание частиц для эффекта передачи данных
    const particleCount = 80;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Позиции частиц в форме сферы
        const radius = 5 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
        
        // Цвета частиц (зеленые и синие)
        colors[i] = Math.random() * 0.5; // R
        colors[i + 1] = 0.8 + Math.random() * 0.2; // G
        colors[i + 2] = 0.8 + Math.random() * 0.2; // B
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Сохраняем ссылку для анимации
    scene.userData.particleSystem = particleSystem;
    scene.userData.particlePositions = positions;
}

function animateParticles() {
    if (!scene.userData.particleSystem) return;
    
    const positions = scene.userData.particlePositions;
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < positions.length; i += 3) {
        // Медленное движение частиц по синусоиде
        const index = i / 3;
        positions[i] += Math.sin(time + index) * 0.01;
        positions[i + 1] += Math.cos(time * 0.7 + index) * 0.01;
        positions[i + 2] += Math.sin(time * 0.5 + index) * 0.01;
    }
    
    scene.userData.particleSystem.geometry.attributes.position.needsUpdate = true;
}

function onWindowResize() {
    const canvas = document.getElementById('canvas3d');
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
}

// Основная функция анимации
function animateAll() {
    animateParticles();
    requestAnimationFrame(animateAll);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация 3D сцены
    if (document.getElementById('canvas3d')) {
        init3DScene();
        animateAll();
    }
    
    // Плавная прокрутка к секциям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Обработка формы
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                // Здесь обычно отправка на сервер
                alert('Сообщение отправлено! Я свяжусь с вами в ближайшее время.');
                contactForm.reset();
            } else {
                alert('Пожалуйста, заполните все поля формы.');
            }
        });
    }
    
    // Параллакс эффект для 3D сцены при скролле
    window.addEventListener('scroll', () => {
        const canvas = document.getElementById('canvas3d');
        if (!canvas) return;
        
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        canvas.style.transform = `translate3d(0px, ${rate}px, 0px)`;
    });
});