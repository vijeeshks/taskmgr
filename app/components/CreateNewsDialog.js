import Box from "@mui/material/Button";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import CourtesiesSelect from "./CourtesiesSelect";
import CategorySelect from "./CategorySelect";
import Grid from "@mui/material/Grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";

export default function CreateNewsDialog({ open, setOpen, setRefreshData }) {
  const [selectedCourtesy, setSelectedCourtesy] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState(10);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [referenceno, setReferenceno] = useState("");
  const [tags, setTags] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [newsId, setNewsId] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  function clearInputs() {
    setTitle("");
    setDescription("");
    setReferenceno("");
    setTags("");
    setSelectedImage(null);
  }
  async function uploadBinaryImage(file, newsid) {
    const binaryData = await toBase64(file);

    const imgUploadRes = await fetch(
      `/api/uploadprimaryimage?newsid=${newsid}&filename=${file.name}`,
      {
        method: "POST",
        body: JSON.stringify(binaryData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setRefreshData(true);
    clearInputs();
    setOpen(false);
  }

  async function handleCreateNews(e) {
    e.preventDefault();
    try {
      const response = await fetch("/api/createnews", {
        method: "POST",
        headers: new Headers({
          "Content-type": "application/json",
        }),
        body: JSON.stringify({
          categoryid: selectedCategory,
          courtesyid: selectedCourtesy,
          title,
          tags,
          description,
          referenceno,
        }),
      });
      const data = await response.json();
      if (data?.data) {
        // alert news created successfully
        if (selectedImage) {
          // alert uploading primary image.
          uploadBinaryImage(selectedImage, data.data);
          // uploadImage(data.data, selectedImage, "uploadprimaryimage");
        }
      } else {
        // alert error in news creation
        //
      }
    } catch (e) {}
  }

  return (
    <>
      <Dialog
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "1000px", // Set your width here
            },
          },
        }}
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
        }}
      >
        <DialogTitle>Create News Thread</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can create a news using following options...
          </DialogContentText>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <CourtesiesSelect
                  selectedCourtesy={selectedCourtesy}
                  setSelectedCourtesy={setSelectedCourtesy}
                ></CourtesiesSelect>
              </Grid>
              <Grid item xs={12} md={6}>
                <CategorySelect
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                ></CategorySelect>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {selectedImage && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Image
                      alt="not found"
                      width={100}
                      height={100}
                      src={URL.createObjectURL(selectedImage)}
                    />
                    <br />
                    <button onClick={() => setSelectedImage(null)}>
                      Remove
                    </button>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload primary image
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Reference No"
                  value={referenceno}
                  onChange={(e) => setReferenceno(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleCreateNews}>
            Create News
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
