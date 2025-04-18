function countLetters(str) {
    const letterCountMap = new Map();
  
    for (const char of str) {
      if (/[a-zA-Z]/.test(char)) {
        const lowerCaseChar = char.toLowerCase();

        if (letterCountMap.has(lowerCaseChar)) {
          letterCountMap.set(lowerCaseChar, letterCountMap.get(lowerCaseChar) + 1);
        } else {
          letterCountMap.set(lowerCaseChar, 1);
        }
      }
    }
  
    return letterCountMap;
  }

console.log(countLetters("banana"))