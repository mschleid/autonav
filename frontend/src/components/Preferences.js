import { Divider, FormControl, Sheet, Typography } from "@mui/joy";
import React, { useRef, useState } from "react";
import Button from '@mui/joy/Button';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import Skeleton from '@mui/joy/Skeleton';
import Snackbar from '@mui/joy/Snackbar';
import Error from '@mui/icons-material/Error';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { userUpdateMe, userUpdatePasswordMe } from '../services/apiService'
import { isAuthenticated } from '../services/authService';

var emailValidator = require("email-validator");

const Preferences = () => {
    const [userData, setUserData] = useState(null);
    const [updateSuccessDisplay, setUpdateSuccessDisplay] = useState(false);
    const [unknownErrorDisplay, setUnknownErrorDisplay] = useState(false);
    const [updateProcess, setUpdateProcess] = useState(false);
    const [passwordChangeProcess, setPasswordChangeProcess] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [passwordSuccessDisplay, setPasswordSuccessDisplay] = useState(false);
    const [incorrectCurrentPassword, setIncorrectCurrentPassword] = useState(false);

    const navigate = useNavigate()

    let firstNameRef = useRef(null);
    let lastNameRef = useRef(null);
    let usernameRef = useRef(null);
    let emailRef = useRef(null);
    let currentPasswordRef = useRef(null);
    let newPasswordRef = useRef(null);
    let confirmPasswordRef = useRef(null);

    const loadData = async (params) => {
        const cu = await isAuthenticated();
        if (cu === null) {
            navigate('/login?redirect=expiredToken');
        } else {
            setUserData(cu);
        }
    };

    React.useEffect(() => {
        loadData();
    }, []);

    // Will run when userData updates 
    React.useEffect(() => {
        if (!(userData === null)) {
            usernameRef.current.value = userData.username;
            firstNameRef.current.value = userData.first_name;
            lastNameRef.current.value = userData.last_name;
            emailRef.current.value = userData.email;
        }
    }, [userData]);

    async function submitProfileChanges(e) {
        e.preventDefault();

        if (updateProcess) return;

        if (!isValidEmail) return;

        setUpdateProcess(true);

        const data = {
            "first_name": firstNameRef.current.value,
            "last_name": lastNameRef.current.value,
            "email": emailRef.current.value,
        };

        try {
            userUpdateMe(data).then((response_data) => {
                if (response_data.first_name === firstNameRef.current.value &&
                    response_data.last_name === lastNameRef.current.value &&
                    response_data.email === emailRef.current.value) {
                    setUpdateSuccessDisplay(true);
                    setUpdateProcess(false);
                } else {
                    setUnknownErrorDisplay(true);
                    setUpdateProcess(false);
                }
            });
        } catch (error) {
            setUnknownErrorDisplay(true);
            setUpdateProcess(false);

        }

    };

    async function submitPasswordChange(e) {
        e.preventDefault();

        if (passwordChangeProcess) return;

        if (!passwordsMatch) return;

        setPasswordChangeProcess(true);

        let currentPasswordValue = currentPasswordRef.current.value;
        let newPasswordValue = newPasswordRef.current.value;

        try {
            await userUpdatePasswordMe(currentPasswordValue, newPasswordValue).then((response_data) => {
                if (response_data.id === userData.id) {
                    setPasswordSuccessDisplay(true);
                    setPasswordChangeProcess(false);
                    currentPasswordRef.current.value = "";
                    newPasswordRef.current.value = "";
                    confirmPasswordRef.current.value = "";
                } else {
                    setPasswordChangeProcess(false);
                }
            })
        } catch (error) {
            setPasswordChangeProcess(false);
            if (error.message == 400) {
                setIncorrectCurrentPassword(true);
            } else {
                setUnknownErrorDisplay(true);
            }
        }


    }

    function confirmValueChanged(e) {
        setPasswordsMatch(newPasswordRef.current.value === confirmPasswordRef.current.value);
    }

    function validateEmail(e) {
        setIsValidEmail(emailValidator.validate(emailRef.current.value));
    }


    return (
        <Sheet>
            {/* Snackbars */}
            <Snackbar
                autoHideDuration={6000}
                color="success"
                open={updateSuccessDisplay}
                onClose={() => setUpdateSuccessDisplay(false)}
                variant="solid"
                startDecorator={<CheckCircle />}
                endDecorator={
                    <Button
                        onClick={() => setUpdateSuccessDisplay(false)}
                        size="sm"
                        variant="solid"
                        color="success"
                    >
                        Dismiss
                    </Button>
                }
            >
                Preferences successfully updated.
            </Snackbar>
            <Snackbar
                autoHideDuration={6000}
                color="success"
                open={passwordSuccessDisplay}
                onClose={() => setPasswordSuccessDisplay(false)}
                variant="solid"
                startDecorator={<CheckCircle />}
                endDecorator={
                    <Button
                        onClick={() => setPasswordSuccessDisplay(false)}
                        size="sm"
                        variant="solid"
                        color="success"
                    >
                        Dismiss
                    </Button>
                }
            >
                Password successfully updated.
            </Snackbar>
            <Snackbar
                autoHideDuration={6000}
                color="danger"
                open={unknownErrorDisplay}
                onClose={() => setUnknownErrorDisplay(false)}
                variant="solid"
                startDecorator={<Error />}
                endDecorator={
                    <Button
                        onClick={() => setUnknownErrorDisplay(false)}
                        size="sm"
                        variant="solid"
                        color="danger"
                    >
                        Dismiss
                    </Button>
                }
            >
                An unknown error occured while performing that action.
            </Snackbar>
            <Snackbar
                autoHideDuration={6000}
                color="danger"
                open={incorrectCurrentPassword}
                onClose={() => setIncorrectCurrentPassword(false)}
                variant="solid"
                startDecorator={<Error />}
                endDecorator={
                    <Button
                        onClick={() => setIncorrectCurrentPassword(false)}
                        size="sm"
                        variant="solid"
                        color="danger"
                    >
                        Dismiss
                    </Button>
                }
            >
                Current password was incorrect.
            </Snackbar>
            {/* Begin Content */}
            <Typography level="h2">My Preferences</Typography>
            <Divider />
            <Sheet id="profileChangesSheet" sx={{ padding: "0px" }}>
                <form onSubmit={submitProfileChanges}>
                    <br />
                    <Typography level="title-lg">Username</Typography>
                    <FormControl sx={{ padding: '10px' }}>
                        <Skeleton loading={userData === null} sx={{ width: '260px' }}>
                            <Input type="text" variant="outlined" sx={{ width: '250px' }}
                                slotProps={{
                                    input: {
                                        ref: usernameRef,
                                    },
                                }}
                                disabled
                            />
                            <FormHelperText sx={{ pl: '1px' }} size='body-xs'>
                                <Typography size='body-xs'>
                                    Username cannot be changed.
                                </Typography>
                            </FormHelperText>
                        </Skeleton>
                    </FormControl>
                    {/* <br /> */}
                    <Typography level="title-lg">First Name</Typography>
                    <FormControl sx={{ padding: '10px' }}>
                        <Skeleton loading={userData === null} sx={{ width: '260px' }}>
                            <Input type="text" variant="outlined" sx={{ width: '250px' }}
                                slotProps={{
                                    input: {
                                        ref: firstNameRef,
                                    },
                                }}
                            />
                        </Skeleton>
                    </FormControl>
                    <br />
                    <Typography level="title-lg">Last Name</Typography>
                    <FormControl sx={{ padding: '10px' }}>
                        <Skeleton loading={userData === null} sx={{ width: '260px' }}>
                            <Input type="text" variant="outlined" sx={{ width: '250px' }}
                                slotProps={{
                                    input: {
                                        ref: lastNameRef,
                                    },
                                }}
                            />
                        </Skeleton>
                    </FormControl>
                    <br />
                    <Typography level="title-lg">Email Address</Typography>
                    <FormControl sx={{ padding: '10px' }}>
                        <Skeleton loading={userData === null} sx={{ width: '260px' }}>
                            <Input type="text" variant="outlined" sx={{ width: '250px' }}
                                slotProps={{
                                    input: {
                                        ref: emailRef,
                                    },
                                }}
                                onChange={validateEmail}
                            />
                        </Skeleton>
                        {isValidEmail ? "" :
                            <FormHelperText>
                                <Typography color='danger' size=''>
                                    <Error />
                                    Enter a valid email address.
                                </Typography>
                            </FormHelperText>
                        }
                    </FormControl>
                    <br />

                    <Button variant="solid" type="submit" disabled={updateProcess}>
                        Save Preferences
                    </Button>
                    <br />
                </form>
            </Sheet>
            <br />
            <Divider />
            <br />
            <Sheet>
                <form onSubmit={submitPasswordChange}>
                    <Typography level="title-lg">Current Password</Typography>
                    <FormControl sx={{ padding: '10px' }}>
                        <Input type="password" variant="outlined" sx={{ width: '250px' }} placeholder="Current Password"
                            slotProps={{
                                input: {
                                    ref: currentPasswordRef,
                                },
                            }}
                        />
                    </FormControl>
                    <br />
                    <Typography level="title-lg">New Password</Typography>
                    <FormControl sx={{ padding: '10px' }}>
                        <Input type="password" variant="outlined" sx={{ width: '250px' }} placeholder="New Password"
                            slotProps={{
                                input: {
                                    ref: newPasswordRef,
                                },
                            }}
                        />
                    </FormControl>
                    <br />
                    <Typography level="title-lg">Confirm New Password</Typography>
                    <FormControl sx={{ padding: '10px' }}>
                        <Input type="password" variant="outlined" sx={{ width: '250px' }} placeholder="Confirm New Password"
                            slotProps={{
                                input: {
                                    ref: confirmPasswordRef,
                                },
                            }}
                            onChange={confirmValueChanged}
                        />
                        {passwordsMatch ? "" :
                            <FormHelperText>
                                <Typography color='danger' size=''>
                                    <Error />
                                    Passwords do not match
                                </Typography>
                            </FormHelperText>
                        }
                    </FormControl>
                    <br />
                    <Button variant="solid" type="submit" disabled={passwordChangeProcess}>
                        Save Password
                    </Button>
                </form>
            </Sheet>
        </Sheet>
    );
};

export default Preferences;