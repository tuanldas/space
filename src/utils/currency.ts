export type FormatMoneyOptions = {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showCode?: boolean;
    codePosition?: 'suffix' | 'prefix';
};

const ZERO_DECIMAL_CURRENCIES = new Set(['VND', 'JPY', 'KRW', 'IDR']);

export function formatMoney(amount: number | string, currencyCode?: string, options: FormatMoneyOptions = {}): string {
    const valueNumber = typeof amount === 'string' ? Number(amount) : amount;
    const safeValue = Number.isFinite(valueNumber) ? Math.abs(valueNumber) : 0;
    const code = (currencyCode || 'VND').toUpperCase();

    const minimumFractionDigits =
        options.minimumFractionDigits != null
            ? options.minimumFractionDigits
            : ZERO_DECIMAL_CURRENCIES.has(code)
              ? 0
              : 0;
    const maximumFractionDigits =
        options.maximumFractionDigits != null
            ? options.maximumFractionDigits
            : ZERO_DECIMAL_CURRENCIES.has(code)
              ? 0
              : 2;

    const formattedNumber = new Intl.NumberFormat(undefined, {
        style: 'decimal',
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(safeValue);

    if (options.showCode === false) return formattedNumber;

    if (options.codePosition === 'prefix') {
        return `${code} ${formattedNumber}`;
    }

    return `${formattedNumber} ${code}`;
}
