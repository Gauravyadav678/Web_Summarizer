// Define an array of stopwords
var stopword = [
    "", "a", "about", "above", "above", "across", "after", "afterwards", "again", "against",
    "all", "almost", "alone", "along", "already", "also", "although", "always", "am", "among",
    "amongst", "amoungst", "amount", "an", "and", "another", "any", "anyhow", "anyone", "anything",
    "anyway", "anywhere", "are", "around", "as", "at", "back", "be", "became", "because", "become",
    "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside",
    "besides", "between", "beyond", "bill", "both", "bottom", "but", "by", "call", "can", "cannot",
    "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down",
    "due", "during", "each", "eg", "eight", "either", "eleven", "else", "elsewhere", "empty", "enough",
    "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen",
    "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found",
    "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have",
    "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself",
    "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest",
    "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd",
    "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most",
    "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless",
    "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of",
    "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our",
    "ours", "ourselves", "out", "over", "own", "part", "per", "perhaps", "please", "put", "rather", "re",
    "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show",
    "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something",
    "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that",
    "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby",
    "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those",
    "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top",
    "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us",
    "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever",
    "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether",
    "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with",
    "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"
];

// Global variable to store the summary sentences
var summarySentences = [];

// Add a click event handler for the "Summarize" button
$("#check").click(function () {
    // Get the text content from the output div
    var text = $('#pc').text();

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
    if (summarySentences.length >= 2) { // Change the condition to 2
        const summarizedParagraph = `<p>${summarySentences.join(" ")}</p>`;
        // Display the summary sentences
        $('#pc').html(summarizedParagraph);
        // Show the button to convert to bullet points
        $('#convertToListBtn').show();
        // Enable and show the Copy Summary button
        $('#copySummaryButton').prop('disabled', false);
        $('#copySummaryButton').show();
    } else {
        alert("Already Summarized");
    }
});

// Button click handler to convert summary to bullet points
$('#convertToListBtn').click(function () {
    const bulletPoints = summarySentences.map(sentence => `&#x2022; ${sentence}<br>`).join("");
    $('#pc').html(bulletPoints);
});