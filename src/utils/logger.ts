import winston from "winston";

const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(
                info => `${info.timestamp} ${info.level}: ${info.message}`
            )
        )
    })
];

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports
});