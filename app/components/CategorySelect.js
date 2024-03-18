import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { useEffect } from "react";
import { useState } from "react";

export default function CategorySelect({
  selectedCategory,
  setSelectedCategory,
}) {
  const [categories, setCategories] = useState([]);

  async function fetchCategories() {
    const response = await fetch("/api/listcategories");

    const data = await response.json();
    if (response.status === 200 && data && data?.data) {
      setCategories(data.data);
    }
  }

  function handleChange(e) {
    setSelectedCategory(e.target.value);
  }

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <FormControl fullWidth required>
      <InputLabel id="demo-simple-select-label">category</InputLabel>
      <Select
        fullWidth
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={categories?.find((item) => item.categoryid === selectedCategory)}
        label="category"
        onChange={handleChange}
      >
        {categories?.map((item) => (
          <MenuItem key={item.categoryid} value={item.categoryid}>
            {item.category}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
