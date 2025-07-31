import { createContext, useState, useEffect, useContext } from 'react';

const ResumeContext = createContext();

// Create the useResume hook
export const useResume = () => {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
};

const FORM_INITIAL_STATE = {
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
};

export const ResumeProvider = ({ children }) => {
    // Current resume/contact being viewed
    const [currentResume, setCurrentResume] = useState(null);
    
    // Form data for the contact form
    const [formData, setFormData] = useState(FORM_INITIAL_STATE);
    
    // List of all contacts
    const [contacts, setContacts] = useState([]);

    // Load contacts from localStorage on initial load
    useEffect(() => {
        const loadContacts = () => {
            try {
                const savedContacts = localStorage.getItem('contacts');
                if (savedContacts) {
                    const parsedContacts = JSON.parse(savedContacts);
                    if (Array.isArray(parsedContacts)) {
                        setContacts(parsedContacts);
                    }
                }
            } catch (error) {
                console.error('Error loading contacts from localStorage:', error);
            }
        };
        
        loadContacts();
    }, []);

    // Save contacts to localStorage when they change
    useEffect(() => {
        try {
            if (contacts.length > 0) {
                localStorage.setItem('contacts', JSON.stringify(contacts));
            }
        } catch (error) {
            console.error('Error saving contacts to localStorage:', error);
        }
    }, [contacts]);

    // Load form data from localStorage on initial load
    useEffect(() => {
        try {
            const savedFormData = localStorage.getItem('currentFormData');
            if (savedFormData) {
                const parsedData = JSON.parse(savedFormData);
                if (parsedData.date) {
                    parsedData.date = new Date(parsedData.date);
                }
                // Only update if there's a difference
                setFormData(prev => {
                    const newFormData = {
                        ...FORM_INITIAL_STATE,
                        ...parsedData
                    };
                    // Only update if there's an actual change to prevent unnecessary re-renders
                    return JSON.stringify(prev) === JSON.stringify(newFormData) 
                        ? prev 
                        : newFormData;
                });
            }
        } catch (error) {
            console.error('Error loading form data from localStorage:', error);
        }
    }, []);

    // Save form data to localStorage when it changes
    useEffect(() => {
        // Only save if formData is not the initial state
        if (JSON.stringify(formData) !== JSON.stringify(FORM_INITIAL_STATE)) {
            try {
                localStorage.setItem('currentFormData', JSON.stringify({
                    ...formData,
                    date: formData.date instanceof Date ? formData.date.toISOString() : formData.date
                }));
            } catch (error) {
                console.error('Error saving form data to localStorage:', error);
            }
        }
    }, [formData]);

    // Set the current resume/contact to view
    const setResume = (resume) => {
        setCurrentResume(resume);
    };

    // Update form data
    const updateFormData = (newData) => {
        setFormData(prev => ({
            ...prev,
            ...newData
        }));
    };

    // Reset form data to initial state
    const resetFormData = () => {
        setFormData(FORM_INITIAL_STATE);
    };

    // Add a new contact
    const addContact = (contact) => {
        const newContact = {
            ...contact,
            id: Date.now().toString()
        };
        setContacts(prev => [...prev, newContact]);
        return newContact;
    };

    // Update an existing contact
    const updateContact = (id, updatedData) => {
        setContacts(prev => 
            prev.map(contact => 
                contact.id === id ? { ...contact, ...updatedData } : contact
            )
        );
    };

    // Delete a contact
    const deleteContact = (id) => {
        setContacts(prev => prev.filter(contact => contact.id !== id));
    };

    const value = {
        // Current resume/contact
        currentResume,
        setResume,
        
        // Form data
        formData,
        updateFormData,
        resetFormData,
        
        // Contacts list
        contacts,
        addContact,
        updateContact,
        deleteContact
    };

    return (
        <ResumeContext.Provider value={value}>
            {children}
        </ResumeContext.Provider>
    );
};

export default ResumeContext;
