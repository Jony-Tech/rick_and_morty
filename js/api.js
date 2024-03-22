//url API
const url = 'https://rickandmortyapi.com/api';

//Selectors
const btnSearch = document.querySelector('#btnSearch');
const btnFilter = document.querySelector('#filter');
const btnNextPage = document.querySelector('#nextPage');
const btnPreviousPage = document.querySelector('#previousPage');
const divPages = document.querySelector('#pages');
const filterBy = document.querySelector('#filterBy');
const filterName = document.querySelector('#filterName');
let selectEpisodes;
let selectLocations;
let selectStatus;
let selectGender;
let objectCharacter;
let pages;

//listeners
document.addEventListener('DOMContentLoaded', getData);
btnNextPage.addEventListener('click', showPage)
btnPreviousPage.addEventListener('click', showPage)
btnFilter.addEventListener('click', filterBtn);
btnSearch.addEventListener('click', searchCharacter);





async function getData(){
    try{
        const response = await fetch(`${url}/character/`);
        const result = await response.json();
        pages = result.info.pages;
        objectCharacter = result
        console.log(objectCharacter);
        showHTML(result.results);
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
            <a class="bg-gray-700 flex flex-col  p-4 rounded-xl text-white" href="character.html?id=${id}">
                <p class="font-bold text-xl hover:text-orange-500">${name}</p>
                <p><span class="text-${color}-500">●</span> ${status}</p>
                <img class="rounded-xl max-h-60" src="${image}" alt="character">
            </a>
        `
    });
    content.innerHTML = html;
}

async function searchCharacter(e){
    e.preventDefault()
    const character = document.querySelector('#search');

    try{
        const response = await fetch(`${url}/character/?name=${character.value}`);
        const result = await response.json();
        objectCharacter = result.results;
        filterName.textContent = "Results with:"
        filterBy.textContent = character.value;
        hidePagesBtn()
        showHTML(result.results);
    } catch (error){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "This character doesn't exist!",
        });
    }

    character.value = ''
}
//Filter
async function filterBtn(){
     Swal.fire({
        title: "FILTER BY",
        background: "#374151",
        color: "#fff",
        html: `
            <form action="" class="pb-5">
            <div class="">
                <label for="episodes" class="text-gray-300 pb-2 block font-bold">Episodes:</label>
                <select
                class="text-white bg-gray-500 py-1 px-4 rounded"
                name="episodes"
                id="episodes"
                form=""
                ></select>
            </div>
            <p class="font-bold p-4">OR</p>
            <div class="">
                <label class="text-gray-300 pb-2 font-bold block" for="locations">Locations:</label>
                <select
                class="text-white rounded py-1 text-center bg-gray-500"
                name="locations"
                id="locations"
                form=""
                ></select>
            </div>
            <p class="font-bold p-4">AND</p>
            <div class="pb-4">
                <label class="text-gray-300 font-bold" for="status">Status:</label>
                <select
                class="text-white text-center bg-gray-500 py-1 px-4 rounded"
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
                <label class="text-gray-300 font-bold" for="gender">Gender:</label>
                <select
                class="text-white text-center bg-gray-500 py-1 px-4 rounded"
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
        filterName.textContent = "Episode:"
        filterBy.textContent = result.name
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
        hidePagesBtn(true);
        filterName.textContent = "Location:"
        filterBy.textContent = result.name
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