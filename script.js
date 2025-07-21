console.log('lets write javascript');

let currentPlay = new Audio();
let plays;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getPlays() {
    let a = await fetch("http://127.0.0.1:3000/Plays/");
    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response;
    let as = div.getElementsByTagName('a')
    let plays = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            plays.push(element.href.split('/Plays/')[1])
        }
    }
    return plays
}

const playAudio = (track, pause = false) => {
    // let audio = new Audio('/Plays/' + track)
    currentPlay.src = '/Plays/' + track
    if (!pause) {
        currentPlay.play()
        play.src = '/img/pause.svg'
    }
    document.querySelector('.playinfo').innerHTML = decodeURI(track)
    document.querySelector('.playtime').innerHTML = '00:00/00:00'
}

async function main() {
    // get the list of all plays
    plays = await getPlays()
    // console.log(plays)
    playAudio(plays[0], true)

    //show all the plays in playlist
    let playUL = document.querySelector('.playNlist').getElementsByTagName('ul')[0]
    for (const play of plays) {
        // playUL.innerHTML = playUL.innerHTML + `<li> ${play.replaceAll('%20'," ")} </li>`;
        playUL.innerHTML = playUL.innerHTML + `<li><img src="img/music.svg" class="invert" alt="">
                            <div class="info">
                                <div>${play.replaceAll('%20', " ")}</div>
                                <div>reciter</div>
                            </div>
                            <div class="playnow">
                                <img src="img/play.svg" class="invert" alt="">
                            </div></li>`;
    }

    //attach eventlistener to each play
    Array.from(document.querySelector('.playNlist').getElementsByTagName('li')).forEach(e => {
        // console.log(e.getElementsByTagName('div')[0]);
        e.addEventListener('click', element => {
            // console.log(e.querySelector('.info').firstElementChild.innerHTML)
            // playAudio(e.querySelector('.info').firstElementChild.innerHTML)
            playAudio(e.querySelector('.info').firstElementChild.innerHTML.trim())
        })
    })

    //attach an eventlistener to previous, play amd next
    play.addEventListener('click', () => {
        if (currentPlay.paused) {
            currentPlay.play()
            play.src = '/img/pause.svg'
        } else {
            currentPlay.pause()
            play.src = '/img/play.svg'
        }
    })

    // listen for timeupdate
    currentPlay.addEventListener('timeupdate', () => {
        console.log(currentPlay.timeupdate, currentPlay.duration);
        document.querySelector('.playtime').innerHTML = `${secondsToMinutesSeconds(currentPlay.currentTime)}/
        ${secondsToMinutesSeconds(currentPlay.duration)}`
        document.querySelector('.circle').style.left = (currentPlay.currentTime / currentPlay.duration) * 100 + '%';
    })

    // add an eventlistener to seekbar
    document.querySelector('.seekbar').addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentPlay.currentTime = ((currentPlay.duration) * percent) / 100
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add an eventlistener to previous and next
    previous.addEventListener('click', () => {
        currentPlay.pause()
        // console.log('currentPlay clicked');
        let index = plays.indexOf(currentPlay.src.split('/').slice(-1)[0])
        if ((index - 1) >= 0) {
            playAudio(plays[index - 1])
        }
    })
    next.addEventListener('click', () => {
        currentPlay.pause()
        // console.log('previousPlay clicked');
        let index = plays.indexOf(currentPlay.src.split('/').slice(-1)[0])
        if ((index + 1) < plays.length) {
            playAudio(plays[index + 1])
        }
    })

}
main()





