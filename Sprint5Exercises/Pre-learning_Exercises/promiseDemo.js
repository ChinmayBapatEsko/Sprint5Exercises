const axiosRequest = require('axios')

axiosRequest
    .get('https://www.boredapi.com/api/activity') //this get method returns a Promise Object
    .then(response => {
        console.log(`Do this activity: ${response.data.activity}`)
    })
    .catch(error => {
        console.log("Error!");
    })