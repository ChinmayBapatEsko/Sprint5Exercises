function getCoffee(){
    return new Promise((resolve, reject) => { //the resolve and reject are FUNCTIONS. Can take a value as a parameter.
        setTimeout(() => {
            resolve("I finished drinking the coffee");
        }, 1000);
    })
}

function startWork(){

    return new Promise((resolve, reject) =>{
        setTimeout(() =>{
            resolve("I have finished the work");
        }, 4000);
    })
}

function playFoosball(){
    return new Promise((resolve, reject) =>{
        setTimeout(() => {
            resolve("I have finished playing Foosball");
        }, 2000);
    })
}

getCoffee().then(value => {
    console.log(value);
    return startWork().then(value =>{
        console.log(value);
        playFoosball().then(value => {
            console.log(value);
            console.log("I have finished all the chores and now I can go home peacefully");
        })
    })
})