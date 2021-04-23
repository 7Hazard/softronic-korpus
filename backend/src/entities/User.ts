import { argon2id } from "hash-wasm";
import { randomBytes } from "crypto";
import { Entity, EntityRepository, Repository, Column, PrimaryColumn } from "typeorm";
import * as database from "../database"

@Entity()
export class User {
    constructor(name: string, password: string, token: string) {
        this.name = name;
        this.hashedPassword = password;
        this.token = token;
    }

    @PrimaryColumn()
    name: string;

    @Column({ name: "password", nullable: false, unique: false, type: "varchar" })
    hashedPassword: string;

    @Column({ nullable: true, unique: false, type: "varchar" })
    token: string;

    //@ManyToMany(() => User)
    //@JoinTable({ name: "Synonym" })
    //synonyms: User[];

}

@EntityRepository(User)
export class Users extends Repository<User> {
    /**
     * Adds new user to the database
     * @param name username
     * @param password password in raw format
     * @returns the new user
     */
    public static async create(name: string, password: string) {
        const hashedPassword = await argon2id({
            password: password,
            parallelism: 4,
            memorySize: 64,
            iterations: 4,
            hashLength: 32,
            salt: randomBytes(16).toString("hex"),
            outputType: "encoded"
        })
        return await database.getDb().getRepository(User).save(new User(
            name,
            hashedPassword,
            null
        ));
    }
    
    public static get(name?:string){
        return database.getDb().manager.find(User);
    }

    public static async getOne(name?:string){
        return await database.getDb().manager.findOne(User,name);
    }
    
} 
