"use strict";

var tableData;
initTableData();
createTable();
fillProjects();

filterBtn.addEventListener('click', function () {
    createTable()
});





function fillProjects() {
    var uniqueProjects = [];

    for (var i = 0; i < tableData.length; i++) {
        var projectName = tableData[i].transaction.project.name;
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

function createTable() {
    for (var i = 0; i < tableData.length; i++) {
        addRow(xsollaTable, tableData, i);
    }

    function addRow(idTable, tableData, i) {
        var row = idTable.tBodies[0].insertRow();
        var note = tableData[i];

        addCell(i + 1, '#');
        addCell(note.user.country, 'Country');
        addCell(note.user.id, 'User ID');
        addCell(note.user.email, 'Email');
        addCell(note.transaction.project.name, 'Project');
        addCell(note.purchase.virtual_items, 'Virtual item');
        addCell(note.purchase.virtual_currency.amount + ' ' + note.purchase.virtual_currency.name, 'Virtual price');
        addCell(note.payment_details.payment.amount + ' ' + note.payment_details.payment.currency, 'Payment price');
        addCell(note.transaction.payment_method.name, 'Payment method');
        addCell(note.transaction.id, 'Transaction ID');
        var transactionDate = new Date(note.transaction.transfer_date);
        addCell(transactionDate.toLocaleDateString('ru'), 'Date');
        addCell(note.purchase.subscription.name, 'Subscription');

        function addCell(text, dataTh) {
            var td = document.createElement('td');
            td.setAttribute('data-th', dataTh)
            td.textContent = text;
            row.appendChild(td);
        }
    };
}

function initTableData(type) {
    loadRemoteJSON(function (response) {
        // Parse JSON string into object
        tableData = JSON.parse(response);
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