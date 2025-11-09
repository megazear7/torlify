import express, { Request, Response, NextFunction } from 'express';
import { healthPath, healthController } from './controller.health.js';
import { bookPath, bookController } from './controller.book.js';
import { clientPath, clientController } from './controller.client.js';

const router = express.Router();

export const wrapper = (controller: Function): (req: Request, res: Response, next: NextFunction) => void => {
    return (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            return controller(req, res, next).catch((error: unknown) => next(error));
        } catch (error) {
            next(error);
        }
    }
}

router.get(healthPath, wrapper(healthController));
router.get(bookPath, wrapper(bookController));
router.all(clientPath, wrapper(clientController));

export { router };
