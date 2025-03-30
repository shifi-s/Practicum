import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Button, Card, CardContent, Typography, Grid2 as Grid, IconButton, Tooltip, Stack, AppBar, Toolbar, Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import SearchSongs from "./searchSongs";
import DeleteSong from "./deleteSong";
import { observer } from "mobx-react-lite";
import songStore from "../stores/songsStore";
import { UserContext } from "./userContext";
import { Add } from "@mui/icons-material";

const Songs = observer(() => {
  const [isSearch, setIsSearch] = useState("")
  const apiUrl = "https://localhost:7265";
  const userContext = useContext(UserContext);
  const { user } = userContext!;
  const navigate = useNavigate();
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});

  useEffect(() => {
    songStore.fetchSongs();
  }, []);
  const handlePlay = (id: number) => {
    Object.entries(audioRefs.current).forEach(([key, audio]) => {
      if (parseInt(key) !== id && audio) {
        audio.pause();
      }
    });
  }
  const searchSongs = async (query: string) => {
    setIsSearch(query)
    if (!query.trim()) {
      songStore.fetchSongs();
      return;
    }
    try {
      const response = await axios.get(apiUrl + `/api/songs/search`, {
        params: { tag: query },
      });
      songStore.songs = response.data;
    } catch (err) {
      console.error("Error searching songs:", err);
      songStore.songs = [];
    }
  };

  return (
    <>

      <Outlet />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} p={2} sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        <SearchSongs onSearch={searchSongs} />
      {  <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={user?.name?() => navigate("/songs/uploadSong"):()=>alert("יש להתחבר כדי להעלות שיר")}
          sx={{ fontSize: "16px", padding: "8px 16px" }}
        >
          העלאת שיר
        </Button>
}
      </Box>
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {songStore.songs.length === 0 ? (isSearch.length > 0 ? (
          <Typography variant="h6" sx={{ color: "red", textAlign: "center", width: "100%" }}>
            ❌ לא נמצאו שירים
          </Typography>
        ) : (<Typography variant="h6" sx={{ color: "red", textAlign: "center", width: "100%" }}>
          ...טוען שירים
        </Typography>)) : (
          songStore.songs.map((song) => (
            <Grid key={song.id} >
              <Card sx={{ p: 2, display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center", width: 250, height: 150 }}>
                <CardContent>
                  <Typography variant="h6" >{song.title} - {song.artist}</Typography>
                  <audio controls style={{
                    width: "220px", marginTop: "10px"
                  }}
                    ref={(el) => { if (el) audioRefs.current[song.id] = el; }}
                    onPlay={() => handlePlay(song.id)}>
                    <source src={song.audioUrl} type="audio/mp3" />
                  </audio>
                  {user?.role == "0" && <DeleteSong id={song.id} />
                  }

                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
}
);
export default Songs;
