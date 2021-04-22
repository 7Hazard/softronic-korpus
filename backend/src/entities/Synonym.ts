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