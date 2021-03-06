// Variables Section

var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var userLevel = 0;
var difficultyLevel = 1;
var speed = 500;
var soundSetting = "on";

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
    userClickedPattern = [];
    userLevel = 0;
}

function restoreChoice() {
    $(".difficulty-choice").removeClass("chosen");
    $(".difficulty-choice").addClass("not-chosen");
    $(".not-chosen").on("mouseover", function () {
        playSound("difficulty", "choice-hover");
    });
}

function setSpeed(difficultyLevel) {
    switch (difficultyLevel) {
        case 3:
            speed = 500;
            break;
        case 2:
            speed = 1000;
            break;
        case 1:
            speed = 1500;
            break;
        default:
            speed = 1500;
            console.log("Something went wrong. speed is set to " + speed);
    }
    return speed;
}

// Interaction Section

function playColorButton(color) {
    setTimeout(() => {
        playSound("theGame", gamePattern[color]);
        for (var i = 1; i < 5; i++) {
            animatePress(gamePattern[color]);
        }
    }, setSpeed(difficultyLevel) * color);
}

function turnSound(setting) {
    switch (setting) {
        case "on":
            $(".sound-selection").attr("src", "img/unmute.png");
            $(".sound-selection").removeClass("sound-off").addClass("sound-on");
            soundSetting = "on";
            break;
        case "off":
            $(".sound-selection").attr("src", "img/mute.png");
            $(".sound-selection").removeClass("sound-on").addClass("sound-off");
            soundSetting = "off";
            break;
        default:
            console.log("Something went wrong with the sound setting. Setting is " + setting);
            break;
    }
}

function playSound(type, name) {
    if (soundSetting === "on") {
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
            case "buttonsAppear":
                var theSound = new Audio("sounds/buttons-" + name + ".wav");
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
}

function disableButtonPush() {
    $(".simonButton").unbind("click");
}

// Game Sequences

function starterAction() {
    if (detectTouch()) {
        $("#level-title").one("click", function () {
            startGame();
            prepButtons();
            $("body").unbind("keydown");
        });
    }
    $("body").one("keydown", function () {
        startGame();
        prepButtons();
        $("#level-title").unbind("click");
    });
}

function nextSequence() {
    userLevel++;
    $("#level-title").text("Level " + userLevel);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);
    disableButtonPush();
    var timeOutTime = setSpeed(difficultyLevel) * gamePattern.length;
    setTimeout(() => {
        prepButtons();
    }, timeOutTime + 1000);
    setTimeout(() => {
        for (var count = 0; count < gamePattern.length; count++) {
            playColorButton(count);
        }
    }, 1000);
}

function startGame() {
    $(".difficulty").slideUp();
    $(".difficulty-section").slideUp();
    setTimeout(function () {
        $(".container").fadeIn();
        playSound("buttonsAppear", "up");
        clearStats();
        nextSequence();
    }, 400);
}

function gameOver() {
    playSound("theGame", "wrong");
    $(".simonButton").unbind("click");
    $("body").addClass("game-over");
    switch (screenType) {
        case "keyboard":
            $("#level-title").text("Game Over. Press Any Key To Restart");
            break;
        case "touchScreen":
            $("#level-title").text("Game Over. Tap Here To Restart");
            break;
        default:
            $("#level-title").text("Game Over. Press Any Key To Restart");
            break;
    }
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 300);
    setTimeout(function () {
        $(".container").fadeOut();
        playSound("buttonsAppear", "down");
    }, 600);
    setTimeout(function () {
        $(".difficulty").slideDown();
    }, 1000);
    starterAction();
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            userClickedPattern = [];
            nextSequence();
        }
    } else {
        gameOver();
    }
}

// Prep the Board for First Play

// Set title based on input capability (touchscreen or keyboard)

switch (screenType) {
    case "keyboard":
        $("#level-title").text("Press Any Key to Start");
        break;
    case "touchScreen":
        $("#level-title").text("Touch Here to Start");
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

$(".difficulty-menu-icon").on("click", () => {
    $(".difficulty-section").slideToggle();
});

$(".difficulty-choice").on("click", function (event) {
    restoreChoice();
    $(this).removeClass("not-chosen");
    $(this).addClass("chosen");
    $(this).unbind("mouseover");
    playSound("picked", "choice-pick");
    theChoice = $(this).attr("id");
    var diffLevels = ["weak", "decent", "strong"];
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
    $(".difficulty-menu-icon").attr("src", "img/" + diffLevels[difficultyLevel - 1] + ".png");
});

$(".sound-selection").on("click", () => {
    if (soundSetting === "on") {
        turnSound("off");
    } else if (soundSetting === "off") {
        turnSound("on");
    }
});

$(".not-chosen").on("mouseover", function () {
    playSound("difficulty", "choice-hover");
});
starterAction();