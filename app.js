const express = require('express')
const cors = require('cors');
require('dotenv').config();

const DatabaseConnection = require('./db/DatabaseConnection')

const ClientsRouter = require('./routes/ClientsRoutes')
const SaverRouter = require('./routes/SaverRoutes')
const LoaderRoutes = require('./routes/LoaderRoutes')


const translator = require("./classes/Translator");
const DataSaver = require('./classes/DataSaver');
const ManageRoutes = require('./routes/ManageRoutes');

const app = express()
app.use(cors());

app.get('/', async (req, res) => {
    return res.redirect('/client2')
})

app.use(express.static("./public"))


//client sender
//app.use('/client', ClientsRouter)

//data saver
app.use('/save', SaverRouter)

//data sender
app.use('/load', LoaderRoutes)

//data Manage
app.use('/manage', ManageRoutes)

//manage
app.post('/translate_all', async (req, res) => {
    try {
        translate_all();
        res.send("ok");
    } catch (error) {
        res.json({ error })
    }
})


const translate_all = async () => {
    //get raw reps
    const allReports = await DatabaseConnection.dbQuery("select * from raw_data_reports where translated = 0;");

    const successful_results = []
    //translate each
    for (let i = 0; i < allReports.length; i++) {
        const raw_data = allReports[i].raw_data
        const result = translator.toArrayOfResults(raw_data)
        if (result.error === undefined) {
            result.results.map(r => {
                successful_results.push(r)
                console.log(r)
            })
        }
    }

    console.log("allReports " + allReports.length)
    console.log("successful_results " + successful_results.length)

    //set all reports to be translated
    //DataSaver.setAllRawToTranslated();

    //save all successful reports
    DataSaver.saveArrayOfDataReport(successful_results)

    //set all to tranalated
    DataSaver.setAllRawToTranslated();

}

app.listen(12035, async () => {
    console.log("http://127.0.0.1:12035/") //!!!
    console.log("server running");
    DatabaseConnection.connection.ping();

    setInterval(() => {
        DatabaseConnection.connection.ping();

        console.log("translating...")
        translate_all();
    }, 1000 * 60 * 5)

})