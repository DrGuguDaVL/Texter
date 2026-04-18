import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { FontLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.158.0/examples/jsm/geometries/TextGeometry.js';

// UI
const textInput = document.getElementById("textInput");
const colorPicker = document.getElementById("colorPicker");
const sizeSlider = document.getElementById("sizeSlider");
const depthSlider = document.getElementById("depthSlider");
const fontSelect = document.getElementById("fontSelect");
const container = document.getElementById("canvas-container");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f0f);

// Camera
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Debug cube (REMOVE LATER if you want)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);
scene.add(cube);

// Font loader
const loader = new FontLoader();

let textMesh;

// Load UI font (Google Fonts)
function loadWebFont(font) {
  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?family=${font.replace(" ", "+")}`;
  link.rel = "stylesheet";
  document.head.appendChild(link);
  document.body.style.fontFamily = font;
}

// Create 3D text
function updateText() {
  if (textMesh) scene.remove(textMesh);

  loader.load('./helvetiker.json', (font) => {

    const geometry = new TextGeometry(textInput.value || "Hello", {
      font: font,
      size: parseFloat(sizeSlider.value),
      height: parseFloat(depthSlider.value),
    });

    geometry.center();

    const material = new THREE.MeshStandardMaterial({
      color: colorPicker.value
    });

    textMesh = new THREE.Mesh(geometry, material);
    scene.add(textMesh);
  });
}

// Events
[textInput, colorPicker, sizeSlider, depthSlider].forEach(el => {
  el.addEventListener("input", updateText);
});

fontSelect.addEventListener("change", () => {
  loadWebFont(fontSelect.value);
});

// Init
updateText();

// Animate
function animate() {
  requestAnimationFrame(animate);

  if (textMesh) {
    textMesh.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});