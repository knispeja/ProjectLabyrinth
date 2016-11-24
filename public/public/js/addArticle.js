(function(){
    "use strict";
    var apiUrl = "https://labyrinth-backend.herokuapp.com/articles/";
    var imageFile;
    function createArticle(article) {
        $.ajax({
            url: apiUrl,
            type: "POST",
            data: article,
            dataType: 'JSON',
            success: function(data) {
                if (data) {
                    window.location.href = "./homePage.html";
                } else {
                    console.log("Article could not be created");
                }
            },
            error: function(request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    $('#submit').click(function() {
        var article = {
            title: $("#articleTitle").val(),
            image: imageFile,
            text: $("#description").val(),
            dateTime: new Date()
        }
        createArticle(article);
    });

    $("#imageUploaded").change(function() {
        var file = $("#imageUploaded")[0].files[0];
        var reader = new FileReader();
        reader.addEventListener('load', function(event) {
            imageFile = event.target.result;
        });
        reader.readAsDataURL(file);
    });
})();