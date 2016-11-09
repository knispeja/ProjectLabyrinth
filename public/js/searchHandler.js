function searchHandlerInit() {
    var searchBox = document.getElementById('searchBox');

    searchBox.onkeypress = function (event) {
        if (event.keyCode == 13) {
            window.location.assign("./searchResults.html" + "?" + searchBox.value);
            return false;
        }
    }
}

window.onload = searchHandlerInit;