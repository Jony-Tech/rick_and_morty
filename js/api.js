const btnSearch = document.querySelector('#btnSearch');
btnSearch.addEventListener('click', searchCharacter)
document.addEventListener('DOMContentLoaded', getData);

const url = 'https://rickandmortyapi.com/api'

async function getData(){
    try{
        const response = await fetch(`${url}/character/`);
        const result = await response.json();
        showHTML(result.results);
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
                <p><span class="text-${color}-600">●</span> ${status}</p>
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