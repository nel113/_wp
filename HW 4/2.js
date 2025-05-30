function uniqueSorted(arr) {
    const uniqueSet = new Set(arr);
    const uniqueArray = Array.from(uniqueSet);
    uniqueArray.sort((a, b) => a - b);
    return uniqueArray;
  }

console.log(uniqueSorted([5, 3, 8, 3, 1, 5, 8]))