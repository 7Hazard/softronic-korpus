import { join } from "node:path";
import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Unique, ManyToOne, Index, PrimaryColumn, BeforeInsert, JoinColumn, RelationId, OneToOne } from "typeorm";
import * as database from "../database"
import { Phrase } from "./Phrase";

@Entity()
@Index("Unique_Syn", ["phrase", "meaning"], { unique: true })
export class Synonym {

    // // TODO remove, make both other columns together unique
    // @PrimaryGeneratedColumn("increment")
    // SynonymId: number;

    @PrimaryColumn()
    @OneToOne(() => Phrase,{
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "phrase" })
    phrase: number;

    @ManyToOne(() => Phrase, phrase => phrase.synonym)
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

    static async getSynonym(phraseId: number, meaningId: number){
        return await database.getDb().manager.getRepository(Synonym).createQueryBuilder()
        .where("phrase = :phraseId",{phraseId: phraseId})
        .andWhere("meaning = :meaningId", {meaningId: meaningId})
        .getOne()
    }

    static async getSynonymsById(phraseIds: number[]){
        return await database.getDb().manager.findByIds(Synonym,phraseIds);
    }

//     public static getByIds(ids: number[]) {
//         return database.getDb().manager.findByIds(Phrase,ids);
// }


    // public static getSynonymsById(ids:number[]){
    //     return database.getDb().manager.getRepository(Synonym).createQueryBuilder()
    //     .where("phrase = :phraseId", { phraseId: ids })
    //     .getMany()
    // }

    static async getBySynonymId(synonymId: number){
        return await database.getDb().manager.getRepository(Synonym).find({where: {id: synonymId},relations: ["phrase","meaning"]})
    }

    public static getSynonyms(word?: number) {
        if (word != null) {
            try {
                return database.getDb().manager.findOne(Phrase, word, { relations: ['synonyms'] });
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

    public static async deleteSynonym(phraseId: number[]){
        try {
            await database.getDb().getRepository(Synonym).
            createQueryBuilder().delete()
            .where("phrase = :phraseId", {phraseId: phraseId})
            .execute()
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public static async isValidInput(phrase: number, meaning: number, oldMeaning?: number) {
        try {
            if (oldMeaning) {
                let synonymExists = await Synonyms.getSynonym(phrase,oldMeaning);

                if (synonymExists == undefined || (phrase == meaning)) {
                    return false;
                }
            }

            let circularExists = await database.getDb().getRepository(Synonym)
                .createQueryBuilder("synonym")
                .where(`synonym.meaning = ${phrase}`)
                .orWhere(`synonym.phrase = ${meaning}`)
                .getOne();

            if (circularExists == undefined) {
                return true;
            } else return false;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}