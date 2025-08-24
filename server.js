import express from "express";
import logMiddleware from "./middleware/winstonLogger.js";
import errorHandler from "./middleware/errorHandler.js";
import dotenv from 'dotenv';
import appRoutes from "./routes/appRoutes.js";
import "./middleware/processHandler.js";

// setup
const app = express();
dotenv.config();

//middlewares
app.use(express.json());
app.use(logMiddleware);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

//router
app.use('/api', appRoutes);

//error handler
app.use(errorHandler);


const PORT = process.env.PORT || 3400;
app.listen(PORT,()=>{
    console.log('HTTP server listening on port...', PORT);
})