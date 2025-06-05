import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
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
  Card,
  CardContent,
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
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"

// Define Song interface
interface Song {
  id: number
  title: string
  artist: string
  audioUrl: string
}

export default function PlaylistSongs() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
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

  const apiUrl = import.meta.env.VITE_API_URL
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentSongRef = useRef<HTMLDivElement | null>(null)

  // Navigate back to playlists
  const handleBackToPlaylists = () => {
    navigate('/myPlaylists')
  }

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

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 4 }, py: 3, pt: 12 }}>
      
      {/* כפתור חזרה */}
      <Box sx={{ mb: 3, position:"fixed", top: 120, right: 30 }}>
      <Tooltip title={"חזרה לפלייליסטים"}><IconButton
          onClick={handleBackToPlaylists}
          
          sx={{
            color: '#667eea',
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            py: 1,
            border: '1px solid rgba(102, 126, 234, 0.2)',
            background: 'rgba(102, 126, 234, 0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(102, 126, 234, 0.1)',
              borderColor: '#667eea',
              transform: 'translateX(4px)'
            }
          }}
        >
     
          <KeyboardArrowRightIcon />
       
    
        </IconButton>
        </Tooltip>
      </Box>

      {/* כותרת ומידע על הפלייליסט */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea, #764ba2)",
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

      {/* רשימת שירים בגריד */}
      {songs.length > 0 ? (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          }}
          gap={2.5}
          mb={4}
        >
          {songs.map((song, index) => (
            <Fade key={song.id} in={true} timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
              <Card
                ref={currentIndex === index ? currentSongRef : null}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: 160,
                  position: 'relative',
                  boxShadow: currentIndex === index 
                    ? '0px 10px 25px rgba(102, 126, 234, 0.3)' 
                    : '0px 4px 15px rgba(0, 0, 0, 0.1)',
                  transform: currentIndex === index ? 'translateY(-4px) scale(1.02)' : 'translateY(0)',
                  border: currentIndex === index ? '2px solid #667eea' : '2px solid transparent',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 8px 20px rgba(102, 126, 234, 0.2)',
                  }
                }}
                onClick={() => togglePlayPause(index)}
              >
                <CardContent sx={{ 
                  p: 3,
                  display: 'flex', 
                  flexDirection: 'column',
                  height: '100%',
                  position: 'relative',
                  background: currentIndex === index 
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))'
                    : 'linear-gradient(135deg, #ffffff, #f5f8ff)',
                  direction: 'rtl',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  {/* אייקון נגינה במרכז */}
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: currentIndex === index && isPlaying
                        ? 'linear-gradient(135deg, #667eea, #764ba2)'
                        : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                      color: currentIndex === index && isPlaying ? 'white' : '#667eea',
                      boxShadow: '0 4px 10px rgba(102, 126, 234, 0.2)',
                      mb: 2,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {currentIndex === index && isPlaying ? (
                      <PauseIcon sx={{ fontSize: 28 }} />
                    ) : (
                      <PlayArrowIcon sx={{ fontSize: 28 }} />
                    )}
                  </Box>
                  
                  {/* שם השיר */}
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '1rem',
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      textAlign: 'center',
                      width: '100%',
                      mb: 0.5,
                      minHeight: '2.4em',
                      color: currentIndex === index ? '#667eea' : 'inherit'
                    }}
                  >
                    {song.title}
                  </Typography>
                  
                  {/* שם האמן */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.875rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                      textAlign: 'center'
                    }}
                  >
                    {song.artist}
                  </Typography>

                  {/* כפתור מחיקה */}
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteConfirmation(String(song.id));
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 32,
                      height: 32,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      opacity: 0.7,
                      transition: 'opacity 0.2s ease',
                      '&:hover': {
                        opacity: 1,
                        backgroundColor: '#ffebee',
                        color: '#f44336'
                      }
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Box>
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
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                background: "linear-gradient(135deg, #5a6fd8, #6a4190)",
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
                  bgcolor: "rgba(102, 126, 234, 0.2)",
                }}
              >
                <MusicNoteIcon sx={{ color: "#667eea" }} fontSize="large" />
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#667eea" }}>
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
                    bgcolor: loopPlaylist ? "rgba(102, 126, 234, 0.1)" : "rgba(0, 0, 0, 0.03)",
                    "&:hover": {
                      bgcolor: loopPlaylist ? "rgba(102, 126, 234, 0.15)" : "rgba(0, 0, 0, 0.08)",
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

      {/* כפתור הוספת שיר */}
      {currentIndex === null && songs.length > 0 && (
        <Box position="relative" mt={3} mb={4} sx={{ display: "flex", justifyContent: "center" }}>
          <Fab
            color="primary"
            aria-label="add"
            onClick={openAddSongDialog}
            sx={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8, #6a4190)",
                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
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
            background: "linear-gradient(135deg, #667eea, #764ba2)",
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
                            sx={{
                              color: "#667eea",
                              bgcolor: "rgba(102, 126, 234, 0.05)",
                              "&:hover": {
                                bgcolor: "rgba(102, 126, 234, 0.15)",
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