import { Comments, User, Tasks } from "./models";
import { v4 as uuidv4 } from 'uuid';
import { genSalt, hash } from 'bcrypt';

async function hashIt(password: string):Promise<string> {
    const salt = await genSalt(6);
    const hashed = await hash(password, salt);
    return hashed;
  }

export async function newUser(username: string, password: string) {
    const hashedPassword = await hashIt(password);
    User.create({ username: username.toLowerCase(), password: hashedPassword }).then(() => {
        console.log(`Created new user with username ${username} and password ${hashedPassword}`)
    }).catch((err) => { console.log(`Encountered an error ${err}`) })
}

export async function getUser(username: string) {
    return await User.findByPk(username.toLowerCase());
}

export async function addCommentToTask(taskId: string, userId: string, text: string, img?: string, location?: string) {
    const cmtId = uuidv4.toString();
    const comment = await Comments.create({
        commentId: cmtId,
        textContent: text,
        image: img,
        location: location,
        commentWriter: userId.toString(),
        commentedAt: new Date()
    });
    const task = await Tasks.findOne({ where: { taskId: taskId } })
    await Tasks.update({
        commentIds: task.commentIds.push(cmtId)
    }, { where: { taskId: taskId } })
    return comment;
}

export async function newTask(creatorUsername: string, text: string, assignToUsername: string) {
    return await Tasks.create({
        taskId: uuidv4().toString(),
        creatorUsername: creatorUsername.toLowerCase(),
        textContent: text,
        timeCreated: new Date(),
        assignedToUsername: assignToUsername.toLowerCase()
    })
}

export async function getTask(taskId: string) {
    return await Tasks.findOne({
        where: {
            taskId: taskId
        }
    })
}

export async function markAsDone(taskId: string) {
    await Tasks.update({
        isDone: true
    }, {
        where: { taskId: taskId }
    })
}

export async function fetchAllTasks() {
    return await Tasks.findAll();
}