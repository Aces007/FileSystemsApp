var app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        // Cordova is ready for use
    }
};

app.initialize();

let data = []; // Initialize data as an array to store multiple entries

function writeFile() {
    const name = document.getElementById("name_inp").value;
    const age = document.getElementById("age_inp").value;
    const occupation = document.getElementById("occupation_inp").value;
    const civilStatus = document.getElementById("civil_inp").value;
    const birthdate = document.getElementById("birth_inp").value;

    if (name && age && occupation) {
        const timeStamp = new Date().toLocaleString();
        
        data.push({
            id: data.length + 1,
            name: name,
            age: age,
            occupation: occupation,
            civilStatus: civilStatus,
            birthdate: birthdate,
            created_at: timeStamp,
        });
        saveJSON();
        saveTXT();
    } else {
        alert("Please enter all necessary details.");
    }
}

function saveTXT() {
    const content = data.map(entry => {
        return `
            Name: ${entry.name}, Age: ${entry.age}, Occupation: ${entry.occupation}, Civil Status: ${entry.civilStatus}, Birthdate: ${entry.birthdate}, Created At: ${entry.created_at}
        `;
    }).join('\n\n'); 

    const txtDirectory = cordova.file.externalDataDirectory;
    const fileName = "privateData.txt";


    window.resolveLocalFileSystemURL(txtDirectory, 
        function (dirEntry) {
        dirEntry.getFile(fileName, { create: true, exclusive: false }, 
            function (fileEntry) {
            fileEntry.createWriter(
                function (fileWriter) {
                fileWriter.onwriteend = function () {
                    alert("Data saved tp " + fileEntry.nativeURL);
                };
                fileWriter.onerror = onError;
                const blob = new Blob([content], { type: "text/plain" });
                fileWriter.write(blob);
            }, onError);
        }, onError);
    }, onError);
}

function readTXT() {
    const txtDirectory = cordova.file.externalDataDirectory;
    const fileName = "privateData.txt";

    window.resolveLocalFileSystemURL(txtDirectory + fileName, 
        function (fileEntry) {
            fileEntry.file(
                function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        document.getElementById("result_cont").innerText = this.result;
                    };
                    reader.readAsText(file);
                }, onError)
        }, onError)
}


function saveJSON() {
    const jsonData = JSON.stringify(data, null, 2); // Convert the entire data array to JSON
    const fileName = "privateData.json";
    const jsonDirectory = cordova.file.externalDataDirectory;

    window.resolveLocalFileSystemURL(jsonDirectory, 
        function (dirEntry) {
        dirEntry.getFile(fileName, { create: true, exclusive: false }, 
            function (fileEntry) {
            fileEntry.createWriter(
                function (fileWriter) {
                fileWriter.onwriteend = function () {
                    alert("Data saved to " + fileEntry.nativeURL);
                    displayData(); 
                };

                fileWriter.onerror = function (e) {
                    console.error("Failed to write file: " + e.toString());
                };

                const blob = new Blob([jsonData], { type: "application/json" });
                fileWriter.write(blob);
            }, onError);
        }, onError);
    }, onError);
}


function readJSON() {
    const fileName = "privateData.json";
    const jsonDirectory = cordova.file.externalDataDirectory;

    window.resolveLocalFileSystemURL(jsonDirectory + fileName, 
        function (fileEntry) {
        fileEntry.file(
            function (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                try {
                    const loadedData = JSON.parse(this.result);
                    data = loadedData; 
                    displayData(); 
                } catch (e) {
                    document.getElementById("result_cont").innerText = "Failed to parse JSON: " + e.message;
                }
            };
            reader.readAsText(file);
        }, onError);
    }, onError);
}


function displayData() {
    const resultContainer = document.getElementById("result_cont");
    resultContainer.innerHTML = ""; 

    data.forEach((entry, index) => {
        const dataEntry = document.createElement('div');
        dataEntry.innerHTML = `
            <p id='entry_num'<strong>Entry #${index + 1}:</strong></p>
            <p><strong>Name:</strong> ${entry.name}</p>
            <p><strong>Age:</strong> ${entry.age}</p>
            <p><strong>Occupation:</strong> ${entry.occupation}</p>
            <p><strong>Civil Status:</strong> ${entry.civilStatus}</p>
            <p><strong>Birthdate:</strong> ${entry.birthdate}</p>
            <p><strong>Created At:</strong> ${entry.created_at}</p>
        `;
        resultContainer.appendChild(dataEntry);
    });
}

function onError(error) {
    console.log("Error: " + error.code);
}
