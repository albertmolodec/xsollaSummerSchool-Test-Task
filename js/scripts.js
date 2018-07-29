"use strict";

var originalData;
var tableColumns = [
    '#',
    'Country',
    'User ID',
    'Email',
    'Project',
    'Virtual item',
    'Virtual price',
    'Payment price',
    'Payment method',
    'Transaction ID',
    'Date',
    'Subscription'
];
loadOriginalData();
var tableData = generateTableData(originalData);

createTable();

fillProjectsList();
fillFilterColumns();
var filterableRows;

var popularPaymentMethods = getPopularPaymentMethods();
drawPaymentsDoughnutChart('paymentsDoughnutChart');
drawPaymentsLineChart('paymentsLineChart');

filterableText.addEventListener('input', function() {
    filterableRows = getSuitableRows(columnSelector.value, filterableText.value);
    updateTable(filterableRows);
});

columnSelector.addEventListener('change', function() {
    filterableText.value = '';
    updateTable(filterableRows, false);
})



function getSuitableRows(columnName, filterableText) {
    filterableText = filterableText.toLowerCase();
    var suitableRows = [];

    if (columnName === '#' && isNumeric(filterableText)) {
        suitableRows.push(filterableText);
    } 
    else if (columnName !== '#'){
        for (var rowNumber = 0; rowNumber < tableData.length; rowNumber++) {
            if (tableData[rowNumber][columnName] === null) continue;

            var isInTable = tableData[rowNumber][columnName].toLowerCase().indexOf(filterableText);
            if (~isInTable) {
                suitableRows.push(rowNumber);
            }
        }
    }
    else {
        suitableRows = getAllRowNumbers();
    }

    return suitableRows;

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function getAllRowNumbers() {
        var rowNumbers = [];
        for (var i = 0; i < tableData.length; i++) {
            rowNumbers.push(i);
        }
        return rowNumbers;
    }
}

function sortColumn(columnNumber, type) {
    var tbody = xsollaTable.tBodies[0];
    var thead = xsollaTable.tHead;
    var rowsArray = [].slice.call(tbody.rows);

    var compare;
    switch (type) {
        case 'number':
            compare = function (rowA, rowB) {
                var numberA = Number(rowA.cells[columnNumber].textContent.split(' ')[0]);
                var numberB = Number(rowB.cells[columnNumber].textContent.split(' ')[0]);
                return numberA - numberB;
            };
            break;
        case 'string':
            compare = function (rowA, rowB) {
                var stringA = rowA.cells[columnNumber].textContent;
                var stringB = rowB.cells[columnNumber].textContent;
                if (stringA > stringB) return 1;
                if (stringA < stringB) return -1;
            };
            break;
        case 'date':
            compare = function (rowA, rowB) {
                var dateA = new Date(rowA.cells[columnNumber].textContent);
                var dateB = new Date(rowB.cells[columnNumber].textContent);
                if (dateA > dateB) return 1;
                if (dateA < dateB) return -1;
            };
            break;
    }

    rowsArray.sort(compare);

    if (!getClass() || getClass() === 'sort-down') {
        removeAllSortClasses();
        thead.firstElementChild.cells[columnNumber].classList.add('sort-up');
    } else {
        rowsArray.reverse();
        removeAllSortClasses();
        thead.firstElementChild.cells[columnNumber].classList.add('sort-down');
    }

    xsollaTable.removeChild(tbody);
    for (var i = 0; i < rowsArray.length; i++) {
        tbody.appendChild(rowsArray[i]);
    }
    xsollaTable.appendChild(tbody);




    function removeAllSortClasses() {
        var theadLength = thead.firstElementChild.children.length;
        for (var thNumber = 0; thNumber < theadLength; thNumber++) {
            thead.firstElementChild.cells[thNumber].classList.remove('sort-up');
            thead.firstElementChild.cells[thNumber].classList.remove('sort-down');
        }
    }

    function getClass() {
        var classList = thead.firstElementChild.cells[columnNumber].classList.toString();
        if (~classList.indexOf('sort-up')) return 'sort-up';
        if (~classList.indexOf('sort-down')) return 'sort-down';
        return false;
    }
}

function drawPaymentsDoughnutChart(chartId) {
    var ctx = document.getElementById(chartId).getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'doughnut',

        // The data for our dataset
        data: {
            labels: popularPaymentMethods.names,
            datasets: [{
                label: "Payment Methods Popularity",
                backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#00ffcc', '#6600cc', '#36ea7f', '#ea7e36', '#35a32e', '#2e35a3'],
                data: popularPaymentMethods.amounts,
            }]
        },

        options: {

        }
    });
}

function drawPaymentsLineChart(chartId) {
    var ctx = document.getElementById(chartId).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',

        data: {
            labels: popularPaymentMethods.names,
            datasets: [{
                label: "Payment Methods Popularity",
                backgroundColor: '#ff005b',
                borderColor: '#ff005b',
                data: popularPaymentMethods.amounts,
                showLine: false
            }]
        },

        options: {
            elements: {
                point: {
                    pointStyle: 'rectRounded'
                }
            }
        }
    });    
}






function getPopularPaymentMethods() {
    var paymentMethodNames = [];
    var paymentMethodAmounts = [];

    for (var transactionNumber = 0; transactionNumber < tableData.length; transactionNumber++) {
        var paymentMethodName = tableData[transactionNumber]['Payment method'];
        var indexInArray = paymentMethodNames.indexOf(paymentMethodName)
        if (indexInArray === -1) {
            paymentMethodNames.push(paymentMethodName);
            paymentMethodAmounts.push(1);
        } else {
            paymentMethodAmounts[indexInArray]++;
        }
    }

    return { names : paymentMethodNames, amounts : paymentMethodAmounts};
}

function fillProjectsList() {
    var uniqueProjects = [];

    for (var rowNumber = 0; rowNumber < tableData.length; rowNumber++) {
        var projectName = tableData[rowNumber]['Project'];
        if (uniqueProjects.indexOf(projectName) === -1) {
            uniqueProjects.push(projectName);
        }
    }

    uniqueProjects.forEach(projectName => {
        var li = document.createElement('li');
        li.textContent = projectName;
        projectsList.appendChild(li);
    });
}

function fillFilterColumns() {
    tableColumns.forEach(columnName => {
        var opt = document.createElement('option');
        opt.textContent = columnName;
        columnSelector.appendChild(opt);
    });
}

function createTable() {
    for (var rowNumber = 0; rowNumber < tableData.length; rowNumber++) {
        addRow(tableData, rowNumber);
    }
}

function updateTable(suitableRows) {
    if (suitableRows.length === 0) {
        suitableRows = getAllRowNumbers;
    }

    function getAllRowNumbers() {
        var rowNumbers = [];
        for (var i = 0; i < tableData.length; i++) {
            rowNumbers.push(i);
        }
        return rowNumbers;
    }

    xsollaTable.tBodies[0].innerHTML = "";

    suitableRows.forEach(rowNumber => {
        addRow(tableData, rowNumber);
    });
}

function generateTableData(originalData) {
    var tableData = [];

    for (var i = 0; i < originalData.length; i++) {
        var originalRow = originalData[i];
        var transactionDate = new Date(originalRow.transaction.transfer_date);
        var row = {
            'Country': originalRow.user.country,
            'User ID': originalRow.user.id,
            'Email': originalRow.user.email,
            'Project': originalRow.transaction.project.name,
            'Virtual item': originalRow.purchase.virtual_items,
            'Virtual price': originalRow.purchase.virtual_currency.amount + ' ' + originalRow.purchase.virtual_currency.name,
            'Payment price': originalRow.payment_details.payment.amount + ' ' + originalRow.payment_details.payment.currency,
            'Payment method': originalRow.transaction.payment_method.name,
            'Transaction ID': originalRow.transaction.id,
            'Date': transactionDate.toLocaleDateString('ru'),
            'Subscription': originalRow.purchase.subscription.name
        }
        tableData.push(row);
    }

    return tableData;
}

function addRow(tableData, rowNumber) {
    var row = xsollaTable.tBodies[0].insertRow();
    var note = tableData[rowNumber];

    addCell(rowNumber, tableColumns[0]);
    for (var columnNumber = 1; columnNumber < tableColumns.length; columnNumber++) {
        addCell(note[tableColumns[columnNumber]], tableColumns[columnNumber]);
    }

    function addCell(text, dataTh) {
        var td = document.createElement('td');
        td.setAttribute('data-th', dataTh)
        td.textContent = text;
        row.appendChild(td);
    }
};




function loadOriginalData() {
    loadRemoteJSON(function (response) {
        // Parse JSON string into object
        originalData = JSON.parse(response);
    });

    function loadRemoteJSON(callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', './data.json', false);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }
}