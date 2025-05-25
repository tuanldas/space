import {toBackendImageUrl} from '@/lib/helpers';
import {Card, CardContent} from '@/components/ui/card';
import {addDefaultImg} from '@/utils/data.ts';
import {ContentLoader} from '@/components/common/content-loader.tsx';
import {ManagedImage} from '@/components/custom/managed-image';

interface IProps {
    iconId: string;
}

export function IconCard({iconId}: IProps) {
    return (
        <Card>
            <CardContent className="flex flex-col justify-between p-2.5 gap-4">
                <Card
                    className="flex items-center justify-center relative bg-accent/50 w-full h-[180px] shadow-none">
                    <ManagedImage
                        src={toBackendImageUrl(iconId)}
                        alt={iconId ? `Icon ${iconId}` : 'Hình ảnh mặc định'}
                        wrapperClassName="w-full h-full"
                        imgClassName="h-[180px] shrink-0 cursor-pointer"
                        loadingComponent={<ContentLoader/>}
                        onError={addDefaultImg}
                    />
                </Card>
            </CardContent>
        </Card>
    );
}
