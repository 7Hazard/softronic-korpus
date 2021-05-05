import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column, OneToMany, RelationId, OneToOne } from "typeorm";
import * as database from "../database"
import { Synonym } from "./Synonym";
import { Word } from "./Word";

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
    @OneToOne(() => Synonym, synonym => synonym.phrase)
    //@JoinColumn()
    synonym: Phrase;

    // @RelationId((phrase: Phrase) => phrase.synonyms)
    // synonymId: number
}

@EntityRepository(Phrase)
export class Words extends Repository<Phrase> {
    public static add(phrase: Phrase) {
        return database.getDb().getRepository(Phrase).save(phrase);
    }

    public static get(phrase?: number) {
        if (phrase != null) {
            return database.getDb().manager.findOne(Phrase, phrase);
        } else return database.getDb().manager.find(Phrase, { relations: ['synonym', 'synonym.meaning'] });
    }

    public static getOneById(id: number) {
        return database.getDb().manager.findOne(Phrase, id);
    }

    public static getByIds(ids: number[]) {
        return database.getDb().manager.findByIds(Phrase, ids);
    }

    public static async getSynonyms(phrase?: number) {
        if (phrase != null) {
            let phraseresult;
            try {
                return database.getDb().manager.findOne(Phrase, phrase, { relations: ['synonyms'] });

            } catch (error) {
                console.error(error);
            }
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
