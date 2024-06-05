import connectToMongo from "./database/db.js";
import express from 'express';
import auth from './routes/auth.js';
import notes from './routes/notes.js';
import cors from 'cors';
import 'dotenv/config';

connectToMongo();
const app = express()
const port = process.env.PORT || 4000;

//* middleware
app.use(express.json());

app.use(cors());
//* Available Route 
app.get('/', (req, res) => {
    res.json("eNotebook backend Api")
});
app.use('/api/auth', auth);
app.use('/api/notes', notes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
