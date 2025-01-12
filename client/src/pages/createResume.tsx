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
            {activeStep === 1 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Work Experience
                </Typography>
                {workExperiences.map((experience, index) => {
                  // Fetch AI Suggestions
                  const handleOpenSuggestions = async () => {
                    setLoading(true);
                    try {
                      const response = await fetch(
                        "http://127.0.0.1:8000/ai-suggestions",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            typeOfSuggestion: "job",
                            description: experience.description,
                          }),
                        }
                      );
                      const data = await response.json();
                      setSuggestions(data.suggestions || []);
                      setOpen(true);
                    } catch (error) {
                      console.error("Error fetching AI suggestions:", error);
                    } finally {
                      setLoading(false);
                    }
                  };

                  // Handle Selection of a Suggestion
                  const handleSelectSuggestion = (suggestion: string) => {
                    const sliced_suggestion = suggestion.slice(3).trim();
                    handleWorkExperienceChange(
                      index,
                      "description",
                      sliced_suggestion
                    );
                    setOpen(false); // Close the modal after selection
                  };

                  return (
                    <Box key={index} sx={{ mb: 10, position: "relative" }}>
                      {/* Remove Work Experience Button */}
                      {index > 0 && (
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: -20,
                            right: -10,
                            zIndex: 1,
                          }}
                          onClick={() => {
                            const updatedWorkExperiences = [...workExperiences];
                            updatedWorkExperiences.splice(index, 1);
                            setWorkExperiences(updatedWorkExperiences);
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      )}

                      {/* Job Title */}
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

                      {/* Company Name */}
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

                      {/* Duration */}
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

                      {/* Description with AI Suggestions */}
                      <Box sx={{ position: "relative" }}>
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
                          multiline
                          minRows={1}
                          maxRows={8}
                        />
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{
                            mt: 1,
                            float: "right",
                            background:
                              "linear-gradient(to right, #6a11cb, #2575fc)",
                            color: "#fff",
                            "&:hover": {
                              background:
                                "linear-gradient(to right, #4a00e0, #8e2de2)",
                            },
                          }}
                          onClick={handleOpenSuggestions}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "AI Suggestions"}
                        </Button>
                      </Box>

                      {/* AI Suggestions Modal */}
                      <Dialog
                        open={open}
                        onClose={() => setOpen(false)}
                        fullWidth
                        maxWidth="sm"
                      >
                        <DialogTitle>
                          AI Suggestions for Job Description
                        </DialogTitle>
                        <DialogContent>
                          {/* Old Description */}
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>Current Description:</strong>
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {experience.description ||
                              "No current description available."}
                          </Typography>

                          {/* AI Suggestions */}
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>Suggestions:</strong>
                          </Typography>
                          <List>
                            {suggestions.map((suggestion, i) => (
                              <ListItem key={i}>
                                <ListItemButton
                                  onClick={() =>
                                    handleSelectSuggestion(suggestion)
                                  }
                                  sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: 2,
                                    p: 2,
                                    "&:hover": {
                                      backgroundColor: "#f5f5f5",
                                    },
                                  }}
                                >
                                  <Typography variant="body2">
                                    {suggestion}
                                  </Typography>
                                </ListItemButton>
                              </ListItem>
                            ))}
                          </List>
                        </DialogContent>

                        {/* Actions */}
                        <DialogActions>
                          <Button
                            onClick={() => setOpen(false)}
                            color="primary"
                          >
                            Close
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Box>
                  );
                })}

                {/* Add Work Experience Button */}
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
