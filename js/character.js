const urlParams = new URLSearchParams(window.location.search);
const idCharacter = urlParams.get('id');
document.addEventListener('DOMContentLoaded', getData);

const url = 'https://rickandmortyapi.com/api'

async function getData(){
    try{
        const response = await fetch(`${url}/character/${idCharacter}`);
        const result = await response.json();
        console.log(result);
        showHTML(result);
    } catch (error){
        console.log(error);
    }
}

function showHTML({name, image, id}){
    const content = document.querySelector('#content');

    content.innerHTML = `
            <a href="character.html?id=${id}">
                <p class="font-bold">${name} </p>
                <img src="${image}" alt="character">
            </a>
        `
}
