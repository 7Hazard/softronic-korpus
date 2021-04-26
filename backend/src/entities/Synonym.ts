import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, ManyToOne, Index, JoinColumn } from "typeorm";
import * as database from "../database"
import { Phrase } from "./Phrase";

@Entity()
@Index("Unique_Syn", ["phrase", "meaning"], { unique: true })
export class Synonym {

    // TODO remove, make both other columns together unique
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Phrase)
    @JoinColumn({ name: "phrase" })
    phrase: number;

    @ManyToOne(() => Phrase, phrase => phrase.synonyms)
    @JoinColumn({ name: "meaning" })
    meaning: number;
}

@EntityRepository(Synonym)
export class Synonyms extends Repository<Synonym>{
    static getAll() {
        return database.getDb().manager.find(Synonym, { relations: ['phrase', 'meaning'] });
    }

    static async getByPhrase(phraseid: number) {
        return await database.getDb().manager.getRepository(Synonym).find({ where: [{ phrase: phraseid }, {meaning: phraseid}], relations: ["phrase", "meaning"] })
    }

    public static getSynonyms(phrase?: number) {
        if (phrase != null) {
            try {
                return database.getDb().manager.findOne(Phrase, phrase, { relations: ['synonyms'] });
            } catch (error) {
                console.log(error);
                throw error;
            }
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

    public static async isValidInput(phrase: number, meaning: number, oldMeaning?: number) {
        try {
            if (oldMeaning) {
                let synonymExists = await database.getDb().getRepository(Synonym)
                    .createQueryBuilder("synonym")
                    .where("synonym.phrase = :phrase", { phrase: phrase })
                    .andWhere("synonym.meaning = :meaning", { meaning: oldMeaning })
                    .getOne();

                if (synonymExists == undefined) {
                    return false;
                }
            }

            let oppositeExists = await database.getDb().getRepository(Synonym).
                createQueryBuilder("synonym").
                where("synonym.phrase = :phrase", { phrase: meaning }).
                andWhere("synonym.meaning = :meaning", { meaning: phrase }).
                getOne();

            let circularExists = await database.getDb().getRepository(Synonym)
                .createQueryBuilder("synonym")
                .where("synonym.meaning = :phrase", { phrase: phrase })
                .getOne();

            if (oppositeExists == undefined || circularExists == undefined) {
                return true;
            } else return false;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}