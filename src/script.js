let buttons = [];

    function getAnimeData(animeId) {
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

    function generateCode() {
  const animeId = document.getElementById('animeId').value;
  let selectedResolutions, selectedTypes; // Declare the variables here

  getAnimeData(animeId)
    .then(data => {
      // Populate the selectedResolutions and selectedTypes variables
      selectedResolutions = Array.from(document.getElementById('resolutionSelect').selectedOptions).map(option => option.value);
      selectedTypes = Array.from(document.getElementById('typeSelect').selectedOptions).map(option => option.value);
      
      // Modify the score to be on a 0 to 100 scale
      modifiedScore = data.data.score * 10;

      // Display data in generatedDataBox1
      const generatedDataBox1 = document.getElementById('generatedDataBox1');
      generatedDataBox1.textContent = data.data.title;

      // Display data in generatedDataBox2
      const generatedDataBox2 = document.getElementById('generatedDataBox2');
      generatedDataBox2.textContent = `${data.data.type}, ${data.data.status} ${data.data.genres.map(genre => genre.name).join(', ')}, ${data.data.themes.map(theme => theme.name).join(', ')}, ${data.data.demographics.map(demographic => demographic.name).join(', ')},${data.data.producers.map(producer => producer.name).join(', ')},${data.data.licensors.map(licensor => licensor.name).join(', ')},${data.data.studios.map(studio => studio.name).join(', ')},${selectedTypes.join(', ')},${selectedResolutions.join(', ')}`;

      // Generate the full HTML code and display it in the original generatedCodeBox
      const code = generateHTMLCode(data, selectedResolutions, selectedTypes);
      document.getElementById('generatedCode').textContent = code;
    })
    .catch(error => {
      console.error(error);
    });
}



    function generateHTMLCode(data, selectedResolutions, selectedTypes) {
      let buttonsHTML = '';
      for (const button of buttons) {
        buttonsHTML += `<a class="shortc-button small blue" href="${button.url}">${button.title}</a>`;
      }

      const code = `
        <div>
          <a><img border="0" data-original-height="450" data-original-width="800" height="360" src="" width="640" /></a>
        </div>

        <div class="review_wrap">
          <div class="review-box review-bottom review-percentage" id="review-box">
            <h2 class="review-box-header the-global-title">${data.data.title}</h2>
            
            <div class="review-item">
        <span
          ><h5>MyAnimeList - ${data.data.score}</h5>
          <span style="width:${modifiedScore}" data-width="${modifiedScore}"></span
        ></span>
            </div>
            
            <div class="review-summary">
              <div class="review-final-score">
                <h3>${data.data.score}</h3>

                <h4>Average Rating</h4>
              </div>

              <div class="review-short-summary">
                <p>${data.data.synopsis}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="toggle tie-sc-open">
          <h3 class="toggle-head">
            Information <span class="fa fa-angle-down"></span>
          </h3>
          <div class="toggle-content">
            <ul style="text-align: left;">
              <li>English: ${data.data.title_english}</li>
              <li>Japanese: ${data.data.title_japanese}</li>
              <li>Synonyms: ${data.data.title_synonyms.join(', ')}</li>
              <li>Type: ${data.data.type}</li>
              <li>Episodes: ${data.data.episodes}</li>
              <li>Status: ${data.data.status}</li>
              <li>Aired: ${data.data.aired.string}</li>
              <li>Season: ${data.data.season}</li>
              <li>Broadcast: ${data.data.broadcast.string}</li>
              <li>Producers: ${data.data.producers.map(producer => `<a href="/${producer.name}">${producer.name}</a>`).join(', ')}</li>
              <li>Licensors: ${data.data.licensors.map(licensor => `<a href="/${licensor.name}">${licensor.name}</a>`).join(', ')}</li>
              <li>Studios: ${data.data.studios.map(studio => `<a href="/${studio.name}">${studio.name}</a>`).join(', ')}</li>
              <li>Source: ${data.data.source}</li>
              <li>Genres: ${data.data.genres.map(genre => `<a href="/label/${genre.name}">${genre.name}</a>`).join(', ')}</li>
              <li>Themes: ${data.data.themes.map(theme => theme.name).join(', ')}</li>
              <li>Demographics: ${data.data.demographics.map(demographic => demographic.name).join(', ')}</li>
              <li>Duration: ${data.data.duration}</li>
              <li>Rating: ${data.data.rating}</li>
              <li>Resolution: ${selectedResolutions.map(resolution => `<a href="/label/${resolution}">${resolution}</a>`).join(', ')}</li>
              <li>Type: ${selectedTypes.map(Type => `<a href="/label/${Type}">${Type}</a>`).join(', ')}</li>
            </ul>
          </div>
        </div>

        <div class="box download">
          <div class="box-inner-block">
            <span class="fa tie-shortcode-boxicon"></span>To access the private drive just open Google Group and join the Google Group, ignore the rest.<br />
            After that, Enjoy&#8230; <a href="https://groups.google.com/g/bondgreninja" target="_blank" rel="noopener">Here</a>
          </div>
        </div>

        <div class="toggle tie-sc-open">
          <h3 class="toggle-head">
            Google Drive <span aria-hidden="true" class="fa fa-angle-down"></span>
          </h3>
          <div class="toggle-content" style="text-align: center;">
            ${buttonsHTML}
          </div>
        </div>`;

      return code;
    }

    function addButton() {
      const title = prompt('Enter button title:');
      const url = prompt('Enter button URL:');

      buttons.push({ title, url });

      const addedButtons = document.getElementById('addedButtons');
      const buttonElement = document.createElement('button');
      buttonElement.textContent = title;
      buttonElement.onclick = () => {
        editButton(title, url);
      };
      addedButtons.appendChild(buttonElement);

      const codeBox = document.getElementById('generatedCodeBox');
      const code = generateHTMLCode();
      codeBox.textContent = code;
    }

    function editButton(title, url) {
      const newTitle = prompt('Enter new button title:', title);
      const newUrl = prompt('Enter new button URL:', url);

      const button = buttons.find(btn => btn.title === title && btn.url === url);
      if (button) {
        button.title = newTitle;
        button.url = newUrl;
      }

      const codeBox = document.getElementById('generatedCodeBox');
      const code = generateHTMLCode();
      codeBox.textContent = code;
    }

    function copyGeneratedCode() {
      const codeBox = document.getElementById('generatedCodeBox');
      const range = document.createRange();
      range.selectNode(codeBox);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      alert('Code copied to clipboard!');
          }
