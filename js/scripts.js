"use strict";

var tableData;
initTableData();
createTable();








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
        // xobj.open('GET', 'https://gist.githubusercontent.com/NikitaBonachev/870f68699f9a7bbf8d5c1434f6c7c3d1/raw/8d45e0f5b60b9dd6a5da1f0c957f3a22031fe102/data.json', true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }
}
