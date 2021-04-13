import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Word {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column("varchar")
    text: string;

    // TODO synonyms
}
