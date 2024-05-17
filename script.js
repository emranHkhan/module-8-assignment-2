const icon = document.getElementById('hoverButton').querySelector('i.fa-volleyball');
const cardRow = document.getElementById('card-row')
const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasWithBothOptions'));
const playerList = document.getElementById('player-list');
const playerCount = document.querySelector('.player-count');
const canvasBody = document.querySelector('.offcanvas-body')
const searchIconContainer = document.querySelector('.search-icon-container');
const modalBtn = document.querySelector('.modal-btn');

document.getElementById('hoverButton').addEventListener('mouseenter', function () {
    icon.classList.remove('fa-shake');
});

document.getElementById('hoverButton').addEventListener('mouseleave', function () {
    icon.classList.add('fa-shake');
});

document.getElementById('player-search-form').addEventListener('submit', function (event) {
    submitForm(event);
});

document.querySelector('.search-icon').addEventListener('click', function (event) {
    submitForm(event);
});

const fetchPlayer = (params = '') => {
    toggleSpinner(true)
    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${params}`)
        .then(res => res.json())
        .then(data => {
            toggleSpinner(false)
            renderCards(data.player)
        })
        .catch(err => renderErrorMessage())
}

function createCard(data) {
    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
        <div class="card mb-3 shadow-lg">
            <img src="${data.strThumb ?? './assets/player.png'}" class="card-img-top" alt="${data.strPlayer}">

            <div class="card-body">
                <h5 class="card-title text-secondary">Name: ${data.strPlayer}</h5>
                <h6 class="card-subtitle text-muted">Country: ${data.strNationality}</h6>
            </div>
            <div class="card-body">
                <p class="card-text">Team: ${data.strTeam}</p>
                <p class="card-text">${data?.strWage}</p>
                <p class="card-text">${(data.strDescriptionEN + '').split(' ').slice(0, 10).join(' ') + '...'}</p>
                <div data-playerId="${data.idPlayer}" class="d-inline-block">
                <button class="btn btn-primary rounded-0" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" onclick="addPlayerToGroup(this, '${data.strPlayer}')">Add To Group</button>
                </div>
                <button type="button" class="btn btn-info rounded-0 d-inline-block ms-2" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="showPlayerDetails('${data.strPlayer}', '${data.strNationality}', '${data.strTeam}', '${data.strWage}', '${data.strGender}')">
                    See Details
                </button>
            </div>
            <div class="card-footer text-muted py-3 d-flex justify-content-center gap-2">
            <a href="${data?.strFacebook}"><i class="fa-brands fa-facebook fa-2xl" style="color: #74C0FC;"></i><a/>
            <a href='${data?.strTwitter}'><i class="fa-brands fa-twitter fa-2xl" style="color: #74C0FC;"></i><a/>
            </div>
        </div>
    `;
    return card;
}

function showPlayerDetails(name, country, team, salary, gender) {
    document.querySelector('.modal-title').innerText = name
    document.querySelector('.country').innerText = country
    document.querySelector('.team').innerText = team
    document.querySelector('.salary').innerText = salary
    document.querySelector('.gender').innerText = gender
}


function addPlayerToGroup(btn, playerName) {
    const count = parseInt(playerCount.textContent)
    if (count >= 11) {
        alert('Maximum number of players exceeded.')
        return
    }

    btn.parentNode.innerHTML = `<button class="btn btn-success rounded-0"><i class="fa-solid fa-check"></i>Added To Group</button>
    </div>`;

    playerCount.textContent = count + 1
    const li = document.createElement('li');
    li.classList.add('border-bottom', 'border-2', 'p-2', 'bg-light', 'mb-2')
    li.innerText = playerName
    playerList.appendChild(li)

}

function submitForm(event) {
    event.preventDefault();
    const playerName = document.getElementById('inputDefault').value;
    console.log(playerName);
    fetchPlayer(playerName);
}

function toggleSpinner(isFetching = false) {
    if (isFetching) {
        document.getElementById('card-row').innerHTML = `<div class="w-100 d-flex justify-content-center">
        <div class="spinner-border text-primary mt-5" role="status">
            <span class="visually-hidden">Loading...</span>
            </div>
        </div>`
    } else {
        document.getElementById('card-row').innerHTML = ''
    }
}



function renderErrorMessage() {
    cardRow.innerHTML = ''

    cardRow.innerHTML = `
    <div class='d-flex flex-column align-items-center justify-content-center my-5'>
        <h3 class="text-center">No Player Found!</h3>
        <a href='/' class='btn btn-dark text-light w-25 mt-5'>Go Back</a>
    </div>
    `
}

function renderCards(data) {
    cardRow.innerHTML = ''
    data.forEach(item => {
        const card = createCard(item);
        cardRow.appendChild(card);
    });
}

document.querySelector('.top-icon').addEventListener('click', function (e) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
})

fetchPlayer()