class Animal {
    constructor(name) {
      this._name = name;
    }
  
    get name() {
      return this._name;
    }
  
    speak(sound1, sound2) {
      return `${this.name} makes a sound.` + `${sound1}` + " " + `${sound2}` + "\n";
    }
  
    static identify() {
      return 'I am an Animal.';
    }
  }
  
  class Dog extends Animal {
    constructor(name, breed) {
      super(name);
      this.breed = breed;
    }
  
    
    speak(sound1, sound2) {
      const parentSpeak = super.speak(sound1, sound2);
      return `${parentSpeak} ${this.name} (the ${this.breed}) barks.` + "\n";
    }
  }
  
  const dog = new Dog('Buddy', 'Golden Retriever');
  console.log(dog.speak("BARRRK", "baarrrrk"));
 
  console.log("Static Methods in JS: ");
  console.log(Animal.identify() + "\n");
  
  // Demonstrating call, apply, and bind
  const cat = new Animal('Whiskers');
  const speakFunc = dog.speak;
  
  // Using call
  console.log(speakFunc.call(cat, "BARRRK", "baarrrrk")); // Sets 'this' to cat for this call
  
  
  // Using apply
  console.log(speakFunc.apply(cat, ["BARRRK", "baarrrrk"])); // Similar to call but can pass arguments as an array
  
  
  // Using bind
  const boundSpeakFunc = speakFunc.bind(cat); // Creates a new function with 'this' bound to cat
  console.log(boundSpeakFunc("BARRRK", "baarrrrk"));
  
  
  