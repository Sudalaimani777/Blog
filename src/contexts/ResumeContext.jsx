import { createContext, useState, useContext } from 'react';

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
    const [resumeData, setResumeData] = useState(null);

    const setResume = (data) => {
        setResumeData(data);
    };

    return (
        <ResumeContext.Provider value={{ resumeData, setResume }}>
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
