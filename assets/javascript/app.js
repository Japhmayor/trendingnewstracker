$(document).ready(function(){

	// arrays of topics
	var topics = ["Politics", "Money", "Entertainment", "Tech", "Sports"];

	// creates the buttons
	var renderTopics = function(){
		// loops through the topics and appends to the markup
		for ( i = 0; i < topics.length; i++ ) {
			// creates new list elements
			var newTopicList = $("<li>");

			// sets their inner text
			newTopicList.text(topics[i]);

			// adds to the ul element
			$("#topic-list").append(newTopicList);
		}
	}

	// calls the functions
	renderTopics();


})