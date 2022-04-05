
const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";

let quoteIndex = 0;
let startTime; let started = false;
let coveredLength = 0;
let totalLength;
let mistakes = 0;
let wrongWords = 0;
let totalkeypress = 0;

// function to fetch api and return content of response
function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL).
        then(res => res.json()).
        then(data => data.content);
}

// function to get content from getRandomQuote and set all word of content in span append quoteDisplay by these spans
async function renderNextQuote() {
    try {
        const quote = await getRandomQuote();
        totalLength = quote.length;
        quoteDisplay.innerText = "";
        quote.split(' ').forEach((ch, i) => {
            let charSpan = document.createElement('span');
            charSpan.innerText = ch;
            if (i == 0) charSpan.classList.add('currentWord');
            quoteDisplay.appendChild(charSpan);
        });
        quoteInput.value = null;
    } catch (error) {
        alert(error.message + ', Please check your internet connection');
    }

}

// calling renderNextQuote function on page load or reload
renderNextQuote();


// ************* main logic starts here **********************
// adding event listener in input box
quoteInput.addEventListener('keyup', (e) => {
    totalkeypress++;        //counting each keyup

    let quoteSpanArray = quoteDisplay.querySelectorAll('span');  //array of span/words in quoteDisplay box

    if (!started) {       //starting timer or setting starttime on first keyup
        startTime = new Date();
        started = true;
    }


    let quoteVal = quoteSpanArray[quoteIndex].innerText;  //getting word using current quorte array index
    let inputVal = quoteInput.value.trim();               //getting typed value from inpur box and triming so that space from end remove

    // if key is spacebar
    if (e.keyCode == 32) {

        // check typed word is correct or not 
        // if correct then move to next word and call calculateSpeedAndDisplay for update speed and progressbar or
        // if not correct then reset the corrent word properties
        if (quoteVal == inputVal) {
            quoteSpanArray[quoteIndex].classList.add('correct');
            quoteSpanArray[quoteIndex].classList.remove('currentWord');
            quoteSpanArray[quoteIndex].classList.remove('incorrect');

            quoteIndex++;

            coveredLength += inputVal.length + 1;

            if (quoteIndex >= quoteSpanArray.length)
                coveredLength--;

            calculateSpeedAndDisplay(new Date());

        } else {
            wrongWords++;
        }

        quoteInput.value = null;
        if (quoteIndex < quoteSpanArray.length) {
            quoteSpanArray[quoteIndex].classList.add('currentWord');
            quoteSpanArray[quoteIndex].classList.remove('incorrect');
        }
    } else {    // if key is not spacebar then check for mistakes

        if (inputVal.length > quoteVal.length) {
            if (e.keyCode != 8) mistakes++;
            quoteSpanArray[quoteIndex].classList.add('incorrect');
            quoteSpanArray[quoteIndex].classList.remove('currentWord');
        } else {
            let i = 0;
            while (i < inputVal.length) {
                if (inputVal[i] != quoteVal[i]) {
                    if (e.keyCode != 8) mistakes++;
                    quoteSpanArray[quoteIndex].classList.add('incorrect');
                    quoteSpanArray[quoteIndex].classList.remove('currentWord');
                    break;
                }
                i++;
            }
            if (i == inputVal.length) {  //if no error found, means word is corrected;
                quoteSpanArray[quoteIndex].classList.remove('incorrect');
                quoteSpanArray[quoteIndex].classList.add('currentWord');
            }
        }
    }

})


// function for calculate gross speed and display it after every space key typed
function calculateSpeedAndDisplay(endTime) {
    let time = (endTime - startTime) / 1000;

    let grossSpeed = Math.round((totalkeypress / 5) / (time / 60));
    speedSpan.innerText = grossSpeed;

    // updating progressbar
    progressDot.style.left = `${780 * (coveredLength / totalLength)}px`;

    if (coveredLength >= totalLength) {  //if race is finished
        displayResult(time);
    }
}


//function for display result div after complete the race
function displayResult(time) {
    let netSpeed = Math.round((((totalkeypress - mistakes) / 5) / (time / 60)));
    let accuracy = (((totalkeypress - mistakes) * 100) / (totalkeypress)).toFixed(2);

    time = Math.floor(time);
    let minute = Math.floor(time / 60);
    let second = time % 60;
    let timeStr = "" + (minute > 9 ? minute : ("0" + minute)) + ":" + (second > 9 ? second : ("0" + second));

    speedResult.innerText = netSpeed;
    accuracyResult.innerText = accuracy;
    timeResult.innerText = timeStr;
    correctword.innerText = quoteIndex;
    wrongWord.innerText = wrongWords;
    KeystrokesCorrect.innerText = totalkeypress - mistakes;
    KeystrokesWrong.innerText = mistakes;

    container.style.display = "none";
    resultBox.style.display = "flex";
}

function newGame() {
    window.location.reload();
}

