import { Fragment } from "react";
import { PermissionGuard } from "@/auth/components/permission-guard";
import { PermissionCode } from "@/auth/lib/permission";
import { withPermission } from "@/auth/with-permission";
import {
    Toolbar,
    ToolbarActions,
    ToolbarDescription,
    ToolbarHeading,
    ToolbarPageTitle,
} from "@/partials/common/toolbar";
import { useSettings } from "@/providers/settings-provider";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { UserManagementContent } from ".";

function UserManagementPageComponent() {
    const { settings } = useSettings();

    return (
        <Fragment>
            {settings?.layout === "demo1" && (
                <Container>
                    <Toolbar>
                        <ToolbarHeading>
                            <ToolbarPageTitle />
                            <ToolbarDescription>
                                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                                    <span className="text-base text-secondary-foreground">All Members:</span>
                                    <span className="text-base text-foreground font-medium me-2">49,053</span>
                                    <span className="text-base text-secondary-foreground">Pro Licenses</span>
                                    <span className="text-base text-foreground font-medium">724</span>
                                </div>
                            </ToolbarDescription>
                        </ToolbarHeading>
                        <ToolbarActions>
                            <Button variant="outline">Import CSV</Button>
                            <PermissionGuard permission={PermissionCode.CREATE_USERS}>
                                <Button variant="primary">Add Member</Button>
                            </PermissionGuard>
                        </ToolbarActions>
                    </Toolbar>
                </Container>
            )}
            <Container>
                <UserManagementContent />
            </Container>
        </Fragment>
    );
}

export const UserManagementPage = withPermission(UserManagementPageComponent, PermissionCode.VIEW_USERS);
