const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config(); // Load environment variables

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helius RPC URL
const API_URL = "https://mainnet.helius-rpc.com/";

// API endpoint to fetch asset details
app.post("/get-asset", async (req, res) => {
  const { id } = req.body;

  // Validate input
  if (!id) {
    return res.status(400).json({ error: "Missing token CA (id)" });
  }

  try {
    const response = await fetch(`${API_URL}?api-key=${process.env.HELIUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "grass",
        method: "getAsset",
        params: { id },
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    res.status(200).json({ result: data.result });
  } catch (error) {
    console.error("Error fetching asset:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
