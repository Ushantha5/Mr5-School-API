import express from 'express';
import { createToken } from '../controllers/livekitController.js';
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get LiveKit token
// POST /api/livekit/token
router.post('/token', createToken);

export default router;
