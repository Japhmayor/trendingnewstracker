// Last edit by Grant

$(document).ready(function(){

	// arrays of topics
	var topics = ["Politics", "Money", "Entertainment", "Tech", "Sports"];
	
	// arrays of countries
	var countries = ["United States", "Canada", "Spain", "Russia", "Japan"];

	// creates the buttons
	var renderTopics = function(){
		// loops through the topics and appends to the markup
		for ( i = 0; i < topics.length; i++ ) {
			// creates new list elements
			var topicList = $("<li>");

			// sets their inner text
			topicList.text(topics[i]);

			// adds to the ul element
			$("#topic-list").append(topicList);
		}
	}

	// creates the list of countries as links
	var renderCountries = function(){
		// loops through the countries and appends to the markup
		for ( i = 0; i < countries.length; i++ ) {
			//creates a list of countries in array
			var countryList = $("<li>");

			//allows the list to be links
			var countryLink = $("<a>");
			
			//adds a url to link tag
			countryLink.attr("href", "");
			
			//makes link text have css
			countryLink.css("color", "red");
			
			//sets the inner text of the links
			countryLink.text(countries[i]);
			
			//appends the links to the list
			countryList.append(countryLink);
			
			//adds to the ul element
			$("#country-list").append(countryList);
		}

	}



	// sets the limit of articles


	// when any topic is clicked do the following...
	$(document).on("click", "#topic-list li", function() {
		// ******TO DO resets news container
		console.log("Click Registered");
		var topicText = $(this).text();
		searchResults(topicText);
		searchFunction();

	})

	// calls the render functions
	renderTopics();
	renderCountries();

})


var searchBy = [];
var searchByString = "";

var searchResults = function(string){

	
	console.log("searchResults string: " + string);

	searchBy.push(string);


}

var limit = 10;

// News AJAX Call
function searchFunction() {
	// Turns the searchBy array into a string
	searchByString = searchBy.toString("");
	console.log("searchByString: " + searchByString);
	
    var params = {
        // Request parameters
        "q": searchByString,
        "count": limit,
        "offset": "0",
        "mkt": "en-us",
        "safeSearch": "Moderate",
    };
  
    $.ajax({
        url: "https://api.cognitive.microsoft.com/bing/v5.0/news/search?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a3f99e8021864f3f8221c9be74777427");
        },
        type: "GET",
        // Request body
        // data: params,
    })
    .done(function(data) {
        console.log("searchFunction success: " + searchByString);
        console.log(data);


    })
    .fail(function() {
        alert("error");
    });

};

function myMap() {
  var mapOptions = {
    // This puts the map in the center of the world
    center: new google.maps.LatLng(0.00, 0.00),
    // Slightly zoomed in
    zoom: 2,
    // Shows the map as a roadmap vs a satellite map
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  // Uses the div with the ID of "map"
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  var geocoder = new google.maps.Geocoder();
  google.maps.event.addListener(map, 'click', function(event) {
    geocoder.geocode({
      'latLng': event.latLng
    }, function(results, status) {
      // If you want to see the full array of results, uncomment the next line
      //console.log(results);
      if (status == google.maps.GeocoderStatus.OK) {
        // Sometimes the the formatted_address just returns a country. Other times it shows a location or state, plus the country. This grabs the last formatted_address and splits the address fields using a comma as a delimiter.
        var addressString = results[(results.length-1)].formatted_address;
        var stringSplit = addressString.split(",");
        // This stores the country clicked to a var
        var countryString = stringSplit[(stringSplit.length-1)];
        // This console logs the var 
        console.log("Country Clicked: " + countryString);
        searchResults(countryString);
        searchFunction();
      }
    });
  });
}

