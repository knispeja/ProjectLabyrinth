(function(){
    "use strict";
    var apiUrl ="https://localhost:3000/users/";
    var currentUser;

    // Make ajax call to add new user to db
    function createUser(user) {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: user,
            dataType: 'JSON',
            success: function(data) {
                if(data) {
                    window.location.href = "./homePage.html";
                    return false;
                }
                else{
                    console.log("User not created");
                }
            }
        });
    }

    // make ajax call to get a user from the db
    function getUser(userID) {
        $.ajax({
            url: apiUrl + userID,
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    currentUser = data;
                } else {
                    console.log("User not Found");
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

})();