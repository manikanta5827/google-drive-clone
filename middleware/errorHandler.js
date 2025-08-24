import {logger} from "./winstonLogger.js";
import { parse  } from 'stack-trace';
import path from "path";

const errorHandler = (err, req,res, next) => {
    
    const stackFrames = parse(err); 

    let fileName = path.basename(stackFrames[0].getFileName());
    let lineNumber = stackFrames[0].getLineNumber();
    let functionName = stackFrames[0].getFunctionName();
    let errorMessage = err.message;

    let logMessage = `[CRITICAL]: Error happened in file::${fileName} Line::${lineNumber} FunctioName::${functionName} Message::${errorMessage}`;

    logger.warn(logMessage);

    res.status(500).send({
        status: "error",
        message: 'Something went wrong!',
        error: err.message
    });
}

export default errorHandler;