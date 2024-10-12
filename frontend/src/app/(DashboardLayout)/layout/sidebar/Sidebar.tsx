import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";
import { Sidebar } from 'react-mui-sidebar';
import Image from "next/image";
import Icon from "./logo.png";

interface ItemType {
    isMobileSidebarOpen: boolean;
    onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
    isSidebarOpen: boolean;
}

const MSidebar = ({
                      isMobileSidebarOpen,
                      onSidebarClose,
                      isSidebarOpen,
                  }: ItemType) => {
    const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));

    const sidebarWidth = "270px";

    // Custom CSS for short scrollbar
    const scrollbarStyles = {
        '&::-webkit-scrollbar': {
            width: '7px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#eff2f7',
            borderRadius: '15px',
        },
    };

    if (lgUp) {
        return (
            <Box
                sx={{
                    width: sidebarWidth,
                    flexShrink: 0,
                }}
            >
                <Drawer
                    anchor="left"
                    open={isSidebarOpen}
                    variant="permanent"
                    PaperProps={{
                        sx: {
                            boxSizing: "border-box",
                            ...scrollbarStyles,
                        },
                    }}
                >
                    <Box
                        sx={{
                            height: "100%",
                        }}
                    >
                        <Sidebar
                            width={'270px'}
                            collapsewidth="80px"
                            open={isSidebarOpen}
                            themeColor="#5d87ff"
                            themeSecondaryColor="#49beff"
                            showProfile={false}
                        />
                        <Box>
                            <Image
                                src={Icon}
                                alt="logo"
                                height={70}
                                width={70}
                                priority
                                style={{ marginLeft: '36px', marginTop: '10px' }}
                            />
                            <SidebarItems />
                        </Box>
                    </Box>
                </Drawer>
            </Box>
        );
    }

    return (
        <Drawer
            anchor="left"
            open={isMobileSidebarOpen}
            onClose={onSidebarClose}
            variant="temporary"
            PaperProps={{
                sx: {
                    boxShadow: (theme) => theme.shadows[8],
                    ...scrollbarStyles,
                },
            }}
        >
            <Box px={2}>
                <Sidebar
                    width={'270px'}
                    collapsewidth="80px"
                    open={isMobileSidebarOpen}
                    isCollapse={false}
                    mode="light"
                    direction="ltr"
                    themeColor="#5d87ff"
                    themeSecondaryColor="#49beff"
                    showProfile={false}
                />
                <Box>
                    <Image src={Icon} alt="logo" height={70} width={74} priority style={{ marginLeft: '36px', marginTop: '10px' }} />
                    <SidebarItems />
                </Box>
            </Box>
        </Drawer>
    );
};

export default MSidebar;