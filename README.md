#  Galaxy Love Project - Three.js Experience

Este proyecto es una experiencia visual interactiva en 3D desarrollada con **Three.js**. Crea un universo dinámico lleno de estrellas, una galaxia espiral, frases flotantes y una nube de recuerdos fotográficos que orbitan alrededor de un corazón central.

##  Características Principales

* **Galaxia Espiral Procedural:** Generada matemáticamente con miles de partículas que siguen brazos espirales.
* **Corazón 3D Interactivo:** Un modelo central (`.glb`) que, al ser clickeado, despliega un mensaje especial.
* **Nube de Recuerdos:** Sistema de 150+ fotos personales que orbitan y flotan de manera fluida en el espacio.
* **Tipografía Espacial:** Frases románticas representadas como *Sprites* que siempre miran a la cámara (billboarding).
* **Entorno Inmersivo:** Fondo de estrellas dinámico y música de fondo que se activa tras la primera interacción.

## 📁 Estructura de Archivos

* `index.html`: Estructura base, contenedores para el canvas de WebGL, modales de mensajes y pantalla de inicio.
* `styles.css`: Estilos para la interfaz de usuario, animaciones de la carta y diseño responsivo.
* `script.js`: Lógica principal del motor gráfico Three.js (escena, cámara, renderizado y animaciones).

## 🛠️ Tecnologías Utilizadas

* **HTML5 / CSS3**
* **Three.js** (Core Engine)
* **OrbitControls.js** (Navegación de cámara)
* **GLTFLoader.js** (Carga de modelos 3D)

## ⚙️ Configuración y Personalización

### 1. Cambiar las imágenes
Para añadir tus propias fotos, colócalas en la carpeta `assets/img/` y actualiza el arreglo `urls` en el `script.js`:

```javascript
const urls = [
 "assets/img/foto1.jpg", 
 "assets/img/foto2.jpg",
 "assets/img/foto3.jpg"
];