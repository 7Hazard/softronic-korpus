import { Entity, EntityRepository, Repository, ManyToOne, Index, PrimaryGeneratedColumn, In } from "typeorm";
import * as database from "../database"
import { Group } from "./Group";
import { Phrase, Phrases } from "./Phrase";

@Entity()
@Index((synonym: Synonym) => [synonym.phrase, synonym.meaning, synonym.group], { unique: true })
export class Synonym {
    constructor(args: { phrase: number, meaning: number, group?: number, id?: number }) {
        if (!args) return
        this.id = args.id
        this.phrase = args.phrase;
        this.meaning = args.meaning;
        this.group = args.group;
    }

    @PrimaryGeneratedColumn()
    public readonly id: number;

    @ManyToOne(() => Phrase, {
        onDelete: "CASCADE"
    })
    phrase: any;

    @ManyToOne(() => Phrase, {
        onDelete: "CASCADE"
    })
    meaning: any;

    @ManyToOne(() => Group, {
        onDelete: "CASCADE"
    })
    group: any;

    async errors() {
        if (this.phrase == this.meaning)
            return { error: "phrase cannot be same as meaning" }
        else if ((await Phrases.getOneById(this.phrase)) == undefined)
            return { error: "phrase does not exist" }
        else if ((await Phrases.getOneById(this.meaning)) == undefined)
            return { error: "meaning does not exist" }
        else if ((await Synonyms.getByMeaningIds([this.phrase])).length != 0)
            return { error: "phrase is already used as a meaning" }
        else if ((await Synonyms.getByPhraseIds([this.meaning])).length != 0)
            return { error: "meaning is already used as a phrase" }
        else if ((await Synonyms.getByPhraseAndMeaningAndGroup(this.phrase, this.meaning, this.group)) != undefined)
            return { error: "this synonym already exists" }
        else if (this.group && (await Synonyms.getByPhraseAndMeaningAndGroup(this.phrase, this.meaning, null)) != undefined)
            return { error: "global synonym already exists" }
    }
}

@EntityRepository(Synonym)
export class Synonyms extends Repository<Synonym>{
    static getAll() {
        return database.getDb().manager.find(Synonym, { relations: ['phrase', 'meaning', 'group'] });
    }

    static get(synonym: Synonym) {
        return database.getDb().manager.getRepository(Synonym).findOne(synonym, { relations: ['phrase', 'meaning', 'group'] });
    }

    static getByIds(synonymIds: number[]) {
        return database.getDb().manager.getRepository(Synonym).findByIds(synonymIds,
            { relations: ['phrase', 'meaning', 'group'] }
        );
    }

    static async getByPhraseIds(ids: number[]) {
        return await database.getDb().manager.getRepository(Synonym).find({
            where: { phrase: In(ids) },
            relations: ["meaning"]
        });
    }

    static async getByMeaningIds(ids: number[]) {
        return await database.getDb().manager.getRepository(Synonym).find({
            where: { meaning: In(ids) },
            relations: ["phrase"]
        });
    }

    // phrase && group
    static async getByPhraseAndGroup(phrase: number, group: number) {
        return await database.getDb().manager.getRepository(Synonym).findOne({
            where: { phrase, group },
            relations: ["meaning", "group"]
        })
    }

    // phrase || meaning
    static async getByPhraseOrMeaning(phraseid: number) {
        return await database.getDb().manager.getRepository(Synonym).find({
            where: [{ phrase: phraseid }, { meaning: phraseid }],
            relations: ["phrase", "meaning"]
        })
    }

    // phrase && meaning && Group
    static async getByPhraseAndMeaningAndGroup(phrase: number, meaning: number, group: number) {
        return await database.getDb().manager.getRepository(Synonym).findOne({
            where: { phrase, meaning, group, }
        })
    }
}
