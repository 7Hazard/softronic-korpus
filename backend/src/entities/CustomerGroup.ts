import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import * as database from "../database"

@Entity()
export class CustomerGroup {

    constructor(text: string) {
        this.text = text;
    }

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ nullable: false, unique: true, type: "varchar" })
    text: string;
}