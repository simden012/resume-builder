import { Box, Typography, Button, TextField, IconButton } from "@mui/material";
import { useGlobalState } from "../context/GlobalStateContext";
import { Project } from "../interfaces/types";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

const ProjectsForm = () => {
  const { projects, setProjects } = useGlobalState();
  const addProject = () =>
    setProjects([...projects, { name: "", description: "" }]);

  const handleProjectChange = (
    index: number,
    field: keyof Project,
    value: string
  ) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
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
