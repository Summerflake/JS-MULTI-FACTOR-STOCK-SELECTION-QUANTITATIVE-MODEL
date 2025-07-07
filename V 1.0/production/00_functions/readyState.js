function executeOnReady(localStorageKey, callback) {
    const intervalId = setInterval(() => {
        if (localStorage.getItem(localStorageKey) === '1') {
            clearInterval(intervalId); // Stop polling
            callback(); // Execute the provided function
        }
    }, 100);
}
// Simulate async fetch and setting ready flag
async function fetchAndStore() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();

    localStorage.setItem('data', JSON.stringify(data));
    localStorage.setItem('_readystate_stock', '1'); // Custom ready state
}

function exportData() {
    const stored = JSON.parse(localStorage.getItem('data'));
    console.log("Fetched Data:", stored);
}

// Start fetch
fetchAndStore();

// Wait until data is ready
executeOnReady('_readystate_stock', exportData);

