import { PermissionCode } from "@/auth/lib/permission";
import { CreditCard, LayoutGrid, Users, Wallet } from "lucide-react";
import { type MenuConfig } from "./types";

export const MENU_SIDEBAR: MenuConfig = [
    {
        title: "sidebar.home",
        icon: LayoutGrid,
        path: "/dashboard",
    },
    {
        title: "sidebar.wallets",
        icon: Wallet,
        path: "/wallets",
    },
    {
        title: "sidebar.user_management",
        icon: Users,
        path: "/users",
        permissions: [PermissionCode.VIEW_USERS],
    },
    {
        title: "sidebar.transaction_categories",
        icon: CreditCard,
        path: "/transaction-categories",
        permissions: [PermissionCode.VIEW_TRANSACTION_CATEGORIES],
    },
];

export const MENU_SIDEBAR_COMPACT: MenuConfig = [
    {
        title: "sidebar.home",
        icon: LayoutGrid,
        path: "/dashboard",
    },
    {
        title: "sidebar.wallets",
        icon: Wallet,
        path: "/wallets",
    },
    {
        title: "sidebar.user_management",
        icon: Users,
        path: "/users",
        permissions: [PermissionCode.VIEW_USERS],
    },
    {
        title: "sidebar.transaction_categories",
        icon: CreditCard,
        path: "/transaction-categories",
        permissions: [PermissionCode.VIEW_TRANSACTION_CATEGORIES],
    },
];
