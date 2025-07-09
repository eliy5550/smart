const databaseConnection = require("../db/DatabaseConnection")

class DataSaver {

    async setAllRawToTranslated() {
        try {
            const r = await databaseConnection.dbQuery("update raw_data_reports set translated = 1 ;")
            return { result: ok }
        } catch (error) {
            return { error: error }
        }
    }

    saveDataReport(report) {
        if (report.translated == true) {
            this.saveToTable(report)
        } else {
            this.saveToRawReports(report)
        }
    }

    async saveToTable(report) {
        const tableName = databaseConnection.getTableName(report.data_type);
        console.log("saving data to table " + report + " table "+  tableName)
        if (tableName == null) {
            console.log("could not find table for this report")
            return
        }
        const sql = `insert into ${tableName} (sensor_id , report_data , report_date , report_time) values ("${report.sensor_id}" , ${report.data} ,"${report.date}" ,"${report.time}" );`
        
        try {
            await databaseConnection.dbQuery(sql)
            console.log("success")
        } catch (error) {
            console.log("ERROR PUTTING DATA INTO TABLE " + tableName)
        }
    }

    saveToRawReports(report) {
        console.log("the report is not translated so not going to a table - make it go to raw!")
    }

    saveArrayOfDataReport(arr) {
        arr.map(r => {
            this.saveDataReport(r)
        })
    }


}



module.exports = new DataSaver()