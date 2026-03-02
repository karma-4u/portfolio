document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if controls already exist
    if (document.getElementById('music-btn')) return;

    // 2. Create standard HTML5 Audio Element
    // Using a reliable, royalty-free ambient track found online (SoundHelix Song 1 - standard test audio)
    // You can replace this URL with any direct link to an MP3
    // OPTION 1: Use a local file (Recommended for best control)
    // Place an MP3 file named 'bg_music.mp3' in this same folder and uncomment the line below:
    // const audioUrl = "bg_music.mp3"; 

    // OPTION 2: Use an online URL (Currently active)
    const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

    const audio = new Audio(audioUrl);
    audio.id = 'bg-music';
    audio.loop = true;
    audio.volume = 0.5; // 50% volume

    // 3. Create Toggle Button
    const musicBtn = document.createElement('button');
    musicBtn.id = 'music-btn';
    musicBtn.className = 'btn';
    musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Default state

    // Style the button
    Object.assign(musicBtn.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: '9999',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: 'none',
        background: 'linear-gradient(135deg, #38bdf8, #818cf8)', // Matches site theme
        color: 'white',
        fontSize: '1.5rem',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(56, 189, 248, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s ease'
    });

    musicBtn.onmouseover = () => musicBtn.style.transform = 'scale(1.1)';
    musicBtn.onmouseout = () => musicBtn.style.transform = 'scale(1)';

    document.body.appendChild(musicBtn);

    // 4. Persistence Logic (Save time and state across pages)
    const savedTime = parseFloat(localStorage.getItem('simple_music_time')) || 0;
    const shouldPlay = localStorage.getItem('simple_music_playing') === 'true';

    audio.currentTime = savedTime;

    const updateIcon = (playing) => {
        musicBtn.innerHTML = playing ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        if (playing) {
            musicBtn.classList.add('playing'); // Optional: Add pulse animation via CSS if desired
        } else {
            musicBtn.classList.remove('playing');
        }
    };

    // Attempt to auto-play if previously playing
    if (shouldPlay) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                updateIcon(true);
            }).catch(error => {
                console.log("Autoplay prevented by browser policy (user interaction needed).");
                localStorage.setItem('simple_music_playing', 'false'); // Reset state
                updateIcon(false);
            });
        }
    }

    // 5. Button Click Handler
    musicBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            localStorage.setItem('simple_music_playing', 'true');
            updateIcon(true);
        } else {
            audio.pause();
            localStorage.setItem('simple_music_playing', 'false');
            updateIcon(false);
        }
    });

    // 6. Save State on Unload (Navigating to another page)
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('simple_music_time', audio.currentTime);
    });
});
