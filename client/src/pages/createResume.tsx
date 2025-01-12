import React, { useState } from "react";
import { WorkExperience, Education, Project } from "../interfaces/types";
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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import WorkExperienceForm from "../components/workExperience";
import EducationForm from "../components/education";
import SkillsForm from "../components/skills";
import ProjectsForm from "../components/projects";

const steps = [
  "Personal Info",
  "Work Experience",
  "Education",
  "Skills",
  "Projects",
  "Finalize",
];

const CreateResume = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Build Your Professional Resume
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Follow the steps to create your perfect resume.
      </Typography>

      <Stepper activeStep={activeStep} sx={{ my: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Main Content */}
      <Grid
        container
        spacing={4}
        sx={{
          minHeight: "100vh",
          justifyContent: "center",
        }}
      >
        {/* Form Section */}
        <Grid sx={{ xs: 12, md: 8, width: "80%" }}>
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
            {activeStep === 1 && <WorkExperienceForm></WorkExperienceForm>}
            {activeStep === 2 && <EducationForm></EducationForm>}
            {activeStep === 3 && <SkillsForm></SkillsForm>}
            {activeStep === 4 && <ProjectsForm></ProjectsForm>}

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
      </Grid>
    </Container>
  );
};

export default CreateResume;
