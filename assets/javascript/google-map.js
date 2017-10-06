var countryClicked = "";

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
        countryClicked = stringSplit[(stringSplit.length-1)];
        // This console logs the var 
        console.log("Country Clicked: " + countryClicked);
      }
    });
  });
}