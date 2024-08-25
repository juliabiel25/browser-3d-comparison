import {
  initializePerformanceMonitor,
  updatePerformanceStats
} from "../performanceMonitor.js";
import { FOLDER_PATH, FILENAME, CAMERA_RADIUS, ORIGIN_HEIGHT, CAMERA_HEIGHT, IMPORT_MATERIALS, IMPORT_LIGHTS, DISPLAY_STATS, INCREMENT_MESHES } from "../constants.js";
let defaultMaterial = null; // Default material for meshes
let geometryMesh = null; // Mesh to store teapot geometry
let sceneRenderTime = 0.0; // Scene render time

// map out relevant dom elements
const canvas = document.getElementById("renderCanvas");

// setup BABYLON engine -- second argument is antialiasing
const engine = new BABYLON.Engine(canvas, false);

// scene setup
const createScene = function () {
  const scene = new BABYLON.Scene(engine);

  scene.environmentTexture = null;  
  scene.imageProcessingConfiguration.isEnabled = false; // Disable image processing for more direct control
  // scene.imageProcessingConfiguration.isGamma = true;
  // scene.imageProcessingConfiguration.gammaCorrection = 2.2; 
  // scene.imageProcessingConfiguration.toneMappingEnabled = false; // Disable tone mapping for more direct control
  // scene.imageProcessingConfiguration.exposure = 1.0; // Match the exposure
  // scene.autoClear = false; // Disable auto-clearing of the framebuffer if it's enabled

  if(!IMPORT_MATERIALS) {
    // Create a default material
    defaultMaterial = new BABYLON.StandardMaterial("defaultMaterial", scene);
    defaultMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // Reduce specular highlights
    defaultMaterial.specularPower = 100; // Adjust as needed
    defaultMaterial.metallic = 0;
    defaultMaterial.roughness = 1;
    defaultMaterial.environmentIntensity = 0; // Adjust as needed
    defaultMaterial.usePhysicalLightFalloff = false; // Disable physical light falloff
    defaultMaterial.useRoughnessFromMetallicTextureAlpha = false; // Avoid using advanced texture maps
  }

  // setup scene camera
  const camera = new BABYLON.ArcRotateCamera(
    "camera1",
    0,
    Math.PI / 4,  
    CAMERA_RADIUS,
    new BABYLON.Vector3(0, 0, 0), // Ensure the camera is targeting the origin
    scene
  );

  // Set camera properties to match Three.js settings
  camera.fov = 75 * (Math.PI / 180); // Convert FOV from degrees to radians
  camera.position = new BABYLON.Vector3(0, CAMERA_HEIGHT, CAMERA_RADIUS);
  camera.setTarget(new BABYLON.Vector3(0, ORIGIN_HEIGHT, 0)); // Ensure the camera is targeting the origin
  // camera.setTarget(new BABYLON.Vector3(0, 0, 0)); // Ensure the camera is targeting the origin
  camera.minZ = 0.1; // Avoid setting to zero to prevent potential division by zero

  // Enable the import of lights from the GLTF file
  BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
    if (loader.name === "gltf") {
      loader.importLights = IMPORT_LIGHTS;   
    }
  });

  // create default lighting
  if (!IMPORT_LIGHTS) {  
    // Create a directional light to simulate sunlight
    const directionalLight = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(0, -1, 0), scene);
    directionalLight.position = new BABYLON.Vector3(0,1,0);
    directionalLight.intensity = 1;
  }

  // Load the gltf file
  BABYLON.SceneLoader.Append(
    FOLDER_PATH,
    FILENAME,
    scene,
    // on successful load:
    function (scene) {      
      scene.meshes.forEach(function(mesh) {
        geometryMesh = mesh;
      });

      if (defaultMaterial) {  
        // Assign default material to meshes
        scene.meshes.forEach(function(mesh) {
          mesh.material = defaultMaterial;

        });
      }
    }
  );

  return scene;
};

// call the createScene function
const scene = createScene();

// Add a new instance of the geometry every 6 seconds
function addGeometryInstance() {
  if (geometryMesh) {
    // Clone the geometry mesh
    const newMesh = geometryMesh.clone(geometryMesh.name + "_clone");

    newMesh.position = new BABYLON.Vector3(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );

    // Add the new mesh to the scene
    scene.addMesh(newMesh);
  }
}
if (INCREMENT_MESHES) {
  setInterval(addGeometryInstance, 1000);
}

// Setup instrumentation to get stats provided by babylon
const instrumentation = new BABYLON.EngineInstrumentation(engine);
instrumentation.captureGPUFrameTime = true;
instrumentation.captureShaderCompilationTime = true;

const sceneInstrumentation = new BABYLON.SceneInstrumentation(scene);
sceneInstrumentation.captureActiveMeshesEvaluationTime = true;
sceneInstrumentation.captureRenderTargetsRenderTime = true;
sceneInstrumentation.captureFrameTime = true;
sceneInstrumentation.captureDrawCalls = true;
sceneInstrumentation.captureInterFrameTime = true;
sceneInstrumentation.captureParticlesRenderTime = true;
sceneInstrumentation.captureSpritesRenderTime = true;
sceneInstrumentation.capturePhysicsTime = true;
sceneInstrumentation.captureAnimationsTime = true;
sceneInstrumentation.captureCameraRenderTime = true;
sceneInstrumentation.captureShaderCompilationTime = true;

initializePerformanceMonitor(DISPLAY_STATS, 5);

engine.runRenderLoop(function () {

  const beforeSceneRender = performance.now();
  scene.render();
  sceneRenderTime = performance.now()-beforeSceneRender;

   // Update the camera's alpha property to rotate around the target
  scene.activeCamera.alpha += 0.01; // Adjust the speed of rotation as needed

  // record performance data
  const fps = engine.getFps().toFixed(2);
  const drawCalls = sceneInstrumentation.drawCallsCounter.current;
  const frameTime = sceneInstrumentation.frameTimeCounter.current;
  const gpuFrameTimeCounter = instrumentation.gpuFrameTimeCounter.current;
  const averageGpuFrameTime = instrumentation.gpuFrameTimeCounter.average;
  updatePerformanceStats({
    fps,
    drawCalls,
    frameTime,
    sceneRenderTime,
    gpuFrameTimeCounter,
    averageGpuFrameTime
  });

});

window.addEventListener("resize", function () {
  engine.resize();
});



