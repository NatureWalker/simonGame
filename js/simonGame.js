// Variables Section

var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var userLevel = 0;
var difficultyLevel = 1;

// Functions Section

// Touchscreen Section

function detectTouch() {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
}

if (detectTouch()) {
    var screenType = "touchScreen";
} else {
    var screenType = "keyboard";
}

// Reset Section

function clearStats() {
    gamePattern = [];
    userClickedPattern = []
    userLevel = 0;
}

function restoreChoice() {
    $(".difficulty-choice").removeClass("chosen");
    $(".difficulty-choice").addClass("not-chosen");
    $(".not-chosen").on("mouseover", function () {
        playSound("difficulty", "choice-hover");
    });
}

// Interaction Section

function playColorButton(color) {

    switch (difficultyLevel) {
        case 1:
            var speed = 1000;
            break;
        case 2:
            var speed = 750;
            break;
        case 3:
            var speed = 500;
            break;
        default:
            var speed = 1000;
            console.log("Something went wrong. speed is set to " + speed)
    }
    setTimeout(function () {
        playSound("theGame", gamePattern[color]);
        for (var i = 1; i < 5; i++) {
            // $("#" + gamePattern[color]).fadeToggle(75);
            animatePress(gamePattern[color]);
        }
    }, speed * color);
}

function playSound(type, name) {

    switch (type) {
        case "theGame":
            var theSound = new Audio("sounds/" + name + ".mp3");
            theSound.play();
            break;
        case "difficulty":
            var randomSound = Math.floor((Math.random() * 3) + 1);
            var theSound = new Audio("sounds/" + name + "-" + randomSound + ".wav");
            theSound.play();
            break;
        case "buttonHover":
            var randomSound = Math.floor((Math.random() * 2) + 1);
            var theSound = new Audio("sounds/" + name + "-" + randomSound + ".wav");
            theSound.play();
            break;
        case "picked":
            var theSound = new Audio("sounds/" + name + ".wav");
            theSound.play();
            break;
        default:
            console.log(type);
            console.log(name);
            break;
    }
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass(currentColor + "-pressed");
    setTimeout(function () {
        $("#" + currentColor).removeClass(currentColor + "-pressed");
    }, 100);
}

function prepButtons() {
    $(".simonButton").on("click", function () {
        var userChosenColor = $(this).attr("id");
        userClickedPattern.push(userChosenColor);
        playSound("theGame", userChosenColor);
        animatePress(userChosenColor);
        var currentLevel = userClickedPattern.length - 1;
        checkAnswer(currentLevel);
    });
    $(".simonButton").on("mouseover", function () {
        playSound("buttonHover", "button-hover");
    })
}

// Game Sequences

function starterAction() {
    if (detectTouch()) {
        $("#level-title").one("click", function () {
            startGame();
            prepButtons();
            // $("#level-title").removeClass("btn btn-large");
            $("body").unbind("keydown");
        });
    };
    $("body").one("keydown", function () {
        startGame();
        prepButtons();
        // $("#level-title").removeClass("btn btn-large");
        $("#level-title").unbind("click");
    });
}

function nextSequence(delayed) {
    userLevel++;
    $("#level-title").text("Level " + userLevel);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);
    if (delayed) {
    setTimeout(function() {
        for (var count = 0; count < gamePattern.length; count++) {
            playColorButton(count);
        }
    }, 1000);
    } else {
        for (var count = 0; count < gamePattern.length; count++) {
            playColorButton(count);
        }
    }
}

function startGame() {
    $(".difficulty").slideUp();
    $(".container").fadeIn();
    clearStats();
    nextSequence(true);        
}

function gameOver() {
    playSound("theGame", "wrong");
    $(".simonButton").unbind("click");
    $(".simonButton").unbind("mouseover");
    $("body").addClass("game-over");
    switch(screenType) {
        case "keyboard":
            $("#level-title").text("Game Over. Press Any Key To Restart");
            break;
        case "touchScreen":
            $("#level-title").text("Game Over. Tap Here To Restart");
            // $("#level-title").addClass("btn btn-large");
            break;
        default:
            $("#level-title").text("Game Over. Press Any Key To Restart");
            break;
    }
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 300)
    setTimeout(function () {
        $(".container").fadeOut();
        $(".difficulty").slideDown();
    }, 600)
    starterAction();
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            userClickedPattern = [];
            // setTimeout(nextSequence, 1000);
            nextSequence(true);
        }
    } else {
        gameOver();
    }
}

// Prep the Board for First Play

// Set title based on input capability (touchscreen or keyboard)

switch(screenType) {
    case "keyboard":
        $("#level-title").text("Press Any Key to Start");
        break;
    case "touchScreen":
        $("#level-title").text("Touch Here to Start");
        // $("#level-title").addClass("btn btn-large");
        break;
    default:
        console.log(screenType);
        break;
}

// Set Easy to Chosen

$(".difficulty-choice").addClass("not-chosen");
$("#easy").removeClass("not-chosen").addClass("chosen");
$(".not-chosen").on("mouseover", function () {
    playSound("difficulty", "choice-hover");
});

// Setup Choose Difficulty

$(".difficulty-choice").on("click", function (event) {
    restoreChoice();
    $(this).removeClass("not-chosen");
    $(this).addClass("chosen");
    $(this).unbind("mouseover");
    playSound("picked", "choice-pick");
    theChoice = $(this).attr("id");
    switch (theChoice) {
        case "easy":
            difficultyLevel = 1;
            break;
        case "medium":
            difficultyLevel = 2;
            break;
        case "hard":
            difficultyLevel = 3;
    }
});
$(".not-chosen").on("mouseover", function () {
    playSound("difficulty", "choice-hover");
});
starterAction();
