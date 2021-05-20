class ContentStorage {
    constructor(name) {
        this.contentStorage = null;
        this.contentStorageType = "";
        this.contentStorageName = name;
    }

    init() {
        try {
            if (!window.indexedDB) {
                throw new Error("");
            }

            this.contentStorage = window.indexedDB;
            this.contentStorageType = "indexedDB";

            this.indexedDB__initDB = (db) => {
                //TODO: Обработать все события
                return db;
            }

            this.indexedDB__initTransaction = (transaction) => {
                //TODO: Обработать все события
                return transaction;
            }

            this.indexedDB__getFromOS = (os, saver) => {
                const request = os.getAll();
                request.onsuccess = (event) => {
                    //TODO: console.log()
                    saver(event.target.result);
                }
                request.onerror = (event) => {
                    //TODO: console.error()
                }
            }

            this.indexedDB__putAll = (os, items) => {

                const request = os.clear();
                request.onsuccess = (event) => {
                    //TODO: console.log()
                }
                request.onerror = (event) => {
                    //TODO: console.error()
                }

                for (let i in items) {
                    const request = os.put(items[i]);
                    request.onsuccess = (event) => {
                        //TODO: console.log()
                    }
                    request.onerror = (event) => {
                        //TODO: console.error()
                    }
                }
            }

            return;
        } catch (e) {
            console.error("");
        }

        try {

            if (!window.localStorage) {
                throw new Error("");
            }

            this.contentStorage = window.localStorage;
            this.contentStorageType = "localStorage";

            return;
        } catch (e) {
            console.error("");
        }

        try {

            this.contentStorage = document.cookie;
            this.contentStorageType = "cookie";

            return;
        } catch (e) {
            console.error("");
        }
    }

    getItems(saver) {
        if (this.contentStorageType === "indexedDB") {
            try {
                const request = this.contentStorage.open(this.contentStorageName, 2);
                request.onsuccess = (event) => {
                    const db = this.indexedDB__initDB(event.target.result);

                    const transaction = this.indexedDB__initTransaction(db.transaction(this.contentStorageName, "readonly"));

                    this.indexedDB__getFromOS(transaction.objectStore(this.contentStorageName), saver);

                }
                request.onupgradeneeded = (event) => {
                    const db = this.indexedDB__initDB(event.target.result);

                    if (db.objectStoreNames.contains(this.contentStorageName)) {
                        db.deleteObjectStore(this.contentStorageName);
                    }
                    db.createObjectStore(this.contentStorageName, { keyPath: "id", autoIncrement: true });
                }
                request.onerror = (event) => {
                    //TODO: Обработать ошибку
                }

            } catch (e) {

            }
        } else if (this.contentStorageType === "localStorage") {
            try {
                saver(JSON.parse(this.contentStorage.getItem(this.contentStorageName)));
            } catch (e) {
                //TODO: Обработать ошибку
            }
        } else if (this.contentStorageType === "cookie") {
            try {
                saver(JSON.parse(this.contentStorage.substring(this.contentStorageName.length + 1)));
            } catch (e) {
                //TODO: Обработать ошибку
            }
        }
    }

    setItems(items) {
        if (this.contentStorageType === "indexedDB") {
            try {
                const request = this.contentStorage.open(this.contentStorageName, 2);
                    request.onsuccess = (event) => {
                        const db = this.indexedDB__initDB(event.target.result);

                        const transaction = this.indexedDB__initTransaction(db.transaction(this.contentStorageName, "readwrite"));
                        this.indexedDB__putAll(transaction.objectStore(this.contentStorageName), items);

                    }
                    request.onupgradeneeded = (event) => {
                        const db = this.indexedDB__initDB(event.target.result);

                        if (db.objectStoreNames.contains(this.contentStorageName)) {
                            db.deleteObjectStore(this.contentStorageName);
                        }
                        db.createObjectStore(this.contentStorageName);
                    }
                    request.onerror = (event) => {
                        //TODO: Обработать ошибку
                    }
            } catch (e) {
                console.error(e);
            }
        } else if (this.contentStorageType === "localStorage") {
            try {
                this.contentStorage.setItem(this.contentStorageName, JSON.stringify(items));
            } catch (e) {
                //TODO: Обработать ошибку
            }
        } else if (this.contentStorageType === "cookie") {
            try {
                document.cookie = this.contentStorageName + "=" + JSON.stringify(items);
            } catch (e) {
                //TODO: Обработать ошибку
            }
        }
    }
}

export default ContentStorage