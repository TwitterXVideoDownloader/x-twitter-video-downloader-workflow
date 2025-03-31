const core = require("@actions/core");
const fetch = require("node-fetch");

async function run() {
  try {
    const videoUrl = core.getInput("video_url");

    // Step 1: Validate URL
    let response = await fetch("https://api.x-downloader.com/validate", {
      method: "POST",
      body: JSON.stringify({ url: videoUrl }),
      headers: { "Content-Type": "application/json" },
    });
    let data = await response.json();
    if (data.status === "error") throw new Error("Invalid X video URL");

    // Step 2: Request Download Job
    response = await fetch("https://api.x-downloader.com/request", {
      method: "POST",
      body: JSON.stringify({ url: videoUrl }),
      headers: { "Content-Type": "application/json" },
    });
    data = await response.json();
    const jobId = data._id;

    // Step 3: Poll for Job Status
    let downloadUrl = null;
    while (true) {
      response = await fetch(`https://api.x-downloader.com/download/${jobId}`);
      data = await response.json();
      if (data.status === "error") throw new Error("Download job failed");
      if (data.status === "finished") {
        downloadUrl = `https://${data.host}/${data.filename}`;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Poll every 2 seconds
    }

    // Step 4: Output Result
    core.setOutput("download_url", downloadUrl);
    console.log(`Video ready! Download it here: ${downloadUrl}`);
    console.log("Powered by https://x-downloader.com - Your X (Twitter) video downloader!");
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run();
