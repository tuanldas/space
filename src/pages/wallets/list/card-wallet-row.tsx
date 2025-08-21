import { useState } from 'react';
import { Edit, EllipsisVertical, Trash } from 'lucide-react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteWalletDialog, EditWalletForm } from './components';
import { IWalletApiItem } from './wallets-content';

interface IWalletItem {
    total: string;
    description: string;
}

export interface IWalletProps {
    id?: string;
    logo?: string;
    logoSize?: string;
    logoDark?: string;
    name: string;
    description?: string;
    statistics?: IWalletItem[];
    progress?: {
        variant: string;
        value: number;
    };
    url: string;
    walletData?: IWalletApiItem;
}

const CardWalletRow = ({ id, name, statistics = [], url, walletData }: IWalletProps) => {
    const intl = useIntl();
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleEdit = () => {
        setIsEditFormOpen(true);
    };

    const handleDelete = () => {
        setIsDeleteDialogOpen(true);
    };

    const renderItem = (statistic: IWalletItem, index: number) => {
        return (
            <div key={index} className="flex flex-col gap-1.5 border border-dashed border-input rounded-md px-2.5 py-2">
                <span className="text-mono text-sm leading-none font-medium">{statistic.total || '0'}</span>
                <span className="text-secondary-foreground text-xs">{statistic.description || ''}</span>
            </div>
        );
    };

    return (
        <>
            <Card className="p-5 lg:p-7.5">
                <div className="flex items-center flex-wrap justify-between gap-5">
                    <div className="flex items-center gap-3.5">
                        <div>
                            <Link to={url} className="text-lg font-medium text-mono hover:text-primary">
                                {name}
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center flex-wrap justify-between gap-5 lg:gap-12">
                        <div className="flex items-center flex-wrap gap-2 lg:gap-5">
                            {statistics && statistics.length > 0 ? (
                                statistics.map((statistic, index) => renderItem(statistic, index))
                            ) : (
                                <div className="text-xs text-secondary-foreground">
                                    {intl.formatMessage({ id: 'common.no_data' })}
                                </div>
                            )}
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" mode="icon">
                                        <EllipsisVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[150px]" side="bottom" align="end">
                                    <DropdownMenuItem onClick={handleEdit}>
                                        <Edit size={16} className="mr-2" />
                                        <span>{intl.formatMessage({ id: 'wallet.actions.edit' })}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                                        <Trash size={16} className="mr-2" />
                                        <span>{intl.formatMessage({ id: 'wallet.actions.delete' })}</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </Card>

            <EditWalletForm isOpen={isEditFormOpen} onOpenChange={setIsEditFormOpen} wallet={walletData} />

            <DeleteWalletDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                walletId={id}
                walletName={name}
            />
        </>
    );
};

export { CardWalletRow };
