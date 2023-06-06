import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { file, folder } from './libs/file.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

let wordID = 0;
const [err, list] = await folder.read('dictionary');
if (!err && list.length > 0) {
    wordID = list.length;
}

app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

app.post('/api/word', async (req: Request, res: Response) => {
    const { value } = req.body;
    const word = {
        id: ++wordID,
        word: value,
        createAt: new Date().getTime(),
    };

    await file.create('dictionary', `${word.id}.json`, word);

    res.status(201).set({
        Location: `api/dictionary/${word.id}`,
    }).send(word);
});

app.get('/api/dictionary/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const [err, content] = await file.read('dictionary', `${id}.json`);
    if (err) {
        return res.status(404).send('Word not found');
    }

    return res
        .status(200)
        .set({
            'Content-type': 'application/json',
        })
        .send(content);
});

app.all('*', (req: Request, res: Response) => {
    res.status(400).json({
        msg: 'POST: ERROR???',
        url: req.url,
    });
});

app.listen(port, () => {
    console.log(`⚡️ Server is running at http://localhost:${port}`);
});