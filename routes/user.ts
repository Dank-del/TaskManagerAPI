import { Request, Response } from "express"
import { newUser, getUser } from "../database/methods";
import config from "../config.json"
import { IsEmpty } from "../utils/validation";

export async function addUser(req: Request, res: Response) {
    const key = req.body.key;
    const username = req.body.username;
    const password = req.body.password;
    
    if (IsEmpty(key) || IsEmpty(username) ||IsEmpty(username)) {
        res.status(404).json({
            "message": "bad request"
        })
        return
    }
    if (key === config.masterKey) {
        const user = await getUser(username);
        // console.log(user);
        // console.log(user != undefined);
        if (user !== null) {
            return res.status(200).json({
                "message": "user already exists",
                "user": user.toJSON()
            })
            
            // newUser(username, password);
            
        }
        await newUser(username, password);
        return res.status(200).json({
            "message": "successfully created user",
            "username": username,
            "password": password,
        })
        // newUser(username, password)
        
    }

    // newUser(username.toString(), password.toString())
    res.status(404).json({
        "message": "invalid key",
        "request": req.body
    })
}