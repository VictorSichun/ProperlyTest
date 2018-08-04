
const jsonFiles = {'users': './store/users.json', 'properties': './store/properties.json',
    'bookings': './store/bookings.json', 'subscriptions': './store/subscriptions.json'};
let dataset = {};
let userCityMapping = {};

function loadObjects(){
    
    $.getJSON(jsonFiles['users'], function(data){
        dataset['users'] = data;
    });

    $.getJSON(jsonFiles['bookings'], function(data){
        dataset['bookings'] = data;
    });

    $.getJSON(jsonFiles['subscriptions'], function(data){
        dataset['subscriptions'] = data;
    });

    $.getJSON(jsonFiles['properties'], function(data){
        dataset['properties'] = data;
    });
}

function loadTaskOne(){
    loadUsersByLocations(dataset['users']);
    //loadUsersByCompanies(dataset['users']);
    //loadUsersByFree(dataset);
    //loadUsersByPremium(dataset);
    loadUsersAgainstPros(dataset);
}

function loadUsersByLocations(users){
    const googleApiKey = "AIzaSyBfNiTdn47CHng5HHro-hQCU1m6CvnCm6U";
    let nRequest = {};
    const numOfusers = users.length;
    document.getElementById("response1").innerHTML += "<ul id='locations'>";
    for (var i=0; i<numOfusers; i++){
    (function(i) {
        
        var latlng = users[i].location;
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ latlng +"\
            &key=" + googleApiKey;
        nRequest[i] = new XMLHttpRequest();
        nRequest[i].open("GET", url, true);
        nRequest[i].onreadystatechange = function (oEvent) {
            if (nRequest[i].readyState === 4) {
                if(nRequest[i].status === 200){
                    var jsonResult = JSON.parse(nRequest[i].responseText).results[0];
                    if(jsonResult == null){
                        document.getElementById("response1").innerHTML = "<p>Nothing bad, probably exceeded the query limits</p>";
                        return false;
                    }
                    jsonResult = jsonResult.address_components;
                    for(var j=0; j<jsonResult.length; j++){
                        if(jsonResult[j].types.indexOf("locality") > -1){
                            var location = jsonResult[j].long_name;
                            userCityMapping[users[i].id] = location;
                            var locationElement = document.getElementById(location);
                            if (locationElement == null){
                                document.getElementById("response1").innerHTML += "<li id='1'>"+ location + ": " + users[i].name +"</li>";
                                document.getElementById("1").setAttribute("id", location);
                            }else{
                                document.getElementById(location).textContent += "<p>"+ users[i].name +"</p>";
                            }
                        }
                    }
                }else{
                    console.log(nRequest[i].status);
                }
            }
        };
        nRequest[i].send(null);
        
    })(i);
}
document.getElementById("response1").innerHTML += "</ul>";
    
}

function loadUsersByCompanies(users){
    document.getElementById("response1").innerHTML += "<ul id='companies'>";
    for(let i=0;i<users.length;i++){
        let firstPos = users[i].email.indexOf("@");
        let secondPos = users[i].email.lastIndexOf(".");
        let company = users[i].email.substring(firstPos+1, secondPos);
        let companyElement = document.getElementById(company);
        if(companyElement == null){
            document.getElementById("response2").innerHTML += "<li id='1'>"+ company + ": " + users[i].name +"</li>";
            document.getElementById("1").setAttribute("id", company);
        }else{
            document.getElementById(company).textContent += "<p>"+ users[i].name +"</p>";
        }
    }
    document.getElementById("response2").innerHTML += "</ul>";
}

function loadUsersByFree(dataset){
    const users = dataset['users'];
    const properties = dataset['properties'];
    const subscriptions = dataset['subscriptions'];
    let freeUsers = {};
    const criteria = 6;
    document.getElementById("response3").innerHTML += "<ul id='freeUsersWithSixMorePros'>";
    for(var i=0; i<subscriptions.length; i++){
        if (subscriptions[i].name == "Free Tier"){
            for(var j=0; j<users.length; j++){
                if (users[j].subscriptionId == subscriptions[i].id){
                    freeUsers[users[j].id] = new Array(0, users[j].name);
                }
            }
        }
    }
    
    for(var i=0; i<properties.length; i++){
        if(properties[i].userId in freeUsers){
            freeUsers[properties[i].userId][0] += 1;
        }
    }
    for (var key in freeUsers) {
        if (freeUsers.hasOwnProperty(key)) {
            if( freeUsers[key][0] >= criteria){
                document.getElementById("freeUsersWithSixMorePros").innerHTML = "<li>" + freeUsers[key][1] +"</li>";
            }
        }
    }
    document.getElementById("response3").innerHTML += "</ul>";

    
}

function loadUsersByPremium(dataset){
    const users = dataset['users'];
    const properties = dataset['properties'];
    const subscriptions = dataset['subscriptions'];
    let preUsers = {};
    const criteria = 4;
    document.getElementById("response4").innerHTML += "<ul id='preUsersWithSixMorePros'>";
    for(var i=0; i<subscriptions.length; i++){
        if (subscriptions[i].name == "Premium"){
            for(var j=0; j<users.length; j++){
                if (users[j].subscriptionId == subscriptions[i].id){
                    preUsers[users[j].id] = new Array(0, users[j].name);
                }
            }
        }
    }
    
    for(var i=0; i<properties.length; i++){
        if(properties[i].userId in preUsers){
            preUsers[properties[i].userId][0] += 1;
        }
    }
    for (var key in preUsers) {
        if (preUsers.hasOwnProperty(key)) {
            if( preUsers[key][0] < criteria){
                document.getElementById("preUsersWithSixMorePros").innerHTML = "<li>" + preUsers[key][1] +"</li>";
            }
        }
    }
    document.getElementById("response4").innerHTML += "</ul>";
}

function loadUsersAgainstPros(dataset){
    const properties = dataset['properties'];
    const users = dataset['users'];
    document.getElementById("response5").innerHTML += "<ul id='different'>";
    let idsReferred = {};
    const googleApiKey = "AIzaSyBfNiTdn47CHng5HHro-hQCU1m6CvnCm6U";
    const numOfProperties = properties.length;
    let nRequest = {}
    for (var i=0; i<numOfProperties; i++){
    (function(i) {
            var latlng = properties[i].location;
            var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ latlng +"\
                &key=" + googleApiKey;
            nRequest[i] = new XMLHttpRequest();
            nRequest[i].open("GET", url, true);
            nRequest[i].onreadystatechange = function (oEvent) {
                if (nRequest[i].readyState === 4) {
                    if(nRequest[i].status === 200){
                        var jsonResult = JSON.parse(nRequest[i].responseText).results[0];
                        if(jsonResult == null){
                            document.getElementById("response5").innerHTML += "<p>Nothing bad, probably exceeded the query limits</p>";
                            return false;
                        }
                        jsonResult = jsonResult.address_components;
                        for(var j=0; j<jsonResult.length; j++){
                            if(jsonResult[j].types.indexOf("locality") > -1){
                                var location = jsonResult[j].long_name;
                                if(userCityMapping[properties[i].userId] != location){
                                    for (var k=0; k<users.length; k++){
                                        if(users[k].id == properties[i].userId && (idsReferred[properties[i].userId] != true)){
                                            idsReferred[properties[i].userId] = true;
                                            document.getElementById("response5").innerHTML += "<li>" + users[k].name + "</li>";
                                        }
                                    }
                                }
                            }
                        }
                    }else{
                        console.log(nRequest[i].status);
                    }
                }
            };
            nRequest[i].send(null);
    })(i);
}
    document.getElementById("response5").innerHTML += "</ul>"
}

