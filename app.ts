import express from 'express';
import { sequelizeClient } from './database/client';
import { addUser } from './routes/user';
import bodyParser from 'body-parser';
import { addTask, getAllTasks, getTaskById } from './routes/tasks';
import { addComment, getComment } from './routes/comments';
import config from './config.json';
import cors from 'cors';

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

sequelizeClient.sync().then(() => {
    console.log("Synced Database")
}).catch((err) => {
    console.log(`Encountered an error ${err}`)
})
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/adduser', addUser);
app.post('/addtask', addTask);
app.post('/task', getTaskById);
app.post('/alltasks', getAllTasks);
app.post('/addcomment', addComment);
app.post('/getcomment', getComment);

app.listen(config.port, () => {
    return console.log(`Express is listening at http://localhost:${config.port}`);
});