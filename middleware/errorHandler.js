import {logger} from "../utils/winstonLogger.js";
import { parse  } from 'stack-trace';
import path from "path";

const errorHandler = (err, req,res, next) => {
    
    const stackFrames = parse(err); 

    if(stackFrames[0]) {
        let fileName = path.basename(stackFrames[0].getFileName() ?? 'fileNotfound');
        let lineNumber = stackFrames[0].getLineNumber();
        let functionName = stackFrames[0].getFunctionName();
        let errorMessage = err.message;

        let logMessage = `[CRITICAL]: Error happened in file::${fileName} Line::${lineNumber} FunctioName::${functionName} Message::${errorMessage}`;

        logger.warn(logMessage);
    }

    if(err.message == "Converting circular structure to JSON\n    --> starting at object with constructor 'Socket'\n    |     property 'parser' -> object with constructor 'HTTPParser'\n    --- property 'socket' closes the circle") {
        err.message = "Circular reference detected: JSON.stringify() cannot serialize objects with circular references. Please remove or fix the problematic JSON.stringify() call."
    }
    res.status(500).send({
        status: "error",
        message: 'Something went wrong!',
        error: err.message
    });
}

export default errorHandler;