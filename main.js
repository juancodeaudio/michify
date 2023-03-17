const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',

});

api.defaults.headers.common['X-API-KEY'] = 'live_GhxtDyAli6Mufch55wS50zsuTr0rGpXNHzBcX6mGDHJdeQhFnErkMhjXcPoa2d5X';

const API_URL_RANDOM = [
    'https://api.thecatapi.com/v1/images/search',
    '?limit=4'
].join('');
const API_URL_FAVOURITES = [
    'https://api.thecatapi.com/v1/favourites',
    '?limit=8'
].join('');
const API_URL_FAVOURITES_DELETE = (id) => [
    'https://api.thecatapi.com/v1/favourites',
    `/${id}`
].join('');
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('error');
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const img3 = document.getElementById('img3');
const img4 = document.getElementById('img4');
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const btn4 = document.getElementById('btn4');

const prev = document.getElementById('preview');
const prevContainer = document.getElementById('previewContainer');
const prevBtn = document.getElementById('previewBtn');
const bgLoader = document.getElementById('bgLoader');
const uploadStatus = document.getElementById('uploadStatus');


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
    const res = await fetch(API_URL_FAVOURITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': 'live_GhxtDyAli6Mufch55wS50zsuTr0rGpXNHzBcX6mGDHJdeQhFnErkMhjXcPoa2d5X'
        }
    });
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
    const {data, status} = await api.post('/favourites', {
        image_id: id
    });
    // const res = await fetch(API_URL_FAVOURITES, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-API-KEY': 'live_GhxtDyAli6Mufch55wS50zsuTr0rGpXNHzBcX6mGDHJdeQhFnErkMhjXcPoa2d5X'
    //     },
    //     body: JSON.stringify({
    //         image_id: id
    //     })
    // });
    // const data = await res.json();
    console.log('SAVE');
    console.log(data, status);

    if(status !== 200) {
        spanError.innerHTML = "Hubo un error: " + status + data.message;
    } else {
        console.log('Michi guardado en favoritos');
        loadFavouriteMichis();
    }
}

async function deleteFavouriteMichi(id) {
    const res = await fetch(API_URL_FAVOURITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': 'live_GhxtDyAli6Mufch55wS50zsuTr0rGpXNHzBcX6mGDHJdeQhFnErkMhjXcPoa2d5X'
        }
    });
    const data = await res.json();

    if(res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        console.log('Michi eliminado de favoritos');
        loadFavouriteMichis();
    }
}

async function uploadMichiPhoto() {
    
    const form = document.getElementById('uploadingForm');
    const file = document.getElementById("file").files;
    const formData = new FormData(form);

    console.log(formData.get('file'));

    if (file.length > 0) {
        bgLoader.style.display = "block";
    }
    try {
        const res = await fetch(API_URL_UPLOAD, {
            method: 'POST',
            headers: {
                'X-API-KEY': 'live_GhxtDyAli6Mufch55wS50zsuTr0rGpXNHzBcX6mGDHJdeQhFnErkMhjXcPoa2d5X' 
            },
            body: formData
        });
        const data = await res.json();
        console.log("Foto de michi cargada :)");
        console.log({ data });
        console.log(data.url);
        saveFavouriteMichi(data.id);
        uploadStatus.style.display = "block";
    } catch (err) {
        console.log('No funcionó', err);
        uploadStatus.style.display = "block";
        uploadStatus.style.backgroundColor = "#D35D6E";
        uploadStatus.innerHTML = "";
        uploadStatus.innerHTML = "Error uploading";
    } finally {
        window.setTimeout(() => uploadStatus.style.display = "none", 2000);
        emptyForm();
        console.log('Done');
    }
    
}

function emptyForm() {
    const file = document.getElementById("file");
    file.value = '';
    console.log('file deleted');
    prevContainer.style.display = "none";
    bgLoader.style.display = "none";

}

const previewImage = () => {
    const file = document.getElementById("file").files;
    const imageInfo = document.getElementById("imageInfo");
    console.log(file);
    if (file.length > 0) {
      const fileReader = new FileReader();
  
      fileReader.onload = function(e) {
        prev.setAttribute("src", e.target.result);
        imageInfo.innerHTML = file[0].name;
        prevContainer.style.display = "block";
      };
      fileReader.readAsDataURL(file[0]);
    }
  }

loadRandomMichis();
loadFavouriteMichis();