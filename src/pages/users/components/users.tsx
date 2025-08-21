import { useEffect, useMemo, useState } from 'react';
import {
    assignRole,
    createUser,
    deleteUser,
    getRoles,
    getUser,
    getUsers,
    ICreateUserData,
    IPaginatedResponse,
    IUpdateUserData,
    IUserData,
    IUserRole,
    updateUser,
} from '@/api/user';
import { PermissionGuard } from '@/auth/components/permission-guard';
import { PermissionCode } from '@/auth/lib/permission';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { AxiosError, AxiosResponse } from 'axios';
import { Loader2, Pencil, Plus, Search, Trash2, UserCog, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as z from 'zod';
import { useMessage } from '@/lib/custom-hooks';
import { useToast } from '@/lib/hooks';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useToolbar } from '@/providers/toolbar-provider';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardTable } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

const RequiredIndicator = () => {
    return <span className="text-destructive ml-1">*</span>;
};

const Users = () => {
    const { t } = useMessage();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { handleError } = useErrorHandler();
    const { setToolbarActions } = useToolbar();

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([{ id: 'users', desc: false }]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<IUser | null>(null);
    const [roleUser, setRoleUser] = useState<IUser | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const createUserSchema = z
        .object({
            name: z
                .string()
                .min(2, { message: t('validation.name.min_length') })
                .max(50, { message: t('validation.name.max_length') }),
            email: z
                .string()
                .email({ message: t('validation.email.invalid') })
                .min(1, { message: t('validation.email.required') }),
            password: z
                .string()
                .min(8, { message: t('validation.password.min_length') })
                .refine((val) => /[A-Z]/.test(val), {
                    message: t('validation.password.uppercase'),
                }),
            password_confirmation: z.string().optional(),
            role: z.string().min(1, { message: t('validation.role.required') }),
        })
        .refine(
            (data) => {
                return data.password === data.password_confirmation;
            },
            {
                message: t('validation.password.match'),
                path: ['password_confirmation'],
            },
        );

    const updateUserSchema = z
        .object({
            name: z
                .string()
                .min(2, { message: t('validation.name.min_length') })
                .max(50, { message: t('validation.name.max_length') }),
            email: z
                .string()
                .email({ message: t('validation.email.invalid') })
                .min(1, { message: t('validation.email.required') }),
            password: z.string().optional(),
            password_confirmation: z.string().optional(),
        })
        .refine(
            (data) => {
                if (!data.password || data.password === '') {
                    return true;
                }
                return data.password === data.password_confirmation;
            },
            {
                message: t('validation.password.match'),
                path: ['password_confirmation'],
            },
        );

    const formSchema = editingUser ? updateUserSchema : createUserSchema;

    const roleFormSchema = z.object({
        role: z.string().min(1, { message: t('validation.role.required') }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: '',
        },
    });

    const roleForm = useForm<z.infer<typeof roleFormSchema>>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            role: '',
        },
    });

    const {
        data: usersResponse,
        isLoading: isLoadingUsers,
        error: usersError,
    } = useQuery<AxiosResponse<IPaginatedResponse<IUserData>>, AxiosError>({
        queryKey: ['users', pagination.pageIndex, pagination.pageSize, searchQuery],
        queryFn: () => getUsers(pagination.pageIndex + 1, pagination.pageSize, searchQuery),
    });

    const { data: rolesResponse, isLoading: isLoadingRoles } = useQuery<AxiosResponse<IUserRole[]>, AxiosError>({
        queryKey: ['roles'],
        queryFn: getRoles,
        staleTime: 30000,
    });

    const { data: userDetailsResponse } = useQuery<AxiosResponse<IUserData> | null, AxiosError>({
        queryKey: ['user', selectedUserId],
        queryFn: () => (selectedUserId ? getUser(selectedUserId) : null),
        enabled: !!selectedUserId,
    });

    const deleteMutation = useMutation<AxiosResponse<{ message: string }>, AxiosError, string | number>({
        mutationFn: deleteUser,
        onSuccess: () => {
            setDeleteDialogOpen(false);
            toast({ title: t('user.management.deleted') });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            handleError(error, {
                title: t('user.management.error_deleting'),
            });
        },
    });

    const createUserMutation = useMutation<AxiosResponse<IUserData>, AxiosError, ICreateUserData>({
        mutationFn: createUser,
        onSuccess: () => {
            setIsUserDialogOpen(false);
            toast({ title: t('user.management.created') });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            form.reset();
        },
        onError: (error) => {
            handleError(error, {
                title: t('user.management.error_creating'),
            });
        },
    });

    const updateUserMutation = useMutation<AxiosResponse<IUserData>, AxiosError, { id: string; data: IUpdateUserData }>(
        {
            mutationFn: ({ id, data }) => updateUser(id, data),
            onSuccess: () => {
                setIsUserDialogOpen(false);
                toast({ title: t('user.management.updated') });
                queryClient.invalidateQueries({ queryKey: ['users'] });
                queryClient.invalidateQueries({ queryKey: ['user-details'] });
                form.reset();
            },
            onError: (error) => {
                handleError(error, {
                    title: t('user.management.error_updating'),
                });
            },
        },
    );

    const updateRoleMutation = useMutation<
        AxiosResponse<{ message: string }>,
        AxiosError,
        { userId: string | number; role: string }
    >({
        mutationFn: ({ userId, role }) => assignRole(userId, role),
        onSuccess: () => {
            setIsRoleDialogOpen(false);
            toast({ title: t('user.management.role_updated') });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', roleUser?.id] });
            setRoleUser(null);
            roleForm.reset();
        },
        onError: (error) => {
            handleError(error, {
                title: t('user.management.error_updating_role'),
            });
        },
    });

    useEffect(() => {
        if (userDetailsResponse && selectedUserId) {
            const user = userDetailsResponse.data;
            setEditingUser({
                id: String(user.id),
                name: user.name,
                email: user.email,
                role: user.roles && user.roles.length > 0 ? user.roles[0].name : '',
            });

            form.reset({
                name: user.name,
                email: user.email,
                password: '',
                password_confirmation: '',
            });

            setIsUserDialogOpen(true);
            setSelectedUserId(null);
        }
    }, [userDetailsResponse, selectedUserId, form]);

    useEffect(() => {
        if (usersError) {
            handleError(usersError, {
                title: t('user.management.error_loading'),
            });
        }
    }, [usersError, handleError, t]);

    const userData: IUser[] = useMemo(() => {
        if (!usersResponse?.data?.data) return [];
        return usersResponse.data.data.map((user: IUserData) => ({
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: user.roles && user.roles.length > 0 ? user.roles[0].title : '-',
        }));
    }, [usersResponse]);

    const roles: IUserRole[] = useMemo(() => {
        return rolesResponse?.data || [];
    }, [rolesResponse]);

    const handleAddUser = () => {
        setEditingUser(null);
        form.reset(
            {
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                role: '',
            },
            {
                keepDefaultValues: false,
            },
        );
        setIsUserDialogOpen(true);
    };

    const handleEditUser = (userId: string) => {
        setSelectedUserId(userId);
    };

    const handleEditRole = (user: IUser) => {
        setRoleUser(user);
        const userRole = user.role ? roles.find((r) => r.title === user.role)?.name || '' : '';
        roleForm.reset({
            role: userRole,
        });
        setIsRoleDialogOpen(true);
    };

    const handleDeleteConfirmation = (userId: string) => {
        setUserToDelete(userId);
        const userToBeDeleted = userData.find((user) => user.id === userId);
        if (userToBeDeleted) {
            setDeleteDialogOpen(true);
        }
    };

    const handleDeleteUser = () => {
        if (!userToDelete) return;
        deleteMutation.mutate(userToDelete);
    };

    const userBeingDeleted = useMemo(() => {
        if (!userToDelete) return null;
        return userData.find((user) => user.id === userToDelete);
    }, [userToDelete, userData]);

    const onSubmitUser = (data: z.infer<typeof formSchema>) => {
        if (editingUser) {
            const updateData: IUpdateUserData = {
                name: data.name,
                email: data.email,
            };

            if (data.password && data.password.trim() !== '') {
                updateData.password = data.password;
                updateData.password_confirmation = data.password_confirmation;
            }

            updateUserMutation.mutate({ id: editingUser.id, data: updateData });
        } else {
            createUserMutation.mutate(data as ICreateUserData);
        }
    };

    const onSubmitRole = (data: z.infer<typeof roleFormSchema>) => {
        if (roleUser) {
            updateRoleMutation.mutate({
                userId: roleUser.id,
                role: data.role,
            });
        }
    };

    useEffect(() => {
        setToolbarActions(
            <div className="flex items-center gap-2.5">
                <div className="relative">
                    <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                    <Input
                        placeholder={t('user.management.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="ps-9 w-40"
                    />
                    {searchQuery.length > 0 && (
                        <Button
                            mode="icon"
                            variant="ghost"
                            className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                            onClick={() => setSearchQuery('')}
                        >
                            <X />
                        </Button>
                    )}
                </div>
                <PermissionGuard permission={PermissionCode.CREATE_USERS}>
                    <Button onClick={handleAddUser} mode="icon" variant="primary">
                        <Plus className="h-4 w-4 text-white" />
                    </Button>
                </PermissionGuard>
            </div>,
        );
        return () => setToolbarActions(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, t]);

    function ActionsCell({ user }: { user: IUser }) {
        return (
            <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="size-8" onClick={() => handleEditUser(user.id)}>
                    <Pencil size={16} />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-primary"
                    onClick={() => handleEditRole(user)}
                >
                    <UserCog size={16} />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-destructive"
                    onClick={() => handleDeleteConfirmation(user.id)}
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        );
    }

    const columns = useMemo<ColumnDef<IUser>[]>(
        () => [
            {
                id: 'users',
                accessorFn: (row) => ({ name: row.name, email: row.email }),
                header: ({ column }) => (
                    <DataGridColumnHeader title={t('user.management.column.member')} column={column} />
                ),
                cell: ({ row }) => (
                    <div className="flex flex-col gap-0.5">
                        <Link to="#" className="text-sm font-medium text-mono hover:text-primary-active mb-px">
                            {row.original.name}
                        </Link>
                        <Link
                            to="#"
                            className="text-sm text-secondary-foreground font-normal hover:text-primary-active"
                        >
                            {row.original.email}
                        </Link>
                    </div>
                ),
                enableSorting: false,
                size: 300,
                meta: {
                    headerClassName: '',
                },
            },
            {
                id: 'role',
                accessorFn: (row) => row.role,
                header: ({ column }) => (
                    <DataGridColumnHeader title={t('user.management.column.role')} column={column} />
                ),
                cell: ({ row }) => <span className="text-foreground font-normal">{row.original.role}</span>,
                enableSorting: false,
                size: 180,
                meta: {
                    headerClassName: '',
                },
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => <ActionsCell user={row.original} />,
                enableSorting: false,
                size: 100,
                meta: {
                    headerClassName: '',
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [t],
    );

    const table = useReactTable({
        columns,
        data: userData,
        pageCount: usersResponse?.data?.last_page || -1,
        getRowId: (row: IUser) => String(row.id),
        state: {
            pagination,
            sorting,
        },
        columnResizeMode: 'onChange',
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    });

    return (
        <>
            <DataGrid
                table={table}
                recordCount={usersResponse?.data?.total || 0}
                isLoading={isLoadingUsers}
                tableLayout={{
                    stripped: true,
                    cellBorder: true,
                    columnsVisibility: false,
                    columnsPinnable: false,
                    columnsMovable: false,
                }}
            >
                <Card>
                    <CardTable>
                        <ScrollArea>
                            {isLoadingUsers ? (
                                <div className="flex justify-center items-center p-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                <DataGridTable />
                            )}
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </CardTable>
                    <CardFooter>
                        <DataGridPagination />
                    </CardFooter>
                </Card>
            </DataGrid>

            <Dialog
                open={isUserDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsUserDialogOpen(false);
                        setEditingUser(null);
                        form.reset();
                    }
                }}
            >
                <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b">
                        <DialogTitle className="text-2xl font-semibold">
                            {editingUser
                                ? `${t('user.management.edit_user')} - ${editingUser.name}`
                                : t('user.management.add_user')}
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            id={editingUser ? `edit-user-form-${editingUser.id}` : 'add-user-form'}
                            onSubmit={form.handleSubmit(onSubmitUser)}
                            className="p-6 space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-col gap-2">
                                            <FormLabel className="text-left text-base">
                                                {t('user.management.form.name')}
                                                <RequiredIndicator />
                                            </FormLabel>
                                            <div className="w-full">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={
                                                            createUserMutation.isPending || updateUserMutation.isPending
                                                        }
                                                        className="text-base py-5 w-full"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-col gap-2">
                                            <FormLabel className="text-left text-base">
                                                {t('user.management.form.email')}
                                                <RequiredIndicator />
                                            </FormLabel>
                                            <div className="w-full">
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        {...field}
                                                        disabled={
                                                            createUserMutation.isPending || updateUserMutation.isPending
                                                        }
                                                        className="text-base py-5 w-full"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-col gap-2">
                                            <FormLabel className="text-left text-base">
                                                {t('user.management.form.password')}
                                                {!editingUser && <RequiredIndicator />}
                                            </FormLabel>
                                            <div className="w-full">
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                        disabled={
                                                            createUserMutation.isPending || updateUserMutation.isPending
                                                        }
                                                        className="text-base py-5 w-full"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                {editingUser && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {t('user.management.form.password_hint')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password_confirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-col gap-2">
                                            <FormLabel className="text-left text-base">
                                                {t('user.management.form.password_confirmation')}
                                                {!editingUser && <RequiredIndicator />}
                                            </FormLabel>
                                            <div className="w-full">
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                        disabled={
                                                            createUserMutation.isPending || updateUserMutation.isPending
                                                        }
                                                        className="text-base py-5 w-full"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {!editingUser && (
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex flex-col gap-2">
                                                <FormLabel className="text-left text-base">
                                                    {t('user.management.form.role')}
                                                    <RequiredIndicator />
                                                </FormLabel>
                                                <div className="w-full">
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            disabled={
                                                                createUserMutation.isPending ||
                                                                updateUserMutation.isPending ||
                                                                isLoadingRoles
                                                            }
                                                        >
                                                            <SelectTrigger className="py-5 text-base w-full">
                                                                <SelectValue
                                                                    placeholder={t('user.management.form.select_role')}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {roles.map((role) => (
                                                                    <SelectItem key={role.name} value={role.name}>
                                                                        {role.title}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </form>
                    </Form>
                    <DialogFooter className="p-6 border-t">
                        <Button
                            type="submit"
                            form={editingUser ? `edit-user-form-${editingUser.id}` : 'add-user-form'}
                            disabled={createUserMutation.isPending || updateUserMutation.isPending}
                            className="text-base py-5 px-8"
                        >
                            {createUserMutation.isPending || updateUserMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : null}
                            {t('user.management.form.submit')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isRoleDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsRoleDialogOpen(false);
                        setRoleUser(null);
                        roleForm.reset();
                    }
                }}
            >
                <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b">
                        <DialogTitle className="text-2xl font-semibold">
                            {roleUser && `${t('user.management.update_role')} - ${roleUser.name}`}
                        </DialogTitle>
                    </DialogHeader>
                    {roleUser && (
                        <Form {...roleForm}>
                            <form
                                id={`role-user-form-${roleUser.id}`}
                                onSubmit={roleForm.handleSubmit(onSubmitRole)}
                                className="p-6 space-y-8"
                            >
                                <div className="p-4 border rounded-md bg-muted/50 mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">{t('user.management.form.name')}:</span>
                                        <span>{roleUser.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{t('user.management.form.email')}:</span>
                                        <span>{roleUser.email}</span>
                                    </div>
                                </div>

                                <FormField
                                    control={roleForm.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex flex-col gap-2">
                                                <FormLabel className="text-left text-base">
                                                    {t('user.management.form.role')}
                                                    <RequiredIndicator />
                                                </FormLabel>
                                                <div className="w-full">
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            disabled={updateRoleMutation.isPending || isLoadingRoles}
                                                        >
                                                            <SelectTrigger className="py-5 text-base w-full">
                                                                <SelectValue
                                                                    placeholder={t('user.management.form.select_role')}
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {roles.map((role) => (
                                                                    <SelectItem key={role.name} value={role.name}>
                                                                        {role.title}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    )}
                    <DialogFooter className="p-6 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setIsRoleDialogOpen(false)}
                            disabled={updateRoleMutation.isPending}
                        >
                            {t('user.management.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            form={roleUser ? `role-user-form-${roleUser.id}` : ''}
                            disabled={updateRoleMutation.isPending}
                            className="text-base py-5 px-8"
                        >
                            {updateRoleMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            {t('user.management.update_role_button')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {userBeingDeleted
                                ? `${t('user.management.confirm_delete')} (${userBeingDeleted.name})`
                                : t('user.management.confirm_delete')}
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    {userBeingDeleted && (
                        <div className="py-4">
                            <p className="text-muted-foreground">{t('user.management.delete_description')}</p>
                            <div className="mt-4 p-4 border rounded-md bg-muted/50">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{t('user.management.form.name')}:</span>
                                    <span>{userBeingDeleted.name}</span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="font-medium">{t('user.management.form.email')}:</span>
                                    <span>{userBeingDeleted.email}</span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="font-medium">{t('user.management.column.role')}:</span>
                                    <span>{userBeingDeleted.role}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>
                            {t('user.management.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            disabled={deleteMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {t('user.management.yes_delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export { Users };
