import { argon2id } from "hash-wasm";
import { randomBytes } from "crypto";
import { Entity, EntityRepository, Repository, Column, PrimaryColumn, getManager, TransactionManager } from "typeorm";
import * as database from "../database"

@Entity()
export class User {
    constructor(username: string, password: string, token: string) {
        this.username = username;
        this.hashedPassword = password;
        this.token = token;
    }

    @PrimaryColumn({unique:true})
    username: string;

    @Column({ username: "password", nullable: false, unique: false, type: "varchar" })
    hashedPassword: string;

    @Column({ nullable: true, unique: false, type: "varchar" })
    token: string;
}

@EntityRepository(User)
export class Users extends Repository<User> {
    /**
     * Adds new user to the database
     * @param username 
     * @param password password in raw format
     * @returns the new user
     */
    public static async create(username: string, password: string) {
        const hashedPassword = await argon2id({
            password: password,
            parallelism: 4,
            memorySize: 64,
            iterations: 4,
            hashLength: 32,
            salt: randomBytes(16).toString("hex"),
            outputType: "encoded"
        })

        
        return await database.getDb().getRepository(User).insert(new User(
            username.toLowerCase(),
            hashedPassword,
            null
        ));
    }
    
    public static get(username?:string){
        return database.getDb().manager.find(User);
    }

    public static async getOne(username?:string){
        return await database.getDb().manager.findOne(User,username);
    }
    
} 
