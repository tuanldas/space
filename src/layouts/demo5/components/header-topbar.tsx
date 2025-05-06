import {UserDropdownMenu} from '@/partials/topbar/user-dropdown-menu';
import {toAbsoluteUrl} from '@/lib/helpers';

export function HeaderTopbar() {

    return (
        <div className="flex items-center gap-2 lg:gap-3.5">
            <div className="flex items-center gap-1">
            </div>

            <UserDropdownMenu
                trigger={
                    <img
                        className="cursor-pointer size-9 rounded-full border-2 border-mono/25 shrink-0"
                        src={toAbsoluteUrl('/media/avatars/300-2.png')}
                        alt="User Avatar"
                    />
                }
            />
        </div>
    );
}
