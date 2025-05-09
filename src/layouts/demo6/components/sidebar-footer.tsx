import {UserDropdownMenu} from '@/partials/topbar/user-dropdown-menu';
import {LogOut} from 'lucide-react';
import {toAbsoluteUrl} from '@/lib/helpers';
import {Button} from '@/components/ui/button';
import {useAuth} from '@/auth/context/auth-context.ts';

export function SidebarFooter() {
    const {logout} = useAuth();

    return (
        <div className="flex flex-center justify-between shrink-0 ps-4 pe-3.5 h-14">
            <UserDropdownMenu
                trigger={
                    <img
                        className="size-9 rounded-full border-2 border-secondary shrink-0 cursor-pointer"
                        src={toAbsoluteUrl('/media/avatars/300-2.png')}
                        alt="User Avatar"
                    />
                }
            />

            <div className="flex flex-center gap-1.5">
                <Button
                    onClick={logout}
                    variant="ghost"
                    mode="icon"
                    className="hover:bg-background hover:[&_svg]:text-primary"
                >
                    <LogOut className="size-4.5!"/>
                </Button>
            </div>
        </div>
    );
}
