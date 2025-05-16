import {toBackendImageUrl} from '@/lib/helpers';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle,} from '@/components/ui/sheet';
import {FormattedMessage} from 'react-intl';
import {Spinner} from '@/components/ui/spinners.tsx';

interface IProps {
    open: boolean;
    walletIconId: string | null;
    onOpenChange: () => void;
    isPendingDelete: boolean;
    onDeleteWalletIcon: () => void;
}

export function StoreClientProductDetailsSheet({
                                                   open,
                                                   walletIconId,
                                                   onOpenChange,
                                                   isPendingDelete,
                                                   onDeleteWalletIcon
                                               }: IProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="sm:w-[520px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
                <SheetHeader className="border-b py-3.5 px-5 border-border">
                    <SheetTitle>Icon Details</SheetTitle>
                </SheetHeader>
                <SheetBody className="px-5 py-0">
                    <ScrollArea className="h-[calc(100dvh-11.75rem)] pe-3 -me-3">
                        <CardContent className="flex flex-col space-y-3 p-5 p-0">
                            <Card className="relative items-center justify-center bg-accent/50 mb-6.5 p-2">
                                {
                                    walletIconId
                                        ? <img
                                            src={toBackendImageUrl(walletIconId)}
                                            className="size-80"
                                            alt="image"
                                        />
                                        : null
                                }
                            </Card>
                        </CardContent>
                    </ScrollArea>
                </SheetBody>
                <SheetFooter className="border-t py-3.5 px-5 border-border">
                    <Button
                        className="grow"
                        variant="destructive"
                        onClick={onDeleteWalletIcon}
                        disabled={isPendingDelete}
                    >
                        {isPendingDelete ? (
                            <span className="flex items-center gap-2"><Spinner
                                className="h-4 w-4 animate-spin"/> <FormattedMessage id={'common.loading'}/>...</span>
                        ) : (
                            <FormattedMessage id={'common.delete'}/>
                        )}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
