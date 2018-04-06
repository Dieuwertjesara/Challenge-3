

  var map;
  var geoJSON;
  var request;
  var gettingData = false;
  var openWeatherMapKey = "7d5d8d10e16f1532dde20890822a8898";
  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(52.0670253,4.323523499999965),
	  zoom: 1,
    };
    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    // Add interaction listeners to make weather requests
    google.maps.event.addListener(map, "idle", checkIfDataRequested);
    // Sets up and populates the info window with details
    map.data.addListener("click", function(event) {
      infowindow.setContent(
       "<img src=" + event.feature.getProperty("icon") + ">"
       + "<br /><strong>" + event.feature.getProperty("city") + "</strong>"
       + "<br />" + event.feature.getProperty("temperature") + "&deg;C"
       + "<br />" + event.feature.getProperty("weather")
       );
      infowindow.setOptions({
          position:{
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          },
          pixelOffset: {
            width: 0,
            height: -15
          }
        });
      infowindow.open(map);
    });
	setMarkerOne();
	setMarkerTwo();
  }
  var checkIfDataRequested = function() {
    // Stop extra requests being sent
    while (gettingData === true) {
      request.abort();
      gettingData = false;
    }
    getCoords();
  };
  // Get the coordinates from the Map bounds
  var getCoords = function() {
    var bounds = map.getBounds();
    var NE = bounds.getNorthEast();
    var SW = bounds.getSouthWest();
    getWeather(NE.lat(), NE.lng(), SW.lat(), SW.lng());
  };
  // Make the weather request
  var getWeather = function(northLat, eastLng, southLat, westLng) {
    gettingData = true;
    var requestString = "https://api.openweathermap.org/data/2.5/box/city?bbox="
                        + westLng + "," + northLat + "," //left top
                        + eastLng + "," + southLat + "," //right bottom
                        + map.getZoom()
                        + "&cluster=yes&format=json"
                        + "&APPID=" + openWeatherMapKey;
    request = new XMLHttpRequest();
    request.onload = proccessResults;
    request.open("get", requestString, true);
    request.send();
  };
  // Take the JSON results and proccess them
  var proccessResults = function() {
    console.log(this);
    var results = JSON.parse(this.responseText);
    if (results.list.length > 0) {
        resetData();
        for (var i = 0; i < results.list.length; i++) {
          geoJSON.features.push(jsonToGeoJson(results.list[i]));
        }
        drawIcons(geoJSON);
    }
  };
  var infowindow = new google.maps.InfoWindow();
  // For each result that comes back, convert the data to geoJSON
  var jsonToGeoJson = function (weatherItem) {
    var feature = {
      type: "Feature",
      properties: {
        city: weatherItem.name,
        weather: weatherItem.weather[0].main,
        temperature: weatherItem.main.temp,
        min: weatherItem.main.temp_min,
        max: weatherItem.main.temp_max,
        humidity: weatherItem.main.humidity,
        pressure: weatherItem.main.pressure,
        windSpeed: weatherItem.wind.speed,
        windDegrees: weatherItem.wind.deg,
        windGust: weatherItem.wind.gust,
        icon: "https://openweathermap.org/img/w/"
              + weatherItem.weather[0].icon  + ".png",
        coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]
      },
      geometry: {
        type: "Point",
        coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]
      }
    };
    // Set the custom marker icon
    map.data.setStyle(function(feature) {
      return {
        icon: {
          url: feature.getProperty('icon'),
          anchor: new google.maps.Point(25, 25)
        }
      };
    });
    // returns object
    return feature;
  };
  // Add the markers to the map
  var drawIcons = function (weather) {
     map.data.addGeoJson(geoJSON);
     // Set the flag to finished
     gettingData = false;
  };
  // Clear data layer and geoJSON
  var resetData = function () {
    geoJSON = {
      type: "FeatureCollection",
      features: []
    };
    map.data.forEach(function(feature) {
      map.data.remove(feature);
    });
	
	var contentHaagseDenHaag = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">De Haagse Hogeschool</h1>'+
            '<div id="bodyContent">'+
            
			'<p><b>Aantal inwoners</b>  525.000 inwoners<br /> ' +
            '<b>Hoogte landingsplek</b> 5 meter<br /> '+
            '<b>Landingsplek aangeraden</b><br /></p>'+
            '</div>'+
            '</div>';
      
			
	var contentStonehenge = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Stonehenge</h1>'+
            '<div id="bodyContent">'+
            
			'<p><b>Aantal inwoners</b> 8.674.713 inwoners<br /> ' +
            '<b>Hoogte landingsplek</b> 245 meter<br /></p> '+
            '</div>'+
            '</div>';
			
	var contentMcDonaldIsland = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">McDonald Island</h1>'+
            '<div id="bodyContent">'+
            
			'<p><b>Aantal inwoners</b> 8.550.405 inwoners<br /> ' +
            '<b>Hoogte landingsplek</b> 124 meter<br /></p> '+
            '</div>'+
            '</div>';
      

      // Array of markers
      var markers = [
        {
          coords:{lat:52.0670253,lng:4.323523499999965},
          content: contentHaagseDenHaag,
          title: 'NASA',
          icon: image,    
        },
        {
          coords:{lat:51.17888199999999,lng:-1.8262150000000474},
          content:contentStonehenge,
          title: 'NASA',
            icon: image, 
        },
        {
          coords:{lat:-53.08181,lng:73.50415799999996},
		  content:contentMcDonaldIsland,
          title: 'NASA',
            icon: image, 
        }
      ];

      // Loop through markers
      for(var i = 0;i < markers.length;i++){
        // Add marker
        addMarker(markers[i]);
      }

      // Add Marker Function
      function addMarker(props){
        var marker = new google.maps.Marker({
          position:props.coords,
          map:map,
          icon: image,
          //icon:props.iconImage
        });

        // Check for customicon
        if(props.iconImage){
          // Set icon image
          marker.setIcon(props.iconImage);
            
        }

        // Check content
        if(props.content){
          var infoWindow = new google.maps.InfoWindow({
            content:props.content
          });

          marker.addListener('click', function(){
            infoWindow.open(map, marker);
          });
        }
      }
	
	var image = 'pictures/success.png';
        
  };
  google.maps.event.addDomListener(window, 'load', initialize);
  

function setMarkerOne()	{
	var icon = {
		url: 'picture/success2.png',
		scaledSize: new google.maps.Size(70, 60) // scaled size
	};
	var image = 'pictures/nasalogo.png';
	var marker = new google.maps.Marker({
		position: {lat: 28.5728722, lng: -80.6489808},
		map: map,
		icon: icon,
		title: 'NASA'
	});	
}



function setMarkerTwo()	{
	var icon = {
		url: 'pictures/nasalogo.png',
		scaledSize: new google.maps.Size(70, 60) // scaled size
	};
	
	var marker = new google.maps.Marker({
		position: {lat: 28.396837, lng: -80.605659},
		map: map,
		icon: icon,
		title: 'NASA'
	});
	
	
}





  
