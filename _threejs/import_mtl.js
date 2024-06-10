import * as THREE from "three";

import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import Stats from "stats.js";
import WebGL from "three/addons/capabilities/WebGL.js";

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


new MTLLoader()
		.setPath( 'low_poly_tree/' )
		.load( 'Lowpoly_tree_sample.mtl', function ( materials ) {

			materials.preload();

			new OBJLoader()
				.setMaterials( materials )
				.setPath( 'low_poly_tree/' )
				.load( 'Lowpoly_tree_sample.obj', 
          // onSuccess
          function ( object ) {
            console.log(object)
            scene.add( object );
            console.log('SUCCESS')
          }, 
          // onProgress
          function () {
            console.log('...')
          },
          //onError
          function (error) {
            console.log('ERROR')
          } 
        );
		} );

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
