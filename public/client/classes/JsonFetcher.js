class JsonFetcher {
    constructor(ip, port) {
        if (JsonFetcher.instance == undefined) {
            JsonFetcher.instance = this
        }

        this.ip = ip
        this.port = port


        return JsonFetcher.instance
    }

    getSensorNamesFromServer(){
        return new Promise(async (resolve , reject)=>{
            const data = await this.get_data("/load/sensor_names" , {})
            if(data.error){
                console.log("error getting sensor names " + data.error)
                resolve([])
            }
            resolve(data)
        })

    }

    async get_data(route, body) {
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
            return { error: error.message }
        }
    }

    async getAllData(){
        const data = await this.get_data("/load/all_sensors" , {})
        return data
    }

    async getSensorData(sensor_id , specific_date){
        const data = await this.get_data("/load/get_sensor_data" , {sensor_id : sensor_id , specific_date})
        console.log("SENDING REQ SENSOR DATA " + JSON.stringify( data) )
        if(data.error){
            console.log(data.error)
            return {error : "error getting data on this sensor " + data.error}
        }
        return data
    }


    async getMockData() {
        //returns list of sensors
        //inside each sensor we get sensor name , and reports
        return [
            {
                id: "s111",
                reports: {
                    temperature: [
                        {
                            report_id: "123",
                            report_data: 15,
                            report_date: "2024-07-04",
                            report_time: "13:29:30",
                        },
                        {
                            report_id: "123",
                            report_data: 15,
                            report_date: "2024-07-04",
                            report_time: "13:29:30",
                        },{
                            report_id: "123",
                            report_data: 15,
                            report_date: "2024-07-04",
                            report_time: "13:29:30",
                        },{
                            report_id: "123",
                            report_data: 15,
                            report_date: "2024-07-04",
                            report_time: "13:29:30",
                        },{
                            report_id: "123",
                            report_data: 10,
                            report_date: "2024-07-04",
                            report_time: "13:29:30",
                        },{
                            report_id: "123",
                            report_data: 15,
                            report_date: "2024-07-04",
                            report_time: "13:29:30",
                        },{
                            report_id: "123",
                            report_data: 15,
                            report_date: "2024-07-04",
                            report_time: "13:29:30",
                        },{
                            report_id: "123",
                            report_data: 15,
                            report_date: "2024-07-04",
                            report_time: "13:29:30",
                        },
                        {
                            report_id: "123",
                            report_data: 20,
                            report_date: "2024-07-04",
                            report_time: "13:29:31",
                        },
                        {
                            report_id: "123",
                            report_data: 22,
                            report_date: "2024-07-04",
                            report_time: "13:29:32",
                        },
                        {
                            report_id: "123",
                            report_data: 20,
                            report_date: "2024-07-04",
                            report_time: "13:29:33",
                        }
                    ]
                    ,
                    humidity: [
                        {
                            report_id: "123",
                            report_data: 15,
                            report_date: "2024-07-04",
                            report_time: "13:29:30",
                        },
                        {
                            report_id: "123",
                            report_data: 20,
                            report_date: "2024-07-04",
                            report_time: "13:29:31",
                        },
                        {
                            report_id: "123",
                            report_data: 22,
                            report_date: "2024-07-04",
                            report_time: "13:29:32",
                        },
                        {
                            report_id: "123",
                            report_data: 20,
                            report_date: "2024-07-04",
                            report_time: "13:29:33",
                        }
                        ,
                        {
                            report_id: "123",
                            report_data: 20,
                            report_date: "2024-07-04",
                            report_time: "13:29:33",
                        },
                        {
                            report_id: "123",
                            report_data: 20,
                            report_date: "2024-07-04",
                            report_time: "13:29:33",
                        },
                        {
                            report_id: "123",
                            report_data: 20,
                            report_date: "2024-07-04",
                            report_time: "13:29:33",
                        }
                        
                    ],
                    
                }
            }
            ,
            {
                id: "s222",
                reports: {
                    temperature: [
                        {
                            report_id: "123",
                            report_data: 15,
                            report_date: "2024-07-04",
                            report_time: "13:29:30",
                        },
                        {
                            report_id: "123",
                            report_data: 20,
                            report_date: "2024-07-04",
                            report_time: "13:29:31",
                        },
                        {
                            report_id: "123",
                            report_data: 22,
                            report_date: "2024-07-04",
                            report_time: "13:29:32",
                        },
                        {
                            report_id: "123",
                            report_data: 5,
                            report_date: "2024-07-04",
                            report_time: "13:29:33",
                        }
                    ]
                    ,
                    light: [
                        {
                            report_id: "123",
                            report_data: 100,
                            report_date: "2024-07-04",
                            report_time: "13:29:30",
                        },
                        {
                            report_id: "123",
                            report_data: 10,
                            report_date: "2024-07-04",
                            report_time: "13:29:31",
                        },
                        {
                            report_id: "123",
                            report_data: 80,
                            report_date: "2024-07-04",
                            report_time: "13:29:32",
                        },
                        {
                            report_id: "123",
                            report_data: 10,
                            report_date: "2024-07-04",
                            report_time: "13:29:33",
                        }
                        
                    ],
                    
                }
            }
        ]
    }

}
