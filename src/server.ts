// Importing modules using ES module syntax
import express, { Request } from "express";
import bodyParser from "body-parser"
import DatabaseAccess from "./DatabaseAccess";
import cors from "cors"

interface GetParams {
    w: number, // board width
    h: number, // board height
    m: number, // mines
    md: number, // metal detectors
    hi: boolean // hint
}

interface TestParams {
    settings: GetParams,
    score: number
}

interface PatchBody{
    settings: GetParams,
    score: number
}

// Creating an Express appss
const app = express();
const port = 3001;

// Creating a new instance of DatabaseAccess
const dbAccess = new DatabaseAccess();

app.use(cors({
    allowedHeaders: ["Content-Type"]
}));

// Using middleware to parse JSON bodies
app.use(bodyParser.json());

// Starting the server and connecting to the database
app.listen(port, async () => {
    console.log("Server is running at http://localhost:" + port);
    await dbAccess.connect();
    console.log("DB connection established.");
});

app.get("/ms-leaderboards", async (req, res) => {
    if (!dbAccess.connected) {
        res.status(500).json({error: "Internal site error: no database connection available."});
    }

    console.log("Processing signature get request...")

    res.json(await dbAccess.getSignatures())
})

// Handling GET requests for "/ms-leaderboard"
app.get("/ms-leaderboard", async (req: Request<any, any, any, GetParams>, res) => {
    if (!dbAccess.connected) {
        res.status(500).json({error: "Internal site error: no database connection available."});
    }

    console.log("Processing highscores get request...")

    const params = req.query

    let signature: string

    try {
        signature = "w" + params.w + "h" + params.h + "m" + params.m + "md" + params.md + "hi" + params.hi
    }
    catch {
        res.status(400).json({error: "Bad query."})
    }

    console.log("signature:", signature)

    res.json(await dbAccess.getHighscores(signature))
});

app.get("/ms-leaderboard/test-score", async (req: Request<any, any, any, TestParams>, res) => {
    if (!dbAccess.connected) {
        res.status(500).json({error: "Internal site error: no database connection available."});
    }

    console.log("Processing highscore-test get request...")

    const params = req.query

    let signature: string

    try {
        signature = "w" + params.settings.w + "h" + params.settings.h + "m" + params.settings.m + "md" + params.settings.md + "hi" + params.settings.hi
    }
    catch {
        res.status(400).json({error: "Bad query."})
    }

    console.log("signature:", signature)

    res.json(await dbAccess.testHighscore(signature, params.score))
})

// Handling PATCH requests for "/ms-leaderboard"
app.put("/ms-leaderboard", async (req, res) => {
    if (!dbAccess.connected) {
        res.status(500).json({error: "Internal site error: no database connection available."});
    }

    console.log("Processing patch request...")

    const body = req.body

    let signature: string

    try {
        signature = "w" + body.settings.w + "h" + body.settings.h + "m" + body.settings.m + "md" + body.settings.md + "hi" + body.settings.hi
    }
    catch {
        res.status(400).json({error: "Error accessing body params."})
    }

    console.log("signature:", signature)

    res.json(dbAccess.pushHighscore(signature, body.score))
});
