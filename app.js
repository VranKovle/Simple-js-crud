const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/addData', (req, res) => {
    const newData = req.body;

    // Read existing data from the file
    fs.readFile('database.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        let existingData = [];

        // Parse existing data from the file
        try {
            existingData = JSON.parse(data);
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing existing data');
            return;
        }

        // Add new data to existing data
        existingData.push(newData);

        // Write combined data back to the file
        fs.writeFile('database.txt', JSON.stringify(existingData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                res.status(500).send('Error writing to the database');
                return;
            }

            res.status(200).send('Data added successfully');
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
// ...
app.get('/getData', (req, res) => {
    fs.readFile('database.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        let parsedData = [];

        try {
            parsedData = JSON.parse(data);
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing data');
            return;
        }

        res.json(parsedData);
    });
});

// ...

// Handle edit data
app.post('/editData', (req, res) => {
    const updatedData = req.body;
    const nameToUpdate = updatedData.name;

    fs.readFile('database.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        let existingData = [];

        try {
            existingData = JSON.parse(data);
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing existing data');
            return;
        }

        // Find the index of the data to be updated
        const indexToUpdate = existingData.findIndex(item => item.name === nameToUpdate);

        if (indexToUpdate !== -1) {
            // Update the data
            existingData[indexToUpdate] = updatedData;

            // Write updated data back to the file
            fs.writeFile('database.txt', JSON.stringify(existingData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                    res.status(500).send('Error writing to the database');
                    return;
                }

                res.status(200).send('Data updated successfully');
            });
        } else {
            res.status(404).send('Data not found');
        }
    });
});

// Handle delete data
app.post('/deleteData', (req, res) => {
    const dataToDelete = req.body;
    const nameToDelete = dataToDelete.name;

    fs.readFile('database.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        let existingData = [];

        try {
            existingData = JSON.parse(data);
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing existing data');
            return;
        }

        // Filter out the data to be deleted
        const newData = existingData.filter(item => item.name !== nameToDelete);

        // Write updated data back to the file
        fs.writeFile('database.txt', JSON.stringify(newData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                res.status(500).send('Error writing to the database');
                return;
            }

            res.status(200).send('Data deleted successfully');
        });
    });
});


