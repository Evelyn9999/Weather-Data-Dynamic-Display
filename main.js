const content = document.getElementById("content");

function fetchData(endpoint) {
    return fetch(`https://webapi19sa-1.course.tamk.cloud/v1/weather/${endpoint}`).then((response) =>
        response.json()
    );
}

function createTable(data, columns, tableClass) {
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    table.classList.add(tableClass);

    columns.forEach((column) => {
        const th = document.createElement("th");
        th.textContent = column.header;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    data.forEach((row, index) => {
        const tr = document.createElement("tr");

        columns.forEach((column) => {
            const td = document.createElement("td");
            td.textContent = column.value(row, index);
            tr.appendChild(td);
        });

        table.appendChild(tr);
    });

    return table;
}

function showView1() {
    fetchData("").then((data) => {
        const tableData = data.slice(0, 30).reverse();
        const leftTableData = tableData.slice(0, 15);
        const rightTableData = tableData.slice(15);

        const leftTable = createTable(leftTableData, [
            { header: "Row", value: (_, index) => index + 1 },
            { header: "Date", value: (row) => row.date_time.split('T')[0] },
            { header: "Time", value: (row) => row.date_time.split('T')[1] },
            { header: "Measurement Type", value: (row) => Object.keys(row.data)[0] },
            { header: "Measured Value", value: (row) => Object.values(row.data)}
        ], 'view1-table');

        const rightTable = createTable(rightTableData, [
            { header: "Row", value: (_, index) => index + 16 },
            { header: "Date", value: (row) => row.date_time.split('T')[0] },
            { header: "Time", value: (row) => row.date_time.split('T')[1] },
            { header: "Measurement Type", value: (row) => Object.keys(row.data)[0] },
            { header: "Measured Value", value: (row) => Object.values(row.data)[0] },
        ], 'view1-table');

        document.getElementById("chartWrapper").innerHTML = '';
        const pieCanvas = document.createElement('canvas');
        pieCanvas.id = 'pieChart';
        pieCanvas.width = 100;
        pieCanvas.height = 100;
        pieCanvas.classList.add('scaled-pie-chart'); // Add the new CSS class

        // Create a container for the table and chart
        const tableChartContainer = document.createElement('div');
        tableChartContainer.classList.add('table-chart-container');

        // Create a container for the two tables
        const tablesContainer = document.createElement('div');
        tablesContainer.classList.add('tables-container');

        // Append the tables to the tablesContainer
        tablesContainer.appendChild(leftTable);
        tablesContainer.appendChild(rightTable);

        // Append the tablesContainer and chart to the tableChartContainer
        tableChartContainer.appendChild(tablesContainer);
        tableChartContainer.appendChild(pieCanvas);

        content.innerHTML = "";
        content.appendChild(tableChartContainer);

        createPieChart(tableData, 'pieChart');
    });
}

function showView2(hours = 20) {
    fetchData(`temperature/${hours}`).then((data) => {
        let slicedData = hours == 20 ? data.slice(0, 20) : data;
        const table = createTable(slicedData.reverse(),[
            { header: "Row", value: (_, index) => index + 1 },
            { header: "Date", value: (row) => row.date_time.split('T')[0] },
            { header: "Time", value: (row) => row.date_time.split('T')[1] },
            { header: "Temperature", value: (row) => row.temperature },
        ], 'view2-table');

        const chartCanvas = document.createElement('canvas');
        chartCanvas.id = 'tempChart';
        chartCanvas.width = 700;
        chartCanvas.height = 450;

        const intervalDropdown = createTimeIntervalDropdown(showView2);
        intervalDropdown.value = hours; // Set the selected value for intervalDropdown

        content.innerHTML = '';
        content.appendChild(intervalDropdown);
        content.appendChild(table);
        document.getElementById("chartWrapper").innerHTML = '';
        document.getElementById("chartWrapper").appendChild(chartCanvas);

        createBarChart(data, 'temperature', 'tempChart');
    });
}

function showView3(hours = 20) {
    fetchData(`wind_speed/${hours}`).then((data) => {
        let slicedData = hours == 20 ? data.slice(0, 20) : data;
        const table = createTable(slicedData.reverse(), [
            { header: "Row", value: (_, index) => index + 1 },
            { header: "Date", value: (row) => row.date_time.split('T')[0] },
            { header: "Time", value: (row) => row.date_time.split('T')[1] },
            { header: "Wind Speed", value: (row) => row.wind_speed },
        ], 'view3-table');

        const chartCanvas = document.createElement('canvas');
        chartCanvas.id = 'windSpeedChart';
        chartCanvas.width = 700;
        chartCanvas.height = 450;

        const intervalDropdown = createTimeIntervalDropdown(showView3);
        intervalDropdown.value = hours; // Set the selected value for intervalDropdown

        content.innerHTML = '';
        content.appendChild(intervalDropdown);
        content.appendChild(table);
        document.getElementById("chartWrapper").innerHTML = '';
        document.getElementById("chartWrapper").appendChild(chartCanvas);

        createBarChart(data, 'wind_speed', 'windSpeedChart');
    });
}


function showView4() {
    const infoDiv = document.createElement("div");
    infoDiv.innerHTML = `
        <h2>Info</h2>
        <p>Author: Evelyn Yue Liang</p>
        <p>Email: yue.liang@tuni.fi</p>
        <p>
            All images and graphics are created by the author, and their use is
            permitted within this project.
        </p>
        <form id="commentForm">
            <textarea id="commentBox" rows="4" cols="50" placeholder="If you have any comments or suggestions, please leave us a message!"></textarea>
            <br>
            <input type="submit" value="Submit">
        </form>
    `;

    const infoImage = document.createElement("img");
    infoImage.src = "https://i.ibb.co/7NZWRy7/image5.jpg";
    infoImage.classList.add("info-image");

    const infoImageContainer = document.createElement("div");
    infoImageContainer.classList.add("info-image-container");
    infoImageContainer.appendChild(infoDiv);
    infoImageContainer.appendChild(infoImage);

    content.innerHTML = "";
    content.appendChild(infoImageContainer);
    document.getElementById("chartWrapper").innerHTML = ''; // Clear the chartWrapper content

    content.innerHTML = "";
    content.appendChild(infoImageContainer);
    document.getElementById("chartWrapper").innerHTML = ""; // Clear the chartWrapper content

    // Add an event listener to handle the form submission
    document.getElementById("commentForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const commentBox = document.getElementById("commentBox");
        const comment = commentBox.value;

        // Process the user input
        console.log("User comment:", comment);

        // Clear the textarea after processing the input
        commentBox.value = "";
    });
}

function showView5(hours = 20, measurementType = 'temperature') {
    fetchData(`${measurementType}/${hours}`).then((data) => {
        let slicedData = hours == 20 ? data.slice(0, 25) : data;
        const table = createTable(slicedData.reverse(),[
            { header: "Row", value: (_, index) => index + 1 },
            { header: "Date", value: (row) => row.date_time.split('T')[0] },
            { header: "Time", value: (row) => row.date_time.split('T')[1] },
            { header: "Measurement Value", value: (row) => row[measurementType] },
        ], 'view5-table');

        const chartCanvas = document.createElement('canvas');
        chartCanvas.id = 'customChart';
        chartCanvas.width = 700;
        chartCanvas.height = 450;

        const intervalDropdown = createTimeIntervalDropdown((newHours) => showView5(newHours, measurementType));
        intervalDropdown.value = hours; // Set the selected value for intervalDropdown
        const measurementTypeDropdown = createMeasurementTypeDropdown((newType) => showView5(hours, newType));
        measurementTypeDropdown.value = measurementType; // Set the selected value for measurementTypeDropdown

        content.innerHTML = '';
        content.appendChild(intervalDropdown);
        content.appendChild(measurementTypeDropdown);
        content.appendChild(table);
        document.getElementById("chartWrapper").innerHTML = '';
        document.getElementById("chartWrapper").appendChild(chartCanvas);

        createLineChart(data, measurementType, 'customChart');
    });
}

function createBarChart(data, label, canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const chartData = data.map(row => row[label]);
    const labels = data.map(row => row.date_time);

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: chartData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: (80 / 100) * 12 // 80% of the default font size (12)
                        }
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createTimeIntervalDropdown(viewFunction) {
    const select = document.createElement('select');
    const timeIntervals = [
        { value: '20', text: 'Now' },
        { value: '24', text: '24 hours' },
        { value: '48', text: '48 hours' },
        { value: '72', text: '72 hours' },
        { value: '168', text: '1 week' }
    ];

    timeIntervals.forEach(interval => {
        const option = document.createElement('option');
        option.value = interval.value;
        option.textContent = interval.text;
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        viewFunction(select.value);
    });

    return select;
}


function createMeasurementTypeDropdown(viewFunction) {
    const select = document.createElement('select');
    const measurementTypes = [
        { value: 'temperature', text: 'Temperature' },
        { value: 'wind_speed', text: 'Wind Speed' },
        { value: 'wind_direction', text: 'Wind Direction' },
        { value: 'light', text: 'Light' },
        { value: 'rain', text: 'Rain' },
    ];

    measurementTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.text;
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        viewFunction(select.value);
    });

    return select;
}

function createLineChart(data, label, canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const chartData = data.map(row => row[label]);
    const labels = data.map(row => row.date_time);

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: chartData,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: (80 / 100) * 12 // 80% of the default font size (12)
                        }
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createPieChart(data, canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const measurementTypeCounts = data.reduce((acc, row) => {
        const type = Object.keys(row.data)[0];
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.values(measurementTypeCounts);
    const labels = Object.keys(measurementTypeCounts);

    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: chartData,
                backgroundColor: ['#483D8B', '#36A2EB', '#B0C4DE', '#4BC0C0',
                                  '#9966FF', '#0000FF', '#ADD8E6', '#4682B4']
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom',
                    align: 'start',
                    labels: {
                        font: {
                            size: 50
                        },
                        boxWidth: 20,
                        padding: 20,
                        sort: function(a, b, data) {
                            // Sort by value in descending order
                            return data.datasets[0].data[b.datasetIndex] - data.datasets[0].data[a.datasetIndex];
                        },
                        reverse: false,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map(function(label, i) {
                                return {
                                    text: label + ': ' + data.datasets[0].data[i],
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: '#ffffff',
                                    lineWidth: 2,
                                    hidden: isNaN(data.datasets[0].data[i]),

                                    // Extra data used for toggling the correct item
                                    index: i
                                };
                            });
                        }
                    }
                }
            },
        }
    });
}

function changeImage(imageUrl) {
    document.getElementById("imageWrapper").style.backgroundImage = `url(${imageUrl})`;
}


document.getElementById("view1").addEventListener("click", () => { showView1(); changeImage("image_url_1"); });
document.getElementById("view2").addEventListener("click", () => { showView2(); changeImage("image_url_2"); });
document.getElementById("view3").addEventListener("click", () => { showView3(); changeImage("image_url_3"); });
document.getElementById("view4").addEventListener("click", () => { showView4(); changeImage("image_url_4"); });
document.getElementById("view5").addEventListener("click", () => { showView5(); changeImage("image_url_5"); });

showView1(); // Show View 1 by default when the page loads