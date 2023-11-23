 /*

			import * as THREE from 'three';

			import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

			import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
			import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';

			let camera, scene, renderer;
			let cameraControls;
			let effectController;
			const teapotSize = 300;
			let ambientLight, light;

			let tess = - 1;	// force initialization
			let bBottom;
			let bLid;
			let bBody;
			let bFitLid;
			let bNonBlinn;
			let shading;

			let teapot, textureCube;
			const materials = {};

			init();
			render();

			function init() {

				const container = document.createElement( 'div' );
				document.body.appendChild( container );

				const canvasWidth = window.innerWidth;
				const canvasHeight = window.innerHeight;

				// CAMERA
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 80000 );
				camera.position.set( - 600, 550, 1300 );

				// LIGHTS
				ambientLight = new THREE.AmbientLight( 0x7c7c7c, 3.0 );

				light = new THREE.DirectionalLight( 0xFFFFFF, 3.0 );
				light.position.set( 0.32, 0.39, 0.7 );

				// RENDERER
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( canvasWidth, canvasHeight );
				container.appendChild( renderer.domElement );

				// EVENTS
				window.addEventListener( 'resize', onWindowResize );

				// CONTROLS
				cameraControls = new OrbitControls( camera, renderer.domElement );
				cameraControls.addEventListener( 'change', render );

				// TEXTURE MAP
				const textureMap = new THREE.TextureLoader().load( 'textures/uv_grid_opengl.jpg' );
				textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
				textureMap.anisotropy = 16;
				textureMap.colorSpace = THREE.SRGBColorSpace;

				// REFLECTION MAP
				const path = 'textures/cube/pisa/';
				const urls = [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ];

				textureCube = new THREE.CubeTextureLoader().setPath( path ).load( urls );

				materials[ 'wireframe' ] = new THREE.MeshBasicMaterial( { wireframe: true } );
				materials[ 'flat' ] = new THREE.MeshPhongMaterial( { specular: 0x000000, flatShading: true, side: THREE.DoubleSide } );
				materials[ 'smooth' ] = new THREE.MeshLambertMaterial( { side: THREE.DoubleSide } );
				materials[ 'glossy' ] = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide } );
				materials[ 'textured' ] = new THREE.MeshPhongMaterial( { map: textureMap, side: THREE.DoubleSide } );
				materials[ 'reflective' ] = new THREE.MeshPhongMaterial( { envMap: textureCube, side: THREE.DoubleSide } );

				// scene itself
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xAAAAAA );

				scene.add( ambientLight );
				scene.add( light );

				// GUI
				setupGui();

			}

			// EVENT HANDLERS

			function onWindowResize() {

				const canvasWidth = window.innerWidth;
				const canvasHeight = window.innerHeight;

				renderer.setSize( canvasWidth, canvasHeight );

				camera.aspect = canvasWidth / canvasHeight;
				camera.updateProjectionMatrix();

				render();

			}

			function setupGui() {

				effectController = {
					newTess: 15,
					bottom: true,
					lid: true,
					body: true,
					fitLid: false,
					nonblinn: false,
					newShading: 'glossy'
				};

				const gui = new GUI();
				gui.add( effectController, 'newTess', [ 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50 ] ).name( 'Tessellation Level' ).onChange( render );
				gui.add( effectController, 'lid' ).name( 'display lid' ).onChange( render );
				gui.add( effectController, 'body' ).name( 'display body' ).onChange( render );
				gui.add( effectController, 'bottom' ).name( 'display bottom' ).onChange( render );
				gui.add( effectController, 'fitLid' ).name( 'snug lid' ).onChange( render );
				gui.add( effectController, 'nonblinn' ).name( 'original scale' ).onChange( render );
				gui.add( effectController, 'newShading', [ 'wireframe', 'flat', 'smooth', 'glossy', 'textured', 'reflective' ] ).name( 'Shading' ).onChange( render );

			}


			//

			function render() {

				if ( effectController.newTess !== tess ||
					effectController.bottom !== bBottom ||
					effectController.lid !== bLid ||
					effectController.body !== bBody ||
					effectController.fitLid !== bFitLid ||
					effectController.nonblinn !== bNonBlinn ||
					effectController.newShading !== shading ) {

					tess = effectController.newTess;
					bBottom = effectController.bottom;
					bLid = effectController.lid;
					bBody = effectController.body;
					bFitLid = effectController.fitLid;
					bNonBlinn = effectController.nonblinn;
					shading = effectController.newShading;

					createNewTeapot();

				}

				// skybox is rendered separately, so that it is always behind the teapot.
				if ( shading === 'reflective' ) {

					scene.background = textureCube;

				} else {

					scene.background = null;

				}

				renderer.render( scene, camera );

			}

			// Whenever the teapot changes, the scene is rebuilt from scratch (not much to it).
			function createNewTeapot() {

				if ( teapot !== undefined ) {

					teapot.geometry.dispose();
					scene.remove( teapot );

				}

				const geometry = new TeapotGeometry( teapotSize,
					tess,
					effectController.bottom,
					effectController.lid,
					effectController.body,
					effectController.fitLid,
					! effectController.nonblinn );

				teapot = new THREE.Mesh( geometry, materials[ shading ] );

				scene.add( teapot );

			}

		</script>

	</body>
</html>
 -->

*/

import * as THREE from "three";

import { GPUStatsPanel } from 'three/examples/jsm/utils/GPUStatsPanel.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from "stats.js";
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';
import WebGL from "three/addons/capabilities/WebGL.js";

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

  teapot.rotation.x += 0.1;
  teapot.rotation.y += 0.1;

	if (renderer.info.render.triangles !== triangles) {
		console.log('Scene info : ', renderer.info.render)
		triangles = renderer.info.render.triangles;
	}

	// gpuPanel.startQuery();
  stats.begin();
  renderer.render(scene, camera);
  stats.end();
	// gpuPanel.endQuery();
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
