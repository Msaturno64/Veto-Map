const maps = [
    { name: 'Ancient', img: 'images/ancient.png' },
    { name: 'Anubis', img: 'images/anubis.png' },
    { name: 'Cache', img: 'images/cache.png' },
    { name: 'Cobblestone', img: 'images/cobblestone.png' },
    { name: 'Dust2', img: 'images/dust2.png' },
    { name: 'Inferno', img: 'images/inferno.png' },
    { name: 'Mirage', img: 'images/mirage.png' },
    { name: 'Nuke', img: 'images/nuke.png' },
    { name: 'Overpass', img: 'images/overpass.png' },
    { name: 'Train', img: 'images/train.png' },
    { name: 'Vertigo', img: 'images/vertigo.png' }
];

let currentTurn = 0;
const totalTurns = 10;
const teams = ["Team A", "Team B"];

function updateMapPool() {
    const vetoStages = document.querySelectorAll('.veto-stage .map-pool');
    vetoStages.forEach(stage => {
        stage.innerHTML = '';
        maps.forEach(map => {
            const mapElement = document.createElement('div');
            mapElement.classList.add('map');
            mapElement.innerHTML = `<img src="${map.img}" alt="${map.name}"><span>${map.name}</span><div class="overlay">X</div>`;
            if (map.banned) {
                mapElement.classList.add('banned');
                mapElement.querySelector('img').style.filter = 'grayscale(100%)';
            }
            mapElement.addEventListener('click', () => handleMapClick(map));
            stage.appendChild(mapElement);
        });
    });
    if (currentTurn >= totalTurns) {
        showDecider();
    } else {
        document.querySelector('#veto-stages h2').innerText = `Vote Stage ${currentTurn + 1}: Ban (${teams[currentTurn % 2]})`;
    }
}

function handleMapClick(map) {
    if (currentTurn < totalTurns && !map.banned) {
        map.banned = true;
        currentTurn++;
        playVetoSound();
        updateMapPool();
    }
}

function playVetoSound() {
    const vetoSound = document.getElementById('veto-sound');
    vetoSound.play();
}

function showDecider() {
    const deciderMap = maps.find(map => !map.banned);
    document.getElementById('decider-map-name').innerText = deciderMap.name;
    document.getElementById('decider-map-img').src = deciderMap.img;
    document.getElementById('decider').style.display = 'flex';
}

document.getElementById('close-decider').addEventListener('click', () => {
    location.href = 'index.html';
});

updateMapPool();


