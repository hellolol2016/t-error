declare module 'react-mui-sidebar' {
    import { FC } from 'react';

    interface SidebarProps {
        width: string;
        collapsewidth: string;
        open: boolean;
        themeColor: string;
        themeSecondaryColor: string;
        showProfile: boolean;
        isCollapse?: boolean;
        mode?: string;
        direction?: string;
    }

    interface LogoProps {
        img: string;
    }

    export const Sidebar: FC<SidebarProps>;
    export const Logo: FC<LogoProps>;
}