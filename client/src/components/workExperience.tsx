import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { useGlobalState } from "../context/GlobalStateContext";
import { WorkExperience } from "../interfaces/interface";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { serverLocalUrl } from "../constants/constants";
const WorkExperienceForm = () => {
  const { workExperiences, setWorkExperiences } = useGlobalState();

  const handleChange = (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => {
    const updatedExperiences = [...workExperiences];
    updatedExperiences[index][field] = value;
    setWorkExperiences(updatedExperiences);
  };

  const addWorkExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      { jobTitle: "", company: "", duration: "", description: "" },
    ]);
  };
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Work Experience
      </Typography>
      {workExperiences.map((experience, index) => {
        const handleOpenSuggestions = async () => {
          setLoading(true);
          try {
            const response = await fetch(`${serverLocalUrl}/ai-suggestions`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                typeOfSuggestion: "job",
                description: experience.description,
              }),
            });
            const data = await response.json();
            setSuggestions(data.suggestions || []);
            setOpen(true);
          } catch (error) {
            console.error("Error fetching AI suggestions:", error);
          } finally {
            setLoading(false);
          }
        };

        const handleSelectSuggestion = (suggestion: string) => {
          const sliced_suggestion = suggestion.slice(3).trim();
          handleChange(index, "description", sliced_suggestion);
          setOpen(false);
        };

        return (
          <Box key={index} sx={{ mb: 10, position: "relative" }}>
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
              onChange={(e) => handleChange(index, "jobTitle", e.target.value)}
            />

            {/* Company Name */}
            <TextField
              fullWidth
              label="Company Name"
              variant="outlined"
              margin="normal"
              value={experience.company}
              onChange={(e) => handleChange(index, "company", e.target.value)}
            />

            <TextField
              fullWidth
              label="Duration"
              variant="outlined"
              margin="normal"
              value={experience.duration}
              onChange={(e) => handleChange(index, "duration", e.target.value)}
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
                  handleChange(index, "description", e.target.value)
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
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                  color: "#fff",
                  "&:hover": {
                    background: "linear-gradient(to right, #4a00e0, #8e2de2)",
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
              <DialogTitle>AI Suggestions for Job Description</DialogTitle>
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
                        onClick={() => handleSelectSuggestion(suggestion)}
                        sx={{
                          border: "1px solid #ddd",
                          borderRadius: 2,
                          p: 2,
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                        }}
                      >
                        <Typography variant="body2">{suggestion}</Typography>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </DialogContent>

              {/* Actions */}
              <DialogActions>
                <Button onClick={() => setOpen(false)} color="primary">
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
  );
};
export default WorkExperienceForm;
