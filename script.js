const tableBody = document.getElementById('table-body');
const addButton = document.getElementById('add');

const checkRequest = document.getElementById('check_request');
const selectbox = document.getElementById('mySelect');
const requestDiv = document.getElementById('request');
const requestNum1 = document.getElementById('request1');
const requestNum2 = document.getElementById('request2');
const requestNum3 = document.getElementById('request3');

const output = document.getElementById('output');
const run = document.getElementById('run_algorithm');

let isRequest = false; // Use let instead of const

const data = [
    { id: "P1", max: [0, 0, 0], allocation: [0, 0, 0], available: [0, 0, 0] }
];

document.addEventListener('DOMContentLoaded', () => {
    requestNum1.value = 0;
    requestNum2.value = 0;
    requestNum3.value = 0;
    addData();
    selectbox.selectedIndex = 0; 
});

addButton.addEventListener('click', () => {
    addRow();
    console.log(data[data.length - 1]);
    addData();
    selectbox.selectedIndex = 0; 
});

checkRequest.addEventListener('change', () => {
    if (checkRequest.checked) {
        requestDiv.style.display = 'flex';
        isRequest = true;
    } else {
        requestDiv.style.display = 'none';
        isRequest = false;
    }
});

function addRow() {
    const newId = 'P' + (data.length + 1);
    const newRow = { id: newId, max: [0, 0, 0], allocation: [0, 0, 0], available: [0, 0, 0] };
    data.push(newRow);
}

function addData() {
    tableBody.innerHTML = '';
    selectbox.innerHTML = '';

    const createTableRow = (item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th>
                <input class="name_process" value="${item.id}">
            </th>
            <th>
                <div class="max_row_data">
                    <input type="number" value="${item.max[0]}" data-index="${index}" data-type="max" data-pos="0">
                    <input type="number" value="${item.max[1]}" data-index="${index}" data-type="max" data-pos="1">
                    <input type="number" value="${item.max[2]}" data-index="${index}" data-type="max" data-pos="2">
                </div>
            </th>
            <th>
                <div class="allocation_row_data">
                    <input type="number" value="${item.allocation[0]}" data-index="${index}" data-type="allocation" data-pos="0">
                    <input type="number" value="${item.allocation[1]}" data-index="${index}" data-type="allocation" data-pos="1">
                    <input type="number" value="${item.allocation[2]}" data-index="${index}" data-type="allocation" data-pos="2">
                </div>
            </th>
            <th>
                <div class="available_row_data">
                    <input type="number" value="${item.available[0]}" data-index="${index}" data-type="available" data-pos="0">
                    <input type="number" value="${item.available[1]}" data-index="${index}" data-type="available" data-pos="1">
                    <input type="number" value="${item.available[2]}" data-index="${index}" data-type="available" data-pos="2">
                </div>
            </th>
        `;

        row.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (confirm(`Are you sure you want to delete ${item.id}?`)) {
                removeRow(index);
            }
        });

        return row;
    };

    data.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.id;
        selectbox.appendChild(option);
        tableBody.appendChild(createTableRow(item, index));
    });

    document.querySelectorAll('#table-body input').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = e.target.getAttribute('data-index');
            const type = e.target.getAttribute('data-type');
            const pos = e.target.getAttribute('data-pos');
            data[index][type][pos] = parseInt(e.target.value, 10);
        });
    });
}

function removeRow(index) {
    data.splice(index, 1);
    addData();
}

function Banker() {
    // Banker algorithm implementation here
}

run.addEventListener('click', () => {
    let id = "";
    let num1 = 0;
    let num2 = 0;
    let num3 = 0;
    if (isRequest === true) {
        id = selectbox.value;
        num1 = parseInt(requestNum1.value, 10);
        num2 = parseInt(requestNum2.value, 10);
        num3 = parseInt(requestNum3.value, 10);
    }
    Banker();
});
