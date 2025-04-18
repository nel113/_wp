
class Animal {
    constructor(name) {
      this.name = name;
    }
  
    speak() {
      return `I am ${this.name}`;
    }
  }
  
  class Dog extends Animal {

    speak() {
      return `Woof! I am ${this.name}`;
    }
  }
  

  const dog = new Dog("Buddy");
  console.log(dog.speak()); 