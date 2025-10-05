import express, { Application, Request, Response} from 'express';
import { noteRouter } from './app/controllers/note.controller';

const app: Application = express();

app.use(express.json());

app.use("/notes", noteRouter)
app.get('/', (req: Request, res: Response) => {
    res.send("Welcome to Note App...")
})

export default app;