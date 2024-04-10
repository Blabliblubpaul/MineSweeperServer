import { Collection, Db, Document, MongoClient, ObjectId, WithId } from "mongodb";

/* DB-Format:
{
    "highscores": [
        "<signature>": [
            <score>,
            <score>,
            ...
        ]
    ]
}

<signature>: w<board-width>h<board-height>m<mines>md<metal-detectors>hi<hint>
<score>: <completion-time-in-seconds>
*/

// Mit .env Datei
export default class DatabaseAccess {
    url = "mongodb://localhost:27017";
    connected = false;
    client: MongoClient;
    database: Db;
    collection: Collection;
    document: WithId<Document>;

    constructor() {
        this.client = new MongoClient(this.url)
    }

    async connect() {
        console.log("Connecting to the database...")
        await this.client.connect()
        
        this.database = this.client.db("ms-leaderboard")
        this.collection = this.database.collection("ms-leaderboard")
        
        this.document = await this.collection.findOne({})

        if (!this.document) {
            console.log("Initializing database...")
            this.collection.insertOne({highscores: {}})
            this.document = await this.collection.findOne({})
            console.log("Database initialized.")
        }
        else {
            console.log("Database already initialized.")
        }

        this.connected = true
    }

    async getSignatures() {
        return this.document.highscores.length
    }

    async getHighscores(signature: string) {
        let highscores = this.document.highscores

        return highscores ? highscores[signature] : undefined
    }

    async testHighscore(signature: string, highscore: number) {
        let highscores = await this.getHighscores(signature)

        console.log("Testing score (" + highscore + ")...")

        if (!highscores || highscores.length === 0) {
            return true
        }
        else {
            return Math.max(...highscores) > highscore
        }
    }

    async pushHighscore(signature: string, highscore: number) {
        let highscores: number[] = await this.getHighscores(signature) || []

        highscores.push(highscore)

        highscores.sort((a, b) => a - b)

        if (highscores.length > 10) {
            highscores.splice(10)
        }

        this.document.highscores[signature] = highscores

        await this.collection.updateOne({}, { $set: { ["highscores." + signature]: highscores } })
    
        return await this.getHighscores(signature)
    }
}