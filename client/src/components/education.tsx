import { Box, Typography, Button, TextField, IconButton } from "@mui/material";
import { useGlobalState } from "../context/GlobalStateContext";
import { Education } from "../interfaces/interface";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

const EducationForm = () => {
  const { educations, setEducations } = useGlobalState();

  const handleChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updatedEducations = [...educations];
    updatedEducations[index][field] = value;
    setEducations(updatedEducations);
  };

  const addEducation = () =>
    setEducations([...educations, { degree: "", institution: "", year: "" }]);
  return (
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
            onChange={(e) => handleChange(index, "degree", e.target.value)}
          />
          <TextField
            fullWidth
            label="Institution"
            variant="outlined"
            margin="normal"
            value={education.institution}
            onChange={(e) => handleChange(index, "institution", e.target.value)}
          />
          <TextField
            fullWidth
            label="Year of Graduation"
            variant="outlined"
            margin="normal"
            value={education.year}
            onChange={(e) => handleChange(index, "year", e.target.value)}
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
  );
};
export default EducationForm;
