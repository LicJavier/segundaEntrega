import log4js from 'log4js';

const logger = log4js.getLogger('default');

log4js.configure({
    appenders: { 
        consola: { type: "console" },
        warn: { type: 'file', filename: './logs/warn.log' },
        error: { type: 'file', filename: './logs/error.log' },
        loggerConsola: { type: 'logLevelFilter' , appender: 'consola' , level: 'info'},
        loggerWarn: { type: 'logLevelFilter' , appender: 'warn' , level: 'warn'},
        loggerError: { type: 'logLevelFilter' , appender: 'error' , level: 'error'}
},
    categories: { 
        default: { appenders: [ "loggerConsola", "loggerWarn" , "loggerError" ], level: "all" },
        
    }
});




export default logger;