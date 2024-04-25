const express = require('express');
const cors = require('cors');

// Config
const app = express();
const port = process.env.PORT || 5010;
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
    res.send('Server Running')
})

app.listen(port,() => {
    console.log(`Server is running port no. ${port}`);
})