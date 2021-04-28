import { Router } from "express";
import { CustomerGroup, CustomerGroups } from "../entities/CustomerGroup";
import { getDb } from "../database";
import Validator from "validatorjs";
import { QueryFailedError } from "typeorm";
import { authToken } from "../middlewares/auth";

export default Router()
    .use("customerGroup", authToken)

    .get("/customerGroup", async (req, res) => {
        let getAll = await CustomerGroups.get();
        res.status(200).json(getAll);
    })

    .get("/customerGroup/:id", async (req, res) => {
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

    .put('/customerGroup/:id', async (req, res) => {
        let id = parseInt(req.params.id);
        let text = req.body.text;
        const group = await CustomerGroups.get(id);


        if (!group) {
            res.status(404).json({
                "error": "invalid id"
            })
            return
        }
        let validation = new Validator(req.body, {
            text: ['required', 'min:1', 'max:100', 'regex:/^[A-z0-9% &/-]+$/']
        });

        if (validation.fails()) {
            res.status(400).json(validation.errors);
            return
        } else if (validation.passes())

            await getDb()
                .createQueryBuilder()
                .update(CustomerGroup)
                .set({ text: text })
                .where("id = :id", { id: id })
                .execute();
        res.status(200).json(group)
    })

    .post("/customerGroup", async (req, res) => {
        let text = req.body.text;

        let validation = new Validator(req.body, {
            text: ['required', 'min:1', 'max:100', 'regex:/^[A-z0-9% &/-]+$/']
        });

        if (validation.fails()) {
            res.status(400).json(validation.errors);
        } else if (validation.passes()) {
            let customerGroup = new CustomerGroup(text);
            try {
                customerGroup = await getDb().getRepository(CustomerGroup).save(new CustomerGroup(text));
                res.status(200).json(customerGroup);
            } catch (error) {
                if (error instanceof QueryFailedError) {
                    res.status(409).json();
                }
            }
        }
    })

    .delete("/customerGroup", async (req, res) => {
        let validation = new Validator(req.body, {
            //reqirement
            ids: "array|required",
            "ids.*": "integer",
        })

        if (validation.fails()) {
            res.status(400).json(validation.errors)
        } else if (validation.passes()) {
            try {
                await getDb().manager.delete(CustomerGroup, req.body.ids) // find by id
                res.status(200).json()
            } catch (error) {
                res.status(500).json()
            }
        }
    })