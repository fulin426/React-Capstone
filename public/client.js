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
const artist_name = 'Alesso';
const artist_id = 4329851;
const venue_id = 65;

function getCalendarData(searchTerm, callback) {
  let settings = {
    url:`https://api.songkick.com/api/3.0/artists/${artist_id}/calendar.json?apikey=${API_Key}`,
    dataType: 'json',
    type: 'GET',
    success: data => {
    	console.log(data.resultsPage.results.event);
      //venue ID
      console.log(data.resultsPage.results.event[0].venue.id);
    },
  };
  $.ajax(settings);
}

function getArtistData (searchTerm) {
    let settings = {
    url:`https://api.songkick.com/api/3.0/search/artists.json?apikey=${API_Key}&query=${artist_name}`,
    dataType: 'json',
    type: 'GET',
    success: data => {
      console.log(data.resultsPage.results.artist[0].id);
    },
  };
  $.ajax(settings);
}

function getVenueData (searchTerm) {
    let settings = {
    url:`https://api.songkick.com/api/3.0/venues/${venue_id}.json?apikey=${API_Key}`,
    dataType: 'json',
    type: 'GET',
    success: data => {
      console.log(data);
    },
  };
  $.ajax(settings);
}

const Event_Name = 'Alesso at XS Nightclub, the Wynn (June 16, 2018)';
const splits = Event_Name.split('(',2);
/*console.log(splits);*/

const time = '20:00:00';

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

/*console.log(convertAMPM(time));*/

$(getCalendarData);
$(getArtistData);
$(getVenueData); 