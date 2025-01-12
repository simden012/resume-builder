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

  // State for Resume Sections
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    { jobTitle: "", company: "", duration: "", description: "" },
  ]);
  const [skills, setSkills] = useState([""]);
  const [projects, setProjects] = useState<Project[]>([
    { name: "", description: "" },
  ]);
  const [educations, setEducations] = useState<Education[]>([
    { degree: "", institution: "", year: "" },
  ]);

  // Navigation
  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  // Add New Entries
  const addWorkExperience = () =>
    setWorkExperiences([
      ...workExperiences,
      { jobTitle: "", company: "", duration: "", description: "" },
    ]);
  const addSkill = () => setSkills([...skills, ""]);
  const addEducation = () =>
    setEducations([...educations, { degree: "", institution: "", year: "" }]);
  const addProject = () =>
    setProjects([...projects, { name: "", description: "" }]);
  // State for AI Suggestions Modal
  const [open, setOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const handleWorkExperienceChange = (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => {
    const updatedExperiences = [...workExperiences];
    updatedExperiences[index][field] = value; // Now TypeScript knows `field` is a valid key
    setWorkExperiences(updatedExperiences);
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };
  const handleProjectChange = (
    index: number,
    field: keyof Project, // Ensures field is a valid key in Project
    value: string
  ) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value; // Type-safe access
    setProjects(updatedProjects);
  };
  const handleEducationChange = (
    index: number,
    field: keyof Education, // Ensures field is a valid key in Education
    value: string
  ) => {
    const updatedEducations = [...educations];
    updatedEducations[index][field] = value; // Type-safe access
    setEducations(updatedEducations);
  };

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
            {/* Personal Info */}
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

            {/* Work Experience */}
            {activeStep === 1 && <WorkExperienceForm></WorkExperienceForm>}

            {/* Education */}
            {activeStep === 2 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Education
                </Typography>
                {educations.map((education, index) => (
                  <Box key={index} sx={{ mb: 3, position: "relative" }}>
                    {index > 0 && (
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: -20,
                          right: -10,
                          zIndex: 1,
                        }}
                        onClick={() => {
                          const updatedEducations = [...educations];
                          updatedEducations.splice(index, 1);
                          setEducations(updatedEducations);
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}

                    <TextField
                      fullWidth
                      label="Degree"
                      variant="outlined"
                      margin="normal"
                      value={education.degree}
                      onChange={(e) =>
                        handleEducationChange(index, "degree", e.target.value)
                      }
                    />
                    <TextField
                      fullWidth
                      label="Institution"
                      variant="outlined"
                      margin="normal"
                      value={education.institution}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "institution",
                          e.target.value
                        )
                      }
                    />
                    <TextField
                      fullWidth
                      label="Year of Graduation"
                      variant="outlined"
                      margin="normal"
                      value={education.year}
                      onChange={(e) =>
                        handleEducationChange(index, "year", e.target.value)
                      }
                    />
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={addEducation}
                >
                  Add Education
                </Button>
              </>
            )}
            {/* Skills */}
            {activeStep === 3 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Skills
                </Typography>
                {skills.map((skill, index) => (
                  <Box key={index} sx={{ mb: 1, position: "relative" }}>
                    {index > 0 && (
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: -20,
                          right: -10,
                          zIndex: 1,
                        }}
                        onClick={() => {
                          const updatedSkills = [...skills];
                          updatedSkills.splice(index, 1);
                          setSkills(updatedSkills);
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                    <TextField
                      fullWidth
                      label={`Skill ${index + 1}`}
                      variant="outlined"
                      margin="normal"
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                    />
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={addSkill}
                >
                  Add Skill
                </Button>
              </>
            )}

            {/* Projects */}
            {activeStep === 4 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Projects
                </Typography>
                {projects.map((project, index) => (
                  <Box key={index} sx={{ mb: 3, position: "relative" }}>
                    {index > 0 && (
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: -20,
                          right: -10,
                          zIndex: 1,
                        }}
                        onClick={() => {
                          const updatedProjects = [...projects];
                          updatedProjects.splice(index, 1);
                          setProjects(updatedProjects);
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                    <TextField
                      fullWidth
                      label="Project Name"
                      variant="outlined"
                      margin="normal"
                      value={project.name}
                      onChange={(e) =>
                        handleProjectChange(index, "name", e.target.value)
                      }
                    />
                    <TextField
                      fullWidth
                      label="Project Description"
                      variant="outlined"
                      margin="normal"
                      value={project.description}
                      onChange={(e) =>
                        handleProjectChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={addProject}
                >
                  Add Project
                </Button>
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
      </Grid>
    </Container>
  );
};

export default CreateResume;
