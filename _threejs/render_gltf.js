import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import {
  initializePerformanceMonitor,
  updatePerformanceStats
} from "../performanceMonitor.js";

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
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

const url = "../../models/_GLTF/shapespark-example-room.gltf";
gltfLoader.load(
  url,
  function (gltf) {
    scene.add(gltf.scene);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened");
  }
);

camera.position.z = 5;
const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Rendering the scene
function animate() {
  camera.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(() => {
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
  });
  requestAnimationFrame(animate);
}

if (window.WebGLRenderingContext) {
  animate();
} else {
  console.error("WebGL is not supported");
}
