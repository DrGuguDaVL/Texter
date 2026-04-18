import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/geometries/TextGeometry.js';

// UI
const textInput = document.getElementById("textInput");
const colorPicker = document.getElementById("colorPicker");
const sizeSlider = document.getElementById("sizeSlider");
const depthSlider = document.getElementById("depthSlider");
const fontSelect = document.getElementById("fontSelect");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth - 320, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

let textMesh;
const loader = new FontLoader();

// Load Google font (UI)
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

  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {

    const geometry = new TextGeometry(textInput.value, {
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

// Start
updateText();

// Animation
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
  renderer.setSize(window.innerWidth - 320, window.innerHeight);
  camera.aspect = (window.innerWidth - 320) / window.innerHeight;
  camera.updateProjectionMatrix();
});