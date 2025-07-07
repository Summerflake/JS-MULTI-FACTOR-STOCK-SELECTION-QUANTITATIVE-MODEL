function executeOnReady(localStorageKey, callback) {
    const intervalId = setInterval(() => {
        if (localStorage.getItem(localStorageKey) === '1') {
            clearInterval(intervalId); // Stop polling
            callback(); // Execute the provided function
        }
    }, 100);
}

// VARIABLES
const API_KEY = 'API_KEY';
