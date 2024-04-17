var XMLHttpRequest = require('xhr2');

const getToDos = (callback) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', () => {
        if(request.readyState === 4 && request.status == 200){ // 200 is successful
            callback(undefined, request.responseText);
        }
        else if(request.readyState === 4){
            callback('could not fetch data', undefined);
        }
    });


    request.open('GET', 'https://jsonplaceholder.typicode.com/todos/');
    request.send();
};

console.log(1);
console.log(2);

getToDos((err, data) => {
    console.log('callback fired');
    if(err)
        console.log(err);
    else
        //console.log(data);
        console.log("Data received");
});

console.log(3);
console.log(4);