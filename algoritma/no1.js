const word = "NEGIE1";
let letters = "";
let digits = "";

// Pisahkan huruf dan angka
for (let char of word) {
    if (isNaN(char)) {
        letters += char; 
    } else {
        digits += char; 
    }
}

// Balikkan huruf dan gabungkan dengan angka di belakang
const newWord = letters.split("").reverse().join("") + digits;

console.log(newWord); 
