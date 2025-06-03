
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItemText,
  TextField,
  Typography,
  Box,
  Stack,
  Tooltip,
  ListItem,
  Paper,
  Slide,
  Fab,
  Avatar,
  Divider,
  InputAdornment,
  Fade,
  Chip,
} from "@mui/material"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import ReplayIcon from "@mui/icons-material/Replay"
import SearchIcon from "@mui/icons-material/Search"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay"
import HeadphonesIcon from "@mui/icons-material/Headphones"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

// Define Song interface
interface Song {
  id: number
  title: string
  artist: string
  audioUrl: string
}

export default function PlaylistSongs() {
  const { id } = useParams<{ id: string }>()
  const [songs, setSongs] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [allSongs, setAllSongs] = useState<Song[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loopPlaylist, setLoopPlaylist] = useState(false)
  const [playlistName, setPlaylistName] = useState("")
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [songToDelete, setSongToDelete] = useState<string | null>(null)

  const apiUrl = "https://localhost:7265"
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentSongRef = useRef<HTMLDivElement | null>(null)

  // Load playlist data
  useEffect(() => {
    if (!id) return

    // Load playlist songs
    axios
      .get(`${apiUrl}/api/playlists/${id}/songs`)
      .then((res) => setSongs(res.data))
      .catch((err) => console.error("שגיאה בטעינת שירים:", err))

    // Load playlist details
    axios
      .get(`${apiUrl}/api/playlists/${id}`)
      .then((res) => setPlaylistName(res.data.name))
      .catch((err) => console.error("שגיאה בטעינת פרטי פלייליסט:", err))
  }, [id])

  // Open delete confirmation dialog
  const openDeleteConfirmation = (songId: string) => {
    setSongToDelete(songId)
    setOpenDeleteDialog(true)
  }

  // Confirm song deletion
  const confirmDelete = () => {
    if (!songToDelete || !id) return

    axios
      .delete(`${apiUrl}/api/playlists/${id}/removeSong/${songToDelete}`)
      .then(() => {
        setSongs((prev) => prev.filter((song) => song.id !== Number(songToDelete)))

        // Update current index if current song is deleted
        if (currentIndex !== null && songs[currentIndex]?.id === Number(songToDelete)) {
          if (songs.length <= 1) {
            setCurrentIndex(null)
          } else if (currentIndex >= songs.length - 1) {
            setCurrentIndex(songs.length - 2)
          }
        }

        setOpenDeleteDialog(false)
        setSongToDelete(null)
      })
      .catch((err) => console.error("שגיאה במחיקת שיר:", err))
  }

  // Open add song dialog
  const openAddSongDialog = () => {
    axios
      .get(`${apiUrl}/api/songs`)
      .then((res) => setAllSongs(res.data))
      .catch((err) => console.error("שגיאה בטעינת שירים כלליים:", err))
    setOpenDialog(true)
  }

  // Add song to playlist
  const handleAddSong = (songId: string) => {
    if (!id) return

    axios
      .post(`${apiUrl}/api/playlists/${id}/addSong`, songId, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        const addedSong = allSongs.find((s) => String(s.id) === songId)
        if (addedSong) setSongs((prev) => [...prev, addedSong])
        setOpenDialog(false)
      })
      .catch((err) => console.error("שגיאה בהוספת שיר:", err))
  }

  // Play next song
  const handleNext = () => {
    if (currentIndex !== null) {
      if (currentIndex < songs.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else if (loopPlaylist) {
        setCurrentIndex(0)
      }
    }
  }

  // Play previous song
  const handlePrevious = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  // Toggle play/pause
  const togglePlayPause = (index: number) => {
    const audio = audioRef.current

    if (currentIndex === index) {
      if (audio) {
        if (audio.paused) {
          audio.play()
          setIsPlaying(true)
        } else {
          audio.pause()
          setIsPlaying(false)
        }
      }
    } else {
      setCurrentIndex(index)
      setIsPlaying(true)
    }
  }

  // Scroll to current song
  useEffect(() => {
    if (currentIndex !== null && currentSongRef.current) {
      currentSongRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [currentIndex])

  // Handle audio playback
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.loop = false

    if (currentIndex !== null) {
      setIsPlaying(true)
      audio.play().catch((err) => {
        console.error("שגיאה בהפעלת השיר:", err)
        setIsPlaying(false)
      })
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      handleNext()
    }

    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentIndex, songs.length, loopPlaylist])

  // Get total songs info
  const getTotalSongsInfo = () => {
    return {
      count: songs.length,
      text: `${songs.length} שירים בפלייליסט`,
    }
  }

  const getSongColor = (index: number) => {
    return index % 2 === 0 ? "#ffffff" : "#fafafa"
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 4 }, py: 3 }}>
      {/* כותרת ומידע על הפלייליסט */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #1976d2, #64b5f6)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 150,
            height: 150,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.1)",
            zIndex: 0,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: "rgba(255,255,255,0.2)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            <PlaylistPlayIcon sx={{ fontSize: 40 }} />
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
              {playlistName || "פלייליסט"}
            </Typography>

            <Chip
              size="small"
              icon={<MusicNoteIcon sx={{ color: "white !important" }} />}
              label={getTotalSongsInfo().text}
              sx={{
                bgcolor: "rgba(255,255,255,0.15)",
                color: "white",
                border: "none",
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* רשימת שירים */}
      {songs.length > 0 ? (
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          <List sx={{ width: "100%", p: 0 }}>
            {songs.map((song, index) => (
              <Fade key={song.id} in={true} timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                <Box>
                  <Box
                    ref={currentIndex === index ? currentSongRef : null}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      backgroundColor:
                        currentIndex === index
                          ? "linear-gradient(to right, rgba(25, 118, 210, 0.1), rgba(100, 181, 246, 0.1))"
                          : getSongColor(index),
                      px: 2,
                      py: 1.5,
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        backgroundColor:
                          currentIndex === index
                            ? "linear-gradient(to right, rgba(25, 118, 210, 0.15), rgba(100, 181, 246, 0.15))"
                            : "rgba(0, 0, 0, 0.03)",
                      },
                    }}
                  >
                    {currentIndex === index && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: 4,
                          height: "100%",
                          bgcolor: "#1976d2",
                        }}
                      />
                    )}

                    <Box display="flex" alignItems="center" gap={2} flex={1}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: currentIndex === index ? "#bbdefb" : "#e0e0e0",
                        }}
                      >
                        <MusicNoteIcon color={currentIndex === index ? "primary" : "action"} />
                      </Avatar>

                      <Box>
                        <Typography
                          fontWeight={currentIndex === index ? 600 : 500}
                          color={currentIndex === index ? "primary" : "textPrimary"}
                        >
                          {song.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {song.artist}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Tooltip title={currentIndex === index && isPlaying ? "השהה" : "נגן"}>
                        <IconButton
                          onClick={() => togglePlayPause(index)}
                          sx={{
                            bgcolor: currentIndex === index && isPlaying ? "rgba(25, 118, 210, 0.1)" : "transparent",
                            "&:hover": {
                              bgcolor:
                                currentIndex === index && isPlaying ? "rgba(25, 118, 210, 0.2)" : "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          {currentIndex === index && isPlaying ? (
                            <PauseIcon color="primary" />
                          ) : (
                            <PlayArrowIcon color={currentIndex === index ? "primary" : "action"} />
                          )}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="מחק מהפלייליסט">
                        <IconButton
                          onClick={() => openDeleteConfirmation(String(song.id))}
                          sx={{
                            "&:hover": {
                              color: "#f44336",
                              bgcolor: "rgba(244, 67, 54, 0.08)",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  {index < songs.length - 1 && <Divider />}
                </Box>
              </Fade>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper
          elevation={2}
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "#f9f9f9",
          }}
        >
          <HeadphonesIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
          <Typography variant="h6" gutterBottom color="text.secondary">
            הפלייליסט ריק
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            הוסף שירים לפלייליסט כדי להתחיל להאזין
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddSongDialog}
            size="large"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              background: "linear-gradient(135deg, #1976d2, #64b5f6)",
              boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                background: "linear-gradient(135deg, #1565c0, #42a5f5)",
              },
            }}
          >
            הוסף שיר
          </Button>
        </Paper>
      )}

      {/* נגן שיר נוכחי */}
      {currentIndex !== null && songs[currentIndex] && (
        <Slide direction="up" in={currentIndex !== null} mountOnEnter unmountOnExit>
          <Paper
            elevation={4}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #fafafa, #f5f5f5)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: "#bbdefb",
                }}
              >
                <MusicNoteIcon color="primary" fontSize="large" />
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {songs[currentIndex].title}
                </Typography>
                <Typography variant="subtitle1">{songs[currentIndex].artist}</Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center" mt={3}>
              <Tooltip title="שיר קודם">
                <span>
                  <IconButton
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    sx={{
                      bgcolor: "rgba(0, 0, 0, 0.03)",
                      "&:hover": {
                        bgcolor: "rgba(0, 0, 0, 0.08)",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <audio
                ref={audioRef}
                controls
                src={songs[currentIndex].audioUrl}
                style={{
                  flex: 1,
                  borderRadius: "8px",
                  height: "40px",
                }}
              />

              <Tooltip title="שיר הבא">
                <span>
                  <IconButton
                    onClick={handleNext}
                    disabled={!loopPlaylist && currentIndex === songs.length - 1}
                    sx={{
                      bgcolor: "rgba(0, 0, 0, 0.03)",
                      "&:hover": {
                        bgcolor: "rgba(0, 0, 0, 0.08)",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title={loopPlaylist ? "השמעה חוזרת פעילה" : "השמעה חוזרת כבויה"}>
                <IconButton
                  onClick={() => setLoopPlaylist((prev) => !prev)}
                  sx={{
                    bgcolor: loopPlaylist ? "rgba(25, 118, 210, 0.1)" : "rgba(0, 0, 0, 0.03)",
                    "&:hover": {
                      bgcolor: loopPlaylist ? "rgba(25, 118, 210, 0.15)" : "rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  <ReplayIcon color={loopPlaylist ? "primary" : "action"} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>
        </Slide>
      )}

      {/* כפתור פעולה בזמן השמעה */}
      {currentIndex === null && songs.length > 0 && (
        <Box position="relative" mt={3} mb={4} sx={{ display: "flex", justifyContent: "center" }}>
          <Fab
            color="primary"
            aria-label="add"
            onClick={openAddSongDialog}
            sx={{
              background: "linear-gradient(135deg, #1976d2, #64b5f6)",
              boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
              },
            }}
          >
            <AddIcon />
          </Fab>
        </Box>
      )}

      {/* מודל הוספת שיר */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            py: 2,
          }}
        >
          בחר שיר להוספה
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <TextField
            fullWidth
            label="חיפוש שיר"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Paper
            variant="outlined"
            sx={{
              maxHeight: 350,
              overflow: "auto",
              borderRadius: 2,
              borderColor: "#e0e0e0",
            }}
          >
            <List dense>
              {allSongs
                .filter(
                  (s) =>
                    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.artist.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((song, index) => (
                  <Box key={song.id}>
                    <ListItem
                      sx={{
                        py: 1,
                        bgcolor: index % 2 === 0 ? "#fafafa" : "#ffffff",
                      }}
                      secondaryAction={
                        <Tooltip title="הוסף לפלייליסט">
                          <IconButton
                            onClick={() => handleAddSong(String(song.id))}
                            color="primary"
                            sx={{
                              bgcolor: "rgba(25, 118, 210, 0.05)",
                              "&:hover": {
                                bgcolor: "rgba(25, 118, 210, 0.15)",
                              },
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={500}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <MusicNoteIcon fontSize="small" color="action" />
                            {song.title}
                          </Typography>
                        }
                        secondary={song.artist}
                      />
                    </ListItem>
                    {index < allSongs.length - 1 && <Divider />}
                  </Box>
                ))}

              {allSongs.filter(
                (s) =>
                  s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  s.artist.toLowerCase().includes(searchTerm.toLowerCase()),
              ).length === 0 && (
                <Box py={4} textAlign="center">
                  <SearchIcon sx={{ fontSize: 40, color: "#bdbdbd", mb: 1 }} />
                  <Typography color="text.secondary">לא נמצאו תוצאות חיפוש</Typography>
                </Box>
              )}
            </List>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
            }}
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>

      {/* מודל אישור מחיקה */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#f44336",
            color: "white",
            py: 2,
          }}
        >
          אישור מחיקה
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Typography>האם אתה בטוח שברצונך למחוק את השיר מהפלייליסט?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            פעולה זו לא ניתנת לביטול לאחר אישור.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
            }}
          >
            ביטול
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              px: 3,
              ml: 1,
            }}
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
