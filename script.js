const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

// Shows loader and hides quote container
function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

//  Hides loader and shows quote container indicating that page has loaded
const removeLoadingSpinner = () => {
    if (!loader.hidden) {
        loader.hidden = true;
        quoteContainer.hidden = false;
    }
}

let errorCounter = 0;

async function getQuoteFromApi() {
    showLoadingSpinner();
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    const proxyUrl = 'https://rocky-sea-12822.herokuapp.com/'
    try {
        const response = await fetch(proxyUrl + apiUrl)
        const data = await response.json();
        // If author is blank, say unknown
        if (data.quoteAuthor === '') {
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = data.quoteAuthor;
        }
        // Reduce font size for long quotes
        if (data.quoteText.length > 115) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote')
        }
        quoteText.innerText = data.quoteText;
        removeLoadingSpinner();
    } catch (error) {
        if (errorCounter == 15) {
            quoteText.innerText = 'Failed to retrieve quote';
            loader.hidden = true;
            quoteContainer.hidden = false;
        }
        if (errorCounter < 15) {
            getQuoteFromApi();
            errorCounter++;
        }
    }
}


// Tweets quote
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}


// Event Listeners
twitterBtn.addEventListener('click', tweetQuote);
newQuoteBtn.addEventListener('click', getQuoteFromApi);




//  On load
getQuoteFromApi();