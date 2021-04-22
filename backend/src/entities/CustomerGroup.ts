import { Entity, EntityRepository, Repository, PrimaryGeneratedColumn, Column } from "typeorm";
import * as database from "../database"

@Entity()
export class CustomerGroup {

    constructor(text: string) {
        this.text = text;
    }

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ nullable: false, unique: true, type: "varchar" })
    text: string;
}
@EntityRepository(CustomerGroup)
export class CustomerGroups extends Repository<CustomerGroup> {
    public static add(customerGroup: CustomerGroup) {
        return database.get().getRepository(CustomerGroup).save(customerGroup);
    }
    public static get(customer?: number) {
        if (customer != null) {
            return database.get().manager.findOne(CustomerGroup, customer);
        }
        else return database.get().manager.find(CustomerGroup);
    }
}
