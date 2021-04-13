import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column } from "typeorm";
import * as db from "../db"

@Entity()
export class Word {

    constructor(text:string) {
        this.text = text;
    }

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({nullable: false,unique: true,type: "varchar"})
    text: string;

    // TODO synonyms
}

@EntityRepository(Word)
export class Words extends Repository<Word> {
    // public static add(word: Word) {
    //     return db.get().getRepository(Word).insert(word);
    // }
}
