document.getElementById('searchBox').onkeypress = function (event) {
    if (event.keyCode == 13) {
        console.log('hit');
        window.location.assign("./searchResults.html");
        return false;
    }
}