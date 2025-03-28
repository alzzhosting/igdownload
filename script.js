async function downloadVideo() {
  const videoUrl = document.getElementById('videoUrl').value.trim();
  const resultDiv = document.getElementById('result');
  const loading = document.getElementById('loading');
  
  // Reset state
  resultDiv.innerHTML = '';
  loading.classList.remove('hidden');
  
  if (!videoUrl) {
    showError('Silakan masukkan URL video Instagram');
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
        showError('Tidak ada video yang ditemukan');
      }
    } else {
      showError(data.message || 'URL tidak valid');
    }
  } catch (error) {
    showError(error.message || 'Terjadi kesalahan');
  } finally {
    loading.classList.add('hidden');
  }
}

function showVideo(url) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
                <div class="card border-0 shadow-sm">
                    <video 
                        class="card-img-top rounded-top-lg cursor-pointer hover:shadow-lg transition"
                        onclick="showModal('${url}')"
                    >
                        <source src="${url}" type="video/mp4">
                    </video>
                    <div class="card-body text-center">
                        <a 
                            href="${url}" 
                            download
                            class="btn btn-danger px-5 py-2 rounded-pill shadow-sm"
                        >
                            ⬇️ Download Sekarang
                        </a>
                    </div>
                </div>
            `;
}

function showModal(url) {
  const video = document.getElementById('popupVideo');
  video.src = url;
  new bootstrap.Modal(document.getElementById('videoModal')).show();
}

function showError(message) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
}