// 🌟 HTML Element References
const uploadBtn = document.getElementById("upload-btn");
const uploadInput = document.getElementById("upload");
const uploadModal = document.getElementById("upload-modal");
const modalUploadInput = document.getElementById("modal-upload");
const imagePreview = document.getElementById("image-preview");
const uploadConfirm = document.getElementById("upload-confirm");
const modalClose = document.getElementById("modal-close");
const landingPage = document.getElementById("landing");
const chatUI = document.getElementById("chat-ui");
const previewImg = document.getElementById("preview");
const previewVideo = document.getElementById("preview-video"); // In case you have a video element too
const chatArea = document.getElementById("chatArea");
const sendBtn = document.getElementById("send-btn");
const textInput = document.getElementById("message-input");
const framePreviewArea = document.getElementById("frame-preview-area"); // For frame thumbnails
const html = document.documentElement;

// Only initialize chat-related elements if chat UI exists
const hasChat = !!chatUI;

// 🌟 Store uploaded media data
let currentImageData = {
  filename: null,
  filepath: null,
  caption: null,
  objects: null,
  is_video: false
};

// 🌟 Upload button click shows modal
if (uploadBtn && uploadModal) {
  uploadBtn.addEventListener("click", () => {
    uploadModal.classList.remove("hidden");
  });
}

// 🌟 Modal upload input change - preview images
if (modalUploadInput && imagePreview) {
  modalUploadInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files);
    imagePreview.innerHTML = "";
    files.forEach(file => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.className = "w-16 h-16 object-cover rounded";
          imagePreview.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    });
  });
}

// 🌟 Upload confirm button
uploadConfirm.addEventListener("click", async () => {
  const files = modalUploadInput.files;
  if (files.length !== 3) {
    alert("Please select exactly 3 images.");
    return;
  }
  // For simplicity, upload the first one, but show all in preview
  const formData = new FormData();
  Array.from(files).forEach(file => formData.append("files", file));

  uploadModal.classList.add("hidden");

  // Switch to chat
  landingPage.classList.add("hidden");
  chatUI.classList.remove("hidden");

  sendBtn.disabled = true;
  sendBtn.style.opacity = "0.5";

  const loadingMsg = document.createElement("div");
  loadingMsg.className = "bubble left";
  loadingMsg.textContent = "🔄 Processing your uploads...";
  loadingMsg.id = "processing-msg";
  chatArea.appendChild(loadingMsg);
  chatArea.scrollTop = chatArea.scrollHeight;

  // Preview all images in modal (but since modal closed, perhaps keep open or show in chat)
  // For now, assume backend handles multiple, but to show in modal, keep modal open until upload done.

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    // Assume data is array or handle multiple
    currentImageData = data; // Adjust as needed

    const processingMsg = document.getElementById("processing-msg");
    if (processingMsg) processingMsg.remove();

    addBotMessage("✅ Upload complete! Your images are ready. Ask me anything about them! 📸");

    // Show images in chat grid
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
    // Assume data.images is array of urls
    (data.images || [data.annotated_image || data.filepath]).forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.className = "w-full h-auto rounded";
      imageGrid.appendChild(img);
    });

  } catch (error) {
    console.error("Upload failed:", error);
    addBotMessage("❌ Upload failed. Please try again.");
  } finally {
    sendBtn.disabled = false;
    sendBtn.style.opacity = "1";
  }
});

// 🌟 Modal close
modalClose.addEventListener("click", () => {
  uploadModal.classList.add("hidden");
});

// 🌟 Handle file upload
uploadInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
    const formData = new FormData();
    formData.append("file", file);

    landingPage.classList.add("hidden");
    chatUI.classList.remove("hidden");

    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.5";
    sendBtn.style.cursor = "not-allowed";

    const loadingMsg = document.createElement("div");
    loadingMsg.className = "bubble left";
    loadingMsg.textContent = "🔄 Processing your upload...";
    loadingMsg.id = "processing-msg";
    chatArea.appendChild(loadingMsg);
    chatArea.scrollTop = chatArea.scrollHeight;

    // 👁️ Preview the upload immediately
    const reader = new FileReader();
    reader.onload = function (e) {
      if (file.type.startsWith("image/")) {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
        if (previewVideo) previewVideo.style.display = "none";
      } else if (file.type.startsWith("video/")) {
        if (previewVideo) {
          previewVideo.src = URL.createObjectURL(file);
          previewVideo.style.display = "block";
        }
        previewImg.style.display = "none";
      }
    };
    reader.readAsDataURL(file);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      currentImageData = {
        filename: data.filename,
        filepath: data.filepath,
        caption: data.caption,
        objects: data.objects,
        is_video: data.is_video
      };

      const processingMsg = document.getElementById("processing-msg");
      if (processingMsg) processingMsg.remove();

      addBotMessage("✅ Upload complete! Your media is ready. Ask me anything about it! 📸");

    } catch (error) {
      console.error("Upload failed:", error);

      const processingMsg = document.getElementById("processing-msg");
      if (processingMsg) processingMsg.remove();

      addBotMessage("❌ Upload failed. Please try again.");
    } finally {
      sendBtn.disabled = false;
      sendBtn.style.opacity = "1";
      sendBtn.style.cursor = "pointer";
    }
  }
});

// 🌟 Send message function
// 🌟 Send message function
async function sendMessage() {
  const userMessage = textInput.value.trim();
  if (userMessage) {
    addUserMessage(userMessage);
    textInput.value = "";

    try {
      const typingIndicator = addTypingIndicator();

      const response = await fetch("/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          filepath: currentImageData.filepath,
          is_video: currentImageData.is_video,
          caption: currentImageData.caption,
          objects: currentImageData.objects
        })
      });

      const data = await response.json();
      chatArea.removeChild(typingIndicator);

      if (data.response) {
        addBotMessage(data.response);
      }

      // Handle annotated images
      if (data.annotated_image) {
        previewImg.src = data.annotated_image + '?t=' + Date.now(); // cache bust
      }

      // Handle video results
      if (data.frame_previews && data.frame_previews.length > 0) {
        showFramesOnRight(data.frame_previews);
      }

      // Handle tracked video
      if (data.video_path) {
        previewVideo.src = data.video_path + '?t=' + Date.now();
        previewVideo.style.display = "block";
        previewImg.style.display = "none";
      }

    } catch (error) {
      console.error("Error:", error);
      addBotMessage("❌ Error during request. Please try again.");
    }
  }
}

// Improved frame display function
function showFramesOnRight(frames) {
  framePreviewArea.innerHTML = "<h4>Key Frames:</h4>";
  const container = document.createElement("div");
  container.className = "frame-container";
  
  frames.forEach(src => {
    const frameDiv = document.createElement("div");
    frameDiv.className = "frame-item";
    
    const img = document.createElement("img");
    img.src = src;
    img.className = "frame-thumb";
    
    frameDiv.appendChild(img);
    container.appendChild(frameDiv);
  });
  
  framePreviewArea.appendChild(container);
}
// 🌟 Helper functions
function addUserMessage(text) {
  const msg = document.createElement("div");
  msg.className = "bubble right";
  msg.textContent = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function addBotMessage(text) {
  const msg = document.createElement("div");
  msg.className = "bubble left";
  msg.textContent = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function addTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "bubble left";
  indicator.textContent = "Typing...";
  indicator.id = "typing-indicator";
  chatArea.appendChild(indicator);
  chatArea.scrollTop = chatArea.scrollHeight;
  return indicator;
}

function showFramesOnRight(frames) {
  framePreviewArea.innerHTML = "";
  frames.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "frame-thumb"; 
    framePreviewArea.appendChild(img);
  });
}

// 🌟 Event Listeners
if (hasChat) {
  if (sendBtn) sendBtn.addEventListener("click", sendMessage);
  if (textInput) textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
}

// 🌟 Optional: Theme toggling
html.setAttribute("data-theme", "dark");
