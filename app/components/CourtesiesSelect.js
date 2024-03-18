import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { useEffect } from "react";
import { useState } from "react";

export default function CourtesiesSelect({
  selectedCourtesy,
  setSelectedCourtesy,
}) {
  const [courtesies, setCourtesies] = useState([]);

  async function fetchCoutesies() {
    const response = await fetch("/api/listcourtesies");

    const data = await response.json();
    if (response.status === 200 && data && data?.data) {
      setCourtesies(data.data);
    }
  }

  function handleChange(e) {
    setSelectedCourtesy(e.target.value);
  }

  useEffect(() => {
    fetchCoutesies();
  }, []);
  return (
    <FormControl fullWidth required>
      <InputLabel id="demo-simple-select-label">Courtesy To</InputLabel>
      <Select
        fullWidth
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={courtesies?.find((item) => item.courtesyid === selectedCourtesy)}
        label="Courtesy to "
        onChange={handleChange}
      >
        {courtesies?.map((item) => (
          <MenuItem key={item.courtesyid} value={item.courtesyid}>
            {item.courtesyto}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
