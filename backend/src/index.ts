import dotenv from 'dotenv';
import app from './app.js';
import logger from './logger.js';

dotenv.config();

const port = process.env.PORT || 3001;

app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
    logger.info(`API Documentation available at http://localhost:${port}/api-docs`);
});
