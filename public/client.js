const API_Key ='BNciuRNtRNFoYYJG';

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
  const errorMsg = `   
        <div class='events-row my-events' id='error-message'>      
          <p>No Results Found. Please try a different artist.</p>
        </div>`;  

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
        $('.my-search-results-container').prop('hidden', false).html(errorMsg);
        }
      },
      error: function() {
        $('.my-search-results-container').prop('hidden', false).html(errorMsg);
    },
  };
  $.ajax(settings);
}

function displaySearchResults(data) {
 return `   
        <div class='events-row my-events'>      
          <div class='col-3 date-time'>
            <p class='event-date'>${formateDate(data.start.date)}</p>
            <p class='event-time'>${ifNull(data.start.time)}</p>
          </div>
          <div class='col-6 event-info'>
            <p class='event-name'><a href='${data.uri}' class='url-event' target="_blank">${splitEventName(data.displayName)}</a></p>
            <p class='event-venue-name'><a href='${data.venue.uri}' class='url-venue' target="_blank">${data.venue.displayName}</a></p>
            <p class='event-city'>${data.location.city}</p>
          </div>
          <div class='col-3 event-add-button'>
            <p id='add-event-trigger'><i class="fas fa-plus-square fa-2x"></i></p>  
          </div>  
        </div>`;
}

function splitEventName(eventName)  {
  const splits = eventName.split('(',2);
  return splits[0];
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
  } else if (time =='') {
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
//Landing Page Log In
$('#login-trigger').on('click', event => {
  event.preventDefault();
    $('section').hide();
    $('#login-page').show();
});
//Landing Page Sign Up
$('#get-started-trigger').on('click', event => {
  event.preventDefault();
    $('section').hide();
    $('#login-page').hide();
    $('#sign-up-page').show();
});
//Not a Member? Sign Up
$('#login-form-signup-trigger').on('click', event => {
  event.preventDefault();
    $('section').hide();
    $('#sign-up-page').show();
});
//Already a member? Sign in
$('#login-form-login-trigger').on('click', event => {
  event.preventDefault();
    $('section').hide();
    $('#login-page').show();
});
//log into events page
$('#login-events-page').on('click', event => {
  event.preventDefault();
    //take the input from the user
    const email = $('#login-email').val();
    const password = $('#login-password').val();
        //validate the input
        if (email === '') {
            alert('Please Add Valid Email');
        } else if (password === '') {
            alert('Please Add Valid Password');
        } 

        //if the input is valid
        else {
            //create a login user object
            const loginUserObject = {
                email: email,
                password: password
            };
            // send the user object to the api call
            $.ajax({
                type: 'POST',
                url: '/users/login',
                dataType: 'json',
                data: JSON.stringify(loginUserObject),
                contentType: 'application/json'
            })
            //if the api call is succefull
            .done(function (result) {
                //display the results
                console.log(result);          
                //hide all the sections
                $('section').hide();
                $('.my-results-header').hide();
              /*  $('.artist-edit-input-container').hide();*/
                //show events page
                $('#my-events-page').show();
                $('.loggedin-user').val(result.email);
                displayMyEvents(result.email);
            })
            //if the api call is NOT succefull
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('Please Check Username and Password');
            });
        };
});
//sign up new account
$('#signup-events-page').on('click', event => {
  event.preventDefault();
    const email = $('#signup-email').val();
    const password = $('#signup-password').val();
        //validate the input
        if (email === '') {
            alert('Please Add Valid Email');
        } else if (password === '') {
            alert('Please Add Valid Password');
        } 
        //if the input is valid
        else {
            //create a new user object
            const newUserObject = {
                email: email,
                password: password
            };
            // send the user object to the api call
            $.ajax({
                type: 'POST',
                url: '/users/create',
                dataType: 'json',
                data: JSON.stringify(newUserObject),
                contentType: 'application/json'
            })
            //if the api call is succefull
            .done(function (result) {
                //display the results
                alert(`${result.email} created`);               
                //hide all the sections
                $('section').hide();
                //show events page only
                $('#my-events-page').show();
            })
            //if the api call is NOT succefull
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
        };

});

//Favorite Artist Trigger
$('.artist-trigger').on('click', event => {
  event.preventDefault();
  const favoriteArtist = $(event.target).text();
  $('.events-search-bar').val('');
  $('.events-search-bar').val(favoriteArtist);
});

//Favorite Artist edit function Trigger
$('.artist-edit').on('click', event => {
  event.preventDefault();
  $('.artist-edit-input-container').show();
  const favoriteArtist = $(event.target).closest('.favorites-artist-container').find('.artist-trigger').text();
  console.log(favoriteArtist);
  $('.artist-edit-input').val('');
  $('.artist-edit-input').val(favoriteArtist);
});

$('.edit-artist-proceed').on('click', event => {
  event.preventDefault();

});

$('.edit-artist-cancel').on('click', event => {
  event.preventDefault();
$('.artist-edit-input-container').hide();
});

//Search for Artist
$('.events-search-button').on('click', event => {
  event.preventDefault();
  let artist = $('.events-search-bar').val();
  getArtistData (artist);
  $('.my-results-header').show();
});

//add event
$('.my-search-results-container').on('click', '.fa-plus-square', function(event) {
    event.preventDefault();
    const newDate = $(event.target).closest('.my-events').find('.event-date').text();
    const newTime = $(event.target).closest('.my-events').find('.event-time').text();
    const newVenueName = $(event.target).closest('.my-events').find('.event-venue-name').text();
    const newEventName = $(event.target).closest('.my-events').find('.event-name').text();
    const newCity = $(event.target).closest('.my-events').find('.event-city').text();
    const newVenueURL = $(event.target).closest('.my-events').find('.url-venue').attr('href');
    const newEventURL = $(event.target).closest('.my-events').find('.url-event').attr('href');
    const loggedInUser = $('.loggedin-user').val();
    
    const newEventObject = {
        user: loggedInUser,
        date: newDate,
        time: newTime,
        venueName: newVenueName,
        eventName: newEventName,
        city: newCity,
        eventurl: newEventURL,
        venueurl: newVenueURL
    };
    $.ajax({
        type: 'POST',
        url: '/event/create',
        dataType: 'json',
        data: JSON.stringify(newEventObject),
        contentType: 'application/json'
    })
    .done(function(result) {
      console.log(result);
      displayMyEvents(result.user);
      $(event.target).closest('.my-events').hide();
    })
    .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });
    ;
  });

function displayMyEvents(loggedInUser) {
    let result = $.ajax({
                /* update API end point */
                url: "/event/get/"+ loggedInUser,
                dataType: "json",
                type: "GET"
            })
            .done(function (result) {  
            console.log(result);
             let buildTable = '';             
                $.each(result, function (resulteKey, resulteValue) {
                    buildTable += '<div class="events-row my-events">';
                    buildTable += `<input type="hidden" name="event-id" class="event-id" value="${resulteValue._id}">`;
                    buildTable += '<div class="col-3 date-time">';
                    buildTable += `<p class="event-date">${resulteValue.date}</p>`;
                    buildTable += `<p class="event-time">${ifNull(resulteValue.time)}</p>`;
                    buildTable += '</div>';
                    buildTable += '<div class="col-6 event-info">';
                    buildTable += `<p class="event-name"><a href="${resulteValue.eventurl}" class="url-event" target="_blank">${resulteValue.eventName}</a></p>`;
                    buildTable += `<p class="event-venue-name"><a href="${resulteValue.venueurl}" class="url-venue" target="_blank">${resulteValue.venueName}</a></p>`;
                    buildTable += `<p class="event-city">${resulteValue.city}</p>`;
                    buildTable += '</div>';
                    buildTable += '<div class="col-3 event-delete-button">';
                    buildTable += '<p id="delete-event-trigger" class="delete-button"><i class="fas fa-trash-alt fa-2x"></i></p> ';
                    buildTable += '</div>';
                    buildTable += '</div>';
                });
                $('.my-saved-events-container').html(buildTable);
            })
            /* if the call is NOT successful show errors */
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
}
//delete event
$('.my-saved-events-container').on('click', '.delete-button', function(event) {
    event.preventDefault();
    const loggedInUser = $('.loggedin-user').val();
    let eventId = $(event.target).closest('.my-events').find('.event-id').val();
    console.log(eventId);
    $.ajax({
        type: 'DELETE',
        url: `/event/delete/${eventId}`
    })
    .done(function (result) {
            displayMyEvents(loggedInUser);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
});

             
          
            
            


