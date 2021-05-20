import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column, OneToMany, RelationId, OneToOne } from "typeorm";
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

    @OneToMany(() => Synonym, synonym => synonym.phrase)
    synonyms: any[];
}

@EntityRepository(Phrase)
export class Phrases extends Repository<Phrase> {
    public static add(phrase: Phrase) {
        return database.getDb().getRepository(Phrase).save(phrase);
    }

    public static getAll() {
        return database.getDb().manager.find(Phrase, { relations: ['synonyms', 'synonyms.meaning', 'synonyms.group'] });
    }

    public static getAllWithRelations(relations) {
        return database.getDb().manager.find(Phrase, {relations});
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
