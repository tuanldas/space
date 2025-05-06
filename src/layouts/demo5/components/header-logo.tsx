import {useEffect, useState} from 'react';
import {ChevronDown, type LucideIcon, Menu, Settings, UserCircle,} from 'lucide-react';
import {Link, useLocation} from 'react-router-dom';
import {toAbsoluteUrl} from '@/lib/helpers';
import {cn} from '@/lib/utils';
import {useIsMobile} from '@/hooks/use-mobile';
import {Button} from '@/components/ui/button';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from '@/components/ui/dropdown-menu';
import {Sheet, SheetBody, SheetContent, SheetHeader, SheetTrigger,} from '@/components/ui/sheet';
import {SidebarMenuDashboard} from './sidebar-menu-dashboard';

interface HeaderLogoTeam {
    title: string;
    icon?: LucideIcon;
    urlPartial: string;
    path: string;
}

type HeaderLogoTeams = Array<HeaderLogoTeam>;

interface HeaderLogoItem {
    title: string;
    icon?: LucideIcon;
}

type HeaderLogoItems = Array<HeaderLogoItem>;

export function HeaderLogo() {
    const {pathname} = useLocation();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const isMobile = useIsMobile();

    const teams: HeaderLogoTeams = [
        {
            title: 'Space',
            icon: Settings,
            urlPartial: '/account/',
            path: '/',
        },
    ];

    const items: HeaderLogoItems = [
        {
            title: 'Account',
            icon: UserCircle,
        },
    ];

    const [selectedTeam, setSelectedTeam] = useState(teams[0]);
    const [selectedItem, setSelectedItem] = useState(items[0]);

    // Close sheet when route changes
    useEffect(() => {
        setIsSheetOpen(false);
    }, [pathname]);

    return (
        <div className="flex items-center gap-1.5 lg:gap-5">
            <Link to="/">
                <img
                    src={toAbsoluteUrl('/media/app/mini-logo-circle.svg')}
                    className="dark:hidden min-h-[34px]"
                    alt="logo"
                />
                <img
                    src={toAbsoluteUrl('/media/app/mini-logo-circle-dark.svg')}
                    className="hidden dark:inline-block min-h-[34px]"
                    alt="logo"
                />
            </Link>

            {isMobile && (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="dim" mode="icon">
                            <Menu/>
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        className="p-0 gap-0 w-[250px]"
                        side="left"
                        close={false}
                    >
                        <SheetHeader className="p-0 space-y-0"/>
                        <SheetBody className="p-3 overflow-y-auto">
                            <SidebarMenuDashboard/>
                        </SheetBody>
                    </SheetContent>
                </Sheet>
            )}

            {!isMobile && (
                <div className="lg:flex items-stretch gap-3">
                    {/* Teams Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="cursor-pointer text-secondary-foreground text-sm font-medium flex items-center gap-2">
                            {selectedTeam.title}
                            <ChevronDown className="size-3.5 text-muted-foreground"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent sideOffset={15} side="bottom" align="start">
                            {teams.map((team, index) => (
                                <DropdownMenuItem
                                    key={index}
                                    asChild
                                    className={cn(team === selectedTeam && 'bg-accent')}
                                    onSelect={() => setSelectedTeam(team)}
                                >
                                    <Link to={team.path}>
                                        {team.icon && <team.icon/>}
                                        {team.title}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <span className="text-sm text-muted-foreground font-medium px-2.5 md:inline">
            /
          </span>

                    {/* Items Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="cursor-pointer text-secondary-foreground text-sm font-medium flex items-center gap-2">
                            {selectedItem.title}
                            <ChevronDown className="size-3.5 text-muted-foreground"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent sideOffset={15} side="bottom" align="start">
                            {items.map((item, index) => (
                                <DropdownMenuItem
                                    key={index}
                                    asChild
                                    className={cn(item === selectedItem && 'bg-accent')}
                                    onSelect={() => setSelectedItem(item)}
                                >
                                    <Link to="/">
                                        {item.icon && <item.icon/>}
                                        {item.title}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
}
