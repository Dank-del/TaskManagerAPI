import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export class User extends Model {
    @Column({primaryKey: true})
    username: string

    @Column
    password: string
}

@Table
export class Comments extends Model {
   @Column({primaryKey: true})
   commentId: string

   @Column
   image: string

   @Column(DataType.TEXT)
   textContent: string

   @Column
   location: string

   @Column(DataType.DATE)
   commentedAt: Date
}

@Table
export class Tasks extends Model {
    @Column({primaryKey: true})
    taskId: string

    @Column(DataType.DATE)
    timeCreated: Date

    @Column
    creatorUsername: string

    @Column
    assignedToUsername: string

    @Column
    isDone: boolean

    @Column(DataType.TEXT)
    textContent: string

    @Column(DataType.ARRAY(DataType.STRING))
    commentIds: string[]
}