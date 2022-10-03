export default function firstLetterToUppercase(word) {
    word = word.replace(/^./, str => str.toUpperCase())
    return word
}