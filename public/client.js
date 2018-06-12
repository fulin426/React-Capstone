//https://www.google.com/maps/search/?api=1&query=99+Grove+Street

//Upcoming Events Calendar
//https://api.songkick.com/api/3.0/artists/{artist_id}/calendar.json?apikey={your_api_key}
//displayName "Alesso" id: 4329851

//Artist Search
//https://api.songkick.com/api/3.0/search/artists.json?apikey={your_api_key}&query={artist_name}

//Venue Search
//https://api.songkick.com/api/3.0/venues/{venue_id}.json?apikey={your_api_key}

//Similar Artists
//https://api.songkick.com/api/3.0/artists/{artist_id}/similar_artists.json?apikey={your_api_key}

const API_Key ='mtLUgpC0c49wQgiQ';

function getArtistData (searchTerm) {
    let settings = {
    url:`https://api.songkick.com/api/3.0/search/artists.json?apikey=${API_Key}&query=${searchTerm}`,
    dataType: 'json',
    type: 'GET',
    success: data => {
      const artistID = data.resultsPage.results.artist[0].id;
      getCalendarData(artistID);
    },
  };
  $.ajax(settings);
}

function getCalendarData(artistID) {
  let settings = {
    url:`https://api.songkick.com/api/3.0/artists/${artistID}/calendar.json?apikey=${API_Key}`,
    dataType: 'json',
    type: 'GET',
    success: data => {
      console.log(data);
      try { 
        let searchResults = data.resultsPage.results.event.map((item, index) => displaySearchResults(item));
      $('.my-search-results-container').html(searchResults);
      } catch (error) {
        $('.my-search-results-container').prop('hidden', false).html("<div class='error_result'><p>Sorry! No Results Found.</p></div>");
        }
      },
      error: function() {
        $('.my-search-results-container').prop('hidden', false).html("<div class='error_result'><p>Sorry! No Results Found.</p></div>");
      //venue ID
      console.log(data.resultsPage.results.event[0].venue.id);
    },
  };
  $.ajax(settings);
}

function getVenueData (data) {
    let settings = {
    url:`https://api.songkick.com/api/3.0/venues/${data.resultsPage.results.event[0].venue.id}.json?apikey=${API_Key}`,
    dataType: 'json',
    type: 'GET',
    success: data => {
      console.log(data);
      //Venue Name
      console.log(data.resultsPage.results.venue.displayName);
      //Street
      console.log(data.resultsPage.results.venue.street);
      //City
      console.log(data.resultsPage.results.venue.city.displayName);
      //State
      console.log(data.resultsPage.results.venue.city.state.displayName);
      //Zip
      console.log(data.resultsPage.results.venue.zip);
      //Venue Link
      console.log(data.resultsPage.results.venue.website);
    },
  };
  $.ajax(settings);
}

function displaySearchResults(data) {
 return `   
        <div class='events-row my-events'>      
          <div class='col-3 date-time'>
            <p>${formateDate(data.start.date)}</p>
            <p>${ifNull(data.start.time)}</p>
          </div>
          <div class='col-6 event-info'>
            <p><a href='${data.uri}'>${splitEventName(data.displayName)}</a></p>
            <p><a href='${data.venue.uri}'>${data.venue.displayName}</a></p>
            <p>${data.location.city}</p>
            <p><a href='#'></a>
          </div>
          <div class='col-3 event-add-button'>
            <p id='add-event-trigger'><i class="fas fa-plus-square fa-2x"></i></p>  
          </div>  
        </div>`;
}

const Event_Name = 'Alesso at XS Nightclub, the Wynn (June 16, 2018)';
function splitEventName(eventName)  {
  const splits = eventName.split('(',2);
  return splits[0];
}

function splitDate(eventName)  {
  const splits = eventName.split('(',2);
  const date = splits[1].split(')',2)
  return date[0];
}

function formateDate(data) {
  return `${data.slice(5, 10)}-${data.slice(0,4)}`;
}


//Convert from military time
function convertAMPM(time) {
  let time_split = time.split(':');
  let hours = parseInt(time_split[0]);
  let minutes = parseInt(time_split[1]);
  let seconds = parseInt(time_split[2]);

  let convertedTime = '';
    if (hours > 0 && hours <= 12) {
      convertedTime= "" + hours;
    } else if (hours > 12) {
      convertedTime= "" + (hours - 12);
    } else if (hours == 0) {
      convertedTime= "12";
    }
  convertedTime += (minutes < 10) ? ":0" + minutes : ":" + minutes; 
  convertedTime += (hours >= 12) ? " PM" : " AM";
  return convertedTime;
};

function ifNull(time) {
  if(time == null) {
    return '';
  } else {
    let newTime = convertAMPM(time)
    return newTime;
  }
}

//Triggers
/*$(document).ready(function () {
  $('section').hide();
  $('#landing-page').show();
});*/
//Log In
$('#login-trigger').on('click', event => {
  event.preventDefault();
    $('section').hide();
    $('footer').hide();
    $('#login-page').show();
});
//Sign Up
$('#get-started-trigger').on('click', event => {
  event.preventDefault();
    $('section').hide();
    $('footer').hide();
    $('#sign-up-page').show();
});
//Not a Member? Sign Up
$('#login-form-signup-trigger').on('click', event => {
  event.preventDefault();
    $('section').hide();
    $('footer').hide();
    $('#sign-up-page').show();
});
//Already a member? Sign in
$('#get-started-trigger').on('click', event => {
  event.preventDefault();
    $('section').hide();
    $('footer').hide();
    $('#login-page').show();
});
//log into events page
$('#login-events-page').on('click', event => {
  event.preventDefault();
    $('section').hide();
    $('footer').hide();
    $('#my-events-page').show();
});

$('#signup-events-page').on('click', event => {
  event.preventDefault();
    $('section').hide();
    $('footer').hide();
    $('#my-events-page').show();
});

//Search for Artist
$('.events-search-button').on('click', event => {
  event.preventDefault();
  let artist = $('.events-search-bar').val();
  getArtistData (artist);
});