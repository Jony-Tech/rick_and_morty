const urlParams = new URLSearchParams(window.location.search);
const idCharacter = urlParams.get('id');
const img = document.querySelector('#img');
const nameP = document.querySelector('#name');
const statusP = document.querySelector('#status');
const speciesP = document.querySelector('#species');
const genderP = document.querySelector('#gender');
const locationP = document.querySelector('#location');
const originP = document.querySelector('#origin');
const typeP = document.querySelector('#type');

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

function showHTML({name, image, id, status, species, gender, location, origin, type}){
    img.src = image;
    nameP.textContent = name
    statusP.textContent = status
    speciesP.textContent = species
    genderP.textContent = gender
    locationP.textContent = location.name
    originP.textContent = origin.name;
    typeP.textContent = type
}
