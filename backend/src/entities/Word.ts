import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import * as database from "../database"
import { Synonym } from "./Synonym";

@Entity()
export class Word {

    constructor(text: string) {
        this.text = text;
    }

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ nullable: false, unique: true, type: "varchar" })
    text: string;

    @OneToMany(() => Synonym, synonym => synonym.wordId_1)
    @JoinColumn()
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
        } else return database.get().manager.find(Word);
    }

    public static async getSynonyms(word?: number) {
        if (word != null) {
            let wordresult;
            try {
                return database.get().manager.findOne(Word, word, { relations: ['synonyms'] });
                // wordresult = await database.get().manager.findOne(Word, word);
                // wordresult.synonyms = await database.get().createQueryBuilder()
                //     .relation(Word, "synonyms")
                //     .of(wordresult)
                //     .loadMany();
            } catch (error) {
                console.error(error);
            }
            // try {
            //     return database.get().manager.findOne(Word, word, {relations : ['synonyms']});
            // } catch (error) {
            //     console.log(error);
            //     throw error;
            // }

            return wordresult;
        }
        else {
            try {
                return database.get().manager.find(Word, { relations: ['synonyms'] })
            } catch (error) {
                console.error(error);
                throw error;
            }


        }

    }
}
