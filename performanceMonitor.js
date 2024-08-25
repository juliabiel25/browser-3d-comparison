import { FILE } from "./constants.js";

let perfDataArchive = [];
let frameCount = 0;
let fps = 0.0,
  frameTime = 0.0;
let lastTime = performance.now();
let displayMonitorData = false;

export function initializePerformanceMonitor(
  displayStats = true,
  reportInterval = 5 // in minutes
) {
  console.log("Initializing performance monitor");
  displayMonitorData = displayStats;

  // setup event listeners for the download button
  document
    .getElementById("downloadReport")
    .addEventListener("click", generateReport);

  // Schedule automatic report generation
  setInterval(generateReport, reportInterval * 60 * 1000);
}

// get measurements not directly provided by the rendering engine
export function updatePerformanceStats(rendererPerfData) {
  const currentTime = performance.now();
  const delta = currentTime - lastTime;
  frameCount++;

  // record number of frames every second
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

    const perfData = {
      timestamp: currentTime,
      fpsManual: fps.toFixed(2),
      frameTime: frameTime.toFixed(2),
      memoryUsed,
      memoryAllocated,
      ...rendererPerfData
    };

    // Update display with current performance data
    if (displayMonitorData) {
      const performanceStatsDiv = document.querySelector("#performanceStats");
      const statsHtml =
        Object.keys(perfData)
          .map(key => `<p>${key}: ${perfData[key]}</p>`)
          .join("");
      performanceStatsDiv.innerHTML = statsHtml;
    }

    perfDataArchive.push(perfData);

    // Reset frame count and last time
    frameCount = 0;
    lastTime = currentTime;
  }
}

export function generateReport() {
  const perfDataKeys = Object.keys(perfDataArchive[0]);
  const csvData = [
    perfDataKeys.join(';'),
    ...perfDataArchive.map(record => perfDataKeys.map(key => record[key]).join(';'))
  ].join("\n");

  // Create a Blob with the CSV data
  const blob = new Blob([csvData], { type: "text/csv" });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");
  link.href = url;
  link.download = FILE + "_code.csv"; // Name of the downloadable file

  // Append the link to the document body and trigger a click event
  document.body.appendChild(link);
  link.click();

  // Clean up by revoking the URL
  URL.revokeObjectURL(url);

  alert("Report generated successfully!");
}
