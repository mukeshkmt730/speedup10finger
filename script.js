
const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";

let quoteIndex = 0;
let startTime; let started = false;
let coveredLength = 0;
let totalLength;
let mistakes = 0;
let wrongWords = 0;


function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL).
        then(res => res.json()).
        then(data => data.content);
}


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

renderNextQuote();

quoteInput.addEventListener('keyup', (e) => {
    let quoteSpanArray = quoteDisplay.querySelectorAll('span');

    if (!started) {
        startTime = new Date();
        started = true;
    }


    let quoteVal = quoteSpanArray[quoteIndex].innerText;
    let inputVal = quoteInput.value.trim();


    if (e.keyCode == 32) {

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
    } else {

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
            if (i == inputVal.length) {
                quoteSpanArray[quoteIndex].classList.remove('incorrect');
                quoteSpanArray[quoteIndex].classList.add('currentWord');
            }
        }
    }

})



function calculateSpeedAndDisplay(endTime) {
    let time = (endTime - startTime) / 1000;

    let speed = Math.round((((coveredLength+mistakes) / 5) / (time / 60)));
    speedSpan.innerText = speed;

    progressDot.style.left = `${780 * (coveredLength / totalLength)}px`;

    if (coveredLength >= totalLength) {
        displayResult(speed, time);
    }
}

function displayResult(speed, time) {
    let accuracy = (((coveredLength) * 100) / (coveredLength + mistakes)).toFixed(2);

    time = Math.floor(time);
    let minute = Math.floor(time / 60);
    let second = time % 60;

    let timeStr = "" + (minute > 9 ? minute : ("0" + minute)) + ":" + (second > 9 ? second : ("0" + second));

    speedResult.innerText = speed;
    accuracyResult.innerText = accuracy;
    timeResult.innerText = timeStr;
    correctword.innerText = quoteIndex;
    wrongWord.innerText = wrongWords;
    KeystrokesCorrect.innerText = coveredLength;
    KeystrokesWrong.innerText = mistakes;

    container.style.display = "none";
    resultBox.style.display = "flex";
}

function newGame() {
    window.location.reload();
}

