let current_page = 1;
const records_per_page = 10;
let totalPages = 0;
let intDATA = null;

let listing_table = document.querySelector('#catTable tbody');
const btn_next = document.getElementById("btn_next");
const btn_prev = document.getElementById("btn_prev");
let page_at = document.getElementById("page_at");
let page_total = document.getElementById("page_total");

let dayOrder, dayTotal, bestSeller;
let weekTime, yearTime;
let weekOrder, weekTotal;
let yearOrder, yearTotal;
let weekorderArray;
let weektotalArray;
let yearorderArray;
let yeartotalArray;

let data, table, sortCol;
let sortAsc = false;
const pageSize = 3;
let curPage = 1;

let createDaysChart, createMonthsChart;






async function getData(link, token_type, Method) {
    const response = await fetch(`https://freddy.codesubmit.io/${link}`, {
        headers: { "Authorization" : "Bearer " + sessionStorage.getItem(token_type) },
        method: Method
    });
    console.log(response);
    return await response.json();
}

// TABLE LOGIC 
function renderTable(blockDATA, pageNow) {
    // create html
    let result = '';
    if (blockDATA != "null") {
        blockDATA.slice(-10).forEach(row => {
            result += `<tr>
            <td>${row.product["name"]}</td>
            <td>${row.units}</td>
            <td>${row.revenue}</td>
            </tr>`;
        });
    } else {
        for (let i = (pageNow - 1) * records_per_page; i < (pageNow * records_per_page); i++) {
            result += `<tr>
                    <td>${bestSeller[i].product["name"]}</td>
                    <td>${bestSeller[i].units}</td>
                    <td>${bestSeller[i].revenue}</td>
                    </tr>`;
        }
    }

    listing_table.innerHTML = result;

    page_at.innerHTML = current_page;
    page_total.innerHTML = totalPages;

    if (current_page == 1) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (current_page == totalPages) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }
}


function prevPage() {
    if (current_page > 1) {
        current_page--;
        renderTable("null", current_page);
    }
}

function nextPage() {
    if ((current_page * records_per_page) < bestSeller.length) {
        current_page++;
        renderTable("null", current_page);
    }
}


function numPages(DATA) {
    return Math.ceil(DATA.length / records_per_page);
}


async function printChart() {
    createDaysChart = new Chart(
        document.getElementById('myDays'),
        config = {
            type: 'bar',
            data: {
                labels: ['today', 'yesterday', 'day3', 'day4', 'day5', 'day6', 'day7',],
                datasets: [{
                    label: "Revenue (last 7 days)",
                    data: weektotalArray,
                    backgroundColor: [
                        'rgba(201, 203, 207, 0.2)'
                    ],
                    borderColor: [
                        'rgb(201, 203, 207)'
                    ],
                    borderWidth: 1,
                    barThickness: 30
                }]
            },
            options: {}
        }
    );
    createMonthsChart = new Chart(
        document.getElementById('myMonths'),
        config = {
            type: 'bar',
            data: {
                labels: ['this month', 'last month', 'month 3', 'month 4', 'month 5', 'month 6', 'month 7', 'month 8', 'month 9', 'month 10', 'month 11', 'month 12'],
                datasets: [{
                    label: "Revenue (12 Months)",
                    data: yeartotalArray,
                    backgroundColor: [
                        'rgba(201, 203, 207, 0.2)'
                    ],
                    borderColor: [
                        'rgb(201, 203, 207)'
                    ],
                    borderWidth: 1,
                    barThickness: 30
                }]
            },
            options: {}
        }
    );

    document.querySelector("#revtoggle").addEventListener("click", function () {
        document.querySelector(".myD").classList.toggle("seeT");
        document.querySelector(".myM").classList.toggle("seeT");
        document.querySelector(".myDays").classList.toggle("seeT");
        document.querySelector(".myMonths").classList.toggle("seeT");
    });
}

window.onload = async () => {
    if (sessionStorage.getItem("access_token")) {
        intDATA = await getData("dashboard", "access_token", "GET");

        if (intDATA.msg) {
            alert(intDATA.msg);
        } else {
            // console.log(intDATA.dashboard);
            bestSeller = Object.keys(intDATA.dashboard.bestsellers).map(key => { return intDATA.dashboard.bestsellers[key]; });
            weekTime = Object.keys(intDATA.dashboard.sales_over_time_week).map(key => { return intDATA.dashboard.sales_over_time_week[key]; })
            yearTime = Object.keys(intDATA.dashboard.sales_over_time_year).map(key => { return intDATA.dashboard.sales_over_time_year[key]; })


            // Converting Object data to Array data
            weekorderArray = weekTime.map(obj => obj.orders);
            weektotalArray = weekTime.map(obj => obj.total);
            yearorderArray = yearTime.map(obj => obj.orders);
            yeartotalArray = yearTime.map(obj => obj.total);
          

            dayOrder = weekTime[0].orders;
            dayTotal = weekTime[0].total;
            weekOrder = weekorderArray.reduce((a, b) => a + b);
            weekTotal = weektotalArray.reduce((a, b) => a + b);
            yearOrder = yearorderArray.reduce((a, b) => a + b);
            yearTotal = yeartotalArray.reduce((a, b) => a + b);
       

            document.querySelector(".day").innerHTML = `${dayTotal}/ ${dayOrder} Orders`;
            document.querySelector(".week").innerHTML = `${weekTotal}/ ${weekOrder} Orders`;
            document.querySelector(".year").innerHTML = `${yearTotal}/ ${yearOrder} Orders`;
            
            totalPages = numPages(bestSeller);
            renderTable(bestSeller, current_page);
            printChart();
        }
        setInterval(async function () {
            newToken = await getData("refresh", "refresh_token", "POST");
            console.log(newToken);
            if (newToken.msg) {
                alert(newToken.msg);
            } else {
                sessionStorage.setItem("access_token", newToken.access_token);
            }
        }, 800000);
    } else {
        window.location = "./login.html";
        window.location.href(`${window.location}`);
    }
}

function logout() {
    sessionStorage.clear;
    window.location = "./login.html";
    window.location.href(`${window.location}`);
}
