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
	var topics = ["Politics", "Finance", "Entertainment", "Tech", "Sports","Health"];

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
		maxTags: 6
	});

	// calls search function after an item is added
	$("#search-input").on("itemAdded", search);
	// calls search function after an item is removed
	$("#search-input").on("itemRemoved", search);

	// calls search when search button is clicked
	$("#search-btn").on("click", search);

	initializeFirebaseAuth();

}); // ***** End of document.ready *****

// ***** Saved Article Container and Click Handler *****

// Used to store articles, click handlers call the array to get data to save articles
var savedArticles = [];
var selectedArticle;
var displayName;
var email;

// Grabs article data from savedArticles
$(document).on("click", "button", function() {
	// Uses the ID value of i, tied to the <button> from the for loop to call savedArticles[i]
	selectedArticle = savedArticles[parseInt(this.id)];
	console.log("selectedArticle below");
	console.log(selectedArticle);
	updateMyAccount();

});

// ***** End Saved Article Container and Click Handler *****

// ***** FUNCTIONS *****

// limit 
var searchResultLimit = 10;


// creates the topic buttons
function renderTopics(topics){
	// loops through the topics and appends to the markup
	for ( i = 0; i < topics.length; i++ ) {
		// creates new list elements
		var topicList = $("<li>");

		topicList.addClass("list-inline-item btn topic-list-item col-lg-2 col-md-4 col-6 px-0 mx-0")

		// sets their inner text
		topicList.text(topics[i]);

		// adds to the ul element
		$("#topic-list").append(topicList);

	}

}

// Builds the News API and calls the AJAX
function search() {
	// sets ajax call based on the search-input
	if ( $("#search-input").val() === "" ) {
		$("#article-box").empty();

	} else {
		$("#article-box").empty();
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
	            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","c4f6265d938341ba8234937653647f7d");
	        },
	        type: "GET"

	    })
	    .done(function(data) {
	        console.log("search success: " + searchByString);
	        console.log(data);

	        for ( var i=0; i < data.value.length; i++){

				var result = data.value[i];
				// console.log(result);

				// Dumps the results to the savedArticles array for use with the saved articles buttons
				savedArticles[i] = result;

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
					imageArticle = "assets/images/placeholder.png";
					//console.log("imageArticle " + i + " is undefined");
				} else {
					imageArticle = result.image.thumbnail.contentUrl;
					//console.log("imageArticle " + i + ": " + imageArticle);
				}

				var articleDiv = $("<div>").addClass("card").attr("padding", "10px");

				var headlineDiv = $("<p>").addClass("card-title article-title mt-3 pb-2");
				var urlDiv = $("<a>").text(headline).attr("href",articleUrl).attr("target","_blank");
				var publishedDateDiv = $("<span>").text("Published " + publishedDate + " by " + source).addClass("article-date card-subtitle mb-2 text-muted");
				var saveBtnDiv = $("<button>").addClass("save-btn btn btn-link float-right").attr("width", "20px").attr("id", i);
				var saveBtnIconDiv = $("<i>").addClass("fa fa-bookmark").attr("aria-hidden","true");
				var	imageDiv = $("<img>").addClass("float-left mt-2 mx-2").attr("src",imageArticle).attr("alt","Article thumbnail").attr("width","100px");
				var shortDescriptionDiv = $("<p>").text(shortDescription).addClass("article-text card-text mb-4");
				var sourceDiv = $("<div>").text(source);

				saveBtnDiv.append(saveBtnIconDiv);
				headlineDiv.append(urlDiv);

				articleDiv.append(headlineDiv);
				articleDiv.append(publishedDateDiv);
				articleDiv.append(saveBtnDiv);
				articleDiv.append(imageDiv);
				articleDiv.append(shortDescriptionDiv);
				$("#article-box").append(articleDiv);
			}

			// updateMyAccount();

		})
		.fail(function() {
			alert("error");
		});

	}

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

// Firebase Auth config.
function initializeFirebaseAuth(){

	var uiConfig = {
		// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
		signInFlow: 'popup',
		signInSuccessUrl: 'index.html',
		signInOptions: [
			// Leave the lines as is for the providers you want to offer your users.
			firebase.auth.GoogleAuthProvider.PROVIDER_ID
		],
		// Terms of service url.
		tosUrl: '<your-tos-url>'
	};

	// Initialize the FirebaseUI Widget using Firebase.
	var ui = new firebaseui.auth.AuthUI(firebase.auth());
	// The start method will wait until the DOM is loaded.
	ui.start('#firebaseui-auth-container', uiConfig);


	// checks if the authentication has changed
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			$("#li-profile").show(0);
			$("#li-log-out").show(0);
			$("#li-log-in").hide(0);
			// User is signed in.
			displayName = user.displayName;
			email = user.email;
			$("#li-profile a").attr("title",email);
			console.log(user.email);
			// hides modal after user logged in succesfully
			$('#sign-in-modal').modal('hide');

		} else {
			// redirects to login
			// window.location = "index.html";
			$("#li-profile").hide(0);
			$("#li-log-out").hide(0);
			$("#li-log-in").show(0);

		}

	});

	// logs out the user
	$("#li-log-out a").on("click", function(e) {
		firebase.auth().signOut();
		e.preventDefault();

	});

	// logs in the user
	$("#log-in-button").on("click", function(e){
		var email = $("#email-input").val();
		var password = $("#password-input").val();
		// firebase email sign in
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
	  		// Handle Errors here.
	  		var errorCode = error.code;
	  		var errorMessage = error.message;
	  		$("#log-in-error").text(errorMessage).show();

		});

		e.preventDefault();

	});

	// signs up the user
	$("#sign-up-button").on("click", function(e){
		var email = $("#email-input").val();
		var password = $("#password-input").val();
		// firebase email sign up
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
	  		// Handle Errors here.
	  		var errorCode = error.code;
	  		var errorMessage = error.message;
	  		$("#log-in-error").text(errorMessage).show();
		});

		e.preventDefault();

	});

}


// writes to the firebase based on user's search
// updates user information
function updateMyAccount() {

// 	// sets variables for firebase
	var database = firebase.database();
	var userName = displayName;
	var userEmail = email;
	var userFavArticleTitle = selectedArticle.name;
	var userFavArticleDate = selectedArticle.datePublished;
	var userFavArticleText = selectedArticle.description;
	var userFavArticleURL = selectedArticle.url;	

	//

	var user = {
		// creates the data object to be written to firebase
		profile: {
			name : displayName,
			email : userEmail
		}


	};
	// updates the object in the database
	database.ref("/users/" + userName).update(user);


	var articles = {

	 	article : {
			title : userFavArticleTitle,
			date : userFavArticleDate,
			text : userFavArticleText,
			url : userFavArticleURL
	 	},

	 	userSearch: $("#search-input").tagsinput("items")
	};	

	database.ref("/users/"+ userName).push(articles);

	// ***** Start New Stuff Added By Grant *****

	// Fetch Firebase Data
	database.ref("/users/" + userName).on("child_added", function(childSnapshot, prevChildKey) {
		console.log("childSnapshot.val below")
		// Fetches all saved articles
		console.log(childSnapshot.val().article);
		var fetchedTitle = childSnapshot.val().article.title;
		var fetchedDate = childSnapshot.val().article.date;
		var fetchedText = childSnapshot.val().article.text;
		var fetchedURL = childSnapshot.val().article.url;

		var savedByUserArticleDiv = $("<div>").addClass("card").attr("padding", "10px");
		var savedByUserHeadlineDiv = $("<p>").addClass("card-title article-title mt-3 pb-2");
		var savedByUserUrlDiv = $("<a>").text(fetchedTitle).attr("href",fetchedURL).attr("target","_blank");
		var savedByUserPublishedDateDiv = $("<span>").text("Published " + fetchedDate).addClass("article-date card-subtitle mb-2 text-muted");
		var savedByUserShortDescriptionDiv = $("<p>").text(fetchedText).addClass("article-text card-text mb-4");

		savedByUserHeadlineDiv.append(savedByUserUrlDiv);
		savedByUserArticleDiv.append(savedByUserHeadlineDiv);
		savedByUserArticleDiv.append(savedByUserPublishedDateDiv);
		savedByUserArticleDiv.append(savedByUserShortDescriptionDiv);
		$("#saved-article-box").append(savedByUserArticleDiv);
		$("#my-account-name").html(userName);
		$("#my-account-email").html(userEmail);

	});



	// ***** End New Stuff Added By Grant *****

} // *****  End Firebase Section *****




// Latest News Section from Google News API Source = CNN 


// Latest News Section from Google News API
function populateBreakingNews () {

   // Performing GET requests to the Google News API
    $.ajax({
      url: "https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=1a778f69eb1940408bfab95ddaa2d890",
      method: "GET"
    }).done(function(response) {
		var currentState = $("#breaking-news-box").attr("data-empty");
		$("#breaking-news-box").empty();

		if(currentState === "true"){
			$("#breaking-news-box").attr("data-empty","false");
			$("#breaking-news-box").addClass("breaking-news-scroll card-block article-content")

			// Grabs IMG from the first new article and Append to the breaking news box 
			var imageUrl = response.articles[0].urlToImage; 
			var newsPoster = $("<img>").addClass("img-fluid img-responsive mb-1").attr("src", imageUrl);
			$("#breaking-news-box").append(newsPoster).attr("href",titleUrl).attr("target","_blank");

			for (var i = 0; i < 10; i++){
		      	// this variable holds the article titles from the ajax call response
		      	var articleTitle = response.articles[i].title;

			  	// this variable holds the URL for the Articles 
				var titleUrl = response.articles[i].url;

		      	// Dynamically creating links for the articles and appending to the DOM
		        var breakingDiv = $("<div>").addClass("breaking-news-title py-2")
		        var newsDiv = $("<a>").text(articleTitle).attr("href",titleUrl).attr("target","_blank").addClass("breaking-news-article");

		        breakingDiv.append(newsDiv);
		        $("#breaking-news-box").append(breakingDiv);
			}
		}else if(currentState ==="false") {
			$("#breaking-news-box").attr("data-empty","true");
			$("#breaking-news-box").removeClass("breaking-news-scroll card-block article-content")
		}
    });
}

$("#breaking-news-header").on("click",populateBreakingNews);

//runs when the page is loaded
window.onload = function(){
	//checks to see if the window width is larger than mobile view
    if($(window).width() > 575) {
    	//if so, make the breaking news expanded
        populateBreakingNews();
    }	
}

// Scrolling Bar News is Populated here SOurce = HuffPost


$(document).ready(function(){
   // Performing GET requests to the Google News API
    $.ajax({
      url: "https://newsapi.org/v1/articles?source=the-huffington-post&sortBy=top&apiKey=1a778f69eb1940408bfab95ddaa2d890",
      method: "GET"
    }).done(function(response) {

     
      for (var i = 0; i < 10; i++){
        
      // this variable holds the article titles from the ajax call response
      var scrollingTitle = response.articles[i].title;

      // // this variable holds the URL for the Articles 
      var scrollingUrl = response.articles[i].url;
        
      // Dynamically creating links for the articles and appending to the DOM
      var scrollingDiv = $("<div>").addClass("scrolling-news");
      var newsBar = $("<a>").text(scrollingTitle).attr("href",scrollingUrl).attr("target","_blank").addClass("scrolling-news");
     

      scrollingDiv.append(newsBar);
      $("#rolling-title-bar").append(scrollingDiv);
      

      }

    });


});