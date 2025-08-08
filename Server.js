// Master Server for LANProxyWithDiscovery
// Save as: masterServer.js
// Run with: node masterServer.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// In-memory host list
let hosts = [];

app.use(cors());
app.use(bodyParser.json());

// Register a new host
app.post("/register", (req, res) => {
    const { ip, port, game } = req.body;
    if (!ip || !port || !game) {
        return res.status(400).send("Invalid host data");
    }

    // Remove any old entry with the same IP/port
    hosts = hosts.filter(h => !(h.ip === ip && h.port === port));

    // Add new entry
    hosts.push({
        ip,
        port,
        game,
        lastSeen: Date.now()
    });

    console.log(`[REGISTER] ${game} @ ${ip}:${port}`);
    res.send({ status: "ok" });
});

// Return the list of active hosts
app.get("/list", (req, res) => {
    // Remove entries older than 2 minutes
    const cutoff = Date.now() - (2 * 60 * 1000);
    hosts = hosts.filter(h => h.lastSeen > cutoff);

    res.json(hosts);
});

// Health check
app.get("/", (req, res) => {
    res.send("Master Server is running");
});

app.listen(PORT, () => {
    console.log(`Master Server running on port ${PORT}`);
});
