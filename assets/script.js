const API_KEY = "76b88bf1b17386c11d9dce4da4425290";

$(function () {
    var searchBar = $('#city-search');
    var searchList = $('#search-list');
    var searchItems = $('.search-item'); // array
    var cityList = $('#city-list');
    var cities;
    var timer;
    const typingInterval = 1000;

    searchBar.on('input', function () { // Detects when user types in search bar
        clearTimeout(timer);
        timer = setTimeout(doneTyping, typingInterval);
    });

    function getLocationData(cityName){
        if(cityName){
            var requestURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + API_KEY;
            fetch(requestURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    clearList();
                    displayList(data);
                })
        }else{
            clearList();
        }
    }

    function clearList(){
        searchList.empty();
    }

    function displayList(data){
        for(var i = 0; i < data.length; i++){
            var newItem = $('<li>' + data[i].name + ', ' + data[i].state + '</li>');
            newItem.addClass('list-group-item text-center search-item');
            newItem.attr('id', i);
            searchList.append(newItem);
        }
        searchItems = $('.search-item');
        detectHover(searchItems);
        detectClick(data);
    }

    function doneTyping () {
        getLocationData(searchBar.val());
    }

    function detectHover(item) {
        item.hover(
            function (e){
                $(e.target).addClass('active');
            }, 
            function (e){
                $(e.target).removeClass('active');
            });
    }

    function detectClick(data) {
        searchItems.on('click', function(e){
            clearList();
            searchBar.val('');
            addCity(data[$(e.target).attr('id')]);
        });
    }

    function addCity(city){
        console.log(city);
        var newCity = $('<li>' + city.name + ', ' + city.state + '</li>');
        newCity.addClass('list-group-item city-item');
        newCity.attr('data-lat', city.lat);
        newCity.attr('data-lon', city.lon);
        cityList.append(newCity);
        cities = $('.city-item');
        detectHover(cities);
        detectClickedCity();
    }

    function detectClickedCity() {
        cities.on('click', function (e) {
            addWeatherInfo($(e.target));
        });
    }

    function addWeatherInfo(city){
        $('#city-name').text(city.text());
        getWeatherData(city.attr('data-lat'), city.attr('data-lon'));
    }

    function getWeatherData(lat, lon){
        var requestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY;
        fetch(requestURL)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                console.log(data);
                return data;
            })
    }
});