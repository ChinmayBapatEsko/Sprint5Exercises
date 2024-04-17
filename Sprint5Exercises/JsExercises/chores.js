function getCoffee(callback){
    setTimeout(() => {
        console.log("I finished drinking the coffee");
        callback();
    }, 1000);
}

function startWork(callback){
    setTimeout(() =>{
        console.log("I have finished the work");
        callback();
    }, 4000);
}

function playFoosball(callback){
    setTimeout(() => {
        console.log("I have finished playing Foosball");
        callback();
    }, 2000);
}

getCoffee(() =>{
    startWork(() =>{
        playFoosball(() =>{
            console.log("I have finished all chores, now I can go home peacefully");
        })
    })
})