import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, PrimaryColumn } from "typeorm";
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
   /* public static add(User: User) {
        return database.get().getRepository(User).save(User);
    } */

    

    
    public static get(name?:string){
        return database.get().manager.find(User);
    }

    public static async getOne(name?:string){
        return await database.get().manager.findOne(User,name);
    }
    
} 
