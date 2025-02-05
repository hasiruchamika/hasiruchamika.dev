// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

// Check for saved theme in localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
  darkModeToggle.checked = true;
}

// Toggle dark mode
darkModeToggle.addEventListener('change', () => {
  body.classList.toggle('dark-mode');
  localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Function to display generated images
function displayGeneratedImages(imageUrls) {
  const imageGrid = document.getElementById('image-grid');
  imageGrid.innerHTML = ''; // Clear previous images

  imageUrls.forEach((url) => {
    const imgElement = document.createElement('img');
    imgElement.src = url;
    imgElement.alt = 'Generated AI Art';
    imageGrid.appendChild(imgElement);
  });
}

// Function to update images from localStorage
document.addEventListener("DOMContentLoaded", function () {
  function updateImages() {
    for (let i = 1; i <= 4; i++) {
      let currentImage = document.getElementById(`generated-image-${i}`);
      let previousImage = localStorage.getItem(`previous-image-${i}`);

      if (!currentImage.src || currentImage.src === window.location.href) {
        currentImage.src = previousImage || "placeholder.jpg";
      } else {
        localStorage.setItem(`previous-image-${i}`, currentImage.src);
      }
    }
  }
  updateImages();
});

// Function to generate images
document.getElementById("generate-button").addEventListener("click", async () => {
  const prompt = document.getElementById("text-prompt").value;
  const style = document.getElementById("style").value;

  if (!prompt) {
    alert("Please enter a text prompt.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, style }),
    });

    const data = await response.json();
    if (data.imageUrl) {
      const imageGrid = document.getElementById("image-grid");
      imageGrid.innerHTML = `
        <div class="image-row">
          <img src="${data.imageUrl}" alt="Generated Image 1" class="generated-image">
        </div>
      `;
    } else {
      alert("Failed to generate image.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    alert("An error occurred while generating the image.");
  }
});


document.getElementById("generate-button").addEventListener("click", async () => {
  const prompt = document.getElementById("text-prompt").value;
  const style = document.getElementById("style").value;

  if (!prompt) {
    alert("Please enter a text prompt.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, style }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Server error: ${data.error || "Unknown error"}`);
    }

    if (data.imageUrl) {
      document.getElementById("image-grid").innerHTML = `
        <div class="image-row">
          <img src="${data.imageUrl}" alt="Generated Image" class="generated-image">
        </div>
      `;
    } else {
      alert("Failed to generate image.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    alert(`An error occurred: ${error.message}`);
  }
});

