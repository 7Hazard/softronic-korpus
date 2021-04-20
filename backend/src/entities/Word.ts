import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany,JoinTable, PrimaryColumn, ManyToOne } from "typeorm";
import * as database from "../database"
import { Synonym } from "./Synonym";

@Entity()
export class Word {

    constructor(text: string) {
        this.text = text;
    }

    @PrimaryColumn()
    id: number;

    @Column({ nullable: false, unique: true, type: "varchar" })
    text: string;

    @OneToMany(() => Synonym, synonym => {synonym.wordId_1,synonym.wordId_2})
    synonyms: Synonym[];

}

@EntityRepository(Word)
export class Words extends Repository<Word> {
    public static add(word: Word) {
        return database.get().getRepository(Word).save(word);
    }

    public static get(word?:number){
        if(word != null){
            return database.get().manager.findOne(Word,word);
        } else return database.get().manager.find(Word);
    }

    public static getSynonyms(word?: number) {
        if (word != null) {
            return database.get().manager.findOne(Word, word, {relations : ['synonyms']});
        }
        else return database.get().manager.find(Word, {relations: ['synonyms']} );
        
    }
}
