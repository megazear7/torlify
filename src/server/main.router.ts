import express from 'express';
import { healthController } from './controller.health.js';
import { clientController } from './controller.client.js';

const router = express.Router();

router.get("/health", healthController);
router.all("/{*any}", clientController);

export { router };
