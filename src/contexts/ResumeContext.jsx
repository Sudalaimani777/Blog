import { createContext, useState, useContext, useEffect } from 'react';

const ResumeContext = createContext();

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
    const [resumeData, setResumeData] = useState(null);
    const [formData, setFormData] = useState(FORM_INITIAL_STATE);
    const [isFormDirty, setIsFormDirty] = useState(false);

    // Load form data from localStorage on initial load
    useEffect(() => {
        try {
            const savedFormData = localStorage.getItem('contactFormData');
            if (savedFormData) {
                const parsedData = JSON.parse(savedFormData);
                if (parsedData.date) {
                    parsedData.date = new Date(parsedData.date);
                }
                setFormData(prev => ({
                    ...FORM_INITIAL_STATE,
                    ...parsedData
                }));
            }
        } catch (error) {
            console.error('Error loading form data from localStorage:', error);
        }
    }, []);

    // Save form data to localStorage when it changes
    useEffect(() => {
        if (isFormDirty) {
            try {
                localStorage.setItem('contactFormData', JSON.stringify({
                    ...formData,
                    date: formData.date instanceof Date ? formData.date.toISOString() : formData.date
                }));
            } catch (error) {
                console.error('Error saving form data to localStorage:', error);
            }
        }
    }, [formData, isFormDirty]);

    const setResume = (data) => {
        setResumeData(data);
    };

    const updateFormData = (newData) => {
        setFormData(prev => ({
            ...prev,
            ...newData
        }));
        setIsFormDirty(true);
    };

    const resetFormData = () => {
        setFormData(FORM_INITIAL_STATE);
        setIsFormDirty(false);
        try {
            localStorage.removeItem('contactFormData');
        } catch (error) {
            console.error('Error clearing form data from localStorage:', error);
        }
    };

    return (
        <ResumeContext.Provider value={{ 
            resumeData, 
            setResume,
            formData,
            updateFormData,
            resetFormData,
            setFormDirty: () => setIsFormDirty(true)
        }}>
            {children}
        </ResumeContext.Provider>
    );
};

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
};

export default ResumeContext;
