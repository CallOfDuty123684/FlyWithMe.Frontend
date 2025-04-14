require('dotenv').config(); // To load environment variables
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai"); // You can also replace this with LLaMA if needed
const port = 5000;
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const API_URL = process.env.LOCAL_API_URL


// ✅ Serve static files (CSS, JS, images) from frontend/public
app.use(express.static(path.join(__dirname, '../frontend/public')));

// ✅ Serve HTML files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve index.html when visiting "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.post("/chatbot", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const payload = { message: userMessage };

        const response = await axios.post(API_URL, payload, {
            headers: { "Content-Type": "application/json" }
        });

        res.json({ reply: response.data.chatResult });
    } catch (error) {
        console.error("Error calling local API:", error.message);
        res.status(500).json({ reply: "Sorry, I am having trouble understanding your request." });
    }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
