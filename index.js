
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
    var loadTaskOne1 = loadUsersByLocations(dataset['users']);
    loadUsersByCompanies(dataset['users']);
    loadUsersByFree(dataset);
    loadUsersByPremium(dataset);
    loadUsersAgainstPros(dataset);
}

function loadUsersByLocations(users){
    if (document.getElementById("response2").innerHTML != ""){
        return false;
    }
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
                        document.getElementById("response1").innerHTML = "Some info lost here, probably because of query limits exceeded";
                        return false;
                    }
                    jsonResult = jsonResult.address_components;
                    for(var j=0; j<jsonResult.length; j++){
                        if(jsonResult[j].types.indexOf("locality") > -1){
                            var location = jsonResult[j].long_name;
                            userCityMapping[users[i].id] = location;
                            var locationElement = document.getElementById(location);
                            if (locationElement == null){
                                document.getElementById("locations").innerHTML += "<li id='1'>"+ location + ": " + users[i].name +"</li>";
                                document.getElementById("1").setAttribute("id", location);
                            }else{
                                document.getElementById(location).textContent += "  "+ users[i].name;
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
    if (document.getElementById("response2").innerHTML != ""){
        return false;
    }
    document.getElementById("response2").innerHTML += "<ul id='companies'>";
    for(let i=0;i<users.length;i++){
        let firstPos = users[i].email.indexOf("@");
        let secondPos = users[i].email.lastIndexOf(".");
        let company = users[i].email.substring(firstPos+1, secondPos);
        let companyElement = document.getElementById(company);
        if(companyElement == null){
            document.getElementById("companies").innerHTML += "<li id='1'>"+ company + ": " + users[i].name +"</li>";
            document.getElementById("1").setAttribute("id", company);
        }else{
            document.getElementById(company).textContent += "<p>"+ users[i].name +"</p>";
        }
    }
    document.getElementById("response2").innerHTML += "</ul>";
}

function loadUsersByFree(dataset){
    if (document.getElementById("response3").innerHTML != ""){
        return false;
    }
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
    if (document.getElementById("response4").innerHTML != ""){
        return false;
    }
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
    if (document.getElementById("response5").innerHTML != ""){
        return false;
    }
    const properties = dataset['properties'];
    const users = dataset['users'];
    document.getElementById("response5").innerHTML += "<ul id='difference1'>";
    let idsReferred = {};
    const googleApiKey = "AIzaSyBfNiTdn47CHng5HHro-hQCU1m6CvnCm6U";
    const numOfProperties = properties.length;
    let nRequest = {}
    for (var i=0; i<numOfProperties; i++){
        if(idsReferred[properties[i].userId] == true){
            continue;
        }
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
                            document.getElementById("response5").innerHTML = "<p>Nothing bad, probably exceeded the query limits</p>";
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
                                            document.getElementById("difference1").innerHTML += "<li>" + users[k].name + "</li>";
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

function loadTaskTwo(){
    loadBookingsOne(dataset['bookings']);
    loadBookingsTwo(dataset['bookings']);
}

function loadBookingsOne(bookings){
    if (document.getElementById("response6").innerHTML != ""){
        return false;
    }
    document.getElementById("response6").innerHTML += "<ul id='difference2'>";
    let currentBook;
    let startDate;
    let endDate;
    let timeDiff;
    let diffDays;
    for(var i=0; i<bookings.length; i++){
        currentBook = bookings[i];
        startDate = new Date(currentBook.startDate);
        endDate = new Date(currentBook.endDate);
        timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
        diffDays = Math.floor(timeDiff / (1000 * 3600 * 24)); 
        if (diffDays >= 25){
            document.getElementById("difference2").innerHTML += "<li> Booking ID: " + currentBook.id + "  Property ID: " 
            + currentBook.propertyId + "</li>";
        }
    }
    document.getElementById("response6").innerHTML += "</ul>";
}

function loadBookingsTwo(bookings){
    if (document.getElementById("response7").innerHTML != ""){
        return false;
    }
    document.getElementById("response7").innerHTML += "<ul id='difference3'>";
    let currentBook;
    let startDate;
    let endDate;
    let timeDiff;
    let diffDays;
    for(var i=0; i<bookings.length; i++){
        currentBook = bookings[i];
        startDate = new Date(currentBook.startDate);
        endDate = new Date(currentBook.endDate);
        timeDiff = Math.abs(startDate.getTime() - endDate.getTime());
        diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diffDays <= 3){
            document.getElementById("difference3").innerHTML += "<li> Booking ID: " + currentBook.id + "  Property ID: " 
            + currentBook.propertyId + "</li>";
        }
    }
    document.getElementById("response7").innerHTML += "</ul>";

}
function loadTaskTwoOne(){
    userDate(dataset);
}

function userDate(dataset){
    let propertyBookingMapping = {};
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    if (startDate == ""|| endDate == ""){
        document.getElementById("responsex").textContent = "Please enter valid dates!";
        return false;
    }
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    if(endDate.getTime() < startDate.getTime()){
        document.getElementById("responsex").textContent = "End date cannot earlier than start date!";
        return false;
    }
    document.getElementById("responsex").innerHTML = "<table id='dates'><tr><th>Booking ID</th><th>Booking Date</th>"+
        "<th>Required Date</th><th>Timezone</th></tr>"
    const bookings = dataset["bookings"];
    const properties = dataset["properties"];
    for(var i=0; i<bookings.length; i++){
        let currentBookStart = new Date(bookings[i].startDate);
        let currentBookEnd = new Date(bookings[i].endDate);
        if (startDate.getTime() >= currentBookStart.getTime() && endDate.getTime() <= currentBookEnd.getTime()){
            let timezone;
            for(var j=0; j<properties.length; j++){
                if(properties[j].id == bookings[i].propertyId){
                    timezone = properties[j].timeZone;
                }
            }
            let content1 = "<tr><td>" + bookings[i].id + "</td>";
            let content2 = "<td> From: " + currentBookStart.toLocaleString('en-GB', { timeZone: timezone}) + " To: " + currentBookEnd.toLocaleString('en-GB', { timeZone: timezone}) + "</td>";
            let content3 = "<td> From: " + startDate.toLocaleString('en-GB', { timeZone: timezone}) + " To: " + endDate.toLocaleString('en-GB', { timeZone: timezone}) + "</td>";
            let content4 = "<td>" + timezone + "</td></tr>";
            document.getElementById("dates").innerHTML += content1 + content2 + content3 + content4;
            
        }
    }
    document.getElementById("responsex").innerHTML += "</table>";
}

function loadTaskThree(){
    if (document.getElementById("response8").innerHTML != ""){
        return false;
    }
    document.getElementById("response8").innerHTML = 
    "<p>1. Every time when a user registering a new property, check if the property location is within the same city as the user lived in, if true go step 2;<br/>"+
    "2. Check if the user is using premium subscription. If yes, permit the registration; if no, go step 3;<br/>"+
    "3. Deny the request and ask the user to activate premium subscription;</p>";

}