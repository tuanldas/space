import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';

export function SidebarHeader() {
    return (
        <div className="mb-3.5">
            <div className="flex items-center justify-between gap-2.5 px-3.5 h-[70px]">
                <Link to="/">
                    <img
                        src={toAbsoluteUrl('/media/app/mini-logo-circle.svg')}
                        className="dark:hidden h-[42px]"
                        alt=""
                    />
                    <img
                        src={toAbsoluteUrl('/media/app/mini-logo-circle-dark.svg')}
                        className="hidden dark:inline-block h-[42px]"
                        alt=""
                    />
                </Link>
            </div>
        </div>
    );
}
