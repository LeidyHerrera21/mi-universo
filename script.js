   /* =================== ESCENA =================== */
const scene = new THREE.Scene();
const ORBIT_SYNC_SPEED = 0.003;

/* =================== ESTRELLAS DE FONDO =================== */
function crearEstrellasFondo() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000; 

    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 500; 
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

crearEstrellasFondo();

/* =================== GALAXIA =================== */
let galaxy;
const parameters = {
    count: 80000,
    size: 0.01,
    radius: 6,
    branches: 4,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: "#ff1b6b",
    outsideColor: "#3000ff"
};

function generateGalaxy() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        const randomX = (Math.random() - 0.5) * parameters.randomness * radius;
        const randomY = (Math.random() - 0.5) * parameters.randomness * radius;
        const randomZ = (Math.random() - 0.5) * parameters.randomness * radius;

        positions[i3]     = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixed = colorInside.clone().lerp(colorOutside, radius / parameters.radius);
        colors[i3]     = mixed.r;
        colors[i3 + 1] = mixed.g;
        colors[i3 + 2] = mixed.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: parameters.size,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);
}

generateGalaxy();

/* =================== CORAZÓN 3D (Partículas) =================== */
const heartGeometry = new THREE.BufferGeometry();
const hPos = [], hCol = [];

for (let i = 0; i < 3500; i++) {
    const t = Math.random() * Math.PI * 2;
    const s = Math.random() * 0.6 + 0.4;

    let x = 17 * Math.pow(Math.sin(t), 3);
    let y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    let z = (Math.random() - 0.5) * 1;

    x *= s * 0.15;
    y *= s * 0.15;
    z *= s * 0.15;

    hPos.push(x, y + 2.2, z);

    let c = new THREE.Color();
    c.setHSL(0.95 + Math.random() * 0.05, 1, 0.65);
    hCol.push(c.r, c.g, c.b);
}

heartGeometry.setAttribute("position", new THREE.Float32BufferAttribute(hPos, 3));
heartGeometry.setAttribute("color", new THREE.Float32BufferAttribute(hCol, 3));

const heartMaterial = new THREE.PointsMaterial({ size: 0.12, vertexColors: true });
const heart = new THREE.Points(heartGeometry, heartMaterial);
scene.add(heart);

/* =================== CORAZON GLB 3D AL CENTRO =================== */
let heartModel = null;
const gltfLoader = new THREE.GLTFLoader();
const matcapLoader = new THREE.TextureLoader();

gltfLoader.load(
    'https://assets.codepen.io/74321/heart.glb',
    (gltf) => {
        heartModel = gltf.scene;
        heartModel.position.set(0, 3.2, 0);
        heartModel.scale.set(1.2, 1.2, 1.2);

        const matcap = matcapLoader.load('https://assets.codepen.io/74321/3.png');
        heartModel.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshMatcapMaterial({
                    matcap,
                    color: new THREE.Color('#ff3366')
                });
            }
        });

        scene.add(heartModel);
    },
    undefined,
    () => {}
);

/* =================== FRASES POR TODO EL UNIVERSO =================== */
// Edita aquí con tus propios mensajes
const frases = [
    "¡Feliz Día Mamá!", 
    "Eres la mejor", 
    "Gracias por todo", 
    "te amo mucho",
    "Mi motor de vida",
    "Siempre juntos",
    "Tu sonrisa es mi luz"
];

function crearTexto(msg, size=1.8) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    ctx.font = "bold 50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ff1493";
    ctx.fillText(msg, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(size * 4, size, 1);
    return sprite;
}

let textoSprites = [];
for (let i = 0; i < 90; i++) {
    let t = crearTexto(frases[Math.floor(Math.random() * frases.length)], 1 + Math.random());
    let x = (Math.random() - 0.5) * 40;
    let y = (Math.random() - 0.5) * 25;
    let z = (Math.random() - 0.5) * 40;

    if (Math.abs(x) < 5 && Math.abs(y) < 5) y += 7;

    t.position.set(x, y, z);
    t.userData = {
        baseY: y,
        orbitRadius: Math.sqrt(x * x + z * z),
        orbitAngle: Math.atan2(z, x),
        orbitSpeed: ORBIT_SYNC_SPEED,
        floatAmp: Math.random() * 0.6 + 0.2,
        floatSpeed: Math.random() * 0.8 + 0.6,
        phase: Math.random() * Math.PI * 2,
        baseSize: 1 + Math.random()
    };
    t.scale.set(t.userData.baseSize * 4, t.userData.baseSize, 1);
    scene.add(t);
    textoSprites.push(t);
}

/* =================== FOTOS PEQUEÑAS =================== */
const photoTextureLoader = new THREE.TextureLoader();

const urls = [
 "assets/img/200_4993_0001.JPG", 
 "assets/img/200_5775.JPG", 
 "assets/img/200_4993_0001.JPG", // Nota: Revisa si el ":" en el nombre es correcto o si era "_"
 "assets/img/200_5777.JPG",
 "WhatsApp Image 2024-11-16 at 5.09.44 PM (2).jpeg",
 "Snapchat-1360669352.jpg",
 "IMG_20231204_220645.jpg",
 "20260228_202652.jpg" // Nueva foto añadida
];

let fotoSprites = [];

// Generamos 150 imágenes para inundar el espacio
for (let i = 0; i < 150; i++) {  
    const texture = photoTextureLoader.load(urls[i % urls.length]);
    const material = new THREE.SpriteMaterial({ 
        map: texture, 
        transparent: true,
        opacity: 0.9 // Un toque de transparencia para que se mezclen mejor
    });
    const sprite = new THREE.Sprite(material);

    // Tamaños variados: unas pequeñas y otras más grandes para dar profundidad
    const scale = 1.0 + Math.random() * 1.8;  
    sprite.scale.set(scale, scale, 1);

    // Dispersión amplia para cubrir toda la pantalla
    let x = (Math.random() - 0.5) * 90;
    let y = (Math.random() - 0.5) * 60;
    let z = (Math.random() - 0.5) * 90;

    // Zona de seguridad: alejamos las fotos del centro para que el corazón brille
    if (Math.abs(x) < 8 && Math.abs(y) < 8) {
        x += (x > 0 ? 10 : -10);
        y += (y > 0 ? 10 : -10);
    }

    sprite.position.set(x, y, z);
    
    // Configuración de movimiento individual
    sprite.userData = {
        baseY: y,
        orbitRadius: Math.sqrt(x * x + z * z),
        orbitAngle: Math.atan2(z, x),
        orbitSpeed: 0.0005 + Math.random() * 0.002, // Giro lento y elegante
        floatAmp: Math.random() * 0.7,
        floatSpeed: Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        baseScale: scale
    };

    scene.add(sprite);
    fotoSprites.push(sprite);
}

/* =================== CÁMARA Y RENDER =================== */
const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 600);
camera.position.set(10, 12, 20);
scene.add(camera);

const canvasEl = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const modalCarta = document.getElementById('modal-carta');
const mensajeRomantico = document.getElementById('mensaje-romantico');
const cerrarCarta = document.getElementById('cerrar-carta');

const frasesRomanticas = [
    'Desde que llegaste a mi vida, siento que el universo encontró una forma perfecta de ordenarse dentro de mí. Eres como una galaxia entera, llena de misterios hermosos que quiero descubrir poco a poco, como estrellas que brillan incluso en mis noches más oscuras. A veces pienso que, entre millones de mundos, tuve la suerte de encontrarte justo a ti, como si el destino hubiera trazado nuestra historia desde el inicio del tiempo. Y es que amarte se siente así, infinito, profundo y brillante, como el cielo cuando lo miro y pienso en todo lo que significas para mí. ✨'
];

function mostrarMensajeRomantico() {
    const mensaje = frasesRomanticas[Math.floor(Math.random() * frasesRomanticas.length)];
    mensajeRomantico.textContent = mensaje;
    modalCarta.classList.add('visible');
}

cerrarCarta.addEventListener('click', () => {
    modalCarta.classList.remove('visible');
});

modalCarta.addEventListener('click', (event) => {
    if (event.target === modalCarta) {
        modalCarta.classList.remove('visible');
    }
});

canvasEl.addEventListener('pointerdown', (event) => {
    if (!heartModel) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const impactos = raycaster.intersectObject(heartModel, true);

    if (impactos.length > 0) {
        mostrarMensajeRomantico();
    }
});

/* =================== ANIMACIÓN =================== */
function tick() {
    const elapsed = clock.getElapsedTime();

    galaxy.rotation.y += 0.001;
    heart.rotation.y += ORBIT_SYNC_SPEED;
    heart.rotation.z = Math.sin(elapsed * 1.7) * 0.08;

    if (heartModel) {
        heartModel.rotation.y += 0.01;
        heartModel.rotation.x = Math.sin(elapsed * 1.8) * 0.1;
        heartModel.position.y = 3.2 + Math.sin(elapsed * 2.2) * 0.25;
    }

    textoSprites.forEach(t => {
        const d = t.userData;
        d.orbitAngle += d.orbitSpeed;
        t.position.x = Math.cos(d.orbitAngle) * d.orbitRadius;
        t.position.z = Math.sin(d.orbitAngle) * d.orbitRadius;
        t.position.y = d.baseY + Math.sin(elapsed * d.floatSpeed + d.phase) * d.floatAmp;

        const pulse = 1 + Math.sin(elapsed * 2.4 + d.phase) * 0.1;
        t.scale.set(d.baseSize * 4 * pulse, d.baseSize * pulse, 1);
        t.material.opacity = 0.72 + Math.sin(elapsed * 1.9 + d.phase) * 0.2;
        t.lookAt(camera.position);
    });

    fotoSprites.forEach(s => {
        const d = s.userData;
        d.orbitAngle += d.orbitSpeed;
        s.position.x = Math.cos(d.orbitAngle) * d.orbitRadius;
        s.position.z = Math.sin(d.orbitAngle) * d.orbitRadius;
        s.position.y = d.baseY + Math.sin(elapsed * d.floatSpeed + d.phase) * d.floatAmp;

        const pulse = 1 + Math.sin(elapsed * 1.7 + d.phase) * 0.08;
        s.scale.set(d.baseScale * pulse, d.baseScale * pulse, 1);
        s.material.rotation += 0.0015;
        s.material.opacity = 0.7 + Math.sin(elapsed * 1.5 + d.phase) * 0.25;
        s.lookAt(camera.position);
    });

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}
tick();

/* =================== RESPONSIVE =================== */
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});
   
   const musica = document.getElementById("musica-fondo");
    const inicio = document.getElementById("inicio");

    inicio.addEventListener("click", () => {
      inicio.style.display = "none";
      musica.play();
    });