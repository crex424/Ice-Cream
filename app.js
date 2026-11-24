import express from 'express';

import mysql2 from 'mysql2';

import dotenv from 'dotenv';

import session from 'express-session';

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT

}).promise();

const app = express();

/* ==================== SESSION MIDDLEWARE ====================
 * A SESSION lets the server remember a user between requests.
 * After this runs, every route can read and write req.session.
 *
 * secret:            Used to sign the session cookie (from .env)
 * resave:            false = don't re-save sessions that didn't change
 * saveUninitialized: false = don't create a session until we store
 *                    something in it (like loggedIn = true)
 * cookie.maxAge:     How long the login lasts, in milliseconds
 *                    (1000 ms * 60 sec * 60 min = 1 hour)
 */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}));

// Port
const PORT = 3001;

const orders = [];

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    //res.send('Pizza Time!');
    //res.sendFile(`${import.meta.dirname}/views/home.html`)

    res.render('home');
});

app.get('/db-test', async(req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders');
        res.send(orders)
    } catch(err){
        console.error("Database error: ", err);
        res.status(500).send('Database error: ' + err.message);
    }
})

app.get('/confirm-order', (req, res) => {
    res.render('confirm');
})

app.post('/submit-order', async(req, res) => {
    // Create JSON object to store order data
    const order = req.body;
    order.timestamp = new Date();

    console.log(order);

    // Convert toppings array to a comma-delimited string
    order.toppings = Array.isArray(order.toppings) ?
        order.toppings.join(", ") : "";

    // Define an SQL query to INSERT new order
    const sql = `INSERT INTO orders (name, email, flavor, cone, toppings, comment) 
                    VALUES(?, ?, ?, ?, ?, ?, ?)`;
    // Create an array of parameters from order data
    const params = [
        order.name,
        order.email,
        order.flavor,
        order.cone,
        order.toppings,
        order.comment
    ];

    // Execute the query
    const [result] = await pool.execute(sql, params);

    // Get the id from the newly inserted row
    order.id = result.insertId;
    console.log("A new row was inserted with ID " + order.id);

    // Display the confirmation page
    res.render('confirm', {order})
})

app.get('/admin', async(req, res) =>{
    try {
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');
        console.log(orders);
        res.render('admin', { orders:orders });

    } catch (err){
        console.error('Database error: ', err);
        res.status(500).send('Database error occurred.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});