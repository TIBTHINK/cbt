const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

console.log('Counting ur mistakes is online and...');

// For parsing application/json
app.use(bodyParser.json());


let counter = 0; 

io.on('connection', (socket) => {
    // Emit initialData event with the initial data
    socket.emit('initialData', { value: counter });

});

const dbConfig = {
    host: 'db',
    user: 'root',
    password: 'rassword',
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
    await connection.query(`
        CREATE TABLE IF NOT EXISTS logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            count_added INT DEFAULT 0,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip VARCHAR(255),
            reason VARCHAR(255)
        )`);

    const [rows] = await connection.query("SELECT * FROM counter");
    if (rows.length === 0) {
        await connection.query("INSERT INTO counter (value) VALUES (0)");
    }
} 

initializeDatabase();

const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/index.html'));
});
    
        
app.use(express.static('public'));


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
    const reason = req.body.reason || "No reason provided"; // default to 1 if amount is not provided
    try {
        await connection.query(`UPDATE counter SET value = value + ${amount} WHERE id = 1`);
        const [rows] = await connection.query("SELECT value FROM counter WHERE id = 1");
        await connection.query(`INSERT INTO logs (count_added, ip, reason) VALUES (${amount}, '${req.ip}', '${reason}')`);
        io.emit('counterUpdated', { value: rows[0].value }); // emit the updated counter value to all connected clients
        res.json({ value: rows[0].value });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



// app.get('/api', async (req, res) => {
//         try {
//             // Assuming `connection` is a promise-based connection from mysql2
//             const [count, fields] = await connection.query('SELECT value FROM counter');
//             // select reason from logs from last input
//             const [reason] = await connection.query('SELECT reason FROM logs ORDER BY id DESC LIMIT 1');
//             res.json({ count: count,reason: reason });
//             console.log("api called from IP address: " + req.ip);
//         } catch (error) {
//             res.status(500).send('Internal Server Error');
//         }
//     });
  

// make a api that takes the current count from counter table, and the reason from logs table
app.get('/api', async (req, res) => {
    try {
        // Assuming `connection` is a promise-based connection from mysql2
        const [count, fields] = await connection.query('SELECT value FROM counter');
        // select reason from logs from last input
        const [reason] = await connection.query('SELECT reason FROM logs ORDER BY id DESC LIMIT 1');
        res.json({ count: count,reason: reason });
        console.log("api called from IP address: " + req.ip);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}
);



const PORT = 80;
server.listen(PORT, () => {
    const address = server.address();
    console.log(`Server is running on port ${address.port} `);
});
console.log('...running!');