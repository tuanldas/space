import { Fragment, useEffect, useState } from 'react';
import { TransactionCategory } from '@/api/transaction-categories';
import { PermissionGuard } from '@/auth/components/permission-guard';
import { usePermission } from '@/auth/hooks/use-permission';
import { PermissionCode } from '@/auth/lib/permission';
import { withPermission } from '@/auth/with-permission';
import { Plus } from 'lucide-react';
import { useMessage } from '@/lib/custom-hooks';
import { useToolbar } from '@/providers/toolbar-provider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components/common/container';
import { TransactionCategoryForm, TransactionCategoryList, TransactionCategoryTrashedList } from './components';

function TransactionCategoriesPageComponent() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<string>('active');
    const { t } = useMessage();
    const { hasPermission } = usePermission();
    const { setToolbarActions, setToolbarTitle } = useToolbar();

    const handleAddClick = () => {
        setSelectedCategory(undefined);
        setIsFormOpen(true);
    };

    const handleEditClick = (category: TransactionCategory) => {
        setSelectedCategory(category);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
    };

    useEffect(() => {
        setToolbarTitle(null);
        setToolbarActions(
            <PermissionGuard permission={PermissionCode.CREATE_TRANSACTION_CATEGORIES}>
                <Button onClick={handleAddClick} mode="icon" variant="primary">
                    <Plus className="h-4 w-4 text-white" />
                </Button>
            </PermissionGuard>,
        );
        return () => {
            setToolbarActions(null);
            setToolbarTitle(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Fragment>
            <Container>
                <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="border-b">
                        <TabsList className="mb-0">
                            <TabsTrigger value="active">{t('transaction_category.tabs.active')}</TabsTrigger>
                            <TabsTrigger value="trashed">{t('transaction_category.tabs.trashed')}</TabsTrigger>
                        </TabsList>
                    </div>
                    <div className="mt-6">
                        <TabsContent value="active">
                            <TransactionCategoryList
                                onEdit={
                                    hasPermission(PermissionCode.UPDATE_TRANSACTION_CATEGORIES)
                                        ? handleEditClick
                                        : undefined
                                }
                            />
                        </TabsContent>
                        <TabsContent value="trashed">
                            <TransactionCategoryTrashedList />
                        </TabsContent>
                    </div>
                </Tabs>
            </Container>

            <TransactionCategoryForm
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSuccess={handleFormSuccess}
                category={selectedCategory}
            />
        </Fragment>
    );
}

export const TransactionCategoriesPage = withPermission(
    TransactionCategoriesPageComponent,
    PermissionCode.VIEW_TRANSACTION_CATEGORIES,
);
