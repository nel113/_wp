function faktor(n){
    if(n===0) return 1;
        return n*faktor(n-1);
}
console.log(faktor(5));