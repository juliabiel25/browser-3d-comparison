import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import Stats from "stats.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
M

// scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// creating geometry
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
const loader = new OBJLoader();
// loader.load(
//   "/grand_piano_test/grand_piano_import.obj",
loader.load(
  "/grand_piano_import_testing.obj",
  function (object) {
    scene.add(object);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

camera.position.z = 5;

// stats monitoring setup
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// rendering the scene
function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

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
