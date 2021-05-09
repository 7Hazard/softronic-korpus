import { NextFunction, Request, Response, Router } from "express";

type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;
type Handler = (req: Request, res: Response) => Promise<void>;

export class Routes {
    router = Router()
    private basepath: string;

    constructor(basepath = "") {
        this.basepath = basepath;
    }

    get(path: string, middlewares: Middleware[], handler: Handler): this {
        this.router.get(this.basepath + path, this.execute(middlewares, handler))
        return this
    }

    post(path: string, middlewares: Middleware[], handler: Handler): this {
        this.router.post(this.basepath + path, this.execute(middlewares, handler))
        return this
    }

    put(path: string, middlewares: Middleware[], handler: Handler): this {
        this.router.put(this.basepath + path, this.execute(middlewares, handler))
        return this
    }

    delete(path: string, middlewares: Middleware[], handler: Handler): this {
        this.router.delete(this.basepath + path, this.execute(middlewares, handler))
        return this
    }

    private execute(middlewares: Middleware[], handler: Handler) {
        return async (req: Request, res: Response) => {
            let donext = false
            function next() {
                donext = true
            }

            try {
                for (const middleware of middlewares) {
                    await middleware(req, res, next)
                    if (!donext) {
                        // check if status is sent
                        if (res.statusCode == undefined)
                            res.sendStatus(500);
                        return;
                    }
                }
                await handler(req, res)
                if (res.statusCode == undefined)
                    res.sendStatus(500);
            } catch (err) {
                res.sendStatus(500);
                console.error(err);
            }
        }
    }
}
