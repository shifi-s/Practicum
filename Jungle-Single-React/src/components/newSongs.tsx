import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid2 as Grid, Stack, Button } from "@mui/material";
import songStore from "../stores/songsStore";
import { Song } from "../models/Song";
import { observer } from "mobx-react-lite";

const NewSongs = observer(() => {
  const [newSongs, setNewSongs] = useState<Song[]>([]);
  const apiUrl = "https://localhost:7265";

  // שליפת השירים החדשים מה-API
  useEffect(() => {
    const getNewSongs = () => {
      const start = Math.max(0, songStore.songs.length - 5);  // מתחילים מהשיר ה-5 לפני האחרון
      const end = songStore.songs.length;  // עד השיר האחרון
      setNewSongs(songStore.songs.slice(start, end).reverse());
    };
    getNewSongs();
  }, []);


  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">שירים שהועלו לאחרונה </Typography>
      </Stack>
      <Grid container spacing={3}>
        {newSongs.length === 0 ? (
          <Typography variant="h6" sx={{ color: "red", textAlign: "center", width: "100%" }}>
            ❌ לא נמצאו שירים חדשים
          </Typography>
        ) : (
          newSongs.map((song) => (
             <Grid key={song.id}>
                  <Card sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center",minWidth: 200  }}>
                    <CardContent>
                      <Typography variant="h6">{song.title} - {song.artist}</Typography>
                      <audio controls style={{ width: "220px", marginTop: "10px" }}>
                      
                        <source src={apiUrl + song.audioUrl} type="audio/mp3" />
                      </audio>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
})

export default NewSongs;
