import { Request, Response } from "express"
import { addCommentToTask } from "../database/methods";
import { IsAuthenticUser, IsEmpty, IsTaskValid } from "../utils/validation";

export async function addComment(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;
    const taskId = req.body.taskId;
    const comment = req.body.comment;
    const img = req.body.img;
    const location = req.body.location;

    if (IsEmpty(username) || IsEmpty(password) || IsEmpty(taskId) || IsEmpty(comment)) {
        res.status(404).json({
            "message": "bad request"
        })
        return
    }

    const isUserValid = await IsAuthenticUser(username, password);
    if (!isUserValid) {
        res.status(401).json({
            "message": "invalid credentials"
        })
        return
    }

    const isValidTask = await IsTaskValid(taskId);
    if (!isValidTask) {
        res.status(404).json({
            "message": "task not found"
        })
        return
    }
    const cmt = await addCommentToTask(taskId, username, comment, img, location);
    return res.status(200).json(cmt.toJSON())
}