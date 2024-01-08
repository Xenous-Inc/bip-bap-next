import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';
import { env } from '../env';
import { toLoggerTimestamp, colors } from './helpers';

type ExtendedLogger = log.RootLogger & { [ext in (typeof loggerExtensions)[number]]: log.Logger };

const levels = {
    trace: str => colors.underline(colors.bold(str)),
    debug: str => colors.blueBright(colors.bold(str)),
    info: str => colors.greenBright(colors.bold(str)),
    warn: str => colors.yellow(colors.bold(str)),
    error: str => colors.redBright(colors.bold(str)),
} satisfies { [k in string]: (str: string) => string };

const configure = (logger: log.Logger, isRoot = false) => {
    logger.setLevel(env.NEXT_PUBLIC_ENV === 'development' ? log.levels.TRACE : log.levels.INFO);
    prefix.apply(logger, {
        timestampFormatter: toLoggerTimestamp,
        levelFormatter: level => level.toLowerCase(),
        format: (level, name, timestamp) => {
            const color = levels[level as keyof typeof levels];

            const time = colors.gray(`[${timestamp as unknown as string}]`);
            const body = color(`${isRoot ? '' : `[${name ?? ''}] `}${level.toUpperCase()}:`);

            return `${time} ${body}`;
        },
    });
};

const loggerExtensions = [
    'ui',
    'hooks',
    'redux',
    'api',
    'middlewares',
    'actions',
    'reducers',
    'decorators',
    'utils',
] as const;

export const logger = log as ExtendedLogger;
prefix.reg(log);

configure(log, true);
for (const ext of loggerExtensions) {
    logger[ext] = log.getLogger(ext);
    configure(logger[ext]);
}
