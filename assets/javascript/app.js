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
			var source = result.provider[0].name;
			var articleUrl = result.url;
			var imageArticle = result.image;
			// makes sure there is a thumbnail attached to the article, if there is a thumbnail, then it attaches the thumbnail URL
			if (imageArticle === undefined) {
				console.log("imageArticle " + i + " is undefined");
			} else {
				imageArticle = result.image.thumbnail.contentUrl;
				console.log("imageArticle " + i + ": " + imageArticle);
			}

			// console.log(publishedDate, headline, shortDescription, articleUrl);

			var headlineDiv = $("<p>").addClass("card-title article-title mt-3 pb-2");
			var urlDiv = $("<a>").text(headline).attr("href",articleUrl).attr("target","_blank");
			var publishedDateDiv = $("<span>").text("Published " + publishedDate + " by " + source).addClass("article-date card-subtitle mb-2 text-muted");
			var saveBtnDiv = $("<button>").addClass("save-btn btn btn-link float-right");
			var saveBtnIconDiv = $("<i>").addClass("fa fa-bookmark").attr("aria-hidden","true");
			var imageDiv = $("<img>").addClass("float-left mt-2 mx-2").attr("src",imageArticle).attr("alt","Article thumbnail");
			var shortDescriptionDiv = $("<p>").text(shortDescription).addClass("article-text card-text mb-4");
			var sourceDiv = $("<div>").text(source);

			saveBtnDiv.append(saveBtnIconDiv);
			headlineDiv.append(urlDiv);

			$("#article-box").append(headlineDiv);
			$("#article-box").append(publishedDateDiv);
			$("#article-box").append(saveBtnDiv);
			// only attach the image to the div if it is not undefined
			if (imageArticle !== undefined) {
				$("#article-box").append(imageDiv);
			}
			$("#article-box").append(shortDescriptionDiv);

		}

		updateMyAccount();

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


// *****  Firebase Section *****
// writes to the firebase based on user's search

// updates user information
function updateMyAccount() {
	// sets variables for firebase
	var database = firebase.database();
	var userName = "Eva";
	var userEmail = "me@email.com";
	var userFavArticleTitle = "This is the news.";

	var user = {
		// creates the data object to be written to firebase
		profile: {
			name : userName,
			email : userEmail
		},

		userSearch: $("#search-input").tagsinput("items"),

		favArticles : {
			title : userFavArticleTitle
		}
	}

	// updates the object in the database
	database.ref("/users/" + userName).update(user);

} // *****  End Firebase Section *****


// Latest News Section from Google News API



   // Performing GET requests to the Google News API and logging the responses to the console
    $.ajax({
      url: "https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=1a778f69eb1940408bfab95ddaa2d890&limit=1",
      method: "GET"
    }).done(function(response) {
      console.log(response);
      console.log(response.articles[0].title);
      

      var articleTitle = response.articles[0].title;
      var titleUrl = response.articles[0].url;

      var newsDiv = $("<p>").text(articleTitle).addClass("newsTitle");
      var urlDiv = $("<a>").text(titleUrl).attr("href",titleUrl).attr("target","_blank");


      $(".article-text").append(newsDiv);
      $(".article-text").append(urlDiv);
    });






