import React, { useState } from 'react';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider } from '@mui/joy/styles';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Skeleton from '@mui/joy/Skeleton';
import Snackbar from '@mui/joy/Snackbar';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Groups from '@mui/icons-material/Groups';
import Error from '@mui/icons-material/Error';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { LocationOn, MyLocation, NearMe } from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const Dashboard = (props) => {
    const [displayName, setDisplayName] = useState(null);
    const [isAdmin, setAdmin] = useState(false);
    const [noPermissionDisplay, setNoPermissionDisplay] = useState(false);
    const location = useLocation();


    const navigate = useNavigate()

    const loadData = async (params) => {
        const cu = await isAuthenticated();
        if (cu === null) {
            navigate('/login?redirect=expiredToken');
        } else {
            const dname = `${cu.first_name} ${cu.last_name}`;
            setDisplayName(dname);
            setAdmin(cu.role === 1);
            navigate('/home');
        }
    };

    React.useEffect(() => {
        loadData();
    }, []);

    return (
        <CssVarsProvider>
            <CssBaseline />
            {/* Snackbars */}

            <Snackbar
                autoHideDuration={6000}
                color="danger"
                open={noPermissionDisplay}
                onClose={() => setNoPermissionDisplay(false)}
                variant="solid"
                startDecorator={<Error />}
                endDecorator={
                    <Button
                        onClick={() => setNoPermissionDisplay(false)}
                        size="sm"
                        variant="solid"
                        color="danger"
                    >
                        Dismiss
                    </Button>
                }
            >
                You do not have permission to access this page.
            </Snackbar>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh', // Full page height
            }}
            >
                {/* Page */}
                <Box
                    sx={{
                        display: 'flex',
                        flexGrow: 1, // This makes the main content fill the available space
                    }}
                >
                    {/* Navigation Sidebar (200px wide) */}
                    <Box
                        sx={{
                            width: '200px',
                            backgroundColor: 'primary.500', // Adjust color as needed
                            height: '100%',
                        }}
                    >
                        {/* {SIDEBAR BEGIN} */}
                        <Sheet
                            className="Sidebar"
                            sx={{
                                position: { xs: 'fixed', md: 'sticky' },
                                zIndex: 10000,
                                height: '100dvh',
                                width: '200px',
                                top: 0,
                                p: 2,
                                flexShrink: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                borderRight: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Box
                                sx={{
                                    minHeight: 0,
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    [`& .${listItemButtonClasses.root}`]: {
                                        gap: 1.5,
                                    },
                                }}
                            >
                                <List
                                    size="sm"
                                    sx={{
                                        gap: 1,
                                        '--List-nestedInsetStart': '30px',
                                        '--ListItem-radius': (theme) => theme.vars.radius.sm,
                                    }}
                                >
                                    <ListItem>
                                        <ListItemButton
                                            selected={location.pathname === '/home'}
                                            onClick={() => {
                                                navigate('/home');
                                            }}>
                                            <HomeRoundedIcon />
                                            <Typography>Home</Typography>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemButton
                                            selected={location.pathname === '/tags'}
                                            onClick={() => {
                                                if (isAdmin) {
                                                    navigate('/tags');
                                                } else {
                                                    setNoPermissionDisplay(true);
                                                }
                                            }}>
                                            <NearMe />
                                            <Typography>Tags</Typography>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemButton
                                            selected={location.pathname === '/anchors'}
                                            onClick={() => {
                                                if (isAdmin) {
                                                    navigate('/anchors');
                                                } else {
                                                    setNoPermissionDisplay(true);
                                                }
                                            }}>
                                            <MyLocation />
                                            <Typography>Anchors</Typography>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemButton
                                            selected={location.pathname === '/waypoints'}
                                            onClick={() => {
                                                if (isAdmin) {
                                                    navigate('/waypoints');
                                                } else {
                                                    setNoPermissionDisplay(true);
                                                }
                                            }}>
                                            <LocationOn />
                                            <Typography>Waypoints</Typography>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemButton
                                            selected={location.pathname === '/users'}
                                            onClick={() => {
                                                if (isAdmin) {
                                                    navigate('/users');
                                                } else {
                                                    setNoPermissionDisplay(true);
                                                }
                                            }}>
                                            <Groups />
                                            <Typography>Users</Typography>
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                                <List
                                    size="sm"
                                    sx={{
                                        mt: 'auto',
                                        flexGrow: 0,
                                        '--ListItem-radius': (theme) => theme.vars.radius.sm,
                                        '--List-gap': '8px',
                                        mb: 2,
                                    }}
                                >
                                    <ListItem>
                                        <ListItemButton
                                            selected={location.pathname === '/preferences'}
                                            onClick={() => {
                                                navigate('/preferences');
                                            }}>
                                            <SettingsRoundedIcon />
                                            <Typography>Preferences</Typography>
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    {/* 16 char max */}
                                    <Typography level="body-xs">Logged In As:</Typography>
                                    <Typography noWrap level="title-sm">
                                        <Skeleton loading={displayName === null}>
                                            {displayName === null ? "XXXXXXXXXXXXXXXX" : displayName}
                                        </Skeleton>
                                    </Typography>
                                </Box>
                                <IconButton size="sm" variant="plain" color="neutral">
                                    <LogoutRoundedIcon />
                                </IconButton>
                            </Box>
                        </Sheet>
                        {/* {SIDEBAR END} */}
                    </Box>

                    {/* Content Box (remaining width) */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            height: '100vh',
                        }}
                    >
                        {/* Sheet that takes the rest of the space */}
                        <Sheet
                            sx={{
                                flexGrow: 1,
                                bgcolor: 'background.paper',
                                padding: 2,
                            }}
                        >
                            {/* Content of the sheet goes here */}
                            <Outlet />
                        </Sheet>
                        <Divider />
                        {/* 50px box at the bottom */}
                        <Sheet
                            sx={{
                                height: '50px',
                                bgcolor: 'primary.main',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'primary.contrastText',
                                color: 'white',
                                backgroundColor: 'neutral.100',
                            }}
                        >
                            <Typography level='body-sm'>
                                AutoNav · University of Delaware · 2024-2025
                            </Typography>

                        </Sheet>
                    </Box>
                </Box>
            </Box >
        </CssVarsProvider >
    );
};

export default Dashboard;