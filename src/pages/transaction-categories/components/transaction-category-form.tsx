import { useEffect, useRef, useState } from 'react';
import {
    createTransactionCategory,
    TransactionCategory,
    updateTransactionCategory,
} from '@/api/transaction-categories';
import { usePermission } from '@/auth/hooks/use-permission';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useMessage } from '@/lib/custom-hooks';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { isDefaultCategoryWithoutPermission } from '../helpers';

interface TransactionCategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category?: TransactionCategory;
}

interface CreateCategoryInput {
    formData: FormData;
}

interface UpdateCategoryInput {
    id: string;
    formData: FormData;
}

const TransactionCategoryForm = ({ isOpen, onClose, onSuccess, category }: TransactionCategoryFormProps) => {
    const { t } = useMessage();
    const { hasPermission } = usePermission();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    // Kiểm tra nếu là danh mục mặc định và không có quyền quản lý
    const isFormDisabled = isDefaultCategoryWithoutPermission(category, hasPermission);

    const formSchema = z.object({
        name: z.string().min(2, t('validation.name.min_length')),
        description: z.string().optional(),
        type: z.enum(['income', 'expense', 'transfer']),
    });

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            type: 'expense',
        },
    });

    const createMutation = useMutation({
        mutationFn: ({ formData }: CreateCategoryInput) => createTransactionCategory(formData),
        onSuccess: () => {
            toast.success(t('transaction_category.messages.created'));
            queryClient.invalidateQueries({ queryKey: ['transactionCategories'] });
            onSuccess();
            onClose();
        },
        onError: (error) => {
            console.error('Error creating category:', error);
            toast.error(t('transaction_category.messages.error_creating'));
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, formData }: UpdateCategoryInput) => updateTransactionCategory(id, formData),
        onSuccess: () => {
            toast.success(t('transaction_category.messages.updated'));
            queryClient.invalidateQueries({ queryKey: ['transactionCategories'] });
            onSuccess();
            onClose();
        },
        onError: (error) => {
            console.error('Error updating category:', error);
            toast.error(t('transaction_category.messages.error_updating'));
        },
    });

    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        if (category) {
            form.reset({
                name: category.name,
                description: category.description || '',
                type: category.type,
            });
            setPreviewImage(category.image);
        } else {
            form.reset({
                name: '',
                description: '',
                type: 'expense',
            });
            setPreviewImage(null);
            setSelectedImage(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }

        // Vô hiệu hóa form nếu không có quyền chỉnh sửa
        if (isFormDisabled) {
            form.setValue('name', category!.name);
            form.setValue('description', category!.description || '');
            form.setValue('type', category!.type);
        }
    }, [category, form, isOpen, isFormDisabled]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (values: FormValues) => {
        try {
            // Kiểm tra quyền cho danh mục mặc định
            if (isFormDisabled) {
                toast.error(t('transaction_category.messages.no_permission_default'));
                return;
            }

            const formData = new FormData();
            formData.append('name', values.name);

            if (values.description) {
                formData.append('description', values.description);
            }

            formData.append('type', values.type);

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            if (category) {
                updateMutation.mutate({ id: category.id, formData });
            } else {
                createMutation.mutate({ formData });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(
                category
                    ? t('transaction_category.messages.error_updating')
                    : t('transaction_category.messages.error_creating'),
            );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {category ? t('transaction_category.edit') : t('transaction_category.add_new')}
                    </DialogTitle>
                </DialogHeader>

                {isFormDisabled && (
                    <div className="bg-amber-100 border border-amber-200 text-amber-800 p-3 rounded-md mb-4">
                        {t('transaction_category.messages.no_permission_default_form')}
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('transaction_category.form.name')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t('transaction_category.form.name')}
                                            {...field}
                                            disabled={isPending || isFormDisabled}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('transaction_category.form.description')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('transaction_category.form.description')}
                                            className="resize-none"
                                            {...field}
                                            disabled={isPending || isFormDisabled}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('transaction_category.form.type')}</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                        disabled={isPending || isFormDisabled}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('transaction_category.form.type')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="income">
                                                {t('transaction_category.types.income')}
                                            </SelectItem>
                                            <SelectItem value="expense">
                                                {t('transaction_category.types.expense')}
                                            </SelectItem>
                                            <SelectItem value="transfer">
                                                {t('transaction_category.types.transfer')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>{t('transaction_category.form.image')}</FormLabel>
                            <div className="flex flex-col gap-4">
                                {previewImage && (
                                    <div className="relative w-20 h-20">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="destructive"
                                            className="absolute -top-2 -right-2 w-6 h-6"
                                            onClick={() => {
                                                setPreviewImage(null);
                                                setSelectedImage(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                            disabled={isPending || isFormDisabled}
                                        >
                                            <X size={14} />
                                        </Button>
                                    </div>
                                )}
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isPending || isFormDisabled}
                                />
                            </div>
                            <FormMessage />
                        </FormItem>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                                {t('transaction_category.form.cancel')}
                            </Button>
                            <Button type="submit" disabled={isPending || isFormDisabled}>
                                {isPending ? 'Processing...' : t('transaction_category.form.submit')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export { TransactionCategoryForm };
