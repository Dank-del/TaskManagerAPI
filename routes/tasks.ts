import { Request, Response } from "express"
import { fetchAllTasks, getTask, markAsDone, newTask } from "../database/methods"
import { IsAuthenticUser, IsEmpty, IsTaskValid, IsUserAssigned, UserExists } from "../utils/validation"

export async function addTask(req: Request, res: Response) {
    const username = req.body.username
    const password = req.body.password
    const taskText = req.body.taskText
    const assignTo = req.body.assignTo

    if (IsEmpty(taskText) || IsEmpty(username) || IsEmpty(password) || IsEmpty(assignTo)) {
        res.status(403).json({
            "message": "forbidden"
        })
        return
    }
    const realUser = await IsAuthenticUser(username, password)
    const validUser = await UserExists(assignTo)

    if (realUser && validUser) {
        const task = await newTask(username, taskText, assignTo);
        return res.json(task.toJSON());
    }

    res.status(401).json({
        "message": "access denied"
    })
}

// a route to get task by task id
export async function getTaskById(req: Request, res: Response) {
    const taskId = req.body.taskId
    const username = req.body.username
    const password = req.body.password
    // console.log(req.body);
    if (IsEmpty(taskId) || IsEmpty(username) || IsEmpty(password)) {
        res.status(403).json({
            "message": "forbidden"
        })
        return
    }
    const realUser = await IsAuthenticUser(username, password)
    const task = await getTask(taskId);
    if (realUser && task !== null) {
        return res.json(task.toJSON());
    }

    res.status(401).json({
        "message": "access denied"
    })
}


export async function markTaskAsDone(req: Request, res: Response) {
    const username = req.body.username
    const password = req.body.password
    const taskId = req.body.taskId

    if (IsEmpty(username) || IsEmpty(password) || IsEmpty(taskId)) {
        res.status(404).json({
            "message": "bad request"
        })
        return
    }

    const realUser = await IsAuthenticUser(username, password)
    if (!realUser) {
        res.status(401).json({
            "message": "access denied"
        })
        return
    }

    const taskValid = await IsTaskValid(taskId)
    if (!taskValid) {
        res.status(404).json({
            "message": "invalid task id"
        })
        return
    }

    const isAssigned = await IsUserAssigned(taskId, username)
    if (!isAssigned) {
        return res.status(404).json({
            "message": "the task isn't assigned to you",
            "task": await getTask(taskId)
        })
    }

    await markAsDone(taskId)
    return res.status(200).json({
        "message": "marked as complete",
        "task": await getTask(taskId)
    })

}

export async function getAllTasks(req: Request, res: Response) {
    const username = req.body.username
    const password = req.body.password

    if (IsEmpty(username) || IsEmpty(password)) {
        res.status(403).json({
            "message": "forbidden"
        })
        return
    }

    const realUser = await IsAuthenticUser(username, password)
    if (!realUser) {
        res.status(401).json({
            "message": "access denied"
        })
        return
    }

    const tasks = await fetchAllTasks();
    const jsonResponse = [];
    tasks.map((value) => {
        jsonResponse.push(value.toJSON())
    });

    return res.status(200).json(jsonResponse);
}