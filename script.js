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

const playAudio = (track, pause = false) => {
    // Relative path jo local aur live dono par kaam karega
    currentPlay.src = 'Plays/' + track;

    if (!pause) {
        currentPlay.play().catch(err => console.log("Playback interaction error:", err));
        document.querySelector('#play').src = '../img/pause.svg';
    }

    // UI par saaf suthra naam dikhane ke liye decode karein aur .mp3 hatayein
    document.querySelector('.playinfo').innerHTML = decodeURIComponent(track).replace('.mp3', '');
    document.querySelector('.playtime').innerHTML = '00:00 / 00:00';
}

async function main() {
    // Elements references safely select karein
    const playBtn = document.querySelector('#play');
    const prevBtn = document.querySelector('#previous');
    const nextBtn = document.querySelector('#next');

    // 1. Pehla track load karo (paused state mein)
    playAudio(plays[0], true);

    // 2. Playlist ke andar saare plays add karein
    let playUL = document.querySelector('.playNlist ul');
    playUL.innerHTML = ""; // Pehle purani list clear karein

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

    // 4. Play/Pause button setup
    playBtn.addEventListener('click', () => {
        if (currentPlay.paused) {
            currentPlay.play();
            playBtn.src = '../img/pause.svg';
        } else {
            currentPlay.pause();
            playBtn.src = '../img/play.svg';
        }
    });

    // 5. Time and seekbar circle update
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

    // 8. Previous Button Logic (with %20 fix)
    prevBtn.addEventListener('click', () => {
        let currentTrackFile = currentPlay.src.split('/').slice(-1)[0];
        let decodedTrack = decodeURIComponent(currentTrackFile);
        let index = plays.indexOf(decodedTrack);

        if ((index - 1) >= 0) {
            playAudio(plays[index - 1]);
        }
    });

    // 9. Next Button Logic (with %20 fix)
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