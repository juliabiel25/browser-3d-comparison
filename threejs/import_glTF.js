import * as THREE from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "stats.js";
import WebGL from "three/addons/capabilities/WebGL.js";

// scene setup
const scene = new THREE.Scene();
console.log("SCENE:", scene);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const gltfLoader = new GLTFLoader();
const url = "../models/models/shapesparkRoom/shapespark-example-room.gltf";
gltfLoader.load(url, gltf => {
  console.log("GLTFLoader function:: ", url, gltf);
  const root = gltf.scene;
  scene.add(root);
  console.log("SCENE AFTER ADDING IMPORTED GLTF:: ", scene);
});

camera.position.z = 5;

// stats monitoring setup
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// rendering the scene
function animate() {
  requestAnimationFrame(animate);
  

  stats.begin();
  renderer.render(scene, camera);
  stats.end();
}

// WebGL compatibility check
if (WebGL.isWebGLAvailable()) {
  animate();
} else {
  console.error(WebGl.getWebGLErrorMessage());
}
