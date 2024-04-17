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

async function doChores(){
    try{
        let gotCoffee = await getCoffee();
        console.log(gotCoffee);
    
        let finishedWork = await startWork();
        console.log(finishedWork);
    
        let playedFoosball = await playFoosball();
        console.log(playedFoosball);
    
        console.log("Finished all chores, Go home peacefully ✌")
    }
    catch(error){
        console.log(error);
    }
}

doChores();