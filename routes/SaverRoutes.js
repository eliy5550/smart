const express = require('express')
const DataSaver = require('../classes/DataSaver')
const { getCurrentDateTime } = require('../classes/Helper')
const databaseConnection = require('../db/DatabaseConnection')
const Helper = require('../classes/Helper')
const SaverRouter = express.Router()

SaverRouter.use(express.json())

// the route /save/sensor gets a data report and saves is. if the rep comes with 
SaverRouter.post('/sensor', async (req, res) => {

    console.log("----------- SAVE SENESOR GOT A REQUEST : " + JSON.stringify(req.body));
    if (req.body.data_type !== undefined && req.body.data !== undefined && req.body.sensor_id !== undefined) {
        
        
        //translated
        console.log("sensor data translated arrived - ", JSON.stringify(req.body));

        //check data
        if (req.body.sensor_id === undefined || req.body.data === undefined || req.body.data_type === undefined) return res.json({ error: "missing params" })
            

        //check type
        const tableName = databaseConnection.getTableName(req.body.data_type)
        console.log("data type  ", req.body.data_type, " table name ", tableName);
        if (tableName == null) { return res.json({ error: "no table for this data_type" }) }
        //add report


        const now = getCurrentDateTime();
        const report_date = now.date
        const report_time = now.time

        console.log("SQL = " + `insert into ${tableName} (sensor_id , report_data , report_date , report_time) values ("${req.body.sensor_id}" , ${req.body.data} ,"${report_date}" ,"${report_time}" );`)

        try {
            const data = await databaseConnection.dbQuery(`insert into ${tableName} (sensor_id , report_data , report_date , report_time) values ("${req.body.sensor_id}" , ${req.body.data} ,"${report_date}" ,"${report_time}" );`)
            return res.json({ result: "saved tranlated data successfully in " + tableName })
        } catch (error) {
            return res.status(400).json({ result: "not ok !" + error })
        }

    } else {
        //raw
        try {
            console.log(JSON.stringify(req?.query?.event));
            console.log(JSON.stringify(req?.body));

            const date = new Date()

            const report_date = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
            const report_time = "" + date.getHours() + ":" + (date.getMinutes()) + ":" + date.getSeconds()


            const savableBody = JSON.stringify(req.body)

            await databaseConnection.dbQuery(`insert into raw_data_reports (time_stamp , raw_data) values ("${report_date + " " + report_time}" ,  '${savableBody}' );`);

            return res.status(200).json(req?.body);


        } catch (error) {
            console.log();
            return res.status(500).json("error " + JSON.stringify(error));
        }


    }


})


// SaverRouter.post('/sensor' ,async (req , res)=>{
//     //check data
//     if(req.body.sensor_id === undefined || req.body.data === undefined || req.body.data_type === undefined ) return res.json({error : "missing params"})
// 		//DVIR
// 		console.log(JSON.stringify(req.body));


// 	//check type
//     const tableName = databaseConnection.getTableName(req.body.data_type)
//     if(tableName == null){ return res.json({error : "no table for this data_type"})}
//     //add report
//     const date = new Date()

//     const report_date = "" + date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
//     const report_time= "" + date.getHours() + ":" + (date.getMinutes()) + ":" + date.getSeconds()

//     try {
//         const data = await databaseConnection.dbQuery(`insert into ${tableName} (sensor_id , report_data , report_date , report_time) values ("${req.body.sensor_id}" , ${req.body.data} ,"${report_date}" ,"${report_time}" );`)
//         return res.json({result : "ok"})
//     } catch (error) {
//         return res.json({result : "not ok " + error })
//     }

// })

SaverRouter.post('/sensor/translated', async (req, res) => {

    console.log("sensor data translated arrived - ", JSON.stringify(req.body));

    //check data
    if (req.body.sensor_id === undefined || req.body.data === undefined || req.body.data_type === undefined) return res.json({ error: "missing params" })


    //check type
    const tableName = databaseConnection.getTableName(req.body.data_type)
    console.log("data type  ", req.body.data_type, " table name ", tableName);
    if (tableName == null) { return res.json({ error: "no table for this data_type" }) }
    //add report
    const date = new Date()

    const report_date = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    const report_time = "" + date.getHours() + ":" + (date.getMinutes()) + ":" + date.getSeconds()

    try {
        const data = await databaseConnection.dbQuery(`insert into ${tableName} (sensor_id , report_data , report_date , report_time) values ("${req.body.sensor_id}" , ${req.body.data} ,"${report_date}" ,"${report_time}" );`)
        return res.json({ result: "ok" })
    } catch (error) {
        return res.json({ result: "not ok " + error })
    }
})


module.exports = SaverRouter