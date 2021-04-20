import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Unique, ManyToOne, Index, PrimaryColumn } from "typeorm";
import * as database from "../database"
import { Word } from "./Word";


@Entity()
@Index("Unique_Syn", ["wordId_1","wordId_2"], {unique: true})
export class Synonym{

    @PrimaryColumn()
    id: number;
    
    @ManyToOne(() => Word, word => word.id)
    wordId_1: number;

    @ManyToOne(() => Word, word => word.id)
    wordId_2: number;
    

    
}