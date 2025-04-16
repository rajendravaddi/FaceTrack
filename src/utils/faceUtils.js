// src/utils/faceUtils.js

export const deleteFaceFromNgrok = async (username, name) => {
  const formData = new FormData();
  formData.append("user_id", username);
  formData.append("name", name);

  try {
    const response = await fetch("https://0239-35-204-227-158.ngrok-free.app/delete-face", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Face deleted:", result.message);
      return { success: true, message: result.message };
    } else {
      console.warn("Failed to delete:", result.message);
      return { success: false, message: result.message };
    }
  } catch (err) {
    console.error("Error deleting face:", err);
    return { success: false, message: "Network or server error" };
  }
};
