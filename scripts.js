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
const totalTurnsBO1 = 7;
const totalTurnsBO3 = 11;
const teams = ["Team A", "Team B"];
const stagesBO1 = [
    "Ban: Team A", "Ban: Team B", "Ban: Team A", "Ban: Team B",
    "Ban: Team A", "Ban: Team B", "Decider"
];
const stagesBO3 = [
    "Ban: Team A", "Ban: Team B", "Pick: Team A", "Pick: Team B",
    "Ban: Team A", "Ban: Team B", "Ban: Team A", "Ban: Team B",
    "Ban: Team A", "Ban: Team B", "Decider"
];

function startBO1() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('bo1-veto').style.display = 'block';
    initializeVeto(stagesBO1, totalTurnsBO1);
}

function startBO3() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('bo3-veto').style.display = 'block';
    initializeVeto(stagesBO3, totalTurnsBO3);
}

function initializeVeto(stages, totalTurns) {
    currentTurn = 0;
    const vetoContainer = document.querySelector(currentTurn < totalTurnsBO3 ? '#bo3-veto-stages' : '#bo1-veto-stages');
    vetoContainer.innerHTML = '';
    maps.forEach(map => {
        map.banned = false;
        map.picked = false;
    });
    updateMapPool(stages, totalTurns, vetoContainer);
}

function updateMapPool(stages, totalTurns, vetoContainer) {
    const mapPool = document.createElement('div');
    mapPool.classList.add('map-pool');
    maps.forEach(map => {
        const mapElement = document.createElement('div');
        mapElement.classList.add('map');
        mapElement.innerHTML = `<img src="${map.img}" alt="${map.name}"><span>${map.name}</span><div class="overlay">X</div>`;
        if (map.banned || map.picked) {
            mapElement.classList.add(map.banned ? 'banned' : 'picked');
            mapElement.querySelector('img').style.filter = 'grayscale(100%)';
        }
        mapElement.addEventListener('click', () => handleMapClick(map, stages, totalTurns, vetoContainer));
        mapPool.appendChild(mapElement);
    });
    const stage = document.createElement('div');
    stage.classList.add('veto-stage');
    stage.innerHTML = `<h2>Vote Stage ${currentTurn + 1}: ${stages[currentTurn]}</h2>`;
    stage.appendChild(mapPool);
    vetoContainer.appendChild(stage);

    if (currentTurn >= totalTurns) {
        showDecider();
    }
}

function handleMapClick(map, stages, totalTurns, vetoContainer) {
    if (currentTurn < totalTurns && !map.banned && !map.picked) {
        if (stages[currentTurn].includes("Ban")) {
            map.banned = true;
        } else if (stages[currentTurn].includes("Pick")) {
            map.picked = true;
        }
        currentTurn++;
        playVetoSound();
        updateMapPool(stages, totalTurns, vetoContainer);
    }
}

function playVetoSound() {
    const vetoSound = document.getElementById('veto-sound');
    vetoSound.play();
}

function showDecider() {
    const deciderMap = maps.find(map => !map.banned && !map.picked);
    document.getElementById('decider-map-name').innerText = deciderMap.name;
    document.getElementById('decider-map-img').src = deciderMap.img;
    document.getElementById('decider').style.display = 'flex';
}

document.getElementById('close-decider').addEventListener('click', () => {
    document.getElementById('decider').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('bo1-veto').style.display = 'none';
    document.getElementById('bo3-veto').style.display = 'none';
});


