import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../contexts/ResumeContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import DownloadIcon from '@mui/icons-material/Download';
import Footer from '../Components/Footer';

const Contact = () => {
    const { 
        currentResume,
        setResume, 
        formData, 
        updateFormData, 
        resetFormData,
        contacts,
        addContact,
        updateContact,
        deleteContact
    } = useResume();
    const navigate = useNavigate();

    // State for storing the errors
    const [error, setError] = useState({});

    // State for dialog
    const [open, setOpen] = useState(false);

    // State for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // State for viewing contact details
    const [viewingContact, setViewingContact] = useState(null);

    // Helper function to safely parse date
    const parseDate = (dateString) => {
        if (!dateString) return new Date();
        
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date() : date;
    };

    // Set current resume from context if available
    const isMounted = useRef(false);
    const initialRender = useRef(true);
    
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        
        if (currentResume) {
            updateFormData(currentResume);
        }
    }, [currentResume]);

    // Debounce function to limit the rate of localStorage updates
    const debounce = (func, delay) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Save form data to localStorage when it changes
    const prevFormDataRef = useRef('');
    
    const saveToLocalStorage = useCallback(debounce((data) => {
        try {
            if (data.firstName || data.lastName || data.email || data.mobileNumber) {
                const dataToSave = {
                    ...data,
                    date: data.date instanceof Date ? data.date.toISOString() : data.date
                };
                localStorage.setItem('currentFormData', JSON.stringify(dataToSave));
            }
        } catch (e) {
            console.error('Error saving form data:', e);
        }
    }, 500), []); // 500ms debounce delay

    useEffect(() => {
        const formDataString = JSON.stringify(formData);
        
        // Skip if form data hasn't changed
        if (prevFormDataRef.current === formDataString) {
            return;
        }
        
        prevFormDataRef.current = formDataString;
        saveToLocalStorage(formData);
    }, [formData, saveToLocalStorage]);

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

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        const isValid = validateForm();
        if (!isValid) {
            return;
        }

        try {
            if (formData.id) {
                // Update existing contact
                updateContact(formData.id, formData);
                toast.success("Contact updated successfully!");
            } else {
                // Add new contact
                addContact(formData);
                toast.success("Contact added successfully!");
            }
            
            // Close the dialog
            setOpen(false);
            
            // Reset the form after a short delay to allow the dialog to close
            setTimeout(() => {
                resetForm();
            }, 100);
            
        } catch (error) {
            console.error('Error saving contact:', error);
            toast.error("Failed to save contact. Please try again.");
        }
    };

    // Reset form
    const resetForm = () => {
        // Reset form data using the context function
        resetFormData();
        
        // Clear any form errors
        setError({});
        
        // Ensure the form has the correct initial state
        updateFormData({
            ...formData,
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            mobileNumber: '',
            gender: '',
            lang: [],
            date: new Date(),
            address: '',
            status: 'college',
            courses: 'engineering',
            skills: '',
            experiences: ''
        });
    };

    // Handle edit
    const handleEdit = (contact) => {
        // Reset any existing errors
        setError({});
        
        // Make a copy of the contact to avoid mutating the original
        const contactToEdit = {
            ...contact,
            date: new Date(contact.date) // Ensure date is a Date object
        };
        
        // Update the form data with the contact to edit
        updateFormData(contactToEdit);
        
        // Open the dialog after a small delay to ensure state is updated
        setTimeout(() => {
            setOpen(true);
        }, 50);
    };

    // Handle delete
    const handleDelete = (id) => {
        try {
            deleteContact(id);
            toast.success("Contact deleted successfully!");
            setOpen(false);
        } catch (error) {
            console.error('Error deleting contact:', error);
            toast.error("Failed to delete contact. Please try again.");
        }
    };

    // Handle dialog open
    const handleClickOpen = () => {
        // Always reset the form when opening the dialog for a new contact
        resetForm();
        setOpen(true);
    };

    // Handle dialog close
    const handleClose = () => {
        setOpen(false);
        // Don't reset form here to prevent race conditions
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

        updateFormData({
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle Radio Button Changes
    const handleRadioChange = (e) => {
        const { value } = e.target;
        updateFormData({
            gender: value
        });

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

        updateFormData({
            lang: updatedLang
        });

        // Clear language error when a selection is made
        if (error.lang && updatedLang.length > 0) {
            setError(previous => ({
                ...previous,
                lang: ''
            }));
        }
    };

    // Handle view details
    const handleViewDetails = (contact) => {
        setViewingContact(contact);
        // Update the resume context with the contact being viewed
        setResume(contact);
        // Navigate to resume page
        navigate('/resume');
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
                                        <TableCell>Status</TableCell>
                                        <TableCell>Courses</TableCell>
                                        <TableCell>Date Added</TableCell>
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
                                                <TableCell>
                                                    {contact.status === 'school' ? 'School' : 
                                                     contact.status === 'college' ? 'College' : 'Working'}
                                                </TableCell>
                                                <TableCell>
                                                    {contact.courses.charAt(0).toUpperCase() + contact.courses.slice(1)}
                                                </TableCell>
                                                <TableCell>{new Date(contact.date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <IconButton 
                                                        color="info" 
                                                        onClick={() => handleViewDetails(contact)}
                                                        aria-label="view details"
                                                        title="View Details"
                                                    >
                                                        <InfoIcon />
                                                    </IconButton>
                                                    <IconButton 
                                                        color="primary" 
                                                        onClick={() => handleEdit(contact)}
                                                        aria-label="edit"
                                                        title="Edit"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(contact.id);
                                                        }}
                                                        aria-label="delete"
                                                        title="Delete"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
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
                            onSubmit={handleSubmit}
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
                            <DialogContent sx={{ pt: 3 }} >
                                <Grid container spacing={3} padding={3}>
                                    {/* First Name */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            error={!!error.firstName}
                                            helperText={error.firstName}
                                            required
                                        />
                                    </Grid>

                                    {/* Last Name */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            error={!!error.lastName}
                                            helperText={error.lastName}
                                            required
                                        />
                                    </Grid>

                                    {/* Email */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={!!error.email}
                                            helperText={error.email}
                                            required
                                        />
                                    </Grid>

                                    {/* Mobile Number */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Mobile Number"
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={handleChange}
                                            error={!!error.mobileNumber}
                                            helperText={error.mobileNumber}
                                            required
                                        />
                                    </Grid>

                                    {/* Gender */}
                                    <Grid item xs={12}>
                                        <FormControl component="fieldset" error={!!error.gender}>
                                            <FormLabel component="legend">Gender</FormLabel>
                                            <RadioGroup
                                                row
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleRadioChange}
                                            >
                                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                                            </RadioGroup>
                                            {error.gender && <FormHelperText>{error.gender}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* Languages */}
                                    <Grid item xs={12}>
                                        <FormControl component="fieldset" error={!!error.lang}>
                                            <FormLabel component="legend">Languages Known</FormLabel>
                                            <div>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formData.lang.includes('english')}
                                                            onChange={handleCheckBox}
                                                            name="english"
                                                        />
                                                    }
                                                    label="English"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formData.lang.includes('japanese')}
                                                            onChange={handleCheckBox}
                                                            name="japanese"
                                                        />
                                                    }
                                                    label="Japanese"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formData.lang.includes('tamil')}
                                                            onChange={handleCheckBox}
                                                            name="tamil"
                                                        />
                                                    }
                                                    label="Tamil"
                                                />
                                            </div>
                                            {error.lang && <FormHelperText>{error.lang}</FormHelperText>}
                                        </FormControl>
                                    </Grid>

                                    {/* Date of Birth */}
                                    <Grid item xs={12} sm={6}>
                                        <DatePicker
                                            label="Date of Birth"
                                            value={formData.date}
                                            onChange={(newValue) => {
                                                // Ensure the date is not in the future
                                                const today = new Date();
                                                today.setHours(23, 59, 59, 999); // Set to end of day for comparison
                                                
                                                // If the selected date is in the future, use today's date instead
                                                const selectedDate = newValue > today ? today : newValue;
                                                
                                                updateFormData({
                                                    ...formData,
                                                    date: selectedDate
                                                });
                                                
                                                if (error.date) {
                                                    setError(prev => ({
                                                        ...prev,
                                                        date: ''
                                                    }));
                                                }
                                            }}
                                            maxDate={new Date()} // This will disable future dates in the calendar
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    error={!!error.date}
                                                    helperText={error.date || "Select a date in the past"}
                                                    required
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* Status */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            error={!!error.status}
                                            helperText={error.status}
                                            required
                                        >
                                            <MenuItem value="school">School</MenuItem>
                                            <MenuItem value="college">College</MenuItem>
                                            <MenuItem value="working">Working Professional</MenuItem>
                                        </TextField>
                                    </Grid>

                                    {/* Courses */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Courses"
                                            name="courses"
                                            value={formData.courses}
                                            onChange={handleChange}
                                            error={!!error.courses}
                                            helperText={error.courses}
                                            required
                                        >
                                            <MenuItem value="engineering">Engineering</MenuItem>
                                            <MenuItem value="medicine">Medicine</MenuItem>
                                            <MenuItem value="arts">Arts</MenuItem>
                                            <MenuItem value="science">Science</MenuItem>
                                            <MenuItem value="commerce">Commerce</MenuItem>
                                        </TextField>
                                    </Grid>

                                    {/* Skills */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Skills"
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            multiline
                                            rows={2}
                                            placeholder="Enter your skills separated by commas"
                                        />
                                    </Grid>

                                    {/* Address */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            error={!!error.address}
                                            helperText={error.address || "Please enter your full address"}
                                            multiline
                                            rows={3}
                                            required
                                        />
                                    </Grid>

                                    {/* Experiences */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Work/Project Experiences"
                                            name="experiences"
                                            value={formData.experiences}
                                            onChange={handleChange}
                                            multiline
                                            rows={4}
                                            placeholder="Describe your work experiences or projects"
                                        />
                                    </Grid>
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
                    
                    {/* View Details Dialog */}
                    <Dialog
                        open={Boolean(viewingContact)}
                        onClose={() => setViewingContact(null)}
                        maxWidth="md"
                        fullWidth
                    >
                        {viewingContact && (
                            <>
                                <DialogTitle sx={{ 
                                    bgcolor: 'primary.main', 
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <ContactMailIcon />
                                    Contact Details
                                </DialogTitle>
                                <DialogContent sx={{ pt: 3 }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" gutterBottom>Personal Information</Typography>
                                            <Typography><strong>Name:</strong> {`${viewingContact.firstName} ${viewingContact.lastName}`}</Typography>
                                            <Typography><strong>Email:</strong> {viewingContact.email}</Typography>
                                            <Typography><strong>Mobile:</strong> {viewingContact.mobileNumber}</Typography>
                                            <Typography><strong>Gender:</strong> {viewingContact.gender.charAt(0).toUpperCase() + viewingContact.gender.slice(1)}</Typography>
                                            <Typography><strong>Date of Birth:</strong> {new Date(viewingContact.date).toLocaleDateString()}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" gutterBottom>Education & Status</Typography>
                                            <Typography><strong>Status:</strong> 
                                                {viewingContact.status === 'school' ? 'School' : 
                                                 viewingContact.status === 'college' ? 'College' : 'Working Professional'}
                                            </Typography>
                                            <Typography><strong>Course:</strong> 
                                                {viewingContact.courses.charAt(0).toUpperCase() + viewingContact.courses.slice(1)}
                                            </Typography>
                                            <Typography><strong>Languages:</strong> {viewingContact.lang.join(', ')}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" gutterBottom>Address</Typography>
                                            <Typography style={{ whiteSpace: 'pre-line' }}>{viewingContact.address}</Typography>
                                        </Grid>
                                        {viewingContact.skills && (
                                            <Grid item xs={12}>
                                                <Typography variant="h6" gutterBottom>Skills</Typography>
                                                <Typography>{viewingContact.skills}</Typography>
                                            </Grid>
                                        )}
                                        {viewingContact.experiences && (
                                            <Grid item xs={12}>
                                                <Typography variant="h6" gutterBottom>Work/Project Experiences</Typography>
                                                <Typography style={{ whiteSpace: 'pre-line' }}>{viewingContact.experiences}</Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </DialogContent>
                                <DialogActions sx={{ p: 3, pt: 0 }}>
                                    <Button 
                                        onClick={() => setViewingContact(null)}
                                        variant="outlined"
                                        color="inherit"
                                        startIcon={<CancelIcon />}
                                    >
                                        Close
                                    </Button>
                                    <Button 
                                        variant="contained"
                                        color="primary"
                                        startIcon={<DownloadIcon />}
                                        onClick={() => {
                                            // Only set the resume data and navigate, don't clear the form
                                            setResume({...viewingContact});
                                            navigate('/resume');
                                        }}
                                    >
                                        Download Resume
                                    </Button>
                                </DialogActions>
                            </>
                        )}
                    </Dialog>
                </Container>
            </LocalizationProvider>
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Footer />
        </Box>
    );
}
export default Contact;
