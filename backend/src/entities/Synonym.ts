import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Unique, ManyToOne, Index, PrimaryColumn, BeforeInsert, JoinColumn } from "typeorm";
import * as database from "../database"
import { Word } from "./Word";


@Entity()
@Index("Unique_Syn", ["wordId_1","wordId_2"], {unique: true})
export class Synonym{

    // constructor(wordid1: number, wordid2: number){
    //     this.wordId_1 = wordid1;
    //     this.wordId_2 = wordid2;
    // }

    @PrimaryGeneratedColumn("increment")
    id: number;

    
    @ManyToOne(() => Word)
    @JoinColumn({name: "wordId_1"})
    wordId_1: number;

    @ManyToOne(() => Word, word => word.synonyms)
    @JoinColumn({name: "wordId_2"})
    wordId_2: number;
        
}

@EntityRepository(Synonym)
export class Synonyms extends Repository<Synonym>{
    public static async getSynonyms(word?: number) {
        if (word != null) {
            try {
                return database.get().manager.findOne(Word, word, {relations : ['synonyms']});
            } catch (error) {
                console.log(error);
                throw error;
            }    
        }
        else {
            try {
                console.log("getting synonyms")
                return database.get().manager.find(Word,{relations: ['synonyms']})
            } catch (error) {
                console.log(error);
                throw error;
            }
            
            
        }
    }

    public static async validate(word1Id: number, word2Id: number){

        let oppositeExists = await database.get().getRepository(Synonym).
            createQueryBuilder("synonym").
            where("synonym.wordId_1 = :word1Id", {word1Id: word2Id}).
            andWhere("synonym.wordId_2 = :word2Id", {word2Id: word1Id}).
            getOne();
        
        let circularExists = await database.get().getRepository(Synonym)
        .createQueryBuilder("synonym")
        .where("synonym.wordId_2 = :word1Id", {word1Id: word1Id})
        .getOne();

        return oppositeExists || circularExists;
    }
}