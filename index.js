const express = require('express');
const bodyparser = require('body-parser');
const mysql = require('mysql2');
const dotenv = require('dotenv').config();

console.log({
    database: process.env.DBNAME,port: process.env.PORT,
    host: process.env.HOST,password1: process.env.PASS,
    user: process.env.USER
})
const connection = mysql.createConnection({
    database: process.env.DBNAME,port: process.env.PORT,
    host: process.env.HOST,password1: process.env.PASS,
    user: process.env.USER
});

const App = express();

const PORT = 8000

App.use(bodyparser.urlencoded({urlencoded:1}));
App.use(bodyparser.json());

App.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', '*');
    next();
});

App.get('/api/users',(req,res)=>{
    connection.query('select * from users',(err,result)=>{
        res.json(result);
    });
});

App.post('/api/users',(req,res)=>{
    const { body } = req;
    connection.query('INSERT into users(`username`,`email`,`password`) values (?,?,?)',[
        body.username,body.email,body.password
    ],(err,r)=>{
        connection.query('select * from users where id = ?',[r.insertId],(err,result)=>{
            res.json({'message':'Users Added !',user:result[0]});
        });
    });
});

App.get('/api/bookings',(req,res)=>{
    connection.query('select * from bookings',(err,result)=>{
        res.json(result);
    });
});

App.post('/api/bookings',(req,res)=>{
    const { body } = req;
    connection.query('INSERT into bookings values (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[
        body.user_id,body.flight_id,body.type,body.depart,body.arrival,body.from,
        body.to,body.class,body.specialReq,body.lastName,body.firstName,body.email,
        body.phone,body.numberTickets
    ],(err,r)=>{
        connection.query('select * from bookings where id = ?',[r.insertId],(err,result)=>{
            res.json({'message':'Booking Added !',user:result[0]});
        });
    });
});

App.get('/api/flights',(req,res)=>{
    connection.query('select * from flights',(err,result)=>{
        res.json(result);
    });
});

App.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})
