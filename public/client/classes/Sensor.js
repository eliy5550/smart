class Sensor {

    id
    reports

    mainElement

    viewString
    constructor(sensor) {
        this.id = sensor.id
        this.reports = sensor.reports
    }

    display(client) 
    {
        if (this.mainElement === undefined) {
            this.mainElement = document.getElementById("sensor_content")
        }

        

        

        this.mainElement.innerHTML = this.getSensorHTML(client ) // creates html by writing data
        //instead create the elements with buttons and add onclicks with it
        //i need to create SensorGraphs objects
        //the sensor graphs will draw on the first time and then update and refresh
        //from the buttons below
    }


    getSensorHTML(client) {
        let html = ""
        html += `<div class='sensor' ><h3>Sensor ID: `+this.id+`</h3>`
        html+=`<button class='btn-sm btn-warning' onclick='client.refresh()'>Refresh</button> `
        html+=`<br><input id='pick_date' type='date' name="date" value=""></input><button class='btn-sm btn-info' onclick='client.showByDay()'>Show by Day</button>`
        html+=`<br><button class='btn-sm btn-info' onclick='client.refresh()'>Show Last 50</button>`

        html += `<h5>${client.view == "last" ? "Showing Last 50" : "Showing Daily : " + client.specific_date}</h5>`
        

        //html+=`<button class='btn-sm btn-success' onclick='client.downloadExcel()'>DOWNLOAD EXCEL</button>`
        //html+= `<p>When you pick a sensor the graphs will show the latest 10 reports</p>`
        html += "<div class='graphs'> "
        for (let type in this.reports) {
            //show canvases
            html += "<h4>" + type + "</h4>"
            html += `<canvas  id="CANVAS_${type+"_"+this.id }"></canvas>`  
            html+=`<button class='btn-sm btn-success' onclick='client.downloadExcel("${this.id}" , "${type}")'>DOWNLOAD EXCEL</button>`

            //show reports
            
            html += `<p>Amount of reports: ${JSON.stringify(this.reports[type].length)}</p>`        
            if(this.reports[type].length > 0){
                //html += `<p>Last report: ${this.reports[this.reports[type].length - 1].report_date}</p>`        
            }  
        }
        html += "</div>"
        html += "</div> "
        return html
    }

    drawOnCanvases() {

        for (let type in this.reports) {
            console.log(this.reports[type])
            this.reports[type] = this.reports[type].reverse()
            const ctx = document.getElementById("CANVAS_"+type +"_"+this.id );
            const labels = this.getLabels(this.reports[type]);

            const data = {
                labels: labels,
                datasets: [{
                    label: [type],
                    data: this.getValuesForChart(this.reports[type]),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.3
                }]
            };

            const config = {
                type: 'line',
                data: data
                ,
                options:{
                    scales: {
                        x: {
                           ticks: {
                               display: false //this will remove only the label
                          }
                       }
                    }
            
                }
            };

            new Chart(ctx, config)
        }
    }



    getLabels(data) {
        const labels = []
        for (let x in data) {
            const data_pack = data[x]
            labels.push(data_pack.report_date + " " + data_pack.report_time)
        }
        return labels
    }

    getValuesForChart(data) {
        const values = []
        for (let x in data) {
            const data_pack = data[x]
            values.push(data_pack.report_data)
        }
        values.reverse()
        return values
    }

}