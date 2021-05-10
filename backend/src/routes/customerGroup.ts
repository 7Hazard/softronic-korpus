import { CustomerGroup, CustomerGroups } from "../entities/CustomerGroup";
import { getDb } from "../database";
import Validator from "validatorjs";
import { QueryFailedError } from "typeorm";
import { authToken } from "../middlewares/auth";
import { Routes } from "./Routes";
import { trimText } from "../util";

export default new Routes("/customerGroup")
    .get("/", [], async (req, res) => {
        let getAll = await CustomerGroups.get();
        res.status(200).json(getAll);
    })

    .get("/:id", [], async (req, res) => {
        let id = parseInt(req.params.id);
        const group = await CustomerGroups.get(id);
        if (!group) {
            res.status(404).json({
                "error": "Group not found"
            })
            return
        }
        res.status(200).json(group);
    })

    .put('/:id', [authToken], async (req, res) => {

        let validation = new Validator(req.body, {
            name: ['required', 'min:1', 'max:100', 'regex:/^[A-zäöåÄÖÅ0-9% &/-]+$/']
        });

        if (validation.fails()) {
            res.status(400).json(validation.errors);
            return
        } else if (validation.passes()) {
            let id = parseInt(req.params.id);
            let name = req.body.name;
            const group = await CustomerGroups.get(id);

            if (!group) {
                res.status(404).json({ error: "invalid id" })
                return
            }

            await getDb()
                .createQueryBuilder()
                .update(CustomerGroup)
                .set({ name })
                .where(`id = ${id}`)
                .execute();

            res.status(200).json(group)
        }
    })

    .post("/", [authToken], async (req, res) => {

        let validation = new Validator(req.body, {
            name: ['required', 'min:1', 'max:100', 'regex:/^[A-zäöåÄÖÅ0-9% &/-]+$/']
        });

        if (validation.fails()) {
            res.status(400).json(validation.errors);
        } else if (validation.passes()) {
            let name = trimText(req.body.name);
            let customerGroup = new CustomerGroup(name);
            try {
                customerGroup = await getDb().getRepository(CustomerGroup).save(customerGroup);
                res.status(200).json(customerGroup);
            } catch (error) {
                if (error instanceof QueryFailedError) {
                    res.status(409).json();
                }
            }
        }
    })

    .delete("/", [authToken], async (req, res) => {
        let validation = new Validator(req.body, {
            //reqirement
            ids: "array|required",
            "ids.*": "integer",
        })

        if (validation.fails()) {
            res.status(400).json(validation.errors)
        } else if (validation.passes()) {
            let groups =await CustomerGroups.getCustomerGroupById(req.body.ids)
            if(groups.length == 0){
                res.status(200).json({deleted:[]})
                return
            }
            try {
                let deletedIds=[]
                
                for (const group of groups) {
                    deletedIds.push(group.id)  
                }
                
                await getDb().manager.delete(CustomerGroup, deletedIds)
                res.status(200).json({deleted:deletedIds})
            } catch (error) {
                res.status(500).json()
            }
        }
    })
