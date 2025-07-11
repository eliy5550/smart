

module.exports = {
    getCurrentDateTime() {
        const now = new Date();
    
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');  // Months are 0-based, so add 1
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        

        return {date : `${year}-${month}-${day}` , time : `${hours}:${minutes}:${seconds}`}

    }

}