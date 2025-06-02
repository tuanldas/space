import {CircleDollarSign} from 'lucide-react';
import {Card, CardContent} from '@/components/ui/card';

interface AssetsProps {
    balance: number;
    currency?: string;
}

const Assets = ({balance, currency}: AssetsProps) => {
    return (
        <Card>
            <CardContent>
                <div className="grid gap-y-5">
                    <div className="flex align-start gap-2">
                        <CircleDollarSign className="text-2xl leading-none text-orange-400"/>
                        <div className="flex flex-col gap-2">
                            <span
                                className="text-2xl font-semibold text-mono leading-none tracking-tight">{Intl.NumberFormat().format(balance)} <span className={'uppercase'}>{currency}</span></span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export {Assets};
