document.getElementById('searchBox').onkeypress = function (event) {
    if (event.keyCode == 13) {
        window.location.assign("./searchResults.html");
        return false;
    }
}