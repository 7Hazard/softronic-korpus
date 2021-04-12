import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Entry {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    // TODO synonyms
}
