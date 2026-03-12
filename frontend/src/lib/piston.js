// Detect if we are running locally or on Render
const isLocal = window.location.hostname === "localhost";
const BACKEND_URL = isLocal 
  ? "http://localhost:8080/api/execute" 
  : "https://your-backend-name.onrender.com/api/execute";

/**
 * Calls your InterCode backend to execute code via the Glot.io bridge.
 */
export async function executeCode(language, code) {
  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        language: language.toLowerCase(), 
        code 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: `Server Error (${response.status}): ${errorData.error || "Execution failed"}` 
      };
    }

    const data = await response.json();

    // Data format returned by our new backend route:
    // { success: boolean, output: string, error: string }
    return {
      success: data.success,
      output: data.output || (data.success ? "No output" : ""),
      error: data.error || "",
    };

  } catch (error) {
    return {
      success: false,
      error: `Connection Failed: ${error.message}. Is the backend running?`,
    };
  }
}