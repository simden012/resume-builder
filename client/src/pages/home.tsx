import React from "react";
import { Typography, Button, Container, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";

// Hero Section Styling
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(10, 2),
  textAlign: "center",
}));

// Feature Card Styling
const FeatureCard = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Typography variant="h2" gutterBottom>
          AI-Powered Resume Builder
        </Typography>
        <Typography variant="h6" gutterBottom>
          Create professional resumes in minutes. No sign-up required!
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          href="/resume-builder"
        >
          Create Your Resume Now
        </Button>
      </HeroSection>

      {/* Feature Highlights */}
      <Container sx={{ my: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Why Choose Us?
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid sx={{ xs: 12, sm: 4 }}>
            <FeatureCard>
              <Typography variant="h6" gutterBottom>
                AI-Powered
              </Typography>
              <Typography>
                Leverage cutting-edge AI to craft tailored resumes.
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid sx={{ xs: 12, sm: 4 }}>
            <FeatureCard>
              <Typography variant="h6" gutterBottom>
                Professional Templates
              </Typography>
              <Typography>
                Choose from a variety of industry-standard templates.
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid sx={{ xs: 12, sm: 4 }}>
            <FeatureCard>
              <Typography variant="h6" gutterBottom>
                Multiple Formats
              </Typography>
              <Typography>
                Download your resume in PDF or docx format.
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>
      {/* How It Works */}
      <Box sx={{ backgroundColor: "#f9f9f9", py: 8 }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid sx={{ xs: 12, sm: 4 }}>
              <Typography variant="h6" gutterBottom align="center">
                Step 1
              </Typography>
              <Typography align="center">
                Enter your professional details and career preferences.
              </Typography>
            </Grid>
            <Grid sx={{ xs: 12, sm: 4 }}>
              <Typography variant="h6" gutterBottom align="center">
                Step 2
              </Typography>
              <Typography align="center">
                Choose a template and preview your resume in real time.
              </Typography>
            </Grid>
            <Grid sx={{ xs: 12, sm: 4 }}>
              <Typography variant="h6" gutterBottom align="center">
                Step 3
              </Typography>
              <Typography align="center">
                Download your tailored resume in your preferred format.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#333", color: "#fff", py: 4 }}>
        <Container>
          <Typography align="center">
            © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
