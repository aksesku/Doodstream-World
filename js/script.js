const apiKey = 'YOUR_DOODSTREAM_API_KEY'; // **GANTI DENGAN API KEY ANDA**
const videoListContainer = document.getElementById('video-list-container');
const videoDetailContainer = document.getElementById('video-detail-container');
const videoDetailTitle = document.getElementById('video-detail-title');
const videoDetailEmbed = document.getElementById('video-detail-embed');
const videoDetailDescription = document.getElementById('video-detail-description');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

let allVideos = [];

function fetchVideos() {
    fetch(`https://doodstream.com/api/user/videos?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                allVideos = data.result;
                displayVideos(allVideos);
            } else {
                videoListContainer.innerHTML = '<p>Gagal mengambil data video.</p>';
                console.error('Gagal mengambil data video:', data.msg);
            }
        })
        .catch(error => {
            videoListContainer.innerHTML = '<p>Terjadi kesalahan saat menghubungi API.</p>';
            console.error('Kesalahan API:', error);
        });
}

function displayVideos(videos) {
    videoListContainer.innerHTML = '';
    videos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');
        videoItem.innerHTML = `
            <img src="${video.thumb}" alt="${video.title}" class="video-thumbnail" data-id="${video.file_code}">
            <h3 class="video-title">${video.title}</h3>
            <p>Durasi: ${formatDuration(video.duration)}</p>
        `;
        videoListContainer.appendChild(videoItem);
    });

    const thumbnails = document.querySelectorAll('.video-thumbnail');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const fileCode = this.dataset.id;
            showVideoDetail(fileCode);
        });
    });
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const parts = [];
    if (hours > 0) parts.push(`${hours}:`);
    parts.push(`${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`);
    return parts.join('');
}

function showVideoDetail(fileCode) {
    fetch(`https://doodstream.com/api/file/info?key=${apiKey}&file_code=${fileCode}`)
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                const videoInfo = data.result;
                videoDetailTitle.textContent = videoInfo.title;
                videoDetailEmbed.innerHTML = `<iframe src="https://dood.la/e/${videoInfo.file_code}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`;
                videoDetailDescription.textContent = videoInfo.description || 'Tidak ada deskripsi.';
                videoListContainer.style.display = 'none';
                videoDetailContainer.style.display = 'block';
            } else {
                alert('Gagal mengambil detail video.');
                console.error('Gagal mengambil detail video:', data.msg);
            }
        })
        .catch(error => {
            alert('Terjadi kesalahan saat mengambil detail video.');
            console.error('Kesalahan API (detail):', error);
        });
}

document.querySelector('.back-to-list').addEventListener('click', function() {
    videoListContainer.style.display = 'grid';
    videoDetailContainer.style.display = 'none';
});

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();
    const filteredVideos = allVideos.filter(video =>
        video.title.toLowerCase().includes(searchTerm)
    );
    displayVideos(filteredVideos);
});

fetchVideos();
