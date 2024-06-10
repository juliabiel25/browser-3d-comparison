let perfData = [];
let frameCount = 0;
let fps = 0.0,
  frameTime = 0.0;
let lastTime = performance.now();

export function initializePerformanceMonitor(
  renderer,
  displayMonitorData = true,
  reportInterval = 5
) {
  if (displayMonitorData) {
    // Create elements for displaying performance data
    const performanceStatsDiv = document.createElement("div");
    performanceStatsDiv.classList.add("performance-stats");
    document.body.appendChild(performanceStatsDiv);
  }

  // setup event listeners for the buttons
  document
    .getElementById("downloadReport")
    .addEventListener("click", generateReport);

  function updatePerformanceStats() {
    const currentTime = performance.now();
    const delta = currentTime - lastTime;
    frameCount++;

    if (delta >= 1000) {
      fps = (frameCount / delta) * 1000;
      frameTime = delta / frameCount;
      const { calls, triangles, points, lines, frame } = renderer.info.render;
      const { geometries, textures } = renderer.info.memory;
      const memoryUsed = (
        performance.memory.usedJSHeapSize /
        (1024 * 1024)
      ).toFixed(2); //in MB
      const memoryAllocated = (
        performance.memory.totalJSHeapSize /
        (1024 * 1024)
      ).toFixed(2); //in MB

      perfData = [
        ...perfData,
        {
          time: currentTime,
          fps: fps.toFixed(2),
          frameTime: frameTime.toFixed(2),
          drawCalls: calls,
          triangles,
          points,
          lines,
          frame,
          geometries,
          textures,
          memoryUsed,
          memoryAllocated
        }
      ];

      if (displayMonitorData) {
        // Update display with current performance data
        const performanceStatsDiv =
          document.querySelector(".performance-stats");
        performanceStatsDiv.innerHTML = `
          <p>FPS: ${fps.toFixed(2)}</p>
          <p>Frame Time: ${frameTime.toFixed(2)} ms</p>
          <p>Draw Calls: ${calls}</p>
          <p>Triangles: ${triangles}</p>
          <p>Points: ${points}</p>
          <p>Lines: ${lines}</p>
          <p>Frame: ${frame}</p>
          <p>Geometries: ${geometries}</p>
          <p>Textures: ${textures}</p>
          <p>Memory Used: ${memoryUsed} MB</p>
          <p>Memory Allocated: ${memoryAllocated} MB</p>
        `;
      }

      // Reset frame count and last time
      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(updatePerformanceStats);
  }

  function generateReport() {
    // Convert array of objects to a CSV string
    const csvData = [
      "timeDelta[ms];fps;frameTime;drawCalls;triangles;points;lines;frame;geometries;textures;memoryUsed[MB];memoryAllocated[MB]",
      ...perfData.map(item => Object.values(item).join(";"))
    ].join("\n");

    // Create a Blob with the CSV data
    const blob = new Blob([csvData], { type: "text/csv" });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.download = "performance_data.csv"; // Name of the downloadable file

    // Append the link to the document body and trigger a click event
    document.body.appendChild(link);
    link.click();

    // Clean up by revoking the URL
    URL.revokeObjectURL(url);

    alert("Report generated successfully!");
  }

  // Schedule report generation
  setInterval(generateReport, reportInterval * 60 * 1000);

  updatePerformanceStats(renderer);
}
