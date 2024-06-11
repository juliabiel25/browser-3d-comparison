import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import {
  initializePerformanceMonitor,
  updatePerformanceStats
} from "../performanceMonitor.js";
import {
  FOLDER_PATH,
  FILENAME,
  FPS_LIMIT,
  FPS_INTERVAL
} from "../constants.js";

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const radius = 3; // Orbit radius
camera.position.set(0, radius, radius);
camera.lookAt(scene.position);
// Animation variables
let angle = 0; // Initial angle

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee);
document.body.appendChild(renderer.domElement);

// initialize the renderer performance monitor
initializePerformanceMonitor(true, [
  "drawCalls",
  "triangles",
  "lines",
  "points",
  "geometries",
  "textures"
]);

// Loading glTF model
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("three/addons/libs/draco/");
gltfLoader.setDRACOLoader(dracoLoader);

const url = FOLDER_PATH + FILENAME;
gltfLoader.load(
  url,
  function (gltf) {
    scene.add(gltf.scene);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened", error);
  }
);

const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

let then = performance.now();

// Rendering the scene
function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const elapsed = now - then;

  if (elapsed > FPS_INTERVAL) {
    then = now - (elapsed % FPS_INTERVAL);

    // Update camera position
    angle += 0.01; // Speed of rotation
    camera.position.x = radius * Math.sin(angle);
    camera.position.z = radius * Math.cos(angle);
    camera.lookAt(scene.position); // Always look at the origin

    const { calls, triangles, points, lines } = renderer.info.render;
    const { geometries, textures } = renderer.info.memory;
    updatePerformanceStats({
      drawCalls: calls,
      triangles,
      lines,
      points,
      geometries,
      textures
    });

    renderer.render(scene, camera);
  }
}

if (window.WebGLRenderingContext) {
  animate();
} else {
  console.error("WebGL is not supported");
}
