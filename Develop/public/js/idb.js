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

function checkDatabase() {
    console.log('checkDb invoke');

    // opens a transaction in budgetStoreDb
    let transaction = db.transaction(['BudgetStore'], 'readwrite');

    // access BudgetStore Obj
    const store = transaction.objectStore('BudgetStore');

    // get all records and set to variable
    const getAll = store.getAll();

    // if succesfull
    getAll.onsuccess = function () {
        // if there are items store, bulk add when back online
        if (getAll.result.length >0) {
            fetch('api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },

            })
                .then((response) => response.json())
                .then((res) => {
                    // if returned resonse is not empty
                    if (res.length !==0){
                        // open another transactipn in BudgetStore that can read and write
                        transaction = db.transaction(['BudgetStore'], 'readwrite');

                        // assign current store to variable
                        const currentStore = transaction.objectStore('BudgetStore');

                        // clear existing entries when bulk add is succesfull
                        currentStore.clear();
                        console.log('Clearing store');
                    }
                });
        }
    };
}
