console.log('lets write javascript');

let currentPlay = new Audio();
let isPlaying = false;

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

// Function to safely update the Play/Pause button image everywhere
function updatePlayButtonUI(pausedState) {
    const playBtn = document.querySelector('#play');
    if (playBtn) {
        playBtn.src = pausedState ? '../img/play.svg' : '../img/pause.svg';
    }
}

const playAudio = (track, pause = false) => {
    // Relative path jo Vercel aur Local dono par sahi chalega
    currentPlay.src = 'Plays/' + track;

    if (!pause) {
        currentPlay.play()
            .then(() => {
                isPlaying = true;
                updatePlayButtonUI(false);
            })
            .catch(err => console.log("Playback interaction error:", err));
    } else {
        isPlaying = false;
        updatePlayButtonUI(true);
    }

    // UI par track ka naam update karna
    document.querySelector('.playinfo').innerHTML = decodeURIComponent(track).replace('.mp3', '');
    document.querySelector('.playtime').innerHTML = '00:00 / 00:00';
}

async function main() {
    const playBtn = document.querySelector('#play');
    const prevBtn = document.querySelector('#previous');
    const nextBtn = document.querySelector('#next');

    // 1. Pehla track load karo (paused state mein)
    playAudio(plays[0], true);

    // 2. Playlist ke andar saare plays add karein
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

    // 3. Har list item par click listener lagana
    Array.from(document.querySelectorAll('.playNlist li')).forEach((e, index) => {
        e.addEventListener('click', () => {
            playAudio(plays[index]);
        });
    });

    // 4. Play/Pause button toggle logic
    playBtn.addEventListener('click', () => {
        if (currentPlay.paused) {
            currentPlay.play().then(() => updatePlayButtonUI(false));
        } else {
            currentPlay.pause();
            updatePlayButtonUI(true);
        }
    });

    // 5. Time aur seekbar circle update
    currentPlay.addEventListener('timeupdate', () => {
        document.querySelector('.playtime').innerHTML =
            `${secondsToMinutesSeconds(currentPlay.currentTime)} / ${secondsToMinutesSeconds(currentPlay.duration)}`;

        let progress = (currentPlay.currentTime / currentPlay.duration) * 100;
        document.querySelector('.circle').style.left = (progress || 0) + '%';
    });

    // 6. Seekbar manipulation
    document.querySelector('.seekbar').addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentPlay.currentTime = ((currentPlay.duration) * percent) / 100;
    });

    // 7. Hamburger Responsive Toggle
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // 8. Previous Button Logic
    prevBtn.addEventListener('click', () => {
        let currentTrackFile = currentPlay.src.split('/').slice(-1)[0];
        let decodedTrack = decodeURIComponent(currentTrackFile);
        let index = plays.indexOf(decodedTrack);

        if ((index - 1) >= 0) {
            playAudio(plays[index - 1]);
        }
    });

    // 9. Next Button Logic
    nextBtn.addEventListener('click', () => {
        let currentTrackFile = currentPlay.src.split('/').slice(-1)[0];
        let decodedTrack = decodeURIComponent(currentTrackFile);
        let index = plays.indexOf(decodedTrack);

        if ((index + 1) < plays.length) {
            playAudio(plays[index + 1]);
        }
    });
}

main();