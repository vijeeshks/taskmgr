import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function EditNewsCard({ newsItem }) {
  const [imageFile, setImageFile] = useState("");
  const fetchImage = useCallback(async () => {
    const response = await fetch(`/api/listprimaryimage`, {
      method: "POST",
      body: JSON.stringify({
        imagename: newsItem.imageurl,
      }),
    });
    if (response.status === 200) {
      const data = await response.json();
      setImageFile(data?.data);
    }
  }, [newsItem.imageurl]);
  useEffect(() => {
    if (newsItem && newsItem.imageurl) {
      fetchImage();
    }
  }, [newsItem, fetchImage]);

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        padding: "5px",
        margin: "10px",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "70px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box>{newsItem.title}</Box>
        <Box>{newsItem.description}</Box>
      </Box>
      <Box>
        {newsItem?.imageurl && imageFile && (
          <Image
            alt={"image"}
            height={50}
            width={50}
            // src={`data:image/jpg;base64,${arrayBufferToBase64(imageFile)}`}
            src={imageFile}
          ></Image>
        )}
      </Box>
    </Paper>
  );
}
