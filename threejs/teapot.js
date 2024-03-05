import * as THREE from "three";

import { GPUStatsPanel } from 'three/examples/jsm/utils/GPUStatsPanel.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from "stats.js";
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';
import WebGL from "three/addons/capabilities/WebGL.js";

// import rStats from "./rStats.js";

let scene;
let ambientLight;
let light;
let camera;
let renderer;
let teapot;
let stats;
let gpuPanel;
let controller;
let materials = {};
let triangles = 0;
let rS;

let size = 1;
let tessellation = 1;
let shading = 'kolor';

init()
render()

function init() {
  // scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // renderer = new THREE.WebGL1Renderer({ antialias: true });
  renderer = new THREE.WebGLRenderer({ antialias: true });
	console.log('Is WebGL2? : ', renderer.capabilities.isWebGL2)
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // LIGHTS
  ambientLight = new THREE.AmbientLight( 0x7c7c7c, 3.0 );
  light = new THREE.DirectionalLight( 0xFFFFFF, 3.0 );
  light.position.set( 0.32, 0.39, 0.7 );
  scene.add(ambientLight)
  scene.add(light)

  // creating geometry
  createTeapot();
  scene.add(teapot);

  camera.position.z = 5;

  // stats monitoring setup
	rS = new rStats({
    values: {
        frame: { caption: 'Total frame render time (ms)' },
        raf: { caption: 'Time since last rAF (ms)' },
        fps: { caption: 'Framerate (FPS)' },
        render: { caption: 'WebGL Render (ms)' }
    }
	});
  stats = new Stats();
	console.log('Available extensions: ', renderer.getContext().getSupportedExtensions());
	gpuPanel = new GPUStatsPanel(renderer.getContext());
	stats.addPanel(gpuPanel);
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  // GUI
  setupGui();
  
}

function render() {
  // WebGL compatibility check
  if (WebGL.isWebGLAvailable()) {
    animate();
		
  } else {
    console.error(WebGl.getWebGLErrorMessage());
  }

}

function updateSettings() {
  if (controller.tessellation !== tessellation || 
    controller.size !== size ||
    controller.shading !== shading) {
      
    // console.log('updating settings', controller)
    size = controller.size;
    tessellation = controller.tessellation;
    shading = controller.shading;
    
    createTeapot();
  }
}

function createTeapot() {
  if (teapot !== undefined) {
    teapot.geometry.dispose();
    scene.remove(teapot);
  }
  
  const geometry = new TeapotGeometry( size, tessellation); // 395 tessalation - teacup stops showing up
  
  materials['kolor'] = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // materials['cieniowanie'] = new THREE.MeshLambertMaterial( { side: THREE.DoubleSide } );
  materials['cieniowanie'] = new THREE.MeshStandardMaterial( {  } );
  materials['tekstura'] = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide } );
  
  teapot = new THREE.Mesh(geometry, materials[shading]);
  scene.add(teapot)  
}

// rendering the scene
function animate() {
  requestAnimationFrame(animate);

  teapot.rotation.x += 0.05;
  teapot.rotation.y += 0.05;

	if (renderer.info.render.triangles !== triangles) {
		console.log('Scene info : ', renderer.info.render)
		triangles = renderer.info.render.triangles;
	}

	// gpuPanel.startQuery();
	rS( 'rAF' ).tick();
	rS( 'FPS' ).frame();
	rS( 'render' ).start();
  renderer.render(scene, camera);
	rS( 'render' ).end();
	stats.update();
	// gpuPanel.endQuery();
	
	rS().update();
}

function setupGui() {
  controller = {
    size: 1,
    tessellation: 1,
    shading: 'kolor'
  };

  const gui = new GUI();
  gui.add( controller, 'size').name('Rozmiar').onChange(updateSettings)
  gui.add( controller, 'tessellation').name('Poziom teselacji').onChange(updateSettings)
  gui.add( controller, 'shading', ['kolor', 'cieniowanie', 'tekstura']).name('Cieniowanie').onChange(updateSettings)
}
