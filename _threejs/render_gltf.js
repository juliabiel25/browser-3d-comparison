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
  CAMERA_RADIUS,
  ORIGIN_HEIGHT,
  CAMERA_HEIGHT,
  IMPORT_MATERIALS,
  IMPORT_LIGHTS,
  DISPLAY_STATS,
  INCREMENT_MESHES
} from "../constants.js";

// variables
let angle = 0; // Initial animation angle
let defaultMaterial = null; // Default material for meshes
let geometryMesh = null; // Mesh to store teapot geometry
let then = performance.now(), frames = 0, fps = 0; // initial performance stats values;

// setup threejs renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x33334c);
renderer.gammaOutput = true; // Enable gamma correction for the renderer
renderer.gammaFactor = 2.2; // Common gamma factor

document.body.appendChild(renderer.domElement);

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x33334c);

// Create a default material
if (!IMPORT_MATERIALS)  {
  defaultMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  defaultMaterial.needsUpdate = true; // Ensure the material updates correctly
}

// setup scene camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, CAMERA_RADIUS, CAMERA_RADIUS);
camera.lookAt(new THREE.Vector3(0, ORIGIN_HEIGHT, 0));

// Remove ambient light if any
// const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
// scene.add(ambientLight);

// Create a directional light to simulate sunlight
if (!IMPORT_LIGHTS) {
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Color, intensity
directionalLight.position.set(0, 1, 0); // Position the light
directionalLight.target.position.set(0, 0, 0); // Ensure the light is directed correctly
scene.add(directionalLight);
scene.add(directionalLight.target);
}

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
    
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        // Save the geometry mesh for later use
        geometryMesh = child;
      }
    });

    // Assign default material to meshes
    if (!IMPORT_MATERIALS)  {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = defaultMaterial;
          child.material.needsUpdate = true; // Ensure the material updates correctly
        }
      });
    }
  }
);


// Add a new instance of the teapot geometry every 6 seconds
function addGeometryInstance() {
  if (geometryMesh) {
    // Clone the geometry mesh
    const newMesh = geometryMesh.clone();

    // Set a random position for the new mesh
    newMesh.position.set(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );

    // Add the new mesh to the scene
    scene.add(newMesh);
  }
}
if (INCREMENT_MESHES) {
  setInterval(addGeometryInstance, 100);
}

// initialize the renderer performance monitor
initializePerformanceMonitor(DISPLAY_STATS, 5);

// Rendering the scene
function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  
    // Update camera position
    angle += 0.01; // Speed of rotation
    camera.position.x = CAMERA_RADIUS * Math.sin(angle);
    camera.position.z = CAMERA_RADIUS * Math.cos(angle);
    camera.position.y = CAMERA_HEIGHT;
    camera.lookAt(new THREE.Vector3(0, ORIGIN_HEIGHT, 0)); // Always look at the origin
    // camera.lookAt(scene.position); // Always look at the scene origin

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

if (window.WebGLRenderingContext) {
  animate();
} else {
  console.error("WebGL is not supported");
}
