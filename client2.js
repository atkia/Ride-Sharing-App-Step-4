const io = require('socket.io-client')
const http = require('http')
const sch = require('node-schedule');
const { match } = require('assert');
const Str = require('@supercharge/strings')

let socket = io.connect('http://communication.chittagong.com:5002/communication');


const job = sch.scheduleJob('*/1 * * * * *', function(){
    riderRequest();
    driverRequest();
});

function riderRequest() {
    requestData = JSON.stringify({
        name: Str.random(6),
        currentX: Math.ceil(Math.random() * 100),
        currentY: Math.ceil(Math.random() * 100),
        destinationX: Math.ceil(Math.random() * 100),
        destinationY: Math.ceil(Math.random() * 100),
    });
    
    
    const postRiderRequest = {
        hostname: 'chittagong.server.com',
       // port: 7001,
        path: '/api/rider',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestData.length
        }
    };
    
    const reqRider = http.request(postRiderRequest, res => {
        let requestData = '';
    
        res.on('data', (chunk) => {
            requestData += chunk;
        });
    
        res.on('end', () => {});
    
    }).on("error", (err) => {
        console.log("Error: ", err.message);
    })
    reqRider.write(requestData);
    reqRider.end();
}

function driverRequest() {
    requestData = JSON.stringify({
        name: Str.random(6),
        car: Math.ceil(Math.random() * 10000),
        currentX: Math.ceil(Math.random() * 100),
        currentY: Math.ceil(Math.random() * 100),
    });
    
    
    const postDriverRequest = {
        hostname: 'chittagong.server.com',
       // port: 7001,
        path: '/api/driver',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestData.length
        }
    };
    
    const reqDriver = http.request(postDriverRequest, res => {
        let requestData = '';
    
        res.on('data', (chunk) => {
            requestData += chunk;
        });
    
        res.on('end', () => {
           //  console.log(`Driver ${res.name} is looking for a Rider....`);
        });
    
    }).on("error", (err) => {
        console.log("Error: ", err.message);
    })
    reqDriver.write(requestData);
    reqDriver.end();
}

function giveRating(pair) {
    requestData = JSON.stringify({
        driverName: pair.driverName,
        car: pair.carNumber,
        rating: Math.ceil(Math.random() * 5),
    });
    
    
    const postRatingrRequest = {
        hostname: 'chittagong.server.com',
       // port: 7001,
        path: '/rating',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestData.length
        }
    };
    
    const reqRating = http.request(postRatingrRequest, res => {
        let requestData = '';
    
        res.on('data', (chunk) => {
            requestData += chunk;
        });
    
        res.on('end', () => {
             console.log(`Rider ${pair.riderName} gives a rating to driver ${pair.driverName}`);
        });
    
    }).on("error", (err) => {
        console.log("Error: ", err.message);
    })
    reqRating.write(requestData);
    reqRating.end();

    
}

socket.on('notify_client',(pair)=>{
    console.log(`Rider ${pair.riderName} matches with driver ${pair.driverName}, Car number ${pair.carNumber},Cost = ${pair.cost}`);
    giveRating(pair);

})