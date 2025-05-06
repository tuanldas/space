export const renderCurrency = (amount: number, currency: string): string => {
    return (
        new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) +
        ' ' +
        currency
    );
};
