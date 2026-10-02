import { useState } from "react";
import { check } from "@tauri-apps/plugin-updater";

function App() {
  const [message, setMessage] = useState("");
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [update, setUpdate] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const checkForUpdates = async () => {
    try {
      setMessage("Checking for updates...");
      setUpdateAvailable(false);

      const result = await check();

      if (result) {
        setUpdate(result);
        setUpdateAvailable(true);
        setMessage(`Update available: ${result.version}`);
      } else {
        setMessage("You are using the latest version.");
      }
    } catch (error) {
      console.error("Update check failed:", error);
      setMessage("Failed to check for updates.");
    }
  };

  const installUpdate = async () => {
    if (!update) return;

    try {
      setIsUpdating(true);
      setMessage("Downloading update...");

      await update.downloadAndInstall();

      setMessage("Update installed. Restarting...");
    } catch (error) {
      console.error("Update installation failed:", error);
      setMessage("Failed to install update.");
      setIsUpdating(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Tax Calculator</h1>

        <p className="mt-4">{message}</p>

        {!updateAvailable && (
          <button
            onClick={checkForUpdates}
            className="mt-6 rounded-lg bg-black px-4 py-2 text-white"
          >
            Check for Updates
          </button>
        )}

        {updateAvailable && (
          <button
            onClick={installUpdate}
            disabled={isUpdating}
            className="mt-6 rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Install Update"}
          </button>
        )}
      </div>
    </main>
  );
}

export default App;
