import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Anime Blog
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your ultimate destination for the latest anime news, reviews, and discussions.
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column">
              <Link href="/" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Home
              </Link>
              <Link href="/about" color="inherit" underline="hover" sx={{ mb: 1 }}>
                About Us
              </Link>
              <Link href="/contact" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Contact
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Privacy Policy
              </Link>
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Categories
            </Typography>
            <Box display="flex" flexDirection="column">
              <Link href="#" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Popular
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ mb: 1 }}>
                New Releases
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Top Rated
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Upcoming
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={5}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: contact@animeblog.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Phone: +1 (123) 456-7890
            </Typography>
            <Typography variant="body2">
              123 Anime Street, Otaku City, 10001
            </Typography>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box mt={5} textAlign="center">
          <Typography variant="body2">
            {currentYear} Anime Blog. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;