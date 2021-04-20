import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Unique, ManyToOne, Index, PrimaryColumn, BeforeInsert, JoinColumn } from "typeorm";
import * as database from "../database"
import { Word } from "./Word";


@Entity()
@Index("Unique_Syn", ["wordId_1","wordId_2"], {unique: true})
export class Synonym{

    constructor(wordid1: number, wordid2: number){
        this.wordId_1 = wordid1;
        this.wordId_2 = wordid2;
    }

    @PrimaryGeneratedColumn("increment")
    id: number;
    
    @ManyToOne(() => Word, word => word.id, {cascade: true})
    @JoinColumn({name: "wordId_1"})
    wordId_1: number;

    @ManyToOne(() => Word, word => word.id, {cascade: true})
    @JoinColumn({name: "wordId_2"})
    wordId_2: number;
    
    @BeforeInsert()
    biderectional(){
        let sqltext = "SELECT ";
        let result = database.get().getRepository(Synonym).
        createQueryBuilder("synonym").
        where("synonym.wordId1Id = :word1Id", {word1Id: this.wordId_2}).
        andWhere("synonym.wordId2Id = :word2Id", {word2Id: this.wordId_1});

        if(result){
            console.log("ERROR");
        }
    }
    
    
}