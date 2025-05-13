import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Tooltip from '@mui/joy/Tooltip';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { visuallyHidden } from '@mui/utils';
import { Add, AddBox, AddBoxOutlined, CheckCircle, Error } from '@mui/icons-material';
import { Button, ModalClose } from '@mui/joy';
import { userCreate, userDelete, userUpdate, usersGetAll } from '../services/apiService';
import { isAuthenticated } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import ModalDialog from '@mui/joy/ModalDialog';
import Modal from '@mui/joy/Modal';
import DialogTitle from '@mui/joy/DialogTitle';
import Snackbar from '@mui/joy/Snackbar';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Grid from '@mui/joy/Grid';
import { useRef } from 'react';

function Users() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [users, setUsers] = React.useState([]);
    const [userModalOpen, setUserModalOpen] = React.useState(false);
    const [modalCreateNew, setModalCreateNew] = React.useState(true);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const [successUpdate, setSuccessUpdate] = React.useState(false);
    const [unknownErrorDisplay, setUnknownErrorDisplay] = React.useState(false);
    const [successDelete, setSuccessDelete] = React.useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = React.useState(false);


    const navigate = useNavigate();

    const loadData = async (params) => {
        const cu = await isAuthenticated();

        if (cu === null) {
            navigate('/login?redirect=expiredToken');
        } else {
            try {
                await usersGetAll().then((reply) => {
                    setUsers(reply);
                })
            } catch (error) {
                console.log(error);
                console.log("Unknown error occured");
            }
        }
    };

    React.useEffect(() => {
        loadData();
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        setRowsPerPage(parseInt(newValue.toString(), 10));
        setPage(0);
    };

    const getLabelDisplayedRowsTo = () => {
        if (users.length === -1) {
            return (page + 1) * rowsPerPage;
        }
        return rowsPerPage === -1
            ? users.length
            : Math.min(users.length, (page + 1) * rowsPerPage);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    function labelDisplayedRows({ from, to, count }) {
        return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
    }

    function descendingComparator(a, b, orderBy) {
        if (typeof a[orderBy] === 'string') {
            if (b[orderBy].toLowerCase() < a[orderBy].toLowerCase()) {
                return -1;
            }
            if (b[orderBy].toLowerCase() > a[orderBy].toLowerCase()) {
                return 1;
            }
        } else {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const headCells = [
        {
            id: 'username',
            numeric: false,
            disablePadding: true,
            label: 'Username',
        },
        {
            id: 'first_name',
            numeric: false,
            disablePadding: false,
            label: 'First Name',
        },
        {
            id: 'last_name',
            numeric: false,
            disablePadding: false,
            label: 'Last Name',
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: false,
            label: 'Email',
        },
        {
            id: 'role',
            numeric: true,
            disablePadding: false,
            label: 'Role',
        },
        {
            id: 'disabled',
            numeric: true,
            disablePadding: false,
            label: 'Disabled',
        }
    ];

    function EnhancedTableHead(props) {
        const { order, orderBy, onRequestSort } =
            props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <thead>
                <tr>
                    {headCells.map((headCell) => {
                        const active = orderBy === headCell.id;
                        return (
                            <th
                                key={headCell.id}
                                aria-sort={
                                    active ? { asc: 'ascending', desc: 'descending' }[order] : undefined
                                }
                            >
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <Link
                                    underline="none"
                                    color="neutral"
                                    textColor={active ? 'primary.plainColor' : undefined}
                                    component="button"
                                    onClick={createSortHandler(headCell.id)}
                                    startDecorator={
                                        headCell.numeric ? (
                                            <ArrowDownwardIcon
                                                sx={[active ? { opacity: 1 } : { opacity: 0 }]}
                                            />
                                        ) : null
                                    }
                                    endDecorator={
                                        !headCell.numeric ? (
                                            <ArrowDownwardIcon
                                                sx={[active ? { opacity: 1 } : { opacity: 0 }]}
                                            />
                                        ) : null
                                    }
                                    sx={{
                                        fontWeight: 'lg',
                                        '& svg': {
                                            transition: '0.2s',
                                            transform:
                                                active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                                        },
                                        '&:hover': { '& svg': { opacity: 1 } },
                                    }}
                                >
                                    {headCell.label}
                                    {active ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </Link>
                            </th>
                        );
                    })}
                </tr>
            </thead>
        );
    }

    EnhancedTableHead.propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };

    function EnhancedTableToolbar(props) {
        return (
            <Box
                sx={[
                    {
                        display: 'flex',
                        alignItems: 'center',
                        py: 1,
                        pl: { sm: 2 },
                        pr: { xs: 1, sm: 1 },
                        borderTopLeftRadius: 'var(--unstable_actionRadius)',
                        borderTopRightRadius: 'var(--unstable_actionRadius)',
                    }
                ]}
            >
                <Box
                    sx={{ flex: '1 1 100%' }}
                    component="div"
                >
                </Box>
                <Tooltip title="Add New User">
                    <IconButton size="sm" variant="outlined" color="neutral"
                        onClick={(e) => {
                            e.preventDefault();
                            setModalCreateNew(true);
                            setSelectedRow(null);
                            setUserModalOpen(true);
                        }}>
                        <Add />
                    </IconButton>
                </Tooltip>
            </Box>
        );
    }

    function handleRowClick(e, row) {
        console.log(row);
        e.preventDefault();
        setSelectedRow(row);
        setModalCreateNew(false);
        setUserModalOpen(true);
    }

    function decodeRole(role) {
        switch (role) {
            case 0: return 'User';
            case 1: return 'Administrator';
            default: return '';
        }
    }

    async function completeModal(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
        const username = e.target.elements.username.value;
        const first_name = e.target.elements.first_name.value;
        const last_name = e.target.elements.last_name.value;
        const email = e.target.elements.email.value;
        const role = parseInt(formJson.role);
        const disabled = 0;
        // TODO - Fix Disabled

        if (modalCreateNew) {
            const password = e.target.elements.password.value;
            try {
                userCreate(username, first_name, last_name, email, role, disabled, password).then((data) => {
                    setSuccessUpdate(true);
                    setUserModalOpen(false);
                    loadData();
                });
            } catch (err) {
                if (err.message == 401) {
                    navigate('/login?redirect=expiredToken');
                } else {
                    setUserModalOpen(false);
                }
            }
        } else {
            try {
                userUpdate(selectedRow.id, username, first_name, last_name, email, role, disabled).then((data) => {
                    setSuccessUpdate(true);
                    setUserModalOpen(false);
                    loadData();
                });
            } catch (err) {
                if (err.message == 401) {
                    navigate('/login?redirect=expiredToken');
                } else {
                    setUserModalOpen(false);
                    setUnknownErrorDisplay(true);
                }
            }
        }
    }

    async function deleteUser(e) {
        e.preventDefault();

        try {
            userDelete(selectedRow.id).then((data) => {
                setSuccessDelete(true);
                setUserModalOpen(false);
                loadData();
            });
        } catch (err) {
            if (err.message == 401) {
                navigate('/login?redirect=expiredToken');
            } else {
                setUserModalOpen(false);
                setUnknownErrorDisplay(true);
            }
        }
    }

    return (
        <Sheet>
            {/* Snackbars */}
            <Snackbar
                autoHideDuration={6000}
                color="success"
                open={successUpdate}
                onClose={() => setSuccessUpdate(false)}
                variant="solid"
                startDecorator={<CheckCircle />}
                endDecorator={
                    <Button
                        onClick={() => setSuccessUpdate(false)}
                        size="sm"
                        variant="solid"
                        color="success"
                    >
                        Dismiss
                    </Button>
                }
            >
                User succesfully {modalCreateNew ? "created" : "updated"}.
            </Snackbar>
            <Snackbar
                autoHideDuration={6000}
                color="success"
                open={successDelete}
                onClose={() => setSuccessDelete(false)}
                variant="solid"
                startDecorator={<CheckCircle />}
                endDecorator={
                    <Button
                        onClick={() => setSuccessDelete(false)}
                        size="sm"
                        variant="solid"
                        color="success"
                    >
                        Dismiss
                    </Button>
                }
            >
                User succesfully deleted.
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

            {/* Modals */}
            <Modal open={userModalOpen} onClose={() => setUserModalOpen(false)}>
                <ModalDialog>
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <DialogTitle>{modalCreateNew ? 'Add User' : 'Edit User'}</DialogTitle>
                    <form
                        onSubmit={completeModal}
                        autoComplete='false'
                    >
                        <Stack spacing={2}>
                            <FormLabel level="title-lg">Username</FormLabel>
                            <FormControl>
                                <Input name="username" id="username" type="text" variant="outlined" sx={{ width: '250px' }}
                                    autoFocus={modalCreateNew}
                                    defaultValue={modalCreateNew ? "" : selectedRow.username}
                                    autoComplete='false'
                                />
                            </FormControl>
                            <FormLabel level="title-lg">First Name</FormLabel>
                            <FormControl>
                                <Input name="first_name" id="first_name" type="text" variant="outlined" sx={{ width: '250px' }}
                                    defaultValue={modalCreateNew ? "" : selectedRow.first_name}
                                    placeholder=''
                                    autoComplete='false'
                                />
                            </FormControl>
                            <FormLabel level="title-lg">Last Name</FormLabel>
                            <FormControl>
                                <Input name="last_name" id="last_name" type="text" variant="outlined" sx={{ width: '250px' }}
                                    defaultValue={modalCreateNew ? "" : selectedRow.last_name}
                                    placeholder=''
                                    autoComplete='false'
                                />
                            </FormControl>
                            <FormLabel level="title-lg">Email</FormLabel>
                            <FormControl>
                                <Input name="email" id="email" type="text" variant="outlined" sx={{ width: '250px' }}
                                    defaultValue={modalCreateNew ? "" : selectedRow.email}
                                    placeholder=''
                                    autoComplete='false'
                                />
                            </FormControl>
                            <FormLabel level="title=lg">Account Role</FormLabel>
                            <FormControl>
                                <Select name="role" id="role"
                                    defaultValue={modalCreateNew ? 0 : selectedRow.role}
                                >
                                    <Option value={0}>User</Option>
                                    <Option value={1}>Administrator</Option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <Checkbox
                                    name="disabled"
                                    id="disabled"
                                    label="Account is disabled"
                                    defaultChecked={modalCreateNew ? false : selectedRow.disabled}
                                />
                            </FormControl>
                            <FormLabel level="title-lg">Password</FormLabel>
                            {
                                modalCreateNew ?
                                    <FormControl>
                                        <Input name="password" id="password" type="password" variant="outlined" sx={{ width: '250px' }}
                                            defaultValue=''
                                            placeholder='Password'
                                            autoComplete='false'
                                        />
                                    </FormControl> : ""
                            }
                            <Sheet>
                                <Grid container spacing={2} columns={2} sx={{ flexGrow: 1, alignItems: 'right', justifyItems: 'right' }}>
                                    {
                                        (modalCreateNew) ? "" :
                                            <Grid size={6}>
                                                <Button color="danger" variant="outlined" onClick={deleteUser}>Delete User</Button>
                                            </Grid>
                                    }
                                    <Grid size={'grow'}>
                                        <Button type="submit">{modalCreateNew ? "Create User" : "Save Changes"}</Button>
                                    </Grid>
                                </Grid>
                            </Sheet>

                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>

            {/* Begin Content */}
            <Typography level="h2">Users</Typography>
            <br />
            {/* Begin Table */}
            <Sheet
                variant="outlined"
                sx={{ width: '100%', boxShadow: 'sm', borderRadius: 'sm' }}
            >
                <EnhancedTableToolbar />
                <Table
                    aria-labelledby="tableTitle"
                    hoverRow
                    sx={{
                        '--TableCell-headBackground': 'transparent',
                        '--TableCell-selectedBackground': (theme) =>
                            theme.vars.palette.success.softBg,
                        '& thead th': {
                            width: '33%'
                        },
                        width: '100%',
                    }}
                >
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={users.length}
                    />
                    <tbody width='100%'>
                        {[...users]
                            .sort(getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <tr
                                        width='100%'
                                        onClick={(event) => handleRowClick(event, row)}
                                    >
                                        <th id={labelId} scope="row">
                                            {row.username}
                                        </th>
                                        <td>{row.first_name}</td>
                                        <td>{row.last_name}</td>
                                        <td>{row.email}</td>
                                        <td>{decodeRole(row.role)}</td>
                                        <td>{row.disabled ? "YES" : "NO"}</td>
                                    </tr>
                                );
                            })}
                        {emptyRows > 0 && (
                            <tr
                                style={{
                                    height: `calc(${emptyRows} * 40px)`,
                                    '--TableRow-hoverBackground': 'transparent',
                                }}
                            >
                                <td colSpan={6} aria-hidden />
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={6}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <FormControl orientation="horizontal" size="sm">
                                        <FormLabel>Rows per page:</FormLabel>
                                        <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
                                            <Option value={15}>15</Option>
                                            <Option value={25}>25</Option>
                                            <Option value={30}>30</Option>
                                        </Select>
                                    </FormControl>
                                    <Typography sx={{ textAlign: 'center', minWidth: 80 }}>
                                        {labelDisplayedRows({
                                            from: users.length === 0 ? 0 : page * rowsPerPage + 1,
                                            to: getLabelDisplayedRowsTo(),
                                            count: users.length === -1 ? -1 : users.length,
                                        })}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                            size="sm"
                                            color="neutral"
                                            variant="outlined"
                                            disabled={page === 0}
                                            onClick={() => handleChangePage(page - 1)}
                                            sx={{ bgcolor: 'background.surface' }}
                                        >
                                            <KeyboardArrowLeftIcon />
                                        </IconButton>
                                        <IconButton
                                            size="sm"
                                            color="neutral"
                                            variant="outlined"
                                            disabled={
                                                users.length !== -1
                                                    ? page >= Math.ceil(users.length / rowsPerPage) - 1
                                                    : false
                                            }
                                            onClick={() => handleChangePage(page + 1)}
                                            sx={{ bgcolor: 'background.surface' }}
                                        >
                                            <KeyboardArrowRightIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </Sheet>
        </Sheet>
    );
}

export default Users;