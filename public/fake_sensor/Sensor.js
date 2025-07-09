
class Sensor {
    sensor_id = 2
    data_type = "HUMIDITY" //HUMIDITY //TEMPERATURE //LIGHT_INTENSITY
    data = 123 //just a number
    intervalTimeInMS

    reportingInterval

    //server data
    ip = "185.60.170.80"
    port = "4000"

    loadDataFromUI() {
        this.sensor_id = document.getElementById('sensor_id').value
        this.data_type = document.getElementById('sensor_data_type').value
        this.data = document.getElementById('sensor_data').value
    }

    loadIntervalTimeFromUI() {
        this.intervalTimeInMS = document.getElementById('report_timer_reset').value
    }

    async reportData() {
        sensor.loadDataFromUI();

        const body = {
            sensor_id: sensor.sensor_id,
            data: sensor.data,
            data_type: sensor.data_type
        }

        if (sensor.isBodyOK(body)) {
            console.log(JSON.stringify(body))
        
            //send
            const response = await sensor.send("/save/sensor/translated", body)
            if (response.error) {
                console.warn( 
                    "FAILED TO SEND : " + JSON.stringify(response.error)
                ) 
            }
            console.log(JSON.stringify(response));
        } else {
            console.warn("BODY NOT OK (NOT SENDING) : " + JSON.stringify(body))
        }

    }

    isBodyOK(body) {
        if (body.sensor_id == "" || body.data == "" || body.data_type == "" || body.sensor_id == undefined || body.data == undefined || body.data_type == undefined || body.sensor_id == null || body.data == null || body.data_type == null) {
            return false
        }
        return true
    }

    startReporting() {
        console.log('start reporting')
        try {
            this.loadIntervalTimeFromUI()
            this.reportingInterval = setInterval(this.reportData, this.intervalTimeInMS)
        } catch (error) {
            console.error(error)
        }

    }

    stopReporting() {
        console.log('stop reporting')
        clearInterval(this.reportingInterval)
        this.reportingInterval = undefined
    }

    isReportingHandler() {
        const isReportingElement = document.getElementById('isReporting')
        if (isReportingElement.checked) {
            this.startReporting()
        } else {
            this.stopReporting()
        }
    }
    
    async send(route, body) {
        try {
            const data = await fetch("http://" + this.ip + ":" + this.port + route, {
                method: "POST",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(body)
            })
            if (data.status == 404) { throw new Error("wrong route - 404") }
            const json = await data.json()
            return json
        } catch (error) {
            return { error: error.message}
        }
    }

    // log(message){
    //     document.write(message);
    //     return message
    // }

}

let sensor

const sensorInit = async () => {
    sensor = new Sensor()
}

sensorInit()