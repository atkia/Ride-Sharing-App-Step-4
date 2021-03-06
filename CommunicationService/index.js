const { POINT_CONVERSION_COMPRESSED } = require('constants');
const express = require('express');
const app = express();
const http = require('http').createServer()
const sch = require('node-schedule')
const io = require('socket.io')(http)

const logger = (req, res, next) => {
    next();
};

app.use(logger);

app.use(express.json());
app.use(express.urlencoded({ extended: false}));


io.of('communication').on('connection', (socket)=>{
    app.post('/api/communication', (req,res)=>{
        socket.emit("notify_client",req.body);
    })
})

const PORT = process.env.PORT || 5003;

http.listen(5002, () => {
    console.log(`Socket Running on port: 5002`);
});

app.listen(PORT, () => {
    console.log(`Server Running on port: ${PORT}`);
});