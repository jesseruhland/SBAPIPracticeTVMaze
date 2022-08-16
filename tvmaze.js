"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


async function getShowsByTerm(term) {
  let shows = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  return shows.data;
  
}


function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    try {
      const $show = $(
        `<div data-show-id="${show.show.id}" class="card Show col-md-12 col-lg-6 mb-4" style="width: 18rem;">
          <img 
            src="${show.show.image.original}" 
            alt="${show.show.name}" 
            class="card-img-top mt-2">
          <div class="card-body">
            <h5 class="card-title text-primary">${show.show.name}</h5>
            <div class="card-text"><small>${show.show.summary}</small></div>
          </div>
            <button id="${show.show.id}" data-toggle="modal" data-target="#exampleModalLong" class="btn btn-outline-primary btn-block mb-2 Show-getEpisodes">
             Episodes
            </button>
        </div> 
      `);

      $showsList.append($show);  
    } catch (e) {
        const $show = $(
          `<div data-show-id="${show.show.id}" class="card Show col-md-12 col-lg-6 mb-4" style="width: 18rem;">
            <img 
                src="https://tinyurl.com/tv-missing" 
                alt="${show.show.name}" 
                class="card-img-top mt-2">
            <div class="card-body">
              <h5 class="card-title text-primary">${show.show.name}</h5>
              <div class="card-text"><small>${show.show.summary}</small></div>
            </div>
              <button id="${show.show.id}" data-toggle="modal" data-target="#exampleModalLong" class="btn btn-outline-primary btn-block mb-2 Show-getEpisodes">
                 Episodes
              </button>
          </div> 
       `);

       $showsList.append($show);
    }
  }
}



async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
  $("#search-query").val('')
});

async function getEpisodes(id) {
  const result = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return result.data;
}

$('.row').on('click', 'button', async function(e) {
  const epList = await getEpisodes(e.target.id)
  populateEpisodes(epList);
})

function populateEpisodes(epList) {
  $('#episodes-list').empty();
  for (let ep of epList) {
    const newEpisode = document.createElement('li');
    newEpisode.innerHTML = `<b>${ep.name}</b> (Season ${ep.season}, Episode ${ep.number})`
    $('#episodes-list').append(newEpisode);
    $('#episodeModal').modal('toggle');
  }
}

$('#episodeModal').on('click', "button", function(){
  $('#episodeModal').modal('toggle');
})
