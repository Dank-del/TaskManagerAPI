import { Sequelize } from "sequelize-typescript";
import { User, Tasks, Comments } from "./models";
import config from "../config.json"

export const sequelizeClient = new Sequelize(config.postgresUrl);

sequelizeClient.addModels([User, Tasks, Comments])