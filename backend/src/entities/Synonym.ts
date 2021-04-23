import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Unique, ManyToOne, Index, PrimaryColumn, BeforeInsert, JoinColumn } from "typeorm";
import * as database from "../database"
import { Word, Words } from "./Word";

@Entity()
@Index("Unique_Syn", ["phrase", "meaning"], { unique: true })
export class Synonym {

    // TODO remove, make both other columns together unique
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Word)
    @JoinColumn({ name: "phrase" })
    phrase: number;

    @ManyToOne(() => Word, word => word.synonyms)
    @JoinColumn({ name: "meaning" })
    meaning: number;
}

@EntityRepository(Synonym)
export class Synonyms extends Repository<Synonym>{
    static getAll() {
        return database.getDb().manager.find(Synonym, { relations: ['phrase', 'meaning'] });
    }

    static async getByWord(wordid: number) {
        return await database.getDb().manager.getRepository(Synonym).find({ where: [{ phrase: wordid }, {meaning: wordid}], relations: ["phrase", "meaning"] })
    }

    public static getSynonyms(word?: number) {
        if (word != null) {
            try {
                return database.getDb().manager.findOne(Word, word, { relations: ['synonyms'] });
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
        else {
            try {
                return database.getDb().manager.find(Word, { relations: ['synonyms'] })
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