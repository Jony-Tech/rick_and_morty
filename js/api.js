const btnSearch = document.querySelector('#btnSearch');
const btnFilter = document.querySelector('#filter');
let selectEpisodes;
let selectLocations;
let selectStatus;
let selectGender;
const btnNextPage = document.querySelector('#nextPage');
const btnPreviousPage = document.querySelector('#previousPage');
const divPages = document.querySelector('#pages');
let objectCharacter;
btnNextPage.addEventListener('click', showPage)
btnPreviousPage.addEventListener('click', showPage)
btnFilter.addEventListener('click', filterBtn);
btnSearch.addEventListener('click', searchCharacter);

document.addEventListener('DOMContentLoaded', getData);

const url = 'https://rickandmortyapi.com/api'
let pages;
async function getData(){
    try{
        const response = await fetch(`${url}/character/`);
        const result = await response.json();
        pages = result.info.pages;
        objectCharacter = result
        console.log(objectCharacter);
        showHTML(result.results);
        console.log(pages);
    } catch (error){
        console.log(error);
    }
}
let currentPage = 1;

console.log(currentPage);
async function showPage(e){
    try{
        if(pages >= currentPage){
            if(e.target.id === 'nextPage'){
            currentPage++;
            btnPreviousPage.classList.remove('hidden');
            console.log(currentPage, "pagina acutal");
            if(currentPage == pages){
                btnNextPage.classList.add('hidden');
            }
             
            
            }else{
                if(btnNextPage.classList.contains('hidden')){
                    btnNextPage.classList.remove('hidden')
                }
                currentPage--;
                console.log(currentPage);
                if(currentPage === 1){
                    btnPreviousPage.classList.add('hidden');
                }
            }
        const response = await fetch(`${url}/character/?page=${currentPage}`);
        const result = await response.json();
        showHTML(result.results)
        }else{
            console.log('no more pages');
        }
    } catch (error){
        console.log(error);
    }
}


function showHTML(data){
    const content = document.querySelector('#content');
    let html = '';
    let color = "gray";
    data.forEach(character => {
        const {name, image, id, status} = character;
        status === "Alive" ? color = "green" : status === "Dead" ? color = "red" : null;
        html += `
            <a class="bg-gray-600 p-2 rounded text-white" href="character.html?id=${id}">
                <p class="font-bold">${name}</p>
                <p><span class="text-${color}-500">●</span> ${status}</p>
                <img src="${image}" alt="character">
            </a>
        `
    });

    content.innerHTML = html
}

async function searchCharacter(e){
    e.preventDefault()
    const character = document.querySelector('#search').value;

    try{
        const response = await fetch(`${url}/character/?name=${character}`);
        const result = await response.json();
        console.log(result);
        objectCharacter = result.results;
        console.log(objectCharacter);
        hidePagesBtn()
        showHTML(result.results);
    } catch (error){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "This character doesn't exist!",
        });
    }
}
//Filter
async function filterBtn(){
     Swal.fire({
        title: "Filter by",
        html: `
            <form action="">
            <div class="">
                <label for="episodes" class="text-gray-500 font-bold">Episodes:</label>
                <select
                class="text-black"
                name="episodes"
                id="episodes"
                form=""
                ></select>
            </div>
            <p class="font-bold p-4">or</p>
            <div class="">
                <label class="text-gray-500 font-bold" for="locations">Locations:</label>
                <select
                class="text-black"
                name="locations"
                id="locations"
                form=""
                ></select>
            </div>
            <p class="font-bold p-4">and</p>
            <div class="">
                <label class="text-gray-500 font-bold" for="status">Status:</label>
                <select
                class="text-black"
                name="status"
                id="status"
                form=""
                >
                <option value="Alive">Alive</option>
                <option value="Dead">Dead</option>
                <option value="unknown">Unknown</option>
                </select>
            </div>
            <div class="">
                <label class="text-gray-500 font-bold" for="gender">Gender:</label>
                <select
                class="text-black"
                name="gender"
                id="gender"
                form=""
                >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="unknown">Unknown</option>
                </select>
            </div>
            </form>
            
        `,
        showConfirmButton: false
  
    });
    getEpisodes();
    getLocations();
    selectEpisodes = document.querySelector('#episodes');
    selectLocations = document.querySelector('#locations');
    selectStatus = document.querySelector('#status');
    selectGender = document.querySelector('#gender');
    selectEpisodes.addEventListener('change', episodeSelected);
    selectLocations.addEventListener('change', locationSelected);
    selectStatus.addEventListener('change', statusSelected);
    selectGender.addEventListener('change', genderSelected);
}

async function getEpisodes(){
    let allResults = [];
    let currentPage = 1;
    let pages = 0;

    do {
        const response = await fetch(`https://rickandmortyapi.com/api/episode?page=${currentPage}`);
        const result = await response.json();
        allResults = allResults.concat(result.results);
        pages = result.info.pages;
        currentPage++;
    } while (currentPage <= pages);
    showEpisodes(allResults);
}
function showEpisodes(data){
    let html;
    data.forEach(episode => {
        html += `
            <option value="${episode.id}">${episode.episode}</option>
        `
    });
    selectEpisodes.innerHTML = html
};


async function episodeSelected(){
    try {
        const response = await fetch(`${url}/episode/${Number(this.value)}`);
        const result = await response.json();
        getCharacter(result.characters);
        hidePagesBtn(true)
    } catch (error) {
        console.log(error);
    }
}

async function getCharacter(data){
    try {
        const promises = data.map(async (character) => {
            const response = await fetch(`${character}`);
            return response.json();
        });
        const characters = await Promise.all(promises);
        objectCharacter = characters;
        console.log(objectCharacter);
        showHTML(characters);
    } catch (error) {
        console.log(error);
    }
}
//locations

async function getLocations(){
    let allResults = [];
    let currentPage = 1;
    let pages = 0;

    do {
        const response = await fetch(`https://rickandmortyapi.com/api/location?page=${currentPage}`);
        const result = await response.json();
        allResults = allResults.concat(result.results);
        pages = result.info.pages;
        currentPage++;
    } while (currentPage <= pages);
    showLocatons(allResults);
}
async function locationSelected(){
    try {
        const response = await fetch(`${url}/location/${Number(this.value)}`);
        const result = await response.json();
        getCharacter(result.residents);
        hidePagesBtn(true)
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}
function showLocatons(data){
    let html;
    data.forEach(location => {
        html += `
            <option value="${location.id}">${location.name}</option>
        `
    });
    selectLocations.innerHTML = html
};

async function statusSelected(){
    if(objectCharacter.info){
        const response = await fetch(`${url}/character/?status=${this.value}`);
        const result = await response.json();
        console.log(result);
        showHTML(result.results);
    }else{
        let arrayCharacters = objectCharacter.filter(character => character.status === this.value );
        showHTML(arrayCharacters);
    }
}

async function genderSelected(){
    if(objectCharacter.info){
        const response = await fetch(`${url}/character/?gender=${this.value}`);
        const result = await response.json();
        console.log(result);
        showHTML(result.results);
    }else{
        let arrayCharacters = objectCharacter.filter(character => character.gender === this.value );
        showHTML(arrayCharacters);
    }
    
}

function hidePagesBtn(hide){
    divPages.classList.add('hidden')
    if(!hide){
        console.log('si');
    }else{
        console.log('no');
    }
}