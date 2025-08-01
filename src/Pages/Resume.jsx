import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../contexts/ResumeContext';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Grid,
  CircularProgress
} from '@mui/material';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Footer from "../Components/Footer";

const Resume = () => {
  const { currentResume, setResume, formData } = useResume();
  const navigate = useNavigate();

  // If no resume data is available, redirect to contact page
  useEffect(() => {
    const hasNoData = !currentResume && !formData.firstName;
    
    if (hasNoData) {
      const timer = setTimeout(() => {
        navigate('/contact');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentResume, formData.firstName, navigate]);

  const resumeRef = useRef();
  const resumeContentRef = useRef();

  // If we're still loading or have no data, show loading spinner
  if (!currentResume && !formData.firstName) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Use currentResume if available, otherwise fall back to formData
  const resumeData = currentResume || formData;

  const handleDownloadPDF = () => {
    const input = resumeContentRef.current;
    
    // Add a small delay to ensure the component is fully rendered
    setTimeout(() => {
      // Hide buttons and other elements we don't want in the PDF
      const buttons = document.querySelectorAll('button, .no-print');
      buttons.forEach(btn => (btn.style.display = 'none'));
      
      html2canvas(input, { 
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => {
          // Ignore elements with no-print class or buttons
          return element.classList.contains('no-print') || 
                 element.tagName === 'BUTTON' ||
                 element.closest('button') !== null;
        }
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if content is longer than one page
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        // Download the PDF
        pdf.save(`${resumeData.firstName}_${resumeData.lastName}_Resume.pdf`);
        
        // Restore button visibility
        const buttons = document.querySelectorAll('button, .no-print');
        buttons.forEach(btn => (btn.style.display = ''));
      }).catch(err => {
        console.error('Error generating PDF:', err);
        // Restore button visibility even if there's an error
        const buttons = document.querySelectorAll('button, .no-print');
        buttons.forEach(btn => (btn.style.display = ''));
        // Fallback to print if PDF generation fails
        window.print();
      });
    }, 500);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} ref={resumeRef}>
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
        <Box sx={{ mb: 3 }} className="no-print">
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/contact')}
          >
            Back to Form
          </Button>
        </Box>
        
        {/* This is the content that will be included in the PDF */}
        <div ref={resumeContentRef}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h3" component="h1" gutterBottom>
              {`${resumeData.firstName} ${resumeData.lastName}`}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {resumeData.email} | {resumeData.mobileNumber}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>Personal Information</Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Full Name" 
                    secondary={`${resumeData.firstName} ${resumeData.lastName}`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Email" secondary={resumeData.email} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Mobile" secondary={resumeData.mobileNumber} />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Gender" 
                    secondary={resumeData.gender ? resumeData.gender.charAt(0).toUpperCase() + resumeData.gender.slice(1) : ''} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Date of Birth" 
                    secondary={new Date(resumeData.date).toLocaleDateString()} 
                  />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>Education & Skills</Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Status" 
                    secondary={
                      resumeData.status === 'school' ? 'School' : 
                      resumeData.status === 'college' ? 'College' : 
                      'Working Professional'
                    } 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Course" 
                    secondary={resumeData.courses ? resumeData.courses.charAt(0).toUpperCase() + resumeData.courses.slice(1) : ''} 
                  />
                </ListItem>
                {resumeData.lang && resumeData.lang.length > 0 && (
                  <ListItem>
                    <ListItemText 
                      primary="Languages Known" 
                      secondary={resumeData.lang.join(', ')} 
                    />
                  </ListItem>
                )}
                {resumeData.skills && (
                  <ListItem>
                    <ListItemText 
                      primary="Skills" 
                      secondary={resumeData.skills} 
                      secondaryTypographyProps={{ style: { whiteSpace: 'pre-line' } }}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>

            {resumeData.experiences && (
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>Work/Project Experiences</Typography>
                <Typography whiteSpace="pre-line">{resumeData.experiences}</Typography>
              </Grid>
            )}
          </Grid>

          <Box mt={4} display="flex" justifyContent="center" gap={2}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleDownloadPDF}
              startIcon={<DownloadIcon />}
            >
              Download PDF
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => window.print()}
              startIcon={<PrintIcon />}
            >
              Print
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/contact')}
              startIcon={<ArrowBackIcon />}
            >
              Back to Contacts
            </Button>
          </Box>
        </Paper>
          </div>
        </Container>
        <Footer className="no-print" />
      </Box>
  );
};

export default Resume;