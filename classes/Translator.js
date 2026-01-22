
function decodeAM103Payload(base64) {
  const bytes = Buffer.from(base64, "base64");
  let i = 0;
  const data = {};

  while (i < bytes.length) {
    const channel = bytes[i++];
    const type = bytes[i++];

    // Temperature (°C * 10)
    if (channel === 0x01 && type === 0x75) {
      data.temperature = bytes.readInt16LE(i) / 10;
      i += 2;
    }

    // Humidity (% * 10)
    else if (channel === 0x02 && type === 0x76) {
      data.humidity = bytes.readUInt16LE(i) / 10;
      i += 2;
    }

    // CO2 (ppm)
    else if (channel === 0x03 && type === 0x67) {
      data.co2 = bytes.readUInt16LE(i);
      i += 2;
    }

    // TVOC (ppb)
    else if (channel === 0x04 && type === 0x7D) {
      data.tvoc = bytes.readUInt16LE(i);
      i += 2;
    }

    // PM2.5 (µg/m³)
    else if (channel === 0x05 && type === 0x7D) {
      data.pm2_5 = bytes.readUInt16LE(i);
      i += 2;
    }

    // PM10 (µg/m³)
    else if (channel === 0x06 && type === 0x7D) {
      data.pm10 = bytes.readUInt16LE(i);
      i += 2;
    }

    // Unknown field
    else {
      break;
    }
  }

  return data;
}

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
            var co2 = null


            console.log("data_string: " + data_string)
            const decodedData = decodeAM103Payload(data_string);

            console.log("decodedData: " + JSON.stringify(decodedData))

            
            if(decodedData.temperature) {temperature = decodedData.temperature;}
            if(decodedData.humidity) humidity = decodedData.humidity;
            if(decodedData.co2) co2 = decodedData.co2;

            // try {
            //     //if first seq is 0367
            //     //get next 4 letters
            //     //turn them to base 10
            //     //devide by 10
            //     if (base16[0] == '0' && base16[1] == '3' && base16[2] == '6' && base16[3] == '7') {
            //         temperature = this.hexToBase10("" + base16[4] + base16[5] + base16[6] + base16[7]) / 10
            //     }
            // } catch (error) { }



            // //if later sequence is 0468
            // //turn next 2 letters to base 10
            // try {
            //     if (base16[8] == '0' && base16[9] == '4' && base16[10] == '6' && base16[11] == '8') {
                    
            //         humidity = this.hexToBase10("" + base16[12] + base16[13] ) / 2.55
            //     }
            // } catch (error) {
            // }
            


            if(temperature != null){
                results.push({date , time , sensor_id , data_type : "TEMPERATURE" , data : temperature , translated : true});
            }

            if(humidity != null){
                results.push({date , time , sensor_id , data_type : "HUMIDITY" , data : humidity , translated : true});
            }
            
            if(co2 != null){
                results.push({date , time , sensor_id , data_type : "CO2" , data : co2 , translated : true});
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