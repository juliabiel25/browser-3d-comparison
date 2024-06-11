import {
  initializePerformanceMonitor,
  updatePerformanceStats
} from "../performanceMonitor.js";
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var createScene = function () {
  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.ArcRotateCamera(
    "camera1",
    0,
    0,
    10,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.setPosition(new BABYLON.Vector3(0, 0, -3));
  camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.7;

  BABYLON.SceneLoader.ImportMesh(
    "",
    "../models/_GLTF/",
    "shapespark-example-room.gltf",
    scene,
    function (newMeshes) {
      camera.target = newMeshes[0];
    }
  );

  return scene;
};

var scene = createScene();

// Instrumentation to get draw calls and triangles count
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
  "gpuFrameTimeCounter",
  "averageGpuFrameTime"
]);

scene.registerBeforeRender(function () {
  const fps = engine.getFps().toFixed(2);
  // const drawCalls = sceneInstrumentation.drawCallsCounter.current;
  // const triangles = sceneInstrumentation.activeIndicesCounter.current;
  // const points = sceneInstrumentation.activeIndicesCounter.current;
  // const lines = sceneInstrumentation.activeEdgesCounter.current;
  const gpuFrameTimeCounter = instrumentation.gpuFrameTimeCounter.current;
  const averageGpuFrameTime = instrumentation.gpuFrameTimeCounter.average;
  updatePerformanceStats({
    fps,
    // drawCalls,
    // triangles,
    // points,
    // lines,
    gpuFrameTimeCounter,
    averageGpuFrameTime
  });
});

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
