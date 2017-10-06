$(document).ready(function(){

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyCmxZPW0f95NhGPakxE416yTimGdjV4VrI",
		authDomain: "trending-news-tracker-f44b1.firebaseapp.com",
		databaseURL: "https://trending-news-tracker-f44b1.firebaseio.com",
		projectId: "trending-news-tracker-f44b1",
		storageBucket: "trending-news-tracker-f44b1.appspot.com",
		messagingSenderId: "338347845911"
	};

	firebase.initializeApp(config);

	// sets variables for firebase
	var database = firebase.database();
	var userName = "Eva";
	var userEmail = "me@email.com";
	var userTopic;
	var userCountry = "USA";
	var userFavArticleTitle = "This is the news.";


	// sets varibales for AJAX Call
	var searchBy = [];
	var searchByString = "";

	// arrays of topics
	var topics = ["Politics", "Money", "Entertainment", "Tech", "Sports"];
	
	// arrays of countries
	var countries = ["United States", "Canada", "Spain", "Russia", "Japan"];


	// creates the topic buttons buttons
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


	// when any topic is clicked do the following...
	$(document).on("click", "#topic-list li", function() {

		// resets news container
		$("#article-box").empty();

		// __________ Writes to FIREBASE _________
		// write to the firebase topic and country clicked
		userTopic = $(this).text();

	    // creates the data object to be written to firebase
		var user = {

			profile: {
				name : userName,
				email : userEmail
			},

			topicsPick: {
				topic : userTopic
			},

			countriesPick: {
				country : userCountry
			},

			favArticles : {
				title : userFavArticleTitle
			}

		};

		console.log(userTopic);

		// updates the object in the database
		database.ref("/users/").update(user);

		// __________ END Writes to FIREBASE _________


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

	        for ( var i=0; i < data.value.length; i++){

				var resultTopic = data.value[i];
				console.log(resultTopic);

				// returns data for the project constraints
				var publishedDate = resultTopic.datePublished;
				var rating; // (only return top results)

				// returns data and stores them in variables for displaying article
				var headline = resultTopic.name;
				var shortDescription = resultTopic.description;					
				var longDescription;
				var source = resultTopic.provider.name;
				var linkToArticle = resultTopic.url;
				// var imageArticle = resultTopic.image.thumbnail.contentUrl;

				// console.log(publishedDate, headline, shortDescription, linkToArticle);


				var headlineDiv = $("<h1>").text(headline);
				var shortDescriptionDiv = $("<div>").text(shortDescription);
				var sourceDiv = $("<div>").text(source);
				var urlDiv = $("<div>").text(linkToArticle);
				var publishedDateDiv = $("<div>").text(publishedDate);


				$("#article-box").append(headlineDiv);
				$("#article-box").append(publishedDate);
				$("#article-box").append(sourceDiv);
				$("#article-box").append(shortDescriptionDiv);


			}

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

