import styles from 'ansi-styles';

export const toLoggerTimestamp = (date: Date) =>
    `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date
        .getSeconds()
        .toString()
        .padStart(2, '0')}:${date.getMilliseconds().toString().padStart(3, '0')}`;

export const colors = {
    success: str => `${styles.color.green.open}${str}${styles.color.green.close}`,
    warn: str => `${styles.color.yellow.open}${str}${styles.color.yellow.close}`,
    error: str => `${styles.color.red.open}${str}${styles.color.red.close}`,

    red: str => `${styles.color.red.open}${str}${styles.color.red.close}`,
    green: str => `${styles.color.green.open}${str}${styles.color.green.close}`,
    yellow: str => `${styles.color.yellow.open}${str}${styles.color.yellow.close}`,
    blue: str => `${styles.color.blue.open}${str}${styles.color.blue.close}`,
    magenta: str => `${styles.color.magenta.open}${str}${styles.color.magenta.close}`,
    cyan: str => `${styles.color.cyan.open}${str}${styles.color.cyan.close}`,
    white: str => `${styles.color.white.open}${str}${styles.color.white.close}`,
    gray: str => `${styles.color.grey.open}${str}${styles.color.grey.close}`,
    black: str => `${styles.color.black.open}${str}${styles.color.black.close}`,
    redBright: str => `${styles.color.redBright.open}${str}${styles.color.redBright.close}`,
    greenBright: str => `${styles.color.greenBright.open}${str}${styles.color.greenBright.close}`,
    yellowBright: str => `${styles.color.yellowBright.open}${str}${styles.color.yellowBright.close}`,
    blueBright: str => `${styles.color.blueBright.open}${str}${styles.color.blueBright.close}`,
    magentaBright: str => `${styles.color.magentaBright.open}${str}${styles.color.magentaBright.close}`,
    cyanBright: str => `${styles.color.cyanBright.open}${str}${styles.color.cyanBright.close}`,
    whiteBright: str => `${styles.color.whiteBright.open}${str}${styles.color.whiteBright.close}`,
    blackBright: str => `${styles.color.blackBright.open}${str}${styles.color.blackBright.close}`,
    bold: str => `${styles.bold.open}${str}${styles.bold.close}`,
    dim: str => `${styles.dim.open}${str}${styles.dim.close}`,
    italic: str => `${styles.italic.open}${str}${styles.italic.close}`,
    underline: str => `${styles.underline.open}${str}${styles.underline.close}`,
    inverse: str => `${styles.inverse.open}${str}${styles.inverse.close}`,
    strike: str => `${styles.strikethrough.open}${str}${styles.strikethrough.close}`,
} satisfies { [k in string]: (str: string) => string };
