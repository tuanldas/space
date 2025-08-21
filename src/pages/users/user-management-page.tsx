import { Fragment } from 'react';
import { PermissionCode } from '@/auth/lib/permission';
import { withPermission } from '@/auth/with-permission';
import { Container } from '@/components/common/container';
import { UserManagementContent } from '.';

function UserManagementPageComponent() {
    return (
        <Fragment>
            <Container>
                <UserManagementContent />
            </Container>
        </Fragment>
    );
}

export const UserManagementPage = withPermission(UserManagementPageComponent, PermissionCode.VIEW_USERS);
