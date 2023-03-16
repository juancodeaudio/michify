const API_URL_RANDOM = [
    'https://api.thecatapi.com/v1/images/search',
    '?limit=4',
    '&api_key=live_GhxtDyAli6Mufch55wS50zsuTr0rGpXNHzBcX6mGDHJdeQhFnErkMhjXcPoa2d5X'
].join('');
const API_URL_FAVOURITES = [
    'https://api.thecatapi.com/v1/favourites',
    '?limit=8',
    '&api_key=live_GhxtDyAli6Mufch55wS50zsuTr0rGpXNHzBcX6mGDHJdeQhFnErkMhjXcPoa2d5X'
].join('');
const API_URL_FAVOURITES_DELETE = (id) => [
    'https://api.thecatapi.com/v1/favourites',
    `/${id}`,
    '?api_key=live_GhxtDyAli6Mufch55wS50zsuTr0rGpXNHzBcX6mGDHJdeQhFnErkMhjXcPoa2d5X'
].join('');

const spanError = document.getElementById('error');
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const img3 = document.getElementById('img3');
const img4 = document.getElementById('img4');
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const btn4 = document.getElementById('btn4');



async function loadRandomMichis() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();

    console.log('Random');
    console.log(data);

    if(res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status;
    } else {
        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;
        img4.src = data[3].url;


        btn1.onclick = () => saveFavouriteMichi(data[0].id);
        btn2.onclick = () => saveFavouriteMichi(data[1].id);
        btn3.onclick = () => saveFavouriteMichi(data[2].id);
        btn4.onclick = () => saveFavouriteMichi(data[3].id);
    }
}

async function loadFavouriteMichis() {
    const res = await fetch(API_URL_FAVOURITES);
    const data = await res.json();

    console.log('Favourites');
    console.log(data);
    
    if(res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        const section = document.getElementById('favouriteMichis');
        section.innerHTML = "";

        data.forEach(michi => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('DELETE ✖');

            btn.appendChild(btnText);
            btn.onclick = () => deleteFavouriteMichi(michi.id)
            img.src = michi.image.url;
            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article);

        });
    }
}

async function saveFavouriteMichi(id) {
    const res = await fetch(API_URL_FAVOURITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image_id: id
        })
    });
    const data = await res.json();

    console.log('SAVE');
    console.log(res);

    if(res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        console.log('Michi guardado en favoritos');
        loadFavouriteMichis();
    }
}

async function deleteFavouriteMichi(id) {
    const res = await fetch(API_URL_FAVOURITES_DELETE(id), {
        method: 'DELETE'
    });
    const data = await res.json();

    if(res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        console.log('Michi eliminado de favoritos');
        loadFavouriteMichis();
    }
}

loadRandomMichis();
loadFavouriteMichis();