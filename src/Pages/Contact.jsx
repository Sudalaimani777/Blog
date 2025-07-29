import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    FormHelperText,
    MenuItem,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TablePagination
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import Footer from '../Components/Footer';

const Contact = () => {
    // State for storing the form data
    const [formData, setFormData] = useState({
        id: '',
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        gender: "",
        lang: [],
        date: new Date(),
        address: "",
        status: "college",
        courses: "engineering",
        skills: "",
        experiences: ""
    });

    // State for storing the errors
    const [error, setError] = useState({});

    // State for storing all contacts
    const [contacts, setContacts] = useState([]);

    // State for dialog
    const [open, setOpen] = useState(false);

    // State for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Load contacts from localStorage on component mount
    useEffect(() => {
        const savedContacts = localStorage.getItem('contacts');
        if (savedContacts) {
            setContacts(JSON.parse(savedContacts));
        }
    }, []);

    // Save contacts to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }, [contacts]);

    // Form Validation
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // First Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First Name is required";
            isValid = false;
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = "First Name must be at least 2 characters";
            isValid = false;
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last Name is required";
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        // Mobile Number validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.mobileNumber) {
            newErrors.mobileNumber = "Mobile number is required";
            isValid = false;
        } else if (!phoneRegex.test(formData.mobileNumber)) {
            newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
            isValid = false;
        }

        // Gender validation
        if (!formData.gender) {
            newErrors.gender = "Please select a gender";
            isValid = false;
        }

        // Language validation
        if (formData.lang.length === 0) {
            newErrors.lang = "Please select at least one language";
            isValid = false;
        }

        // Date validation
        if (!formData.date) {
            newErrors.date = "Please select a date";
            isValid = false;
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
            isValid = false;
        } else if (formData.address.trim().length < 10) {
            newErrors.address = "Address must be at least 10 characters";
            isValid = false;
        }

        // Status validation
        if (!formData.status) {
            newErrors.status = "Please select your status";
            isValid = false;
        }

        // Courses validation
        if (!formData.courses) {
            newErrors.courses = "Please select a course";
            isValid = false;
        }

        setError(newErrors);
        return isValid;
    };

    // Handle Form Submission
    const handleFormSubmission = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (formData.id) {
                // Update existing contact
                setContacts(contacts.map(contact =>
                    contact.id === formData.id ? formData : contact
                ));
            } else {
                // Add new contact
                const newContact = {
                    ...formData,
                    id: Date.now().toString()
                };
                setContacts([...contacts, newContact]);
            }

            // Reset form
            resetForm();
            setOpen(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            id: '',
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: "",
            gender: "",
            lang: [],
            date: new Date(),
            address: "",
            status: "college",
            courses: "engineering",
            skills: "",
            experiences: ""
        });
        setError({});
    };

    // Handle edit
    const handleEdit = (contact) => {
        setFormData({
            ...contact,
            date: new Date(contact.date) // Ensure date is a Date object
        });
        setOpen(true);
    };

    // Handle delete
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            setContacts(contacts.filter(contact => contact.id !== id));
        }
    };

    // Handle dialog open
    const handleClickOpen = () => {
        resetForm();
        setOpen(true);
    };

    // Handle dialog close
    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Clear error for the current field when user types
        if (error[name]) {
            setError(previous => {
                const newErrors = { ...previous };
                delete newErrors[name];
                return newErrors;
            });
        }

        setFormData(previous => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle Radio Button Changes
    const handleRadioChange = (e) => {
        const { value } = e.target;
        setFormData(previous => ({
            ...previous,
            gender: value
        }));

        // Clear gender error when a selection is made
        if (error.gender) {
            setError(previous => ({
                ...previous,
                gender: ''
            }));
        }
    };

    // Handle Checkbox Changes for Languages
    const handleCheckBox = (e) => {
        const { name, checked } = e.target;
        let updatedLang = [...formData.lang];

        if (checked) {
            // Add language if not already in the array
            if (!updatedLang.includes(name)) {
                updatedLang = [...updatedLang, name];
            }
        } else {
            // Remove language if unchecked
            updatedLang = updatedLang.filter(lang => lang !== name);
        }

        setFormData(previous => ({
            ...previous,
            lang: updatedLang
        }));

        // Clear language error when a selection is made
        if (error.lang && updatedLang.length > 0) {
            setError(previous => ({
                ...previous,
                lang: ''
            }));
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Container maxWidth="lg" sx={{ py: 4, flex: '1 0 auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h4" component="h1">
                            Contact Management
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClickOpen}
                            sx={{ textTransform: 'none' }}
                            startIcon={<PersonAddIcon />}
                        >
                            Add New Contact
                        </Button>
                    </Box>
                    
                    {/* Contacts Table */}
                    <Paper sx={{ width: '100%', overflow: 'hidden', mb: 4 }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="contacts table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Mobile</TableCell>
                                        <TableCell>Gender</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {contacts.length > 0 ? (
                                        contacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contact) => (
                                            <TableRow key={contact.id} hover>
                                                <TableCell>{`${contact.firstName} ${contact.lastName}`}</TableCell>
                                                <TableCell>{contact.email}</TableCell>
                                                <TableCell>{contact.mobileNumber}</TableCell>
                                                <TableCell>{contact.gender}</TableCell>
                                                <TableCell>{new Date(contact.date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <IconButton 
                                                        color="primary" 
                                                        onClick={() => handleEdit(contact)}
                                                        aria-label="edit"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={() => handleDelete(contact.id)}
                                                        aria-label="delete"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton 
                                                        color="info"
                                                        onClick={() => {
                                                            window.location.href = '/resume';
                                                        }}
                                                        aria-label="view resume"
                                                    >
                                                        <DescriptionIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                No contacts found. Add a new contact to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={contacts.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                    
                    {/* Add/Edit Contact Dialog */}
                    <Dialog 
                        open={open} 
                        onClose={handleClose}
                        maxWidth="md"
                        fullWidth
                    >
                        <Box 
                            component="form" 
                            onSubmit={handleFormSubmission}
                            sx={{ '& .MuiTextField-root': { mb: 2 } }}
                        >
                            <DialogTitle sx={{ 
                                bgcolor: 'primary.main', 
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                {formData.id ? (
                                    <>
                                        <EditIcon />
                                        Edit Contact
                                    </>
                                ) : (
                                    <>
                                        <PersonAddIcon />
                                        Add New Contact
                                    </>
                                )}
                            </DialogTitle>
                            <DialogContent sx={{ pt: 3 }}>
                                <Grid container spacing={3}>
                                    {/* Form content will go here */}
                                </Grid>
                            </DialogContent>
                            <DialogActions sx={{ p: 3, pt: 0 }}>
                                <Button 
                                    onClick={handleClose}
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<CancelIcon />}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                >
                                    {formData.id ? 'Update' : 'Save'}
                                </Button>
                            </DialogActions>
                        </Box>
                    </Dialog>
                </Container>
            </LocalizationProvider>
            <Footer />
        </Box>
    );
}

export default Contact;
