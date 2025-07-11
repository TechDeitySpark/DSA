// binary-search.js - Interactive Binary Search Visualization
let array = [];
let isRunning = false;
let currentStep = 0;

function generateArray() {
    if (isRunning) return;
    array = [];
    for (let i = 0; i < 10; i++) {
        array.push(Math.floor(Math.random() * 90) + 10);
    }
    array.sort((a, b) => a - b);
    renderArray();
    resetInfo();
}

function renderArray(active = -1, found = -1, searched = []) {
    const visualization = document.getElementById('visualization');
    visualization.innerHTML = '';
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value * 1.2}px`;
        bar.textContent = value;
        bar.id = `bar-${index}`;
        if (index === active) bar.classList.add('active');
        if (index === found) bar.classList.add('found');
        if (searched.includes(index)) bar.classList.add('searched');
        visualization.appendChild(bar);
    });
}

function resetInfo() {
    document.getElementById('stepInfo').textContent = "Ready! Enter a number and click 'Start Search'.";
    document.getElementById('explanation').textContent = "Binary Search works by repeatedly dividing the sorted array in half, comparing the target value to the middle element.";
    document.getElementById('searchInput').value = '';
    isRunning = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSearch() {
    if (isRunning) return;
    isRunning = true;
    const target = parseInt(document.getElementById('searchInput').value);
    if (isNaN(target)) {
        document.getElementById('stepInfo').textContent = 'Please enter a valid number.';
        isRunning = false;
        return;
    }
    let left = 0, right = array.length - 1;
    let step = 1;
    let searched = [];
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        renderArray(mid, -1, searched);
        document.getElementById('stepInfo').textContent = `Step ${step}: Checking index ${mid} (value: ${array[mid]})`;
        document.getElementById('explanation').textContent = `Comparing target (${target}) with middle value (${array[mid]}).`;
        await sleep(1200);
        if (array[mid] === target) {
            renderArray(mid, mid, searched);
            document.getElementById('stepInfo').textContent = `Found ${target} at index ${mid}!`;
            document.getElementById('explanation').textContent = `Success! The value ${target} was found at index ${mid}.`;
            isRunning = false;
            return;
        } else if (array[mid] < target) {
            searched.push(mid);
            left = mid + 1;
            document.getElementById('explanation').textContent = `Target is greater than ${array[mid]}. Searching right half.`;
        } else {
            searched.push(mid);
            right = mid - 1;
            document.getElementById('explanation').textContent = `Target is less than ${array[mid]}. Searching left half.`;
        }
        step++;
        await sleep(800);
    }
    renderArray(-1, -1, searched);
    document.getElementById('stepInfo').textContent = `Not found!`;
    document.getElementById('explanation').textContent = `The value ${target} is not present in the array.`;
    isRunning = false;
}

window.onload = function() {
    generateArray();
    // Attach event listeners for accessibility
    document.getElementById('searchBtn').onclick = startSearch;
    document.getElementById('searchInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') startSearch();
    });
    document.querySelector('.btn-primary').onclick = generateArray;
    document.querySelector('.btn-success').onclick = resetInfo;
    if (typeof goBack === 'undefined') {
        window.goBack = function() { window.location.href = '../../index.html'; };
    }
};
