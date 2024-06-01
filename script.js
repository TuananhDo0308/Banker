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

function isSafe(available, max, allocation, need) {
    let work = [available.slice()];

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
                    if (need[i][j] > work[work.length - 1][j]) {
                        break;
                    }
                }
                if (j === m) {
                    let nextWork = work[work.length - 1].slice();
                    for (let k = 0; k < m; k++) {
                        nextWork[k] += allocation[i][k];
                    }
                    work.push(nextWork);
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
        safeSequence: safeSequence,
        work: work
    };
}



function Banker() {
    output.innerHTML = "";
    const available = data[0].available.slice();
    const max = data.map(p => p.max.slice());
    const allocation = data.map(p => p.allocation.slice());
    const need = data.map((p, i) => p.max.map((maxResource, j) => maxResource - p.allocation[j]));
    printNeedTable(need);

    if (isRequest) {
        const processIndex = data.findIndex(p => p.id === selectbox.value);
        const request = [parseInt(requestNum1.value), parseInt(requestNum2.value), parseInt(requestNum3.value)];

        let outputDiv = document.createElement("div");
        let contentHTML = '';

        for (let i = 0; i < request.length; i++) {
            if (request[i] > need[processIndex][i]) {
                contentHTML += `<p class = "contentAnswer"><b>Request of P${processIndex + 1} 
                (${request[0]},${request[1]},${request[2]}) greater than  
                Need of P${processIndex + 1} (${need[processIndex][0]},${need[processIndex][1]},${need[processIndex][2]})
                 => unsatisfied.</b></p>`;
                outputDiv.innerHTML = contentHTML;
                output.appendChild(outputDiv);
                return;
            }
            if (request[i] > available[i]) {
                contentHTML += `<p class = "contentAnswer"><b>Request of P${processIndex + 1} 
                (${request[0]},${request[1]},${request[2]}) greater than  
                available (${available})
                 => unsatisfied.</b></p>`;
                outputDiv.innerHTML = contentHTML;
                output.appendChild(outputDiv);
                return;
            }
        }

        contentHTML += `<p class = "contentAnswer"><b>Request of P${processIndex + 1} 
                (${request[0]},${request[1]},${request[2]}) less or equal to  
                Need of P${processIndex + 1} (${need[processIndex][0]},${need[processIndex][1]},${need[processIndex][2]})
                 => satisfied.<br></b></p>`;
        outputDiv.innerHTML = contentHTML;
        output.appendChild(outputDiv);

        outputDiv = document.createElement("div");
        contentHTML = '';
        contentHTML += `<p class = "contentAnswer"><b>Request of P${processIndex + 1} 
                 (${request[0]},${request[1]},${request[2]}) less or equal to  
                 available (${available})
                  => satisfied.<br></b></p>`;

        outputDiv.innerHTML = contentHTML;
        output.appendChild(outputDiv);

        outputDiv = document.createElement("div");
        contentHTML = '';

        contentHTML += `<p class = "contentAnswer"><b>1.    Assume: Available = Available - Request P${processIndex + 1} ;
            Allocation P${processIndex + 1} = Allocation P${processIndex + 1} + P${processIndex + 1};
            <br>Need P${processIndex + 1} = Need P${processIndex + 1}- request P${processIndex + 1}<br></b></p>`;

        outputDiv.innerHTML = contentHTML;
        output.appendChild(outputDiv);

        for (let i = 0; i < request.length; i++) {
            available[i] -= request[i];
            allocation[processIndex][i] += request[i];
            need[processIndex][i] -= request[i];
        }
        
        printAssumeTable(allocation, need, available)

        console.log(`available: ${available}`);
        console.log(`max: ${max}`);
        console.log(`allocation: ${allocation}`);
        console.log(`need: ${need}`);

        const result = isSafe(available, max, allocation, need);
        
        console.log(result.work);
        outputDiv = document.createElement("div");
        contentHTML = '';

        contentHTML += `<p class = "contentAnswer"><b>2.  Safety Algorithm <br></b></p>`;

        outputDiv.innerHTML = contentHTML;
        output.appendChild(outputDiv);

        printWorkTable(result.work, result.safeSequence);

        outputDiv = document.createElement("div");
        contentHTML = '';

        if (result.isSafe) {
            data[0].available = available;
            data[processIndex].allocation = allocation[processIndex];
            contentHTML += `<p class = "contentAnswer"><b>Request is granted for ${selectbox.value}.<br>Safe sequence: ${result.safeSequence.join(', ')}</b></p>`;
        }
        else {
            contentHTML += `<p class = "contentAnswer"><b>Request cannot be granted as it leaves the system in an unsafe state for ${selectbox.value}</b></p>`;
        }

        outputDiv.innerHTML = contentHTML;
        output.appendChild(outputDiv);
    }
    else {
        let outputDiv = document.createElement("div");
        let contentHTML = '';
        const result = isSafe(available, max, allocation, need);
        printWorkTable(result.work, result.safeSequence);

        if (result.isSafe) {
            contentHTML += `<p class = "contentAnswer"><b>The system is in a safe state.<br>Safe sequence: ${result.safeSequence.join(', ')}</b></p>`;
        } else {
            contentHTML += `<p class = "contentAnswer"><b>The system is not in a safe state.</b></p>`;
        }
        outputDiv.innerHTML = contentHTML;
        output.appendChild(outputDiv);
    }
}

function printNeedTable(need) {
    let neeDivInput_container = document.createElement("div");
    let neeTable = document.createElement("table");
    neeDivInput_container.classList.add("input_container");
    neeTable.innerHTML = `
    <tr>
        <th>
            <div class="space">
            </div>
        </th>
        <th>Need</th>
    </tr>
    <tr>
        <th>
            <div class="space">
            </div>
        </th>
        <th>
            <div class="allocation_row_title">
                <p>R1</p>
                <p>R2</p>
                <p>R3</p>
            </div>
        </th>
    </tr>
    `
    neeDivInput_container.appendChild(neeTable);

    let neeDivScrollable_tbody = document.createElement('div');
    neeDivScrollable_tbody.classList.add("scrollable-tbody");

    neeTable = document.createElement("table");
    let neeTbody = document.createElement("tbody");
    neeTbody.classList.add("data-container");

    let contentTable = '';
    for (const i in need) {
        contentTable += `
        <tr>
            <th>
                <input class="name_process" value="P${parseInt(i) + 1}">
            </th>
            <th>
                <div class="allocation_row_data">
        `
        for (const j in need[i]) {
            contentTable += `<input type="number" value="${need[i][j]}" data-index="${i}" data-type="allocation" data-pos="${j}">`;
        }

        contentTable += `</div></th></tr>`;
    }

    neeTbody.innerHTML = contentTable;
    neeTable.appendChild(neeTbody);
    neeDivScrollable_tbody.appendChild(neeTable);
    neeDivInput_container.appendChild(neeDivScrollable_tbody);
    output.appendChild(neeDivInput_container);


}
function printWorkTable(work, safeSequence) {
    let workivInput_container = document.createElement("div");
    let worTable = document.createElement("table");
    const arrSafeSequence = Object.values(safeSequence);
    workivInput_container.classList.add("input_container");
    worTable.innerHTML = `
    <tr>
        <th>
            <div class="space">
            </div>
        </th>
        <th>work</th>
    </tr>
    <tr>
        <th>
            <div class="space">
            </div>
        </th>
        <th>
            <div class="allocation_row_title">
                <p>R1</p>
                <p>R2</p>
                <p>R3</p>
            </div>
        </th>
    </tr>
    `
    workivInput_container.appendChild(worTable);

    let workivScrollable_tbody = document.createElement('div');
    workivScrollable_tbody.classList.add("scrollable-tbody");

    worTable = document.createElement("table");
    let worTbody = document.createElement("tbody");
    worTbody.classList.add("data-container");

    let cnt = 0;
    let contentTable = '';
    for (const i in work) {
        if (cnt == 0) {
            contentTable += `
                <tr>
                <th>
                    <input class="name_process" value="init">
                </th>
                <th>
                    <div class="allocation_row_data">
            `
        }
        else {
            contentTable += `
            <tr>
                <th>
                    <input class="name_process" value="${arrSafeSequence[cnt - 1]}">
                </th>
                <th>
                    <div class="allocation_row_data">
            `
        }

        for (const j in work[i]) {
            contentTable += `<input type="number" value="${work[i][j]}" data-index="${i}" data-type="allocation" data-pos="${j}">`;
        }

        contentTable += `</div></th></tr>`;
        cnt++;
    }

    worTbody.innerHTML = contentTable;
    worTable.appendChild(worTbody);
    workivScrollable_tbody.appendChild(worTable);
    workivInput_container.appendChild(workivScrollable_tbody);
    output.appendChild(workivInput_container);
}

function printAssumeTable(allocation, need, available) {
    let neeDivInput_container = document.createElement("div");
    let neeTable = document.createElement("table");
    neeDivInput_container.classList.add("input_container");
    neeTable.innerHTML = `
                    <tr>
                        <th>
                            <div class="space">
                            </div>
                        </th>
                        <th>Allocation</th>
                        <th>Need</th>
                        <th>Available</th>
                    </tr>
                    <tr>
                        <th>
                            <div class="space">
                            </div>
                        </th>
                        <th>
                            <div class="max_row_title">
                                <p>R1</p>
                                <p>R2</p>
                                <p>R3</p>
                            </div>
                        </th>
                        <th>
                            <div class="allocation_row_title">
                                <p>R1</p>
                                <p>R2</p>
                                <p>R3</p>
                            </div>
                        </th>
                        <th>
                            <div class="available_row_title">
                                <p>R1</p>
                                <p>R2</p>
                                <p>R3</p>
                            </div>
                        </th>
                    </tr>
    `
    neeDivInput_container.appendChild(neeTable);

    let neeDivScrollable_tbody = document.createElement('div');
    neeDivScrollable_tbody.classList.add("scrollable-tbody");

    neeTable = document.createElement("table");
    let neeTbody = document.createElement("tbody");
    neeTbody.classList.add("data-container");

    let tmp = available.slice();
    let contentTable = '';
    for (let index = 0; index < allocation.length; index++) {
        contentTable += `
        <tr>
            <th>
                <input class="name_process" value="P${index + 1}">
            </th>
            <th>
                <div class="max_row_data">
                    <input type="number" value="${allocation[index][0]}" data-index="${index}" data-type="max" data-pos="0">
                    <input type="number" value="${allocation[index][1]}" data-index="${index}" data-type="max" data-pos="1">
                    <input type="number" value="${allocation[index][2]}" data-index="${index}" data-type="max" data-pos="2">
                </div>
            </th>
            <th>
                <div class="allocation_row_data">
                    <input type="number" value="${need[index][0]}" data-index="${index}" data-type="allocation" data-pos="0">
                    <input type="number" value="${need[index][1]}" data-index="${index}" data-type="allocation" data-pos="1">
                    <input type="number" value="${need[index][2]}" data-index="${index}" data-type="allocation" data-pos="2">
                </div>
            </th>
            <th>
                <div class="available_row_data">
                    <input type="number" value="${tmp[0]}" data-index="${index}" data-type="available" data-pos="0">
                    <input type="number" value="${tmp[1]}" data-index="${index}" data-type="available" data-pos="1">
                    <input type="number" value="${tmp[2]}" data-index="${index}" data-type="available" data-pos="2">
                </div>
            </th>
        </tr>
        `
        tmp[0] = tmp[1] = tmp[2] = 0;
    }

    neeTbody.innerHTML = contentTable;
    neeTable.appendChild(neeTbody);
    neeDivScrollable_tbody.appendChild(neeTable);
    neeDivInput_container.appendChild(neeDivScrollable_tbody);
    output.appendChild(neeDivInput_container);

}
/******************************************BANKER END*********************************************/

run.addEventListener('click', () => {
    Banker();
});

