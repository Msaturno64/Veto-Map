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
const totalTurnsBO3 = 11;
const teams = ["Team A", "Team B"];
const teamColors = ["teamA", "teamB"];
const stagesBO3 = [
    "Ban: Team A", "Ban: Team B", "Pick: Team A", "Pick: Team B",
    "Ban: Team A", "Ban: Team B", "Ban: Team A", "Ban: Team B",
    "Ban: Team A", "Ban: Team B", "Decider"
];

function initializeVeto() {
    currentTurn = 0;
    maps.forEach(map => {
        map.banned = false;
        map.picked = false;
        map.pickedBy = null;
    });
    updateMapPool();
}

function updateMapPool() {
    const vetoStages = document.querySelector('#bo3-veto-stages .map-pool');
    vetoStages.innerHTML = '';
    maps.forEach(map => {
        const mapElement = document.createElement('div');
        mapElement.classList.add('map');
        mapElement.innerHTML = `<img src="${map.img}" alt="${map.name}"><span>${map.name}</span><div class="overlay">X</div>`;
        if (map.banned) {
            mapElement.classList.add('banned');
            mapElement.querySelector('img').style.filter = 'grayscale(100%)';
        } else if (map.picked) {
            mapElement.classList.add(map.pickedBy);
        }
        mapElement.addEventListener('click', () => handleMapClick(map));
        vetoStages.appendChild(mapElement);
    });
    document.getElementById('bo3-stage-header').innerText = `Vote Stage ${currentTurn + 1}: ${stagesBO3[currentTurn]}`;
    if (stagesBO3[currentTurn].includes("Pick")) {
        document.getElementById('bo3-stage-header').classList.add(teamColors[currentTurn % 2]);
    } else {
        document.getElementById('bo3-stage-header').classList.remove(...teamColors);
    }

    if (currentTurn >= totalTurnsBO3) {
        showDecider();
    }
}

function handleMapClick(map) {
    if (currentTurn < totalTurnsBO3 && !map.banned && !map.picked) {
        if (stagesBO3[currentTurn].includes("Ban")) {
            map.banned = true;
        } else if (stagesBO3[currentTurn].includes("Pick")) {
            map.picked = true;
            map.pickedBy = teamColors[currentTurn % 2];
        }
        currentTurn++;
        playVetoSound();
        if (currentTurn >= totalTurnsBO3) {
            showDecider();
        } else {
            updateMapPool();
        }
    }
}

function playVetoSound() {
    const vetoSound = document.getElementById('veto-sound');
    vetoSound.play();
}

function showDecider() {
    const pickedMaps = maps.filter(map => map.picked);
    const deciderMap = maps.find(map => !map.banned && !map.picked);
    const deciderElement = document.getElementById('decider');
    const deciderContent = deciderElement.querySelector('.decider-content');

    deciderContent.innerHTML = '<button id="close-decider">X</button>';
    pickedMaps.forEach(map => {
        const team = map.pickedBy === "teamA" ? "Team A" : "Team B";
        const color = map.pickedBy === "teamA" ? "blue" : "red";
        deciderContent.innerHTML += `<div class="map-container"><h2 style="color:${color}">${team}: ${map.name}</h2><img src="${map.img}" alt="${map.name}" style="width: 200px; height: 200px;"></div>`;
    });
    deciderContent.innerHTML += `<div class="map-container"><h2 style="color:green">Decider: ${deciderMap.name}</h2><img src="${deciderMap.img}" alt="${deciderMap.name}" style="width: 200px; height: 200px;"></div>`;

    deciderElement.style.display = 'flex';
    document.getElementById('close-decider').addEventListener('click', () => {
        document.getElementById('decider').style.display = 'none';
        location.href = 'index.html';
    });
}

initializeVeto();


