/**
 * Example frontend code for uploading files using presigned URLs
 * 
 * This demonstrates the correct way to use the presigned URL API
 * to upload files directly to MinIO from the browser.
 */

// Function to get a presigned URL from the backend
async function getPresignedUrl(filename, contentType, folder = 'videos') {
  try {
    const response = await fetch('/uploads/presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename,
        folder,
        contentType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get presigned URL: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    throw error;
  }
}

// Function to upload a file using the presigned URL
async function uploadWithPresignedUrl(file) {
  try {
    // Step 1: Get the presigned URL for the file
    const presignedData = await getPresignedUrl(
      file.name,
      file.type, // Make sure to send the correct content type
      'videos'
    );

    console.log('Received presigned URL data:', presignedData);

    // Step 2: Upload the file using the presigned URL
    const uploadResponse = await fetch(presignedData.url, {
      method: 'PUT',  // Important: Must use PUT method for S3 presigned URLs
      body: file,
      headers: {
        'Content-Type': file.type,  // Important: Set the correct content type
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    console.log('File uploaded successfully!');
    
    // Step 3: Return the public URL where the file can be accessed
    return presignedData.fileUrl;
  } catch (error) {
    console.error('Error during upload process:', error);
    throw error;
  }
}

// Example usage in a form submit handler
document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a file to upload');
    return;
  }
  
  try {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';
    
    const fileUrl = await uploadWithPresignedUrl(file);
    
    loadingIndicator.style.display = 'none';
    
    // Display the uploaded file URL or take further actions
    document.getElementById('uploadResult').innerHTML = `
      <p>File uploaded successfully!</p>
      <p>URL: <a href="${fileUrl}" target="_blank">${fileUrl}</a></p>
    `;
  } catch (error) {
    document.getElementById('loadingIndicator').style.display = 'none';
    document.getElementById('uploadResult').innerHTML = `
      <p class="error">Upload failed: ${error.message}</p>
    `;
  }
}); 