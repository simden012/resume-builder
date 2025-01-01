import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";

const ResumePreview = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  boxShadow: theme.shadows[3],
  height: "100%",
  overflowY: "auto",
}));

const steps = [
  "Personal Info",
  "Work Experience",
  "Education",
  "Skills",
  "Finalize",
];

const CreateResume = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Page Header */}
      <Typography variant="h4" align="center" gutterBottom>
        Build Your Professional Resume
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Follow the steps to create your perfect resume.
      </Typography>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ my: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid sx={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4 }}>
            {activeStep === 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  margin="normal"
                />
              </>
            )}
            {activeStep === 1 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Work Experience
                </Typography>
                <TextField
                  fullWidth
                  label="Job Title"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Company Name"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Duration (e.g., 2020 - 2022)"
                  variant="outlined"
                  margin="normal"
                />
              </>
            )}
            {activeStep === 2 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Education
                </Typography>
                <TextField
                  fullWidth
                  label="Degree"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Institution"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Year of Graduation"
                  variant="outlined"
                  margin="normal"
                />
              </>
            )}
            {activeStep === 3 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Skills
                </Typography>
                <TextField
                  fullWidth
                  label="Skills (e.g., JavaScript, Leadership)"
                  variant="outlined"
                  margin="normal"
                />
              </>
            )}
            {activeStep === 4 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Finalize Your Resume
                </Typography>
                <Typography>
                  Review your details and click "Download" to get your resume.
                </Typography>
              </>
            )}

            {/* Navigation Buttons */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Preview Section */}
        <Grid sx={{ xs: 12, md: 4 }}>
          <ResumePreview>
            <Typography variant="h6" gutterBottom>
              Resume Preview
            </Typography>
            <Typography>
              {activeStep === 0 && "Preview your personal info here."}
              {activeStep === 1 && "Preview your work experience here."}
              {activeStep === 2 && "Preview your education details here."}
              {activeStep === 3 && "Preview your skills here."}
              {activeStep === 4 && "Final preview of your resume."}
            </Typography>
          </ResumePreview>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateResume;
