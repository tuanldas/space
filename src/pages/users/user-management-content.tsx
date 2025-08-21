import { Fragment } from 'react';
import { Users } from './components/users';

export interface IUserAvatar {
    className: string;
    image?: string;
    imageClass?: string;
    fallback?: string;
    badgeClass: string;
}

export interface IUserGroup {
    filename: string;
}

export interface IUserTeam {
    size: string;
    group: IUserGroup[];
    more?: {
        number: number;
        variant: string;
    };
}

export interface IUserStatistic {
    total: string;
    description: string;
}

export interface IUserItem {
    name: string;
    info: string;
    avatar: IUserAvatar;
    email: string;
    team: IUserTeam;
    statistics: IUserStatistic[];
    connected: boolean;
    status: string;
}

export function UserManagementContent() {
    return (
        <Fragment>
            <div className="grid gap-5 lg:gap-7.5">
                <Users />
            </div>
        </Fragment>
    );
}
