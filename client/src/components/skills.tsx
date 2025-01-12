import { Box, Typography, Button, TextField, IconButton } from "@mui/material";
import { useGlobalState } from "../context/GlobalStateContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

const SkillsForm = () => {
  const { skills, setSkills } = useGlobalState();
  const handleChange = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };
  const addSkill = () => setSkills([...skills, ""]);
  return (
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
            onChange={(e) => handleChange(index, e.target.value)}
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
  );
};
export default SkillsForm;
