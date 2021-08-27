$(document).ready(function(){
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    // Draw the chart and set the chart values
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Work', 8],
            ['Eat', 2],
            ['TV', 4],
            ['Gym', 2],
            ['Sleep', 8]
        ]);

        // Optional; add a title and set the width and height of the chart
        var options = {'title':'My Average Day'};

        // Display the chart inside the <div> element with id="piechart"
        var chart = new google.visualization.PieChart(document.getElementById('chart2'));
        chart.draw(data, options);


        var data = google.visualization.arrayToDataTable([
            ['Element', 'Density', { role: 'style' }],
            ['Copper', 8.94, '#b87333'],            // RGB value
            ['Silver', 10.49, 'silver'],            // English color name
            ['Gold', 19.30, 'gold'],
   
            ['Platinum', 21.45, 'color: #e5e4e2' ], // CSS-style declaration
        ]);
        
        // data.addColumn('timeofday', 'Time of Day');
        // data.addColumn('number', 'Motivation Level');

        var options = {
            title: 'Motivation  Level Throughout the Day',
            // hAxis: {
            //     // title: 'Time of Day',
            //     // format: 'h:mm a',
            //     // viewWindow: {
            //     //     min: [7, 30, 0],
            //     //     max: [17, 30, 0]
            //     // }
            // },
            // vAxis: {
            //     // title: 'Rating (scale of 1-10)'
            // }
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('chart1'));
        chart.draw(data, options);
    }
    
});