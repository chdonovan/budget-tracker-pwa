// holds db connection
let db;
let budgetVersion;

// establishes connection to IndexedDB database "budget_db"
const request = indexedDB.open('BudgetDB', budgetVersion ||21 );

request.onupgradeneeded = function (e) {
    console.log('Upgrade needed in IndexedDb');

    const { oldVersion } = e;
    const newVersion = e.newVersion || db.version;

    console.log(`DB updated from version ${oldVersion} to ${newVersion}`);

    db = e.target.result;

    if (db.objectStoreNames.length === 0) {
        db.createObjectStore('budgetStore', {autoIncrement: true });
    }

};

request.onerror = function (e) {
    console.log(`NOOOOOO! ${e.target.errorcode}`);
};