import { useEffect } from 'react';
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
  Grid
} from '@mui/material';
import Footer from "../Components/Footer";

const Resume = () => {
  const { resumeData } = useResume();
  const navigate = useNavigate();

  // Redirect to home if no resume data is available
  useEffect(() => {
    if (!resumeData) {
      navigate('/');
    }
  }, [resumeData, navigate]);

  if (!resumeData) {
    return null; // or a loading spinner
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
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

          <Box mt={4} display="flex" justifyContent="center">
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => window.print()}
              sx={{ mr: 2 }}
            >
              Print Resume
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate(-1)}
            >
              Back to Contacts
            </Button>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default Resume;