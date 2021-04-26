import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import * as database from "../database"
import { Synonym } from "./Synonym";

@Entity()
export class Phrase {

    constructor(text: string) {
        this.text = text;
    }

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ nullable: false, unique: true, type: "varchar" })
    text: string;

    // TODO redundant, remove
    @OneToMany(() => Synonym, synonym => synonym.phrase)
    //@JoinColumn()
    synonyms: Phrase[];

}

@EntityRepository(Phrase)
export class Words extends Repository<Phrase> {
    public static add(phrase: Phrase) {
        return database.getDb().getRepository(Phrase).save(phrase);
    }

    public static get(phrase?: number) {
        if (phrase != null) {
            return database.getDb().manager.findOne(Phrase, phrase);
        } else return database.getDb().manager.find(Phrase);
    }

    public static getOneById(id: number) {
        return database.getDb().manager.findOne(Phrase, id);
    }

    public static async getSynonyms(phrase?: number) {
        if (phrase != null) {
            let phraseresult;
            try {
                return database.getDb().manager.findOne(Phrase, phrase, { relations: ['synonyms'] });
                // phraseresult = await database.get().manager.findOne(Word, phrase);
                // phraseresult.synonyms = await database.get().createQueryBuilder()
                //     .relation(Word, "synonyms")
                //     .of(phraseresult)
                //     .loadMany();
            } catch (error) {
                console.error(error);
            }
            // try {
            //     return database.get().manager.findOne(Word, phrase, {relations : ['synonyms']});
            // } catch (error) {
            //     console.log(error);
            //     throw error;
            // }

            return phraseresult;
        }
        else {
            try {
                return database.getDb().manager.find(Phrase, { relations: ['synonyms'] })
            } catch (error) {
                console.error(error);
                throw error;
            }


        }

    }
}
