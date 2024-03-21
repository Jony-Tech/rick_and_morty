const btnSearch = document.querySelector('#btnSearch');
const btnFilter = document.querySelector('#filter');
const selectEpisodes = document.querySelector('#episodes');
const selectLocations = document.querySelector('#locations');
const btnNextPage = document.querySelector('#nextPage');
const btnPreviousPage = document.querySelector('#previousPage');
const divPages = document.querySelector('#pages');
btnNextPage.addEventListener('click', showPage)
btnPreviousPage.addEventListener('click', showPage)
selectEpisodes.addEventListener('change', episodeSelected);
selectLocations.addEventListener('change', locationSelected);
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
        showHTML(result.results);
    } catch (error){
        console.log(error);
    }
}
let currentPage = 1;
async function showPage(e){
    try{
        if(e.target.id === 'nextPage'){
            currentPage++;
            btnPreviousPage.classList.remove('hidden');
        
        }else{
            currentPage--;
            if(currentPage === 1){
                btnPreviousPage.classList.add('hidden');
            }
        }
        console.log(currentPage);
        const response = await fetch(`${url}/character/?page=${currentPage}`);
        const result = await response.json();
        showHTML(result.results)
    } catch (error){
        console.log(error);
    }
}

function showHTML(data){
    const content = document.querySelector('#content');
    let html = '';
    let color;
    data.forEach(character => {
        const {name, image, id, status} = character;
        status === "Alive" ? color = "green" : status === "Dead" ? color = "red" : color = "gray";
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
        showHTML(result.results);
    } catch (error){
        console.log(error);
    }
}
//side bar
function filterBtn(){
    const sidebar = document.querySelector('#sidebar');
    
    if(sidebar.classList.contains('hidden')){
        sidebar.classList.remove('hidden');
    }else{
        sidebar.classList.add('hidden')
    }
    // sidebar.classList.toggle('-translate-x-full');
}
getEpisodes();
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
        getCharacter(result.characters)
    } catch (error) {
        console.log(error);
    }
}
let object;
async function getCharacter(data){
    try {
        const promises = data.map(async (character) => {
            const response = await fetch(`${character}`);
            return response.json();
        });
        const characters = await Promise.all(promises);
        // characters.forEach(character => {
        //     character.location.name.includes('Earth') ? console.log(character.name) : console.log();
        // })
        object = characters;
        console.log(object);
        showHTML(characters);
    } catch (error) {
        console.log(error);
    }
}
//locations
getLocations();
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