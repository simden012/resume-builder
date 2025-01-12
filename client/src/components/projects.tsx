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
import { useGlobalState } from "../context/GlobalStateContext";
import { Project } from "../interfaces/types";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

const ProjectsForm = () => {
  const { projects, setProjects } = useGlobalState();
  const addProject = () =>
    setProjects([...projects, { name: "", description: "" }]);

  const handleProjectChange = (
    index: number,
    field: keyof Project, // Ensures field is a valid key in Project
    value: string
  ) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value; // Type-safe access
    setProjects(updatedProjects);
  };
  return (
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
            onChange={(e) => handleProjectChange(index, "name", e.target.value)}
          />
          <TextField
            fullWidth
            label="Project Description"
            variant="outlined"
            margin="normal"
            value={project.description}
            onChange={(e) =>
              handleProjectChange(index, "description", e.target.value)
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
  );
};
export default ProjectsForm;
