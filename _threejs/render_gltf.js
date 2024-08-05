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
  FPS_INTERVAL,
  CAMERA_RADIUS,
  ORIGIN_HEIGHT,
  CAMERA_HEIGHT
} from "../constants.js";

// variables
let angle = 0; // Initial animation angle
let then = performance.now(), frames = 0, fps = 0; // initial performance stats values
const PERFORMANCE_KEYS = [
  "timestamp",
  "fps",
  "frameRenderTime",
  "drawCalls",
  "triangles",
  "lines",
  "points",
  "geometries",
  "textures",
];

// setup threejs renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x33334c);
// renderer.setClearColor(0xeeeeee);
renderer.gammaOutput = true; // Enable gamma correction for the renderer
renderer.gammaFactor = 2.2; // Common gamma factor
document.body.appendChild(renderer.domElement);

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x33334c);

// Create a default material
const defaultMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
defaultMaterial.needsUpdate = true; // Ensure the material updates correctly

// setup scene camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, CAMERA_RADIUS, CAMERA_RADIUS);
camera.lookAt(0, ORIGIN_HEIGHT, 0);

// Remove ambient light if any
// const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
// scene.add(ambientLight);

// Create a directional light to simulate sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Color, intensity
directionalLight.position.set(0, 1, 0); // Position the light
directionalLight.target.position.set(0, 0, 0); // Ensure the light is directed correctly
scene.add(directionalLight);
scene.add(directionalLight.target);

// setup gltf the loader
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("three/addons/libs/draco/");
gltfLoader.setDRACOLoader(dracoLoader);
const url = FOLDER_PATH + FILENAME;

// load the gltf file
gltfLoader.load(
  url,
  // on successful load:
  function (gltf) {
    scene.add(gltf.scene);
    
    // Assign default material to meshes
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = defaultMaterial;
        child.material.needsUpdate = true; // Ensure the material updates correctly
      }
    });
  }
);

// initialize the renderer performance monitor
initializePerformanceMonitor(true, PERFORMANCE_KEYS, 5);

// Rendering the scene
function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const elapsed = now - then;

  if (elapsed > FPS_INTERVAL) {
    then = now - (elapsed % FPS_INTERVAL);

    // Update camera position
    angle += 0.01; // Speed of rotation
    camera.position.x = CAMERA_RADIUS * Math.sin(angle);
    camera.position.z = CAMERA_RADIUS * Math.cos(angle);
    camera.position.y = CAMERA_HEIGHT;
    // camera.lookAt(ORIGIN_HEIGHT); // Always look at the origin
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
