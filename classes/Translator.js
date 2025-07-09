


class Translator {
    
    
    base64ToHex(str) {
        const raw = atob(str);
        let result = '';
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16);
            result += (hex.length === 2 ? hex : '0' + hex);
        }
        return result.toUpperCase();
    }

    hexToBase10(str) {
        return parseInt(str, 16)
    }
    
    toArrayOfResults(report) {

        
        const results = []
        try {
            //console.log("translating...");

            //parse string
            const parsedReport = JSON.parse(report)


            // get time and date
            const date_time_arr = parsedReport.time.split("T")
            const date = date_time_arr[0]
            const time = date_time_arr[1].split(".")[0]

            //get sensor_id
            const sensor_id = parsedReport.deviceInfo.devEui

            //get data string
            const data_string = parsedReport.data

            if (date === undefined || time === undefined || sensor_id === undefined || data_string === undefined) {
                throw new Error(
                    "translator : missing data in raw data " + date + "-" + time + "-" + sensor_id + "-" + data_string
                )
            }

            //turn to base 16
            const base16 = this.base64ToHex(data_string)

            var temperature = null
            var humidity = null
            try {
                //if first seq is 0367
                //get next 4 letters
                //turn them to base 10
                //devide by 10
                if (base16[0] == '0' && base16[1] == '3' && base16[2] == '6' && base16[3] == '7') {
                    temperature = this.hexToBase10("" + base16[4] + base16[5] + base16[6] + base16[7]) / 10
                }
            } catch (error) { }



            //if later sequence is 0468
            //turn next 2 letters to base 10
            try {
                if (base16[8] == '0' && base16[9] == '4' && base16[10] == '6' && base16[11] == '8') {
                    
                    humidity = this.hexToBase10("" + base16[12] + base16[13] ) / 2.55
                }
            } catch (error) {
            }
            
            if(temperature != null){
                results.push({date , time , sensor_id , data_type : "TEMPERATURE" , data : temperature , translated : true});
            }

            if(humidity != null){
                results.push({date , time , sensor_id , data_type : "HUMIDITY" , data : humidity , translated : true});
            }


            //console.log("Done!");

            
            return {
                results,
                report_date: date, report_time: time, sensor_id, data_string, base16, temperature , humidity
            }

        } catch (error) {
            return {
                error: error.message,
                results
            }
        }
    }

}

module.exports = new Translator()