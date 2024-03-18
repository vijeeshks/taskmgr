import Box from "@mui/material/Box";
import EditNewsCard from "./EditNewsCard";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function EditWrapper({ refreshData, setRefereshData }) {
  const { data: session, status } = useSession();
  const [news, setNews] = useState([]);

  async function fetchNewsEdit() {
    const response = await fetch("/api/listnewsedit");

    const data = await response.json();
    if (response.status === 200 && data && data?.data) {
      setNews(data.data);
    }
  }
  useEffect(() => {
    fetchNewsEdit();
  }, []);

  useEffect(() => {
    if (refreshData) {
      fetchNewsEdit();
      setRefereshData(false);
    }
  }, [refreshData]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxHeight: "90vh",
        overflowY: "auto",
        width: "100%",
      }}
    >
      {news?.map((newsItem) => (
        <EditNewsCard key={newsItem.newsid} newsItem={newsItem}></EditNewsCard>
      ))}
    </Box>
  );
}
