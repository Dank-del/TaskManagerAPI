import express from 'express';
import { sequelizeClient } from './database/client';
import { addUser } from './routes/user';
import bodyParser from 'body-parser';
import { addTask, getAllTasks } from './routes/tasks';
import config from './config.json';

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
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
app.post('/alltasks', getAllTasks);

app.listen(config.port, () => {
    return console.log(`Express is listening at http://localhost:${config.port}`);
});