let buttons = [];

    function getData(animeId) {
      let url = `https://api.jikan.moe/v4/anime/${animeId}`;
      return fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch anime data.');
          }
        });
    }

    function getCharacterData(animeId) {
      let characterUrl = `https://api.jikan.moe/v4/anime/${animeId}/characters`;
      return fetch(characterUrl)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch character data.');
          }
        });
    }
    
    function getStaffData(animeId) {
      let staffUrl = `https://api.jikan.moe/v4/anime/${animeId}/staff`;
      return fetch(staffUrl)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch staff data.');
          }
        });
    }
    
    
    function getThemesData(animeId) {
  let themesUrl = `https://api.jikan.moe/v4/anime/${animeId}/themes`;
  return fetch(themesUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch themes data.');
      }
    });
}


    function getEpisodesData(animeId) {
  let episodesUrl = `https://api.jikan.moe/v4/anime/${animeId}/episodes`;
  return fetch(episodesUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch episodes data.');
      }
    });
}
    
    
    function generateCode() {
      const animeId = document.getElementById('animeId').value;
      let selectedResolutions, selectedTypes; // Declare the variables here

      getData(animeId)
        .then(Data => {
          // Populate the selectedResolutions and selectedTypes variables
          selectedResolutions = Array.from(document.getElementById('resolutionSelect').selectedOptions).map(option => option.value);
          selectedTypes = Array.from(document.getElementById('typeSelect').selectedOptions).map(option => option.value);
          
          
          // Display data in generatedDataBox1 and generatedDataBox2
          const generatedDataBox1 = document.getElementById('generatedDataBox1');
          generatedDataBox1.textContent = Data.data.title;

          const generatedDataBox3 = document.getElementById('generatedDataBox3');
          generatedDataBox3.textContent = Data.data.synopsis;
          
          const generatedDataBox4 = document.getElementById('generatedDataBox4');
          generatedDataBox4.textContent = Data.data.score;

          const generatedDataBox2 = document.getElementById('generatedDataBox2');
          generatedDataBox2.innerHTML = `<strong>Genres: </strong>${Data.data.genres.map(genre => genre.name).join(', ')},<br/> <strong>Themes: </strong>${Data.data.themes.map(theme => theme.name).join(', ')},<br/> <strong>Demography</strong>${Data.data.demographics.map(demographic => demographic.name).join(', ')},<br/> <strong>Licensors</strong>${Data.data.licensors.map(licensor => licensor.name).join(', ')},<br/> <strong>Studios</strong>${Data.data.studios.map(studio => studio.name).join(', ')}`;

generatedDataBox2.style.display = 'block';
            

            
          // Fetch character and staff data
          return Promise.all([
            getCharacterData(animeId),
            getStaffData(animeId),
            getThemesData(animeId),
            getEpisodesData(animeId)
          ])
          .then(([characterData, staffData, themesData, episodesData]) => {
            // Generate the full HTML code and display it in the original generatedCodeBox
            const code = generateHTMLCode(Data, characterData, staffData, themesData, episodesData, selectedResolutions, selectedTypes, modifiedScore);
            document.getElementById('generatedCode').textContent = code;
          });
        })
        .catch(error => {
          console.error(error);
        });
    }

    function generateHTMLCode(Data, characterData, staffData, themesData, episodesData, selectedResolutions, selectedTypes, modifiedScore) {
      let buttonsHTML = '';
      for (const button of buttons) {
        buttonsHTML += `<a class="shortc-button small blue" href="${button.url}">${button.title}</a>`;
      }

       const themes = themesData.data;
       const episodes = episodesData.data;
       
       
       // Format opening and ending themes data
  const formattedOpenings = themes.openings.map((theme, index) => `<strong>OP${index + 1}</strong>: ${theme}`).join('<br>');
  const formattedEndings = themes.endings.map((theme, index) => `<strong>ED${index + 1}</strong>: ${theme}`).join('<br>');

      const japaneseVoiceActors = characterData.data
  .filter(character => character.voice_actors.some(va => va.language === "Japanese"))
  .slice(0, 4)
  .map(character => {
    const japaneseVAs = character.voice_actors.filter(va => va.language === "Japanese");
    // Access only the first Japanese voice actor
    const firstJapaneseVA = japaneseVAs[0];
    return `
      <strong><a href="${character.character.url}" target="_blank" rel="noopener nofollow">${character.character.name}</a></strong> – <a href="${firstJapaneseVA.person.url}" target="_blank" rel="noopener nofollow">${firstJapaneseVA.person.name}</a><br />
    `;
  })
  .join('');
  

      const staff = staffData.data
        .slice(0, 4)
        .map(staffMember => {
          const position = staffMember.positions[0];
          return `
            <strong><a href="${staffMember.person.url}" target="_blank" rel="noopener nofollow">${staffMember.person.name}</a></strong> – ${position}<br />
          `;
        })
        .join('');
        
        // Format episode list
  const formattedEpisodes = episodes.map((episode) => {
    const episodeNumber = episode.mal_id;
    const episodeTitle = episode.title;
    return `<strong>${episodeNumber}</strong>: ${episodeTitle}<br>`;
  }).join('');

      const code = `
   [toggle title="Information" state="open"]
              <strong>English:</strong> ${Data.data.title_english}<br />
              <strong>Japanese:</strong> ${Data.data.title_japanese}<br />
              <strong>Synonyms:</strong> ${Data.data.title_synonyms.join(', ')}<br />
              <strong>Type:</strong> ${Data.data.type}<br />
              <strong>Episodes:</strong> ${Data.data.episodes}<br />
              <strong>Status:</strong> <a href="/search/label/${Data.data.status.replace(/Currently Airing/g, "Airing").replace(/Finished Airing/g, "Completed")}">${Data.data.status.replace(/Currently Airing/g, "Airing").replace(/Finished Airing/g, "Completed")}</a><br />
              <strong>Aired:</strong> ${Data.data.aired.string}<br />
              <strong>Season:</strong> ${Data.data.season}<br />
              <strong>Broadcast:</strong> ${Data.data.broadcast.string}<br />
              <strong>Producers:</strong> ${Data.data.producers.map(producer => producer.name).join(', ')}<br />
              <strong>Licensors:</strong> ${Data.data.licensors.map(licensor => `<a href="/search/label/${licensor.name}">${licensor.name}</a>`).join(', ')}<br />
              <strong>Studios:</strong> ${Data.data.studios.map(studio => `<a href="/search/label/${studio.name}">${studio.name}</a>`).join(', ')}<br />
              <strong>Source:</strong> ${Data.data.source}<br />
              <strong>Genres:</strong> ${Data.data.genres.map(genre => `<a href="/search/label/${genre.name}">${genre.name}</a>`).join(', ')}<br />
              <strong>Themes:</strong> ${Data.data.themes.map(theme => `<a href="/search/label/${theme.name}">${theme.name}</a>`).join(', ')}<br />
              <strong>Demographics:</strong> ${Data.data.demographics.map(demographic => `<a href="/search/label/${demographic.name}">${demographic.name}</a>`).join(', ')}<br />
              <strong>Duration:</strong> ${Data.data.duration}<br />
              <strong>Rating:</strong> ${Data.data.rating}<br />
              <strong>Resolution:</strong> ${selectedResolutions.map(resolution => `<a href="/search/label/${resolution}">${resolution}</a>`).join(', ')}<br />
              <strong>Type:</strong> ${selectedTypes.map(Type => `<a href="/search/label/${Type}">${Type}</a>`).join(', ')}<br />
          [/toggle]
        
   [toggle title="Characters &amp; Voice Actors" state="close"]
      ${japaneseVoiceActors}
      <a style="float: right;" href="${Data.data.url}/characters" target="_blank" rel="noopener nofollow">More &gt;&gt;</a><br>
   [/toggle]
   [toggle title="Staff" state="close"]
      ${staff}
      <a style="float: right;" href="${Data.data.url}/characters#staff" target="_blank" rel="noopener nofollow">More &gt;&gt;</a><br>
   [/toggle]
  
   [toggle title="Theme Songs" state="close"]
        ${formattedOpenings}<br><br />
        ${formattedEndings}<br>
   [/toggle]
    
   [toggle title="Episode List" state="close"]
        ${formattedEpisodes}
   [/toggle]
    
   [toggle title="Trailer" state="close"]
      <iframe width="420" height="345" src="https://www.youtube.com/embed/${Data.data.trailer.youtube_id}"></iframe>
   [/toggle]
  
   [box type="info" align="alignright" width=""]To access the private drive just open Google Group and join the Google Group, ignore the rest.<br />
            After that, Enjoy&#8230; <a href="https://groups.google.com/g/animekaizoku" target="_blank" rel="noopener">Click Here</a>
   [/box]
        
  
   [toggle title="Google Drive" state="open"]
            ${buttonsHTML}
   [/toggle]
        `;

      return code;
    }

    function addButton() {
      const title = prompt('Enter button title:');
      const url = prompt('Enter button URL:');
      if (title && url) {
        buttons.push({ title, url });
        const addedButtons = document.getElementById('addedButtons');
        addedButtons.innerHTML = '';
        for (const button of buttons) {
          addedButtons.innerHTML += `<button>${button.title}</button>`;
        }
      }
    }

    function copyGeneratedCode() {
      const generatedCode = document.getElementById('generatedCode');
      const range = document.createRange();
      range.selectNode(generatedCode);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      alert('Code copied to clipboard!');
    }
