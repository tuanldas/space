import { Fragment, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { MENU_SIDEBAR } from "@/config/menu.config";
import { MenuItem } from "@/config/types";
import { cn } from "@/lib/utils";
import { useMenu } from "@/hooks/use-menu";
import { Container } from "@/components/common/container";
import { useToolbar } from "@/providers/toolbar-provider.tsx";
import { useIntl } from "react-intl";
import { TooltipsProvider } from "@/providers/tooltips-provider";

export interface ToolbarHeadingProps {
    title?: string | ReactNode;
    description?: string | ReactNode;
}

function Toolbar({ children }: { children?: ReactNode }) {
    return (
        <div className="pb-5">
            <TooltipsProvider>
                <Container className="flex items-center justify-between flex-wrap gap-3">{children}</Container>
            </TooltipsProvider>
        </div>
    );
}

function ToolbarActions({ children }: { children?: ReactNode }) {
    const { toolbarActions } = useToolbar();
    return <div className="flex items-center flex-wrap gap-1.5 lg:gap-3.5">{toolbarActions ?? children}</div>;
}

function ToolbarBreadcrumbs() {
    const { pathname } = useLocation();
    const { getBreadcrumb, isActive } = useMenu(pathname);
    const items: MenuItem[] = getBreadcrumb(MENU_SIDEBAR);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-1 text-sm">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const active = item.path ? isActive(item.path) : false;

                return (
                    <Fragment key={index}>
                        {item.path ? (
                            <Link
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-1",
                                    active ? "text-mono" : "text-secondary-foreground hover:text-primary",
                                )}
                            >
                                {item.title}
                            </Link>
                        ) : (
                            <span className={cn(isLast ? "text-mono" : "text-secondary-foreground")}>{item.title}</span>
                        )}
                        {!isLast && <span className="text-muted-foreground">/</span>}
                    </Fragment>
                );
            })}
        </div>
    );
}

const ToolbarHeading = ({ title = "" }: ToolbarHeadingProps) => {
    const intl = useIntl();
    const { pathname } = useLocation();
    const { getCurrentItem } = useMenu(pathname);
    const item = getCurrentItem(MENU_SIDEBAR);
    const { toolbarTitle } = useToolbar();

    const fmt = (id: string) => {
        try {
            return intl.formatMessage({ id, defaultMessage: id });
        } catch {
            return id;
        }
    };

    const getTitle = () => {
        if (toolbarTitle != null) {
            return typeof toolbarTitle === "string" ? fmt(toolbarTitle) : toolbarTitle;
        }
        if (title) {
            return typeof title === "string" ? fmt(title) : title;
        }
        if (!item?.title) return "";
        return fmt(item.title);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-1 lg:gap-5">
            <h1 className="font-medium text-lg text-mono">{getTitle()}</h1>
        </div>
    );
};

export { Toolbar, ToolbarActions, ToolbarBreadcrumbs, ToolbarHeading };
