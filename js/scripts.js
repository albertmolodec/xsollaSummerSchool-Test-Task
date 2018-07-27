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

fillProjects();
fillFilterColumns();
var filterableRows;

filterBtn.addEventListener('click', function () {
    filterableRows = getSuitableRows(columnSelector.value, filterableText.value);
    updateTable(filterableRows);
});

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






function getSuitableRows(columnName, filterableText) {
    filterableText = filterableText.toLowerCase();
    var suitableRows = [];

    if (columnName === '#') {
        suitableRows.push(filterableText);
    } else {
        for (var rowNumber = 0; rowNumber < tableData.length; rowNumber++) {
            if (tableData[rowNumber][columnName] === null) continue;

            var isInTable = tableData[rowNumber][columnName].toLowerCase().indexOf(filterableText);
            if (~isInTable) {
                suitableRows.push(rowNumber);
            }
        }
    }
    return suitableRows;
}

function fillProjects() {
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

function updateTable(neededRows) {
    xsollaTable.tBodies[0].innerHTML = "";

    for (var rowNumber = 0; rowNumber < neededRows.length; rowNumber++) {
        addRow(tableData, neededRows[rowNumber]);
    }
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