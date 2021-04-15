import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import * as database from "../database"

@Entity()
export class Word {

    constructor(text: string) {
        this.text = text;
    }

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ nullable: false, unique: true, type: "varchar" })
    text: string;

    @ManyToMany(() => Word)
    @JoinTable({ name: "Synonym" })
    synonyms: Word[];

}

@EntityRepository(Word)
export class Words extends Repository<Word> {
    public static add(word: Word) {
        return database.get().getRepository(Word).save(word);
    }

    public static get(word?: number) {
        if (word != null) {
            return database.get().manager.findOne(Word, word);
        }
        else return database.get().manager.find(Word, {relations: ['synonyms']} );
        
    }
}
