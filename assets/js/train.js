// Initialize Firebase
var config = {
    apiKey: "AIzaSyA25Z6RV39IiXt7V51vaL3GTqZxzgrTvdk",
    authDomain: "traintracker-ceb90.firebaseapp.com",
    databaseURL: "https://traintracker-ceb90.firebaseio.com",
    projectId: "traintracker-ceb90",
    storageBucket: "traintracker-ceb90.appspot.com",
    messagingSenderId: "953463832444"
};
firebase.initializeApp(config);

// Initial Variables
var trainArray = [];
var trainName;
var destination;
var freq;
var next;
var mins;


var database = firebase.database();

function minsAway(freq, initTime) {
    var firstTrainTime = moment(initTime, "HH:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(firstTrainTime), "minutes");

    var timeApart = timeDiff % freq;

    var minsTil = freq - timeApart;
    return minsTil;
}

function nextArrival(freq, initTime, minsTil) {
    var firstTrainTime = moment(initTime, "HH:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(firstTrainTime), "minutes");
    var timeApart = timeDiff % freq;
    var minsTil = freq - timeApart;
    var nextTrainTime = moment().add(minsTil, "minutes");
    var away = moment(nextTrainTime).format("HH:mm");
    
    return away;
}

trains = {
    trainName: "Hogwarts Express",
    destination: "Hogwarts Castle",
    initTime: "03:00",
    freq: 5,
}

trainArray.push(trains);
console.log(trainArray);

for (var i = 0; i < trainArray.length; i++) {
    trainArray[i].mins = minsAway(trainArray[i].freq, trainArray[i].initTime);
    trainArray[i].next = nextArrival(trainArray[i].freq, trainArray[i].initTime, trainArray[i].mins);
    console.log(trainArray[i].trainName)
    console.log(trainArray[i].destination)
    console.log(trainArray[i].freq)
    console.log(trainArray[i].next)
    console.log(trainArray[i].mins)

    // writing to table
    var tableData = $("<td>");
    var trainInfo1 = $("<td>").append(trainArray[i].trainName);
    var trainInfo2 = $("<td>").append(trainArray[i].destination);
    var trainInfo3 = $("<td>").append(trainArray[i].freq);
    var trainInfo4 = $("<td>").append(trainArray[i].next);
    var trainInfo5 = $("<td>").append(trainArray[i].mins);

    //writing to row
    var tableRow = $("<tr>").append(trainInfo1, trainInfo2, trainInfo3, trainInfo4, trainInfo5);

    //writing to table
    var table = $("table").append(tableRow);
}

// add Firebase ref function
database.ref("/train").on("child_added", function (snapshot) {

    // need to run snapshots through the functions
    var newMins = minsAway(snapshot.val().Freq, snapshot.val().FirstTime)
    var newNext = nextArrival(snapshot.val().Freq, snapshot.val().FirstTime, snapshot.val().Mins)

    // writes db info to the screen
    var trainInfo1 = $("<td>").append(snapshot.val().TrainName);
    var trainInfo2 = $("<td>").append(snapshot.val().Destination);
    var trainInfo3 = $("<td>").append(snapshot.val().Freq);
    var trainInfo4 = $("<td>").append(newNext);
    var trainInfo5 = $("<td>").append(newMins);
    var tableRow = $("<tr>").append(trainInfo1, trainInfo2, trainInfo3, trainInfo4, trainInfo5);
    var table = $("table").append(tableRow);

}, function (errorObject) {

    console.log("Errors Handled: " + errorObject.code);

});

$("button").on("click", function() {
    event.preventDefault();
    console.log("test");

    trainName = $("#trainNameInput").val().trim();
    console.log(trainName)
    destination = $("#destinationInput").val().trim();
    firstTime = $("#firstTrainInput").val().trim();
    freq = parseInt($("#freqInput").val().trim());
    mins = minsAway(freq, firstTime);
    next = nextArrival(freq, firstTime, mins);

    // firebase push to database function
    database.ref("/train").push({

        TrainName: trainName,
        Destination: destination,
        FirstTime: firstTime,
        Freq: freq,
        Next: next,
        Mins: mins,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
})