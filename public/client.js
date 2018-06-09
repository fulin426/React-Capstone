
//Upcoming Events Calendar
//https://api.songkick.com/api/3.0/artists/{artist_id}/calendar.json?apikey={your_api_key}
//displayName "Alesso" id: 4329851

//Artist Search
//https://api.songkick.com/api/3.0/search/artists.json?apikey={your_api_key}&query={artist_name}

//Venue Search
//https://api.songkick.com/api/3.0/venues/{venue_id}.json?apikey={your_api_key}

const API_Key ='mtLUgpC0c49wQgiQ';
const artist_name = 'Alesso';
const artist_id = 4329851;

function getDataFromApi(searchTerm, callback) {
  let settings = {
    url:`https://api.songkick.com/api/3.0/artists/${artist_id}/calendar.json?apikey=${API_Key}`,
    dataType: 'json',
    type: 'GET',
    success: data => {
    	console.log(data);
    	console.log(data.resultsPage.results.event);
    },
  };
  $.ajax(settings);
}

/*$(getDataFromApi);*/

const Event_Name = 'Alesso at XS Nightclub, the Wynn (June 16, 2018)';
const splits = Event_Name.split('(',2);
console.log(splits);

//https://www.google.com/maps/search/?api=1&query=99+Grove+Street

const time = '21:00:00';

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

console.log(convertAMPM(time));