// Storage Management
const StorageManager = {
    getData(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (error) {
            console.error(`Error getting data from localStorage: ${error}`);
            return [];
        }
    },
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving data to localStorage: ${error}`);
        }
    }
};