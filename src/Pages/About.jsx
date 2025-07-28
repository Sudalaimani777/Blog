import React from 'react';
import { Container, Typography, Box, Grid, Paper, Avatar, useTheme } from '@mui/material';
import { useMediaQuery } from '@mui/material';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ 
      py: { xs: 4, sm: 6, md: 8 },
      display: { md: 'flex' },
      flexDirection: { md: 'column' },
      alignItems: { md: 'center' }
    }}>
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6,
        width: { md: '80%' }
      }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{
          fontWeight: 'bold',
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          mb: 2
        }}>
          About Us
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{
          maxWidth: { xs: '90%', sm: '80%', md: '60%' },
          mx: 'auto',
          fontSize: { xs: '0.9rem', sm: '1rem' }
        }}>
          Welcome to our anime blog! We're passionate about sharing the latest anime news, reviews, and insights with fellow fans.
        </Typography>
      </Box>

      <Box sx={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: { xs: 4, sm: 6, md: 8 }
      }}>
        <Grid container spacing={4} sx={{
          width: '100%',
          maxWidth: '1200px'
        }}>
          {/* Mission Statement */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ 
              p: 4, 
              height: '100%',
              textAlign: { md: 'center' }
            }}>
              <Typography variant="h4" gutterBottom>
                Our Mission
              </Typography>
              <Typography paragraph sx={{ 
                fontSize: { xs: '0.9rem', sm: '1rem' },
                textAlign: { md: 'center' }
              }}>
                We aim to provide comprehensive and up-to-date information about the anime industry while fostering a community of passionate fans.
              </Typography>
              <Typography paragraph sx={{ 
                fontSize: { xs: '0.9rem', sm: '1rem' },
                textAlign: { md: 'center' }
              }}>
                Our team consists of dedicated anime enthusiasts who share a common goal of promoting the appreciation and understanding of Japanese animation.
              </Typography>
            </Paper>
          </Grid>

          {/* Team Section */}
          <Grid item xs={12} md={8} lg={6} sx={{ mx: 'auto' }}>
            <Paper elevation={3} sx={{ 
              p: 4,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              justifyContent: 'center',
            }}>
              <Typography variant="h4" gutterBottom>
                Meet the Team
              </Typography>
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '100%'
                }}>
                  <Avatar sx={{ 
                    bgcolor: 'primary.main', 
                    mr: 2,
                    ml: { md: 2 }
                  }}>
                    A
                  </Avatar>
                  <Box sx={{ 
                    textAlign: 'center',
                    display: { md: 'block' },
                    width: '100%'
                  }}>
                    <Typography variant="subtitle1">Anime Enthusiast</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lead Editor
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '100%'
                }}>
                  <Avatar sx={{ 
                    bgcolor: 'secondary.main', 
                    mr: 2,
                    ml: { md: 2 }
                  }}>
                    B
                  </Avatar>
                  <Box sx={{ 
                    textAlign: 'center',
                    display: { md: 'block' },
                    width: '100%'
                  }}>
                    <Typography variant="subtitle1">Content Creator</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Writer & Reviewer
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Contact Section */}
      <Box sx={{ 
        mt: 6, 
        p: 2, 
        bgcolor: 'background.paper',
        borderRadius: 2,
        width: { md: '80%' },
        textAlign: { md: 'center' }
      }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Get in Touch
        </Typography>
        <Grid container spacing={3} sx={{ 
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1" color="primary">
                contact@example.com
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Social Media
              </Typography>
              <Typography variant="body1" color="primary">
                @animeblog
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default About;