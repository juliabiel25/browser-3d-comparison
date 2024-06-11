let perfData = [];
let frameCount = 0;
let fps = 0.0,
  frameTime = 0.0;
let lastTime = performance.now();
let displayMonitorData = false;
let rendererPerfDataKeys = [];

export function initializePerformanceMonitor(
  displayStats = true,
  dataKeys = [],
  reportInterval = 5
) {
  console.log("Initializing performance monitor");
  displayMonitorData = displayStats;
  rendererPerfDataKeys = dataKeys;

  // setup event listeners for the download button
  document
    .getElementById("downloadReport")
    .addEventListener("click", generateReport);

  // Schedule automatic report generation
  setInterval(generateReport, reportInterval * 60 * 1000);
}

export function updatePerformanceStats(rendererPerfData) {
  const currentTime = performance.now();
  const delta = currentTime - lastTime;
  frameCount++;

  if (delta >= 1000) {
    fps = (frameCount / delta) * 1000;
    frameTime = delta / frameCount;
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
        fpslocal: fps.toFixed(2),
        frameTime: frameTime.toFixed(2),
        memoryUsed,
        memoryAllocated,
        ...rendererPerfData
      }
    ];

    // Update display with current performance data
    if (displayMonitorData) {
      const performanceStatsDiv = document.querySelector("#performanceStats");
      const statsHtml =
        `
        <p>FPS: ${fps.toFixed(2)}</p>
        <p>Frame Time: ${frameTime.toFixed(2)} ms</p>
        <p>Memory Used: ${memoryUsed} MB</p>
        <p>Memory Allocated: ${memoryAllocated} MB</p>
        <hr>
      ` +
        rendererPerfDataKeys
          .map(key => `<p>${key}: ${rendererPerfData[key]}</p>`)
          .join("");
      performanceStatsDiv.innerHTML = statsHtml;
    }

    // Reset frame count and last time
    frameCount = 0;
    lastTime = currentTime;
  }
}

export function generateReport() {
  const csvData = [
    "fps;frame time;memory used; memory allocated;" +
      rendererPerfDataKeys.join(";"),
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
