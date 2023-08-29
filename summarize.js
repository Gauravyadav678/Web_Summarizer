// Define an array of stopwords
var stopword = ["", "a", "about", /* ... */ ]; // This array contains a list of common stopwords

// Global variable to store the summary sentences
var summarySentences = [];

// Add a click event handler for the "Summarize" button
$("#check").click(function () {
    // Get the text content from the output div
    var text = $('#output').text();

    // Define a custom tokenizer function
    function customTokenizer(text) {
        return text.split(/\s+/);
    }

    // Tokenize the text and calculate word frequency
    const tokens = customTokenizer(text);
    const wordFrequency = {};
    // Iterate through tokens and calculate word frequency, ignoring stopwords and punctuation
    for (const word of tokens) {
        // Lowercase the word for consistency
        const lowercaseWord = word.toLowerCase();
        if (!stopword.includes(lowercaseWord) && !/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(word)) {
            if (!wordFrequency[word]) {
                wordFrequency[word] = 1;
            } else {
                wordFrequency[word]++;
            }
        }
    }

    // Normalize word frequencies
    const maxFrequency = Math.max(...Object.values(wordFrequency));
    for (const word in wordFrequency) {
        wordFrequency[word] = wordFrequency[word] / maxFrequency;
    }

    // Split text into sentences and calculate sentence scores
    const sentences = text.replace(/[.?!]+/g, '|').split("|").filter(Boolean);
    const sentScore = {};
    // Iterate through sentences and calculate sentence scores based on word frequency
    for (const sentence of sentences) {
        const sentenceTokens = customTokenizer(sentence);
        for (const word of sentenceTokens) {
            if (word in wordFrequency) {
                sentScore[sentence] = (sentScore[sentence] || 0) + wordFrequency[word];
            }
        }
    }

    // Select the top sentences to form the summary
    const selectedLength = Math.min(sentences.length, 3); // Change to 3 sentences
    summarySentences = Object.keys(sentScore)
        .sort((a, b) => sentScore[b] - sentScore[a])
        .slice(0, selectedLength);

    // Check if enough sentences are selected for the summary
    if (summarySentences.length >= 3) { // Change the condition to 2
        // Hide the original text output
        $("#output").hide();
        // Add bordered style to the summarized text
        $('#summarizedText').addClass('bordered-text');
        // Set the summarized text content
        $('#summarizedText').text(summarySentences.join(" "));
        // Show the button to convert to bullet points
        $('#convertToListBtn').show();
        // Enable and show the Copy Summary button
        $('#copySummaryButton').prop('disabled', false);
        $('#copySummaryButton').show();
    } else {
        alert("Please enter at least 2 sentences");
    }
});

// Button click handler to convert summary to bullet points
$('#convertToListBtn').click(function () {
    // Convert summary sentences to bullet points
    const bulletPoints = summarySentences.map(sentence => `<li>${sentence}</li>`).join("");
    $('p').html(`<ul>${bulletPoints}</ul>`);
});