import { useContext, useEffect, useState } from "react";
import { Typography, Grid2 as Grid, Stack } from "@mui/material";
import { observer } from "mobx-react-lite";
import ShowSongs from "./showSongs";
import songStore from "../stores/songsStore";

const NewSongs = observer(() => {
  
 useEffect(() => {
  songStore.setQuery("new")
 }, []);  
  
    

  return (
    <>
      <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: 2 ,marginTop:"50px" }}>
        <Typography variant="h5" fontWeight={600} color="primary" textAlign="center">
          שירים שהועלו לאחרונה
        </Typography>
      </Stack>
      <Grid container spacing={3} justifyContent="center">
        {songStore.filteredSongs.length === 0 ? (
          <Typography variant="h6" sx={{ color: "#d32f2f", textAlign: "center", width: "100%", fontWeight: 500 }}>
            לא נמצאו שירים חדשים
          </Typography>
        ) : (
          <ShowSongs  />
        )}
      </Grid>
    </>
  );
});

export default NewSongs;
