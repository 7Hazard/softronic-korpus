import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column } from "typeorm";
import * as database from "../database"

@Entity()
export class Group {

    constructor(name: string) {
        this.name = name;
    }

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ nullable: false, unique: true, type: "varchar" })
    name: string;
}
@EntityRepository(Group)
export class Groups extends Repository<Group> {
    public static add(group: Group) {
        return database.getDb().getRepository(Group).save(group);
    }
    
    public static get(group?: number) {
        if (group != null) {
            return database.getDb().manager.findOne(Group, group);
        }
        else return database.getDb().manager.find(Group);
    }

    static async getByIds(groupIds: number[]) {
        return await database.getDb().manager.findByIds(Group, groupIds);
    }
    
}
