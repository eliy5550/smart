



class Client {
    data = []

    sensorNames = []

    sensors = {} //(data of sensors)just one for now , dont add more to here 

    sensor = null

    jsonFetcher

    specific_date = null
    sensor_id = null

    view = "last" // last or day

    constructor(ip, port) {
        this.jsonFetcher = new JsonFetcher(ip, port)
    }

    //MAIN METHODS

    //on start
    loadSensorNamesFromServer() {
        this.jsonFetcher.getSensorNamesFromServer().then(data => {
            this.sensorNames = data
            this.displaySensorNamesList()
        })
    }

    //pick as sensor
    //displays all

    changeSensor = async (sensorID) => {
        removeContent()
        this.sensor_id = sensorID
        await this.display() // to remove
    }

    // changeSensor = async (sensorID) => {
    //     removeContent()
    //     await client.getSensorData(sensorID , this.specific_date) // to remove
    //     this.display() // to remove
    //     this.displayCanvases() //to remove   
    // }

    async showByDay() {
        const today = this.getDateFromUI()
        //set today to data on UI
        this.specific_date = today
        removeContent();
        this.view = "day"
        await this.display();
    }

    viewByLastReports(amount) {

    }




    //HELPERS

    getDateFromUI() {
        try {

            let e = document.getElementById('pick_date').value;
            console.log(e);

            if (e == "") { throw new Error("bad date") }
            return e

        } catch (error) {
            console.warn(error)
            alert("You did not pick a date, showing last 50...")
            return null
        }

    }


    async refresh() { //button
        this.view = "last"
        this.specific_date = null
        this.changeSensor(this.sensor_id)
    }

    // async getSensorData(sensor_id, specific_date){ //button
    //     this.sensor_id = sensor_id
    //     this.specific_date = specific_date

    //     const sensor_data = await this.jsonFetcher.getSensorData(sensor_id , specific_date);

    //     if(!sensor_data.error){
    //         this.sensors = {}
    //         this.sensors[sensor_id] = new Sensor({id : sensor_id , reports :  sensor_data.reports})
    //     }

    //     // this.organize(sensor_data)
    // }

    async getSensorData(sensor_id, specific_date) { //button
        this.sensor_id = sensor_id
        this.specific_date = specific_date

        const sensor_data = await this.jsonFetcher.getSensorData(sensor_id, specific_date);

        if (!sensor_data.error) {
            this.sensor = new Sensor({ id: sensor_id, reports: sensor_data.reports })
        }

        // this.organize(sensor_data)
    }

    organize(data) {
        // for(let s in this.data){
        //     const sensor = this.data[s]
        //     this.sensors.push(new Sensor(sensor))
        // }
    }

    async display() {
        await this.getSensorData(this.sensor_id, this.specific_date) // to remove

        this.sensor.display(client)

        this.displayCanvases()
    }

    displayCanvases() {
        this.sensor.drawOnCanvases()
    }



    displaySensorNamesList() {
        document.getElementById("pick_a_sensor").innerHTML = this.getSensorPickHTML();
    }

    getSensorPickHTML() {
        let html = "<h3>Pick a Sensor</h3>"
        if (this.sensorNames.length == 0) { html += "<p>No sensors found</p>" }
        for (let i in this.sensorNames) {
            const name = this.sensorNames[i]
            html += `<button class='btn btn-info' onclick="client.changeSensor('${name}')">${name}</button>    `
        }
        return html
    }

    nextDay() {

    }

    prevDay() {

    }

    downloadExcel(sensor_id, type) {

        // Example JavaScript array
        const data = this.getDataForEXCEL(sensor_id, type)

        // Create a new workbook and add the data to it
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data); // Convert array to sheet
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // Append sheet to workbook

        // Generate the Excel file and trigger a download
        XLSX.writeFile(wb, "data.xlsx");
    }

    getDataForEXCEL(sensor_id, type) {
        try {
            const sensor_data = this.sensor.reports[type]
            const array_of_arrays = [[type + " reports:", "", ""], ["report_id", "time", "data"]]
            sensor_data.map(d => {

                const row = []
                row.push(d?.report_id)
                row.push(d?.report_date + " " + d?.report_time)
                row.push(d?.report_data)
                array_of_arrays.push(row)
            })
            return array_of_arrays
        } catch (error) {
            console.warn("ERROR GETTING THE RIGHT SENSOR OR TYPE, returning empty " - error)
            return []
        }
    }



}
