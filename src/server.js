const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');

const app = express();
console.log('Cancel Ben Tsardoulias counter is online and...');

// For parsing application/json
app.use(bodyParser.json());

const dbConfig = {
    host: 'db',
    user: 'tibthink',
    password: 'Halsnewram!18',
    database: 'counter_db'
};

let connection;

async function initializeDatabase() {
    connection = await mysql.createConnection(dbConfig);
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

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Cancel Ben Tsardoulias</title>
    </head>
    
    <!-- add css with the content being in the center of the page  -->
    <style>
        
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
    
        .title {
            font-family: ubuntu;
            font-size: large;
            margin-bottom: 50px;
        }
    
        .counter {
            font-size: 1.5em;
            margin-bottom: 30px;
        }
        button {
            font-size: 1.5em;
            padding: 10px 20px;
            border-radius: 5px;
            border: 1px solid #ccc;
            background-color: #098BDB;
            color: white;
            cursor: pointer;
        }
        button:hover {
            background-color: #0C62AB;
        }
        /* add mobile version */
        @media only screen and (max-width: 600px) {
            .container {
                height: 100%;
            }
            .title {
                font-size: 1.5em;
            }
            .counter {
                font-size: 1em;
            }
            button {
                font-size: 1em;
            }
        }
    </style>
    
    
    
    <body onload="fetchCurrentCount()">
        <div class="container">
    
            <div class="title">
                <h1>CANCEL BEN TSARDOULIAS</h1>
            </div>
            <div class="counter">I have been canceled <span id="counter">0</span> times</div>
            <button onclick="incrementCounter()">Cancel me</button>
        </div>
        
    
        <script>
            async function fetchCurrentCount() {
                try {
                    const response = await fetch('/current-count');
                    const data = await response.json();
                    document.getElementById('counter').textContent = data.value;
                } catch (error) {
                    console.error('Failed to fetch current count:', error);
                }
            }
    
            async function incrementCounter() {
                const response = await fetch('/increment', {
                    method: 'POST',
                });
                const data = await response.json();
                document.getElementById('counter').textContent = data.value;
            }
        </script>
    </body>
    </html>
    `);
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
    try {
        await connection.query("UPDATE counter SET value = value + 1 WHERE id = 1");
        const [rows] = await connection.query("SELECT value FROM counter WHERE id = 1");
        res.json({ value: rows[0].value });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

const PORT = 80;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

console.log('...running!');
