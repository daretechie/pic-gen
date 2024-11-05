// Get elements from the HTML page
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const errorElement = document.getElementById('error');
const imageGrid = document.getElementById('imageGrid');
const emptyState = document.getElementById('emptyState');

// Function to get images based on user's input
async function generateImages() {
    const prompt = promptInput.value.trim(); // Get input text

    // Check if input is empty
    if (!prompt) {
        showError('Please enter a prompt'); // Show error if empty
        return;
    }

    // Show loading state
    generateBtn.disabled = true; // Disable button
    generateBtn.classList.add('loading'); // Add loading style
    errorElement.textContent = ''; // Clear any error message

    try {
        // Send request to server to generate images
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }), // Send the prompt text
        });

        const data = await response.json(); // Get response data

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate images'); // Show error if it fails
        }

        displayImages(data.images); // Show images if successful
        emptyState.style.display = 'none'; // Hide empty state message

    } catch (error) {
        showError(error.message); // Show error message if something goes wrong
        imageGrid.innerHTML = ''; // Clear image grid
        emptyState.style.display = 'block'; // Show empty state message
    } finally {
        generateBtn.disabled = false; // Enable button again
        generateBtn.classList.remove('loading'); // Remove loading style
    }
}

// Function to display images on the page
function displayImages(images) {
    imageGrid.innerHTML = images.map(image => `
        <div class="image-card">
            <img src="${image.url}" alt="${promptInput.value}">
            <div class="image-overlay">
                <a href="${image.download_url}" 
                   class="download-btn" 
                   target="_blank">
                    ⬇️ Download
                </a>
            </div>
        </div>
    `).join(''); // Add each image to the grid
}

// Function to show an error message
function showError(message) {
    errorElement.textContent = message; // Display error message
}

// Allow pressing Enter to generate images
promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateImages(); // Run generateImages when Enter is pressed
    }
});
