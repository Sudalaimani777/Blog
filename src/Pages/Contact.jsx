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

    // State for viewing contact details
    const [viewingContact, setViewingContact] = useState(null);

    // Load contacts from localStorage on component mount
    useEffect(() => {
        const loadContacts = () => {
            try {
                const savedContacts = localStorage.getItem('contacts');
                if (savedContacts) {
                    const parsedContacts = JSON.parse(savedContacts);
                    // Safely convert date strings to Date objects
                    const contactsWithDates = parsedContacts.map(contact => {
                        let date;
                        try {
                            date = new Date(contact.date);
                            if (isNaN(date.getTime())) {
                                console.warn('Invalid date found, using current date');
                                date = new Date();
                            }
                        } catch (e) {
                            console.warn('Error parsing date, using current date', e);
                            date = new Date();
                        }
                        return {
                            ...contact,
                            date: date
                        };
                    });
                    setContacts(contactsWithDates);
                }
            } catch (error) {
                console.error('Error loading contacts from localStorage:', error);
                // Reset to empty array if there's an error
                setContacts([]);
                localStorage.removeItem('contacts');
            }
        };

        loadContacts();
    }, []);

    // Save contacts to localStorage whenever it changes
    useEffect(() => {
        if (contacts.length === 0) return; // Don't save empty array on initial load
        
        try {
            // Convert Date objects to ISO strings for storage
            const contactsForStorage = contacts.map(contact => {
                // Ensure we have a valid date
                const dateToSave = contact.date && contact.date instanceof Date && !isNaN(contact.date.getTime())
                    ? contact.date.toISOString()
                    : new Date().toISOString();
                
                return {
                    ...contact,
                    date: dateToSave
                };
            });
            
            localStorage.setItem('contacts', JSON.stringify(contactsForStorage));
        } catch (error) {
            console.error('Error saving contacts to localStorage:', error);
        }
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

    // Handle view details
    const handleViewDetails = (contact) => {
        setViewingContact(contact);
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
                                <Grid container spacing={3} sx={{ p: 3 }}>
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
                                                // Ensure we have a valid date that's not in the future
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
                                                
                                                let selectedDate = newValue ? new Date(newValue) : new Date();
                                                
                                                // If selected date is in the future, use today's date instead
                                                if (selectedDate > today) {
                                                    selectedDate = today;
                                                }
                                                
                                                // Ensure it's a valid date
                                                if (isNaN(selectedDate.getTime())) {
                                                    selectedDate = today;
                                                }
                                                
                                                setFormData(prev => ({
                                                    ...prev,
                                                    date: selectedDate
                                                }));
                                                
                                                if (error.date) {
                                                    setError(prev => ({
                                                        ...prev,
                                                        date: ''
                                                    }));
                                                }
                                            }}
                                            maxDate={new Date()} // This disables future dates in the calendar
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    error={!!error.date}
                                                    helperText={error.date || "Select a past or current date"}
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
                                </DialogActions>
                            </>
                        )}
                    </Dialog>
                </Container>
            </LocalizationProvider>
            <Footer />
        </Box>
    );
}

export default Contact;
