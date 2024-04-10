"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing modules using ES module syntax
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const DatabaseAccess_1 = __importDefault(require("./DatabaseAccess"));
// Creating an Express appss
const app = (0, express_1.default)();
const port = 3001;
// Creating a new instance of DatabaseAccess
const dbAccess = new DatabaseAccess_1.default();
// Using middleware to parse JSON bodies
app.use(body_parser_1.default.json());
// Starting the server and connecting to the database
app.listen(port, async () => {
    console.log("Server is running http://localhost:" + port);
    await dbAccess.connect();
    console.log("DB connection established.");
    console.log("Testing db push...");
    await dbAccess.pushHighscore("w9h9m10md0hi1", 90);
    await dbAccess.pushHighscore("w9h9m10md0hi1", 90);
    await dbAccess.pushHighscore("w9h9m10md0hi1", 120);
    await dbAccess.pushHighscore("w9h9m10md0hi1", 20);
    console.log("Testing done");
});
// Handling GET requests for "/ms-leaderboard"
app.get("/ms-leaderboard", async (req, res) => {
    if (!dbAccess.connected) {
        res.status(500).json({ error: "Internal site error: no database connection available." });
    }
    const settings = req.body;
    let signature = "w" + settings.boardWidth + "h" + settings.boardHeight + "m" + settings.mines + "md" + settings.metalDetectors + "hi" + settings.hi;
    // const leaderboard = db
});
app.get("/ms-leaderboard/test-score", async (req, res) => {
    if (!dbAccess.connected) {
        res.status(500).json({ error: "Internal site error: no database connection available." });
    }
});
// Handling PATCH requests for "/ms-leaderboard"
app.patch("/ms-leaderboard", async (req, res) => {
    if (!dbAccess.connected) {
        res.status(500).json({ error: "Internal site error: no database connection available." });
    }
});
