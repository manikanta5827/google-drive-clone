import {logger} from '../middleware/winstonLogger.js';


export const getUser = ( req, res) => {
    logger.info(`fetching user list`);
    res.status(200).json({
        status: "success",
        message: "Users retrived successfully",
        data: []
    })
} 