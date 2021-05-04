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
        return database.getDb().getRepository(CustomerGroup).save(customerGroup);
    }
    public static get(customer?: number) {
        if (customer != null) {
            return database.getDb().manager.findOne(CustomerGroup, customer);
        }
        else return database.getDb().manager.find(CustomerGroup);
    }

    static async getCustomerGroupById(groupIds: number[]){
        return await database.getDb().manager.findByIds(CustomerGroup,groupIds);
    }
}
