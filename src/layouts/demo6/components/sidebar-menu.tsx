import { SidebarMenuPrimary } from "./sidebar-menu-primary";
import { SidebarWallets } from "@/layouts/demo6/components/sidebar-wallets.tsx";

export function SidebarMenu() {
    return (
        <div className="kt-scrollable-y-auto grow max-h-[calc(100vh-11.5rem)]">
            <SidebarMenuPrimary />
            <div className="border-b border-input my-4 mx-5"></div>
            <SidebarWallets />
        </div>
    );
}
