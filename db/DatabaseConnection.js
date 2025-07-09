const mysql = require('mysql')

class DatabaseConnection {
    constructor() {
        if (!DatabaseConnection.instance) {
            console.log('creating instance of db connection')

            //connect to database
            this.connection = mysql.createConnection({
                host: '127.0.0.1',
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_DATABASE,
                multipleStatements: true
            })

            this.connection.connect()

            DatabaseConnection.instance = this
        }

        return DatabaseConnection.instance
    }

    async dbQuery(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (error, results) => {
                if (error) { reject({error : error}) }
                resolve(results)
            })
        })
    }

    getTableName(data_type) {
        let name = null
        if (data_type == "TEMPERATURE") { name = "temperature_reports" }
        else if (data_type == "HUMIDITY") { name = "humidity_reports" }
        else if (data_type == "LIGHT_INTENSITY") { name = "light_intensity_reports" }
        return name
    }

    getAllReportTableNamesDict() {
        return {
            humidity : "humidity_reports",
            light_intensity: "light_intensity_reports",
            temperature : "temperature_reports"
        }
    }
}

const databaseConnection = new DatabaseConnection()

module.exports = databaseConnection