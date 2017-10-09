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

	// when any topic is clicked do the following...
	$(document).on("click", "#topic-list li", function() {

		// resets news container
		$("#article-box").empty();
		console.log("Click Registered");

		var currentTopic = $(this).text();

		// adds current topic to the taginput
		$("#search-input").tagsinput('add', currentTopic);



		// *****  Writes to Firebase *****
		// writes to the firebase based on the topic and country clicked
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

	}); // ends click event

	// calls the render buttons
	renderTopics(topics);

	// initializes tags input and limits the search tags
	$("#search-input").tagsinput({
		maxTags: 4
	});

	// calls search function after an item is added
	$("#search-input").on("itemAdded", search);
	// calls search function after an item is removed
	$("#search-input").on("itemRemoved", search);

	// calls search when search button is clicked
	$("#search-btn").on("click", search);
	
}); // ***** End of document.ready *****


// ***** FUNCTIONS *****

// limit 
var searchResultLimit = 10;


// creates the topic buttons
function renderTopics(topics){
	// loops through the topics and appends to the markup
	for ( i = 0; i < topics.length; i++ ) {
		// creates new list elements
		var topicList = $("<li>");

		topicList.addClass("nav-link active my-auto")

		// sets their inner text
		topicList.text(topics[i]);

		// adds to the ul element
		$("#topic-list").append(topicList);

	}

}

// Builds the News API and calls the AJAX
function search() {
	// reads users's selected tags (click or type)
	var searchBy = $("#search-input").tagsinput("items");
	// turns the searchBy array into a string delimited by +
	searchByString = searchBy.join("+");
	console.log("searchByString: " + searchByString);
	
    var params = {
        // Request parameters
        "q": searchByString,
        "count": searchResultLimit,
        "offset": "0",
        "mkt": "en-us",
        "safeSearch": "Moderate",
    };
  
  	// News AJAX Call
    $.ajax({
        url: "https://api.cognitive.microsoft.com/bing/v5.0/news/search?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a3f99e8021864f3f8221c9be74777427");
        },
        type: "GET"

    })
    .done(function(data) {
        console.log("search success: " + searchByString);
        console.log(data);

        for ( var i=0; i < data.value.length; i++){

			var result = data.value[i];
			// console.log(result);

			// returns data for the project constraints
			var publishedDate = result.datePublished;
			var rating; // (only return top results)

			// returns data and stores them in variables for displaying article
			var headline = result.name;
			var shortDescription = result.description;					
			var longDescription;
			var source = result.provider.name;
			var articleUrl = result.url;
			// var imageArticle = result.image.thumbnail.contentUrl;

			// console.log(publishedDate, headline, shortDescription, articleUrl);


			var headlineDiv = $("<h1>").text(headline);
			var shortDescriptionDiv = $("<div>").text(shortDescription);
			var sourceDiv = $("<div>").text(source);
			var urlDiv = $("<div>").text(articleUrl);
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

// Google Map API function

function initMap() {
	var mapOptions = {
		// This puts the map in the center of the world
		center: new google.maps.LatLng(0.00, 0.00),
		// Slightly zoomed in
		zoom: 2,
		// Shows the map as a roadmap vs a satellite map
		mapTypeId: google.maps.MapTypeId.ROADMAP,
    // Styles the map
    styles: [
    
    {elementType: 'geometry', stylers: [{color: '#212121'}]},

    {elementType: 'labels.icon', stylers: [{visibility: 'off'}]},

    {elementType: 'labels.text.fill', stylers: [{color: '#757575'}]},

    {elementType: 'labels.text.stroke', stylers: [{color: '#212121'}]},

    {featureType: 'administrative', elementType: 'geometry', stylers: [{color: '#757575'}]},

    {featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{color: '#9e9e9e'}]},

    {featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{visibility: 'off'}]},
  
    {featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{color: '#bdbdbd'}]},

    {featureType: 'poi', elementType: 'labels.text', stylers: [{visibility: 'off'}]},

    {featureType: 'poi.park', elementType: 'geometry', stylers: [{color: '#263c3f'}]},
  
    {featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{color: '#6b9a76'}]},
  
    {featureType: 'road', elementType: 'geometry', stylers: [{visibility: 'off'}]},
  
    {featureType: 'road.highway', elementType: 'geometry', stylers: [{visibility: 'off'}]},

    {featureType: 'transit', elementType: 'geometry', stylers: [{color: '#2f3948'}]},

    {featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{color: '#d59563'}]},

    {featureType: 'water', elementType: 'geometry', stylers: [{color: '#E8E8E8'}]},

    {featureType: 'water', elementType: 'labels.text.fill', stylers: [{color: '#515c6d'}]},

    {featureType: 'water', elementType: 'labels.text.stroke', stylers: [{color: '#17263c'}]}

    ]


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
				// Sometimes the the formatted_address just returns a country.
				// Other times it shows a location or state, plus the country.
				// This grabs the last formatted_address and splits the address fields using a comma as a delimiter.
				var addressString = results[(results.length-1)].formatted_address;
				var stringSplit = addressString.split(",");
				// This stores the country clicked to a var
				var countryString = stringSplit[(stringSplit.length-1)];
				// This console logs the var 
				console.log("Country Clicked: " + countryString);

				// passes the countryString into tagsinput
				$("#search-input").tagsinput("add", countryString);


			}

		});

	});

}

