document.addEventListener('DOMContentLoaded', () => {
    const audioList = document.getElementById('audioList');
    const favList = document.getElementById('favList');
    const newMusicInput = document.getElementById('newMusic');
    const addMusicButton = document.getElementById('addAudios');

    // function queries music from the iTunes Api and returns the results as an array
   async function fetchMusic(query) {
        try {
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music`);
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.log("Error getting audios");
        }
    }

    // function to create/populate a list of usic in the unorderded list declared in the html file
    function createListItem(music, isFavorite = false) {
        const li = document.createElement('li');
        li.textContent = `${music.trackName} by ${music.artistName}`;//returns the audio name together with the artists name

        const audio = document.createElement('audio');//creates a new element audio
        audio.controls = true;// the controls are play,pause,volume
        audio.src = music.previewUrl;//picks the music from the preview URL of the song

        if (!isFavorite) {
            const addFavButton = document.createElement("button");
            addFavButton.textContent = 'Add to Favorites';
            addFavButton.addEventListener('click', () => {//an event listener that listens when the add to fav button is clicked
                const favLi = createListItem(music, true);
                favList.appendChild(favLi);//if  a song is addeded to the favourite list, it is added to a new list which contains only favourite songs
            });

            //add a delete button to implement Delete in CRUD in the fav list also
            const deleteButton = document.createElement("button");
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => audioList.removeChild(li));

            li.appendChild(audio);
            li.appendChild(addFavButton);
            li.appendChild(deleteButton);
        } else {
            const removeFavButton = document.createElement('button');
            removeFavButton.textContent = 'Remove';
            removeFavButton.addEventListener('click', () => favList.removeChild(li));
            li.appendChild(audio);
            li.appendChild(removeFavButton);
        }

        return li;
    }

    // Event listener for adding music to the list
    addMusicButton.addEventListener('click', async () => {
        const query = newMusicInput.value.trim();
        if (query) {
            // clear previously searchd music
            audioList.innerHTML = '';

            const musicData =await fetchMusic(query);
            if (musicData.length === 0) {
                alert("No music querried");
                return;
            }
            musicData.forEach(music => {
                const li = createListItem(music);
                audioList.appendChild(li);
            });
            newMusicInput.value = '';
        } else {
            alert('Please enter music to querry');
        }
    });
});