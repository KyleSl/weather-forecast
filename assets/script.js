const API_KEY = "76b88bf1b17386c11d9dce4da4425290";
console.log(API_KEY);

$(function () {
    var searchBar = $('#city-search');
    console.log(searchBar);

    searchBar.on('change', function () {
        console.log(searchBar.val());
    });
});