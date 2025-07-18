const express = require('express')
const databaseConnection = require('../db/DatabaseConnection')
const ManageRoutes = express.Router()

ManageRoutes.use(express.json())

ManageRoutes.post('/set_sensor_to_area', (req, res) => {
    const sensor_id = req.body.sensor_id
    const area_id = req.body.area_id

    if (sensor_id === undefined) { return res.json({ error: "missing sensor_id" }) }
    if (area_id === undefined) { return res.json({ error: "missing area_id" }) }

    const sql = `insert into area_sensor_connections (area_id , sensor_id) values ("${area_id}" , "${sensor_id}");`;

    databaseConnection.connection.query(sql, (err) => {
        if (err) { return res.status(400).json({ err }) }
        return res.status(200).json({ message: "ok" });
    })

})

ManageRoutes.post('/delete_sensor_connection_to_area', (req, res) => {
    const sensor_id = req.body.sensor_id
    const area_id = req.body.area_id

    if (sensor_id === undefined) { return res.json({ error: "missing sensor_id" }) }
    if (area_id === undefined) { return res.json({ error: "missing area_id" }) }

    const sql = `delete from area_sensor_connections where area_id = "${area_id}" and sensor_id = "${sensor_id}";`;

    databaseConnection.connection.query(sql, (err) => {
        if (err) { return res.status(400).json({ err }) }
        return res.status(200).json({ message: "ok" });
    })
})

ManageRoutes.post("/create_area", (req, res) => {
    if (req.body.area_id === undefined) { return res.status(400).json({ error: "missing area_id" }) }
    if (req.body.area_name === undefined) { return res.status(400).json({ error: "missing area_name" }) }
    if (req.body.sub_of === undefined) { return res.status(400).json({ error: "missing sub_of" }) }
    if (req.body.area_desc === undefined) { return res.status(400).json({ error: "missing area_desc" }) }

    const sql = `insert into areas (area_id , sub_of , area_name , area_desc , pic_path) values ("${req.body.area_id}" , "${req.body.sub_of}", "${req.body.area_name}" , "${req.body.area_desc}" , null);`

    databaseConnection.connection.query(sql, (err) => {
        if (err) { return res.status(400).json({ err }) }
        return res.status(200).json({ message: "ok" });
    })
})



module.exports = ManageRoutes