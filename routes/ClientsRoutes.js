const express = require('express')
const ClientsRouter = express.Router()

ClientsRouter.get('/fake_sensor' , (req , res)=>{
    res.send('fake_sensor')
})


ClientsRouter.get('/smart_campus' , (req , res)=>{
    res.send('smart_campus')
})


ClientsRouter.get('/smart_farming' , (req , res)=>{
    res.send('smart_farming')
})

module.exports = ClientsRouter