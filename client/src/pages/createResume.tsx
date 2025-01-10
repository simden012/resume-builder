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
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
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
  "Projects",
  "Finalize",
];
interface Project {
  name: string;
  description: string;
}
interface WorkExperience {
  jobTitle: string;
  company: string;
  duration: string;
  description: string;
}
interface Education {
  degree: string;
  institution: string;
  year: string;
}

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

  // Handle Input Changes
  type WorkExperienceField =
    | "jobTitle"
    | "company"
    | "duration"
    | "description";

  const handleWorkExperienceChange = (
    index: number,
    field: WorkExperienceField,
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
            {activeStep === 1 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Work Experience
                </Typography>
                {workExperiences.map((experience, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      variant="outlined"
                      margin="normal"
                      value={experience.jobTitle}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "jobTitle",
                          e.target.value
                        )
                      }
                    />
                    <TextField
                      fullWidth
                      label="Company Name"
                      variant="outlined"
                      margin="normal"
                      value={experience.company}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "company",
                          e.target.value
                        )
                      }
                    />
                    <TextField
                      fullWidth
                      label="Duration"
                      variant="outlined"
                      margin="normal"
                      value={experience.duration}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "duration",
                          e.target.value
                        )
                      }
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      variant="outlined"
                      margin="normal"
                      value={experience.description}
                      onChange={(e) =>
                        handleWorkExperienceChange(
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
                  onClick={addWorkExperience}
                >
                  Add Work Experience
                </Button>
              </>
            )}

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
                  <TextField
                    key={index}
                    fullWidth
                    label={`Skill ${index + 1}`}
                    variant="outlined"
                    margin="normal"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                  />
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
                  <Box key={index} sx={{ mb: 3 }}>
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
