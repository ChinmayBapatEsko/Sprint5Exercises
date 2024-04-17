const axiosRequest = require('axios')

async function getBoredActivity(){
    try{
        let response = await axiosRequest.get('https://www.boredapi.com/api/activity')
        console.log(`Do this activity: ${response.data.activity}`)
    }
    catch(error){
        console.error(`Error: ${error}`);
    }
}

getBoredActivity();