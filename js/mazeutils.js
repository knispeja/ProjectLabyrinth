// Used for form inputs that only accept numbers
function numericOnly() {
    return event.charCode >= 48 && event.charCode <= 57;
}

// Downloads maze as an image
function downloadMaze(link, fileName) {
    link.href = document.getElementById("canvas").toDataURL();
    link.download = fileName;
}