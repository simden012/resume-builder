import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import WorkExperienceForm from "../components/workExperience";
import EducationForm from "../components/education";
import SkillsForm from "../components/skills";
import ProjectsForm from "../components/projects";
import { serverLocalUrl } from "../constants/constants";
import { ResumeData, Template } from "../interfaces/interface";
import { useGlobalState } from "../context/GlobalStateContext";
const steps = [
  "Choose Template",
  "Personal Info",
  "Work Experience",
  "Education",
  "Skills",
  "Projects",
  "Finalize",
];

const CreateResume = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const {
    personalInfo,
    workExperiences,
    educations,
    projects,
    skills,
    setPersonalInfo,
  } = useGlobalState();
  const handlePersonnalInfoChange = (field: string, value: string) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      if (canDownloadResume()) {
        handleGenerateResume();
      }
      console.log("Download docx resume");
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  const canDownloadResume = () => {
    return true;
  };
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${serverLocalUrl}/templates`);
        const data = await response.json();
        setTemplates(data.templates);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  const handleGenerateResume = async () => {
    const resumeData: ResumeData = {
      selectedTemplate,
      personalInfo,
      workExperiences,
      educations,
      skills,
      projects,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      });

      const data = await response.json();

      if (response.ok) {
        // Create a download link for the generated resume
        const downloadLink = document.createElement("a");
        downloadLink.href = data.download_url;
        downloadLink.download = "resume.pdf";
        downloadLink.click();
      } else {
        console.error("Failed to generate resume:", data.error);
      }
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };
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

      <Grid
        container
        spacing={4}
        sx={{ minHeight: "100vh", justifyContent: "center" }}
      >
        <Grid sx={{ xs: 12, md: 8, width: "80%" }}>
          <Paper sx={{ p: 4 }}>
            {activeStep === 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Select a Template
                </Typography>
                <Grid container spacing={2}>
                  {templates.map((template) => {
                    const imgPath = `${serverLocalUrl}${template.path}/png/${template.name}.png`;
                    return (
                      <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={template.name}>
                        <Card
                          sx={{
                            height: 500,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            border:
                              selectedTemplate === template.name
                                ? "2px solid #007bff"
                                : "1px solid #ddd",
                            cursor: "pointer",
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                          }}
                          onClick={() => setSelectedTemplate(template.name)}
                        >
                          <CardMedia
                            component="img"
                            sx={{ height: 500, objectFit: "cover" }}
                            image={imgPath}
                            alt={template.name}
                          />
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </>
            )}
            {activeStep === 1 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  margin="normal"
                  value={personalInfo.fullName}
                  onChange={(e) =>
                    handlePersonnalInfoChange("fullName", e.target.value)
                  }
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  margin="normal"
                  value={personalInfo.email}
                  onChange={(e) =>
                    handlePersonnalInfoChange("email", e.target.value)
                  }
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  margin="normal"
                  type="number"
                  value={personalInfo.phone}
                  onChange={(e) =>
                    handlePersonnalInfoChange("phone", e.target.value)
                  }
                />
              </>
            )}
            {activeStep === 2 && <WorkExperienceForm></WorkExperienceForm>}
            {activeStep === 3 && <EducationForm></EducationForm>}
            {activeStep === 4 && <SkillsForm></SkillsForm>}
            {activeStep === 5 && <ProjectsForm></ProjectsForm>}

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
                disabled={activeStep === 0 && !selectedTemplate}
              >
                {activeStep === steps.length - 1
                  ? "Download docx resume"
                  : "Next"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateResume;
