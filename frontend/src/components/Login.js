import React, { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { login, isAuthenticated } from '../services/authService'

import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import CircularProgress from '@mui/joy/CircularProgress'
import Alert from '@mui/joy/Alert'
import Stack from '@mui/joy/Stack'
import Snackbar from '@mui/joy/Snackbar'
import FormControl from '@mui/joy/FormControl'
import { Info } from '@mui/icons-material'

const IncorrectCredentialsAlert = (s) => {
    return (
        <Alert
            color='danger'
            size='md'
            variant='soft'
        >
            {s}
        </Alert>
    );
}

const Login = (props) => {

    const invalidCredentialsString = "Invalid login credentials.";
    const disabledAccountString = "Your account is disabled.";
    const unknownErrorString = "An unknown error occured.";

    const [errorAlert, setErrorAlert] = useState(false);
    const [errorAlertText, setErrorAlertText] = useState(unknownErrorString);
    const [loginProcess, setLoginProcess] = useState(false);
    const [expiredCredentialRedirect, setExpiredCredentialRedirect] = useState(false);
    const [searchParams, _] = useSearchParams();

    const navigate = useNavigate()

    // Redirect Hanlder
    const redirectReason = searchParams.get("redirect");

    if (redirectReason === "true") {
        setExpiredCredentialRedirect(true);
    }

    let usernameRef = useRef(null);
    let passwordRef = useRef(null);

    function setErrorText(error) {
        if (error.message == 400) {
            setErrorAlertText(invalidCredentialsString);
        } else if (error.message == 403) {
            setErrorAlertText(disabledAccountString);
        } else {
            setErrorAlertText(unknownErrorString);
        }
    }

    async function loginFormSubmit(e) {
        e.preventDefault();

        if (loginProcess) return;

        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        try {
            setErrorAlert(false);
            setLoginProcess(true);
            await login(username, password);
            if (await isAuthenticated()) {
                navigate('/home');
            } else {
                setErrorAlertText(unknownErrorString);
                setErrorAlert(true);
                setLoginProcess(false);
            }
        } catch (error) {
            setErrorText(error);
            setErrorAlert(true);
            setLoginProcess(false);
        }
    };

    return (
        <div>
            {/* Snackbars */}
            <Snackbar
                autoHideDuration={10000}
                color="neutral"
                open={expiredCredentialRedirect}
                onClose={() => setExpiredCredentialRedirect(false)}
                variant="soft"
                startDecorator={<Info />}
                endDecorator={
                    <Button
                        onClick={() => setExpiredCredentialRedirect(false)}
                        size="sm"
                        variant="soft"
                        color="neutral"
                    >
                        Dismiss
                    </Button>
                }
            >
                Your login credentials have expired.  Please sign in again using your username/email and password.
            </Snackbar>
            <Sheet
                sx={{
                    width: 300,
                    mx: 'auto', // margin left & right
                    my: 4, // margin top & bottom
                    pb: 2, // padding bottom
                    pt: 2,  // padding top
                    px: 2, // padding left & right
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderRadius: 'sm',
                    boxShadow: 'md',
                }}
                variant="outlined"
            >
                <div>
                    <Typography level="h4" component="h1">
                        <b>AutoNav</b>
                    </Typography>
                    <Typography level="body-sm">Sign in to continue.</Typography>
                </div>

                <div>
                    <form onSubmit={loginFormSubmit}>
                        <Stack spacing={2}>
                            {/* Username Box */}
                            <FormControl>
                                <Input placeholder="Username or Email" type="text" variant="outlined"
                                    slotProps={{
                                        input: {
                                            ref: usernameRef,
                                        },
                                    }}
                                    autoFocus
                                />
                            </FormControl>
                            {/* Password Box */}
                            <FormControl>
                                <Input placeholder="Password" type="password" variant="outlined"
                                    slotProps={{
                                        input: {
                                            ref: passwordRef,
                                        },
                                    }}
                                    autoFocus
                                />
                            </FormControl>
                            <Button type="submit" disabled={loginProcess}>
                                {
                                    // Login Button Text / Progress Spinner
                                    (loginProcess) ?
                                        <CircularProgress
                                            color="neutral"
                                            determinate={false}
                                            size="sm"
                                            variant="soft"
                                        />
                                        :
                                        "Log In"

                                }
                            </Button>
                            {errorAlert ? IncorrectCredentialsAlert(errorAlertText) : ""}
                        </Stack>
                    </form>
                </div>
            </Sheet>
        </div>
    )
}

export default Login