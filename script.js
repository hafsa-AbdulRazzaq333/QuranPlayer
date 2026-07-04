console.log('lets write javascript');

let currentPlay = new Audio();

// ✅ Array of files manually
let plays = [
    "Kullo nafsin zaikatul maut.mp3",
    "Surah Ad Duha.mp3",
    "Surah Al Ghashiyah.mp3",
    "Surah Al-Infitar.mp3",
    "Surah Al-Muzammil.mp3",
    "Surah An-Naba.mp3",
    "Surat Ash-Sharh.mp3"
];

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Global function to change button icon instantly
function togglePlayIcon(isPlaying) {
    const playBtn = document.querySelector('#play');
    if (playBtn) {
        playBtn.src = isPlaying ? '../img/pause.svg' : '../img/play.svg';
    }
}

const playAudio = (track, pause = false) => {
    // Relative path configuration
    currentPlay.src = 'Plays/' + track;

    if (!pause) {
        currentPlay.play()
            .then(() => {
                togglePlayIcon(true);
            })
            .catch(err => {
                console.log("Playback failed or interrupted:", err);
                togglePlayIcon(false);
            });
    } else {
        togglePlayIcon(false);
    }

    // Update song details in playbar
    document.querySelector('.playinfo').innerHTML = decodeURIComponent(track).replace('.mp3', '');
    document.querySelector('.playtime').innerHTML = '00:00 / 00:00';
}

async function main() {
    const playBtn = document.querySelector('#play');
    const prevBtn = document.querySelector('#previous');
    const nextBtn = document.querySelector('#next');

    // 1. Load first track initially (in paused state)
    playAudio(plays[0], true);

    // 2. Render playlist items dynamically
    let playUL = document.querySelector('.playNlist ul');
    playUL.innerHTML = "";

    for (const play of plays) {
        let cleanName = play.replace('.mp3', '');
        playUL.innerHTML += `
          <li>
            <img src="../img/music.svg" class="invert" alt="" style="width:24px;">
            <div class="info">
              <div>${cleanName}</div>
              <div>Qari</div>
            </div>
            <div class="playnow">
              <img src="../img/play.svg" class="invert" alt="" style="width:20px;">
            </div>
          </li>`;
    }

    // 3. Playlist items click event
    Array.from(document.querySelectorAll('.playNlist li')).forEach((e, index) => {
        e.addEventListener('click', () => {
            playAudio(plays[index], false); // Force play the selected track
        });
    });

    // 4. Central Play/Pause button setup
    playBtn.addEventListener('click', () => {
        if (currentPlay.paused) {
            currentPlay.play()
                .then(() => togglePlayIcon(true))
                .catch(err => console.log(err));
        } else {
            currentPlay.pause();
            togglePlayIcon(false);
        }
    });

    // 5. Progress seekbar and timer updates
    currentPlay.addEventListener('timeupdate', () => {
        document.querySelector('.playtime').innerHTML =
            `${secondsToMinutesSeconds(currentPlay.currentTime)} / ${secondsToMinutesSeconds(currentPlay.duration)}`;

        let progress = (currentPlay.currentTime / currentPlay.duration) * 100;
        document.querySelector('.circle').style.left = (progress || 0) + '%';
    });

    // 6. Manual seekbar clicking control
    document.querySelector('.seekbar').addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentPlay.currentTime = ((currentPlay.duration) * percent) / 100;
    });

    // 7. Hamburger Responsive Drawer
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // 8. Previous Button Functionality
    prevBtn.addEventListener('click', () => {
        let currentTrackFile = currentPlay.src.split('/').slice(-1)[0];
        let decodedTrack = decodeURIComponent(currentTrackFile);
        let index = plays.indexOf(decodedTrack);

        if ((index - 1) >= 0) {
            playAudio(plays[index - 1], false);
        }
    });

    // 9. Next Button Functionality
    nextBtn.addEventListener('click', () => {
        let currentTrackFile = currentPlay.src.split('/').slice(-1)[0];
        let decodedTrack = decodeURIComponent(currentTrackFile);
        let index = plays.indexOf(decodedTrack);

        if ((index + 1) < plays.length) {
            playAudio(plays[index + 1], false);
        }
    });
}

main();