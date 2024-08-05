import {
  initializePerformanceMonitor,
  updatePerformanceStats
} from "../performanceMonitor.js";
import { FOLDER_PATH, FILENAME, CAMERA_RADIUS, ORIGIN_HEIGHT, CAMERA_HEIGHT } from "../constants.js";

// map out relevant dom elements
const canvas = document.getElementById("renderCanvas");

// setup BABYLON engine
const engine = new BABYLON.Engine(canvas, true);

// scene setup
const createScene = function () {
  const scene = new BABYLON.Scene(engine);

  // Create a default material
  const defaultMaterial = new BABYLON.StandardMaterial("defaultMaterial", scene);
  defaultMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // Reduce specular highlights
  defaultMaterial.specularPower = 100; // Adjust as needed

  // setup scene camera
  const camera = new BABYLON.ArcRotateCamera(
    "camera1",
    0,
    Math.PI / 2,  
    CAMERA_RADIUS,
    new BABYLON.Vector3(0, 0, 0), // Ensure the camera is targeting the origin
    scene
  );

  // Set camera properties to match Three.js settings
  camera.fov = 75 * (Math.PI / 180); // Convert FOV from degrees to radians
  camera.position = new BABYLON.Vector3(0, CAMERA_HEIGHT, CAMERA_RADIUS);
  camera.setTarget(new BABYLON.Vector3(0, 0, 0)); // Ensure the camera is targeting the origin

  // Enable the import of lights from the GLTF file
  BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
    if (loader.name === "gltf") {
      loader.importLights = true; 
    }
  });

  // // Create a basic light, aiming 0, 1, 0 - meaning, to the sky.
  // var hemisphericLight = new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(0, 1, 0), scene);
  // hemisphericLight.intensity = 0.7; // Adjust the intensity as needed

  // Create a directional light to simulate sunlight
  const directionalLight = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(-1, -2, -1), scene);
  directionalLight.position = new BABYLON.Vector3(20, 40, 20);
  directionalLight.intensity = 0.8; // Adjust the intensity as needed

  // Load the gltf file
  BABYLON.SceneLoader.Append(
    FOLDER_PATH,
    FILENAME,
    scene,
    // on successful load:
    function (scene) {
      // scene.createDefaultCamera(true, true, true);
      // scene.activeCamera.radius = CAMERA_RADIUS;  
      
      // Assign default material to meshes
      scene.meshes.forEach(function(mesh) {
        mesh.material = defaultMaterial;
      });
    }
  );

  return scene;
};

// call the createScene function
const scene = createScene();

// Setup instrumentation to get stats provided by babylon
const instrumentation = new BABYLON.EngineInstrumentation(engine);
instrumentation.captureGPUFrameTime = true;
instrumentation.captureShaderCompilationTime = true;

const sceneInstrumentation = new BABYLON.SceneInstrumentation(scene);
sceneInstrumentation.captureActiveMeshesEvaluationTime = true;
sceneInstrumentation.captureRenderTime = true;
sceneInstrumentation.captureFrameTime = true;
sceneInstrumentation.captureDrawCalls = true;
sceneInstrumentation.captureInterFrameTime = true;
sceneInstrumentation.captureActiveIndices = true;

initializePerformanceMonitor(true, [
  "fps",
  "drawCalls",
  // "triangles",
  "gpuFrameTimeCounter",
  "averageGpuFrameTime"
]);

scene.registerBeforeRender(function () {
  const fps = engine.getFps().toFixed(2);
  const drawCalls = sceneInstrumentation.drawCallsCounter.current;
  // const triangles = sceneInstrumentation.activeIndicesCounter.current;
  // const points = sceneInstrumentation.activeIndicesCounter.current;
  // const lines = sceneInstrumentation.activeEdgesCounter.current;
  const gpuFrameTimeCounter = instrumentation.gpuFrameTimeCounter.current;
  const averageGpuFrameTime = instrumentation.gpuFrameTimeCounter.average;

  updatePerformanceStats({
    fps,
    drawCalls,
    // triangles,
    // points,
    // lines,
    gpuFrameTimeCounter,
    averageGpuFrameTime
  });
});

engine.runRenderLoop(function () {
  scene.render();

   // Update the camera's alpha property to rotate around the target
  scene.activeCamera.alpha += 0.01; // Adjust the speed of rotation as needed

});

window.addEventListener("resize", function () {
  engine.resize();
});