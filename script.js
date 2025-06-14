        // Elements
        const videoUrlInput = document.getElementById('videoUrl');
        const resultDiv = document.getElementById('result');
        const loadingDiv = document.getElementById('loading');
        const downloadBtn = document.getElementById('downloadBtn');
        const errorContainer = document.getElementById('errorContainer');
        const errorTitle = document.getElementById('errorTitle');
        const errorMessage = document.getElementById('errorMessage');
        const resultVideo = document.getElementById('resultVideo');
        const hdDownload = document.getElementById('hdDownload');
        
        // Reset UI state
        function resetUI() {
          resultDiv.style.display = 'none';
          errorContainer.style.display = 'none';
          loadingDiv.style.display = 'none';
          downloadBtn.disabled = false;
        }
        
        // Show loading state
        function showLoading() {
          resetUI();
          loadingDiv.style.display = 'block';
          downloadBtn.disabled = true;
        }
        
        // Show error message
        function showError(title, message) {
          resetUI();
          errorTitle.textContent = title;
          errorMessage.textContent = message;
          errorContainer.style.display = 'block';
        }
        
        // Show success result
        function showVideo(url) {
          resetUI();
          
          // Set video source
          resultVideo.src = url;
          
          // Set download link
          hdDownload.href = url;
          
          // Show the result container
          resultDiv.style.display = 'block';
          
          // Scroll to results
          resultDiv.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Copy link to clipboard
        function copyLink() {
          if (resultVideo.src) {
            navigator.clipboard.writeText(resultVideo.src)
              .then(() => {
                alert('Link copied to clipboard!');
              })
              .catch(err => {
                showError('Clipboard Error', 'Failed to copy link to clipboard');
              });
          } else {
            showError('Copy Error', 'No video link available to copy');
          }
        }
        
        // Main download function
        async function downloadVideo() {
          const videoUrl = videoUrlInput.value.trim();
          
          // Show loading state
          showLoading();
          
          if (!videoUrl) {
            showError('Input Error', 'Please enter an Instagram URL');
            return;
          }
          
          // Validate Instagram URL
          if (!videoUrl.includes('instagram.com/')) {
            showError('URL Error', 'Please enter a valid Instagram URL');
            return;
          }
          
          try {
            const response = await axios.get(
              `https://api.allorigins.win/get?url=${
                        encodeURIComponent(
                            `https://api.im-rerezz.xyz/api/dl/instagram?url=${
                                encodeURIComponent(videoUrl)
                            }`
                        )
                    }`
            );
            
            const data = JSON.parse(response.data.contents);
            
            if (data.status && Array.isArray(data.data)) {
              const videoItem = data.data.find(item => item.title === "Download Video");
              
              if (videoItem) {
                showVideo(videoItem.url);
              } else {
                showError('Video Not Found', 'No downloadable video found in this post');
              }
            } else {
              showError('API Error', data.message || 'Invalid response from server');
            }
          } catch (error) {
            showError('Network Error', error.message || 'An error occurred while processing your request');
          }
        }
        
        // Initialize with sample URL
        window.onload = function() {
          // Set a sample Instagram URL for demo
          videoUrlInput.value = "";
        }
