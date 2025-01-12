import { useState } from "react";
import { useGlobalState } from "../context/GlobalStateContext";
import { Project } from "../interfaces/types";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { serverLocalUrl } from "../constants/constants";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
const ProjectsForm = () => {
  const { projects, setProjects } = useGlobalState();
  const addProject = () =>
    setProjects([...projects, { name: "", description: "" }]);

  const handleChange = (index: number, field: keyof Project, value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Projects
      </Typography>
      {projects.map((project, index) => {
        const handleOpenSuggestions = async () => {
          setLoading(true);
          try {
            const response = await fetch(`${serverLocalUrl}/ai-suggestions`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                typeOfSuggestion: "project",
                description: project.description,
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
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
            {/* Description with AI Suggestions */}
            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                margin="normal"
                value={project.description}
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
                  {project.description || "No current description available."}
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
      <Button
        variant="outlined"
        startIcon={<AddCircleOutlineIcon />}
        onClick={addProject}
      >
        Add Project
      </Button>
    </>
  );
};
export default ProjectsForm;
