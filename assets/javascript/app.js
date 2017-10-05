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

	//creates the list of countries as links
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

	// calls the functions
	renderTopics();
	renderCountries();


})