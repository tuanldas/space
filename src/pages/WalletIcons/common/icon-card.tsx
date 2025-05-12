import {toBackendImageUrl} from '@/lib/helpers';
import {Card, CardContent} from '@/components/ui/card';

interface IProps {
    iconId: string;
}

export function IconCard({iconId}: IProps) {
    return (
        <Card>
            <CardContent className="flex flex-col justify-between p-2.5 gap-4">
                <Card
                    className="flex items-center justify-center relative bg-accent/50 w-full h-[180px] shadow-none">
                    <img
                        src={toBackendImageUrl(iconId)}
                        className="h-[180px] shrink-0 cursor-pointer"
                        alt="image"
                    />
                </Card>
            </CardContent>
        </Card>
    );
}
