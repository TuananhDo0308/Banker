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
    console.log(data[0]);
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
    updateIds(); // Cập nhật lại ID sau khi xóa
    addData();
}

function updateIds() {
    data.forEach((item, index) => {
        item.id = 'P' + (index + 1);
    });
}

/******************************************BANKER BEGIN*********************************************/

function isSafe(available, max, allocation, need) {
    const work = available.slice();
    const finish = Array(max.length).fill(false);
    const safeSequence = [];

    const n = max.length;
    const m = available.length;

    while (true) {
        let found = false;
        for (let i = 0; i < n; i++) {
            if (!finish[i]) {
                let j;
                for (j = 0; j < m; j++) {
                    if (need[i][j] > work[j]) {
                        break;
                    }
                }
                if (j === m) {
                    for (let k = 0; k < m; k++) {
                        work[k] += allocation[i][k];
                    }
                    finish[i] = true;
                    found = true;
                    safeSequence.push(data[i].id);
                }
            }
        }
        if (!found) {
            break;
        }
    }

    return {
        isSafe: finish.every(f => f),
        safeSequence
    };
}

function Banker() {
    const available = data[0].available.slice();
    const max = data.map(p => p.max.slice());
    const allocation = data.map(p => p.allocation.slice());
    const need = data.map((p, i) => p.max.map((maxResource, j) => maxResource - p.allocation[j]));

    if (isRequest) {
        const processIndex = data.findIndex(p => p.id === selectbox.value);
        const request = [parseInt(requestNum1.value), parseInt(requestNum2.value), parseInt(requestNum3.value)];

        for (let i = 0; i < request.length; i++) {
            if (request[i] > need[processIndex][i]) {
                output.textContent = `Request exceeds maximum claim for ${selectbox.value}`;
                return;
            }
            if (request[i] > available[i]) {
                output.textContent = `Resources are not available for ${selectbox.value}`;
                return;
            }
        }

        for (let i = 0; i < request.length; i++) {
            available[i] -= request[i];
            allocation[processIndex][i] += request[i];
            need[processIndex][i] -= request[i];
        }

        const result = isSafe(available, max, allocation, need);

        if (result.isSafe) {
            data[0].available = available;
            data[processIndex].allocation = allocation[processIndex];
            output.innerHTML = `Request is granted for ${selectbox.value}<br>Safe sequence: ${result.safeSequence.join(', ')}`;
        } else {
            output.textContent = `Request cannot be granted as it leaves the system in an unsafe state for ${selectbox.value}`;
        }
    } else {
        const result = isSafe(available, max, allocation, need);
        if (result.isSafe) {
            output.innerHTML = `The system is in a safe state.<br>Safe sequence: ${result.safeSequence.join(', ')}`;
        } else {
            output.textContent = "The system is not in a safe state.";
        }
    }

    printNeedTable(need);
}

function printNeedTable(need) {
    let needTable = '<table><tr><th>Process</th><th>Need</th></tr>';
    data.forEach((process, index) => {
        needTable += `<tr><td>${process.id}</td><td>${need[index].join(', ')}</td></tr>`;
    });
    needTable += '</table>';
    output.innerHTML += `<br><br>Need Table:<br>${needTable}`;
}

/******************************************BANKER END*********************************************/

run.addEventListener('click', () => {
    Banker();
});
