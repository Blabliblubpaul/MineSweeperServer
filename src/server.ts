// Importing modules using ES module syntax
import express from "express";
import bodyParser from "body-parser"
import DatabaseAccess from "./DatabaseAccess";

// Creating an Express appss
const app = express();
const port = 3001;

// Creating a new instance of DatabaseAccess
const dbAccess = new DatabaseAccess();

// Using middleware to parse JSON bodies
app.use(bodyParser.json());

// Starting the server and connecting to the database
app.listen(port, async () => {
    console.log("Server is running http://localhost:" + port);
    await dbAccess.connect();
    console.log("DB connection established.");
});

// Handling GET requests for "/ms-leaderboard"
app.get("/ms-leaderboard", async (req, res) => {
    if (!dbAccess.connected) {
        res.status(500).json({error: "Internal site error: no database connection available."});
    }

    const body = req.body
    let signature = "w" + body.settings.boardWidth + "h" + body.settings.boardHeight + "m" + body.settings.mines + "md" + body.settings.metalDetectors + "hi" + body.settings.hi

    return await dbAccess.getHighscores(signature)
});

app.get("/ms-leaderboard/test-score", async (req, res) => {
    if (!dbAccess.connected) {
        res.status(500).json({error: "Internal site error: no database connection available."});
    }

    const body = req.body
    let signature = "w" + body.settings.boardWidth + "h" + body.settings.boardHeight + "m" + body.settings.mines + "md" + body.settings.metalDetectors + "hi" + body.settings.hi

    return await dbAccess.testHighscore(signature, body.score)
})

// Handling PATCH requests for "/ms-leaderboard"
app.patch("/ms-leaderboard", async (req, res) => {
    if (!dbAccess.connected) {
        res.status(500).json({error: "Internal site error: no database connection available."});
    }

    const body = req.body
    let signature = "w" + body.settings.boardWidth + "h" + body.settings.boardHeight + "m" + body.settings.mines + "md" + body.settings.metalDetectors + "hi" + body.settings.hi

    return await dbAccess.pushHighscore(signature, body.score)
});
