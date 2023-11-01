const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);



console.log('Cancel Ben Tsardoulias counter is online and...');

// For parsing application/json
app.use(bodyParser.json());



// const dbConfig = {
//     host: 'db',
//     user: 'tibthink',
//     password: 'Halsnewram!18',
//     database: 'counter_db'
// };
 
const dbConfig = {
    host: 'db',
    user: 'root',
    password: 'Halsnewram',
    database: 'counter_db'
};
let connection;



async function initializeDatabase() {
    connection = await mysql.createConnection(dbConfig);
    // if connection failed retry every 2 seconds
    connection.on('error', (err) => {
        console.error(err);
        setTimeout(initializeDatabase, 2000);
    });
    await connection.query(`
        CREATE TABLE IF NOT EXISTS counter (
            id INT AUTO_INCREMENT PRIMARY KEY,
            value INT DEFAULT 0 
        );
    `);

    const [rows] = await connection.query("SELECT * FROM counter");
    if (rows.length === 0) {
        await connection.query("INSERT INTO counter (value) VALUES (0)");
    }
}

 



initializeDatabase();

const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
    
        


app.get('/current-count', async (req, res) => {
    try {
        const [rows] = await connection.query("SELECT value FROM counter WHERE id = 1");
        res.json({ value: rows[0].value });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});




app.post('/increment', async (req, res) => {
    const amount = req.body.amount || 1; // default to 1 if amount is not provided
    try {
        await connection.query(`UPDATE counter SET value = value + ${amount} WHERE id = 1`);
        const [rows] = await connection.query("SELECT value FROM counter WHERE id = 1");
        io.emit('counterUpdated', { value: rows[0].value });
        res.json({ value: rows[0].value });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


const PORT = 80;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


console.log('...running!');
