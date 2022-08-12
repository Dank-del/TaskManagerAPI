import { getUser } from "../database/methods";
import { Tasks } from "../database/models";

export async function IsAuthenticUser(username: string, password: string): Promise<boolean> {
    const user = await getUser(username)
    if (user === null || user === undefined || user.password !== password) {
        return false;
    }
    if (user.password === password) {
        return true
    }
    return false
}

export async function UserExists(username: string): Promise<boolean> {
    const user = await getUser(username)
    return (user !== null || user !== undefined)
}


export async function IsTaskValid(taskId: string): Promise<boolean> {
    const task = await Tasks.findOne({
        where: {
            taskId: taskId
        }
    })
    return (task !== null || task !== undefined)
}

export async function IsUserAssigned(taskId: string, username: string): Promise<boolean> {
    const task = await Tasks.findOne({
        where: {
            taskId: taskId
        }
    })
    return task.assignedToUsername == username.toLowerCase()
}