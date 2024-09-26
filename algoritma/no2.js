const findLongestWord = (sentence) => {
    const wordsArray = sentence.split(" "); 
    let longestWordLength = 0;             
    let longestWord = "";                   
    wordsArray.forEach(word => {
        if (longestWordLength < word.length) {
            longestWordLength = word.length; 
            longestWord = word;             
        }
    });

    return longestWord; 
}

// Contoh penggunaan
const longestWord = findLongestWord("cek kata terpanjang dari kalimat ini");
console.log(longestWord); 
