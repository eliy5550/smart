const express = require('express')
const ManageRoutes = express.Router()

ManageRoutes.use(express.json())

ManageRoutes.post('/register_sensor' , (req , res)=>{
    res.json({message : "create this route!"})
})

ManageRoutes.post('/delete_sensor_registration' , (req , res)=>{
    res.json({message : "create this route!"})
})

ManageRoutes.post('/delete_reports_of_sensor' , (req , res)=>{
    res.json({message : "create this route!"})
})

ManageRoutes.post('/delete_all_reports' , (req , res)=>{
    res.json({message : "create this route!"})
})


module.exports = ManageRoutes