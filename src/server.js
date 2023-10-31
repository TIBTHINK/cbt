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

// const dbConfig = {
//     host: 'db',
//     user: 'root',
//     password: 'Halsnewram',
//     database: 'counter_db'
// };
let connection;

async function initializeDatabase() {
    connection = await mysql.createConnection({
        host: 'db',
        user: 'root',
        password: 'Halsnewram',
    });

    await connection.query('CREATE DATABASE IF NOT EXISTS counter_db');
    await connection.query('USE counter_db');
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
        <script src="/socket.io/socket.io.js"></script>
    
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
    
        .buttons-container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            max-width: 400px;
        }
    
        .progress-container {
            width: 100%;
            max-width: 400px;
            margin-bottom: 30px;
        }
    
        progress {
            width: 100%;
            height: 30px;
            appearance: none;
            border: none;
            border-radius: 5px;
            background-color: #eee;
        }
    
        progress::-webkit-progress-bar {
            background-color: #eee;
            border-radius: 5px;
        }
    
        progress::-webkit-progress-value {
            background-color: #098BDB;
            border-radius: 5px;
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
            <div class="progress-container">
                <progress id="progress-bar" value="" max="1000000"></progress>
                <span id="progress-percentage" class="progress-percentage"></span>
            </div>
    
            <div class="buttons-container">
                <button onclick="incrementCounter()">Cancel me</button>
                <button onclick="incrementCounter(5)">Cancel me 5 </button>
                <button onclick="incrementCounter(10)">Cancel me 10</button>
                <button onclick="incrementCounter(25)">Cancel me 25</button>
            </div>
        </div>
    
        
        <script>
            const socket = io();
            const progressBar = document.getElementById('progress-bar');
            const percentageSpan = document.getElementById('progress-percentage'); // Define it here


            // Listen for counterUpdated event from the server
            socket.on('counterUpdated', (data) => {
            document.getElementById('counter').textContent = data.value;
            progressBar.value = data.value;

            const percentage = Math.floor((data.value / progressBar.max) * 100.00);
            percentageSpan.textContent = percentage + "%"; // Use the variable here
        });

    
        async function fetchCurrentCount() {
            try {
                const response = await fetch('/current-count');
                const data = await response.json();
        
                let displayedCount = 0;
                const counterElem = document.getElementById('counter');
        
                function updateCounter() {
                    // Calculate the remaining difference
                    const difference = data.value - displayedCount;
                    // Adjust the speed based on the remaining difference. The larger the difference, the bigger the step.
                    const step = Math.max(1, Math.ceil(difference * 0.25)); // 5% of the remaining difference
        
                    if (displayedCount + step < data.value) {
                        displayedCount += step;
                        counterElem.textContent = displayedCount;
                        // Use setTimeout instead of setInterval for dynamic intervals
                        setTimeout(updateCounter, 50);
                    } else {
                        counterElem.textContent = data.value; // directly set the final value
                    }
                }
        
                updateCounter();
        
            } catch (error) {
                console.error(error);
            }
        }
        
        async function incrementCounter(amount = 1) {  
            const counterElem = document.getElementById('counter');
            const currentCount = parseInt(counterElem.textContent, 10);
        
            try {
                const response = await fetch('/increment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ amount: amount })  
                });
                
                const data = await response.json();
                
                let displayedCount = currentCount;
        
                function updateCounter() {
                    // Same logic as above
                    const difference = data.value - displayedCount;
                    const step = Math.max(1, Math.ceil(difference * 0.05)); 
        
                    if (displayedCount + step < data.value) {
                        displayedCount += step;
                        counterElem.textContent = displayedCount;
                        setTimeout(updateCounter, 50);
                    } else {
                        counterElem.textContent = data.value;
                    }
                }
        
                updateCounter();
        
            } catch (error) {
                console.error('Failed to update count:', error);
            }
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
