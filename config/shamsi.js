module.exports =  function(date){
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var kabise = Math.floor((year-1)/4);
    var kabise2 = Math.floor((year - (2020 - 1399) - 1)/4);
    var month2day = [31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
    var daySum = (year-1)*365 + (month2day[month - 2]) + day - 226899 + kabise - kabise2;
    year = Math.floor(daySum/365) + 1;
    var monthSum = [31, 62, 93, 142, 155, 186, 216, 246, 276, 306, 336, 365];
    for(var i=0; i<12; i++){
        if(daySum%365 < monthSum[i]){
            month = i + 1;
            break;
        }
    }
    day = (daySum%365) - monthSum[month - 2] + 1;
    return(`${year}, ${month}, ${day}`);
};