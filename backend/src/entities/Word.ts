import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Word {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({nullable: false,unique: true,type: "varchar"})
    text: string;

    // TODO synonyms
}
