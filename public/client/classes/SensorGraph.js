class SensorGraph{
    sensor_id
    
    viewType = "amount" //per - amount/day    
    //if day
    viewDate
    
    //if amount
    viewAmount = 10
    viewOffset = 0
    
    baseElementName
    elementName
    canvasName
    
    data = []
    


    constructor(baseElementName){
        this.baseElementName = baseElementName 
    }

    fillData(){
        if(this.viewType == "amount"){
            
        }else if(this.viewType == "day"){

        }else{
            alert("viewTYPE not defined");
        }
    }
    
    displayGraph(){

    }

    //buttons


    forwardOffset(){

    }

    backOffset(){

    }

    nextDay(){

    }

    prevDay(){

    }

}