const express = require('express')
const databaseConnection = require('../db/DatabaseConnection')
const LoaderRoutes = express.Router()

LoaderRoutes.use(express.json())


LoaderRoutes.post('/buildings', async (req, res) => { //get list of building names
    try {
        const building = databaseConnection.dbQuery("select count(*) as amount , building from sensors group by building;")
        return res.json(building)

    } catch (error) {
        return res.json({ error: "error : " + error })
    }
})

LoaderRoutes.post('/rooms', (req, res) => { //give building name get list
    res.json({ message: "create this route" })
})

LoaderRoutes.post('/get_registered_sensors', (req, res) => { // get list of all registered sensors ids 
    res.json({ message: "create this route" })
})


LoaderRoutes.post('/get_sensor_data', async (req, res) => {// returns latest 10 reports of a sensor or by day
    if (req.body.sensor_id === undefined ) { return res.json({ error: "missing params sensor_id" }) }
    if (req.body.specific_date === undefined  ) { req.body.specific_date = null }

    console.log("get sensor data body: " + JSON.stringify(req.body));
    const specific_date = req.body.specific_date

    let end = ""
    let order = ""

    //all or one day
    if(specific_date == null || specific_date === ""){
        //just limit
        end = "limit 50"
        order = "order by report_date desc ,report_time desc"        
    }else{
        //search all in specific date
        end = `and report_date = "${specific_date}"` + " order by report_date desc ,report_time desc"
    }

    //from date to date
    const from = req.body.from
    const to = req.body.to
    if(from !== undefined && to !== undefined  && from !== "" && to !== ""){
        order = ""
        end = `AND report_date >= '${from}' AND report_date <= '${to}'`
    }

    const allData = {}
    try {
        const tablesDict = databaseConnection.getAllReportTableNamesDict()
        for (let type in tablesDict) {
            const tableName = tablesDict[type]
            const sql = `select * from ${tableName} where sensor_id = "${req.body.sensor_id}" ${order} ${end};`
            console.log("SQL : " + sql)
            const data = await databaseConnection.dbQuery(sql)
            if (data.error) {
                console.log("error getting data from " + tableName + " ! " + data.error)
                allData[type] = []
                continue
            }
            allData[type] = data
        }

        return res.json({"id": req.body.sensor_id, reports: allData})
    } catch (error) {
        return res.json({ error: "error : " + JSON.stringify(error) })
    }
})

// LoaderRoutes.post("/all_data", async (req, res) => { //!!!! BAD ROUTE DONT USE IT YET
//     //return an array
//     //each ibject has sensor id = "id" an reports
//     //reports is a dict of report names like "HUMIDITY"
//     //the humidity object is an array of humidity report

//     //get sensor names


//     //go through each table and get everything inside
//     const allData = {}
//     const tablesDict = databaseConnection.getAllReportTableNamesDict()
//     for (let type in tablesDict) {
//         const tableName = tablesDict[type]
//         const sql = `select * from ${tableName};`
//         const data = await databaseConnection.dbQuery(sql)
//         if (data.error) {
//             allData[type] = []
//             continue
//         }
//         allData[type] = data
//     }

//     // //all data holds all the relevant tables
//     // console.log(allData)
//     // for(let type in tablesDict){
//     //     const typeData = tablesDict[type]
//     //     for(let row in typeData){

//     //     }
//     // }


//     return res.send(allData)

//     //build that object that returns every thing with it start with unique sensor names
// })


LoaderRoutes.post('/get_sensor_data/at', async (req, res) => {// returns all reports of a sensor from start time and end time
    // if(req.body.sensor_id === undefined || req.body.start_date === undefined || req.body.start_time === undefined || req.body.finish_date === undefined || req.body.finish_time === undefined ){return res.json({error : "missing params"})}
    // const temperature = await databaseConnection.dbQuery(`select * from temperature_reports where sensor_id = "${req.body.sensor_id}"`);
})

LoaderRoutes.post("/sensor_names" , async (req , res)=>{

    const sensor_names_dict = {} 

    const tablesDict = databaseConnection.getAllReportTableNamesDict()

    for (let type in tablesDict) {
        const tableName = tablesDict[type]
        const data = await databaseConnection.dbQuery("select sensor_id from " + tableName + " group by sensor_id;");
        
        for(let row in data){
            const sensor_id = data[row].sensor_id
            if(sensor_id === undefined){continue}
            else{
                sensor_names_dict[sensor_id] = 1
            }
        }
    }

    console.log("data " + JSON.stringify(sensor_names_dict))

    const array_to_return = []

    for(let x in sensor_names_dict){
        array_to_return.push(x)
    }


    return res.json(array_to_return)
})



module.exports = LoaderRoutes