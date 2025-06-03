import { useContext, useRef, useState, useEffect } from "react";
import DeleteSong from "./deleteSong";
import { 
  Card, 
  CardContent, 
  Typography, 
  CardMedia, 
  Box, 
  Chip, 
  IconButton, 
  Tooltip, 
  Button, 
  CircularProgress, 
  Modal, 
  Paper, 
  Fade,
  LinearProgress,
  Slide
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import DownloadIcon from "@mui/icons-material/Download";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RepeatIcon from "@mui/icons-material/Repeat";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { UserContext } from "./userContext";
import { Song } from "../models/Song";
import songStore from "../stores/songsStore";
import { observer } from "mobx-react-lite";
import { PlayIcon } from "lucide-react";

const DEFAULT_COVER = "/default-cover.png";

// Media Player Component
const MediaPlayer = ({ 
  song, 
  isPlaying, 
  progress = 0, 
  currentTime = '0:00', 
  totalTime = '0:00',
  onPlayPause,
  onNext,
  onPrevious,
  onClose
}: {
  song: Song | null;
  isPlaying: boolean;
  progress?: number;
  currentTime?: string;
  totalTime?: string;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}) => {
  if (!song) return null;

  return (
    <Slide direction="up" in={!!song} mountOnEnter unmountOnExit>
      <Card
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          borderRadius: '16px 16px 0 0',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderBottom: 'none',
          overflow: 'visible'
        }}
      >
        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 4,
            borderRadius: 0,
            backgroundColor: 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 0
            }
          }}
        />

        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            
            {/* Left Side - Song Info & Now Playing */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              minWidth: 0, 
              flex: 1 
            }}>
              {/* Album Art */}
              <Box
                component="img"
                src={song.coverUrl || DEFAULT_COVER}
                alt={song.title}
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  objectFit: 'cover',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  animation: isPlaying ? 'subtle-pulse 2s ease-in-out infinite' : 'none',
                  '@keyframes subtle-pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.02)' }
                  }
                }}
              />

              {/* Song Info */}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography 
                  variant="h6" 
                  fontWeight={700}
                  sx={{ 
                    fontSize: '1rem',
                    color: '#333',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mb: 0.3
                  }}
                >
                  {song.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  fontWeight={500}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mb: 0.5
                  }}
                >
                  {song.artist}
                </Typography>

                {/* Live Indicator & Time */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 

                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {currentTime}
                  </Typography>
                  <Box sx={{ 
                    width: 2, 
                    height: 2, 
                    borderRadius: '50%', 
                    bgcolor: 'text.secondary',
                    opacity: 0.5
                  }} />
                  <Typography variant="caption" color="text.secondary">
                    {totalTime}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Center - Main Controls */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              justifyContent: 'center',
              flex: 0.5
            }}>
              <IconButton 
                onClick={onPrevious}
                sx={{ 
                  color: '#666',
                  '&:hover': { 
                    color: '#333',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)' 
                  }
                }}
              >
                <SkipPreviousIcon />
              </IconButton>

              <IconButton
                onClick={onPlayPause}
                sx={{
                  width: 50,
                  height: 50,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>

              <IconButton 
                onClick={onNext}
                sx={{ 
                  color: '#666',
                  '&:hover': { 
                    color: '#333',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)' 
                  }
                }}
              >
                <SkipNextIcon />
              </IconButton>
            </Box>

            {/* Right Side - Secondary Controls */}
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flex: 1,
              justifyContent: 'flex-end'
            }}>
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                alignItems: 'center', 
                gap: 0.5 
              }}>
                <IconButton size="small" sx={{ color: '#666' }}>
                  <ShuffleIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: '#666' }}>
                  <RepeatIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: '#666' }}>
                  <QueueMusicIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: '#666' }}>
                  <VolumeUpIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: '#666' }}>
                  <FavoriteIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: '#666' }}>
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Close Button */}
              <IconButton 
                onClick={onClose}
                size="small" 
                sx={{ 
                  color: '#666',
                  ml: 1,
                  '&:hover': { 
                    color: '#f44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)' 
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Slide>
  );
};

const ShowSongs = observer(() => {
  const songs = songStore.filteredSongs;
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const userContext = useContext(UserContext);
  const { user } = userContext!;
  
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoverId, setHoverId] = useState<number | null>(null);
  const [lyricsMap, setLyricsMap] = useState<{ [id: number]: string }>({});
  const [loadingLyricsId, setLoadingLyricsId] = useState<number | null>(null);
  const [lyricsModalOpen, setLyricsModalOpen] = useState(false);
  const [currentLyricsSong, setCurrentLyricsSong] = useState<Song | null>(null);
  const [audioProgress, setAudioProgress] = useState<{ [key: number]: number }>({});

  // Media Player Helper Functions
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTime = () => {
    if (playingId && audioRefs.current[playingId]) {
      return formatTime(audioRefs.current[playingId].currentTime);
    }
    return '0:00';
  };

  const getTotalTime = () => {
    if (playingId && audioRefs.current[playingId]) {
      return formatTime(audioRefs.current[playingId].duration);
    }
    return '0:00';
  };

  const handleMediaPlayerPlayPause = () => {
    if (playingId && audioRefs.current[playingId]) {
      const audio = audioRefs.current[playingId];
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  };

  const handleNext = () => {
    if (!playingId) return;
    const currentIndex = songs.findIndex(song => song.id === playingId);
    const nextIndex = (currentIndex + 1) % songs.length;
    handleStartPlaying(songs[nextIndex].id);
  };

  const handlePrevious = () => {
    if (!playingId) return;
    const currentIndex = songs.findIndex(song => song.id === playingId);
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    handleStartPlaying(songs[prevIndex].id);
  };

  const handleCloseMediaPlayer = () => {
    if (playingId && audioRefs.current[playingId]) {
      audioRefs.current[playingId].pause();
      audioRefs.current[playingId].currentTime = 0;
    }
    setPlayingId(null);
    setIsPlaying(false);
    setAudioProgress(prev => ({ ...prev, [playingId!]: 0 }));
  };

  // פונקציה להתחלת נגינה (רק כשהשיר לא נגן)
  const handleStartPlaying = async (id: number) => {
    const audio = audioRefs.current[id];
    if (!audio || playingId === id) return;

    // עצור את כל השירים האחרים
    Object.entries(audioRefs.current).forEach(([key, audioElement]) => {
      if (audioElement && parseInt(key) !== id) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    });
    
    // התחל את השיר החדש
    setPlayingId(id);
    setIsPlaying(true);
    audio.currentTime = 0;
    
    try {
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // מאזיני אירועים לאודיו - רק לעדכון UI
  useEffect(() => {
    const updateProgress = () => {
      if (playingId && audioRefs.current[playingId]) {
        const audio = audioRefs.current[playingId];
        if (audio && !audio.paused) {
          const progress = (audio.currentTime / audio.duration) * 100;
          setAudioProgress(prev => ({
            ...prev,
            [playingId]: progress || 0
          }));
        }
      }
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [playingId]);

  // גלילה לשיר הנגן
  useEffect(() => {
    if (playingId && cardsContainerRef.current) {
      const playingCard = document.getElementById(`song-card-${playingId}`);
      if (playingCard) {
        setTimeout(() => {
          playingCard.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }, 100);
      }
    }
  }, [playingId]);

  const fetchLyrics = async (song: Song) => {
    if (lyricsMap[song.id]) {
      setCurrentLyricsSong(song);
      setLyricsModalOpen(true);
      return;
    }
    
    try {
      setLoadingLyricsId(song.id);
      const res = await fetch("https://localhost:7265/api/Ai/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(song.audioUrl)
      });
      const text = await res.text();
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLyricsMap(prev => ({ ...prev, [song.id]: text }));
      setCurrentLyricsSong(song);
      setLyricsModalOpen(true);
    } catch (err) {
      setLyricsMap(prev => ({ 
        ...prev, 
        [song.id]: "שגיאה בשליפת מילות השיר. בינה המלאכותית לא הצליחה לפענח את הטקסט." 
      }));
      setCurrentLyricsSong(song);
      setLyricsModalOpen(true);
    } finally {
      setLoadingLyricsId(null);
    }
  };

  const handleDownload = (song: Song) => {
    const link = document.createElement('a');
    link.href = song.audioUrl;
    link.download = `${song.title} - ${song.artist}.mp3`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadLyrics = (song: Song) => {
    if (!lyricsMap[song.id]) return;
    
    const lyrics = lyricsMap[song.id];
    const blob = new Blob([lyrics], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${song.title} - ${song.artist} - מילים.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const closeLyricsModal = () => {
    setLyricsModalOpen(false);
    setCurrentLyricsSong(null);
  };

  // סידור השירים עם השיר הנגן למעלה
  

  return (
    <>
      <Box
        ref={cardsContainerRef}
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)'
          },
          gap: { xs: 1.5, sm: 2, md: 2.5, lg: 2 },
          mx: { xs: 1, sm: 1.5, md: 2, lg: 2 },
          my: 2,
          minHeight: '60vh',
          paddingBottom: playingId ? '140px' : '20px', // Space for media player
        }}
      >
        {/* מודל מילות השיר */}
        <Modal
          open={lyricsModalOpen}
          onClose={closeLyricsModal}
          closeAfterTransition
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <Fade in={lyricsModalOpen}>
            <Paper 
              sx={{
                bgcolor: '#fff',
                borderRadius: 3,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                p: 0,
                width: { xs: '95%', sm: '85%', md: '75%', lg: '60%' },
                maxWidth: 800,
                maxHeight: '90vh',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {currentLyricsSong && (
                <>
                  <Box 
                    sx={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      py: 3,
                      px: 4,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <SmartToyIcon sx={{ fontSize: 28 }} />
                      <Box>
                        <Typography variant="h5" component="h2" fontWeight={600}>
                          מילות השיר ״{currentLyricsSong.title}״
                        </Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 0.5 }}>
                          מזוהות בסיוע בינה מלאכותית
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="הורד מילות השיר">
                        <IconButton 
                          onClick={() => downloadLyrics(currentLyricsSong)}
                          sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="סגור">
                        <IconButton 
                          onClick={closeLyricsModal}
                          sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box 
                    sx={{ 
                      p: 4,
                      height: { xs: '50vh', sm: '60vh' },
                      maxHeight: 'calc(90vh - 100px)',
                      overflowY: 'auto',
                      direction: 'rtl',
                      bgcolor: '#fafafa',
                      '&::-webkit-scrollbar': { width: '8px' },
                      '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '4px' },
                      '&::-webkit-scrollbar-thumb': { 
                        backgroundColor: '#c1c1c1', 
                        borderRadius: '4px',
                        '&:hover': { backgroundColor: '#a8a8a8' }
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
                      <Box 
                        component="img" 
                        src={currentLyricsSong.coverUrl || DEFAULT_COVER} 
                        alt={`כריכה של ${currentLyricsSong.title}`}
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          borderRadius: 2,
                          objectFit: 'cover',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight={700} color="#333">
                          {currentLyricsSong.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight={500}>
                          {currentLyricsSong.artist}
                        </Typography>
                      </Box>
                    </Box>

                    <Paper 
                      elevation={1}
                      sx={{ 
                        p: 3, 
                        bgcolor: '#fff', 
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          whiteSpace: 'pre-line',
                          lineHeight: 2,
                          textAlign: 'right',
                          fontFamily: 'Assistant, Roboto, sans-serif',
                          fontSize: '1.1rem',
                          color: '#333'
                        }}
                      >
                        {lyricsMap[currentLyricsSong.id]}
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}
            </Paper>
          </Fade>
        </Modal>

        {songs.map((song) => {
          const isCurrentlyPlaying = playingId === song.id;
          const isCurrentlyPlayingAndActive = isCurrentlyPlaying && isPlaying;
          
          return (
            <Card
              id={`song-card-${song.id}`}
              key={song.id}
              onMouseEnter={() => setHoverId(song.id)}
              onMouseLeave={() => setHoverId(null)}
              sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                borderRadius: 3,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow:
                 "0 4px 20px rgba(0, 0, 0, 0.08)",
                backgroundColor: '#fff',
                transform: isCurrentlyPlaying 
                  ? 'scale(1.02)' 
                  : hoverId === song.id 
                    ? 'translateY(-8px)' 
                    : 'translateY(0)',
                border: isCurrentlyPlaying ? '2px solid #1976d2' : '1px solid #f0f0f0',
                gridColumn: 'span 1',
                minHeight: '360px',
                zIndex: 1,
                opacity: playingId && !isCurrentlyPlaying ? 0.7 : 1,
              }}
            >
              {/* תגית ז'אנר */}
              {song.genre && (
                <Chip 
                  icon={<MusicNoteIcon fontSize="small" />} 
                  label={song.genre} 
                  size="small" 
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              )}

           

              {/* תמונת כריכה */}
              <Box 
                sx={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: 
                  160, 
                  overflow: 'hidden' 
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ 
                    height: '100%', 
                    width: '100%', 
                    objectFit: 'cover', 
                    objectPosition: 'center', 
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)', 
                    transform: (hoverId === song.id || isCurrentlyPlaying) ? 'scale(1.1)' : 'scale(1)' 
                  }}
                  loading="lazy"
                  src={song.coverUrl || DEFAULT_COVER}
                  alt={`תמונת כריכה של השיר ${song.title}`}
                />
                
                {/* כפתור הפעלה או אינדיקטור ויזואלי */}
                <Box
                  onClick={isCurrentlyPlaying ? undefined : () => handleStartPlaying(song.id)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: (hoverId === song.id || isCurrentlyPlaying) 
                      ? 'rgba(0, 0, 0, 0.4)' 
                      : 'rgba(0, 0, 0, 0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    cursor: isCurrentlyPlaying ? 'default' : 'pointer',
                    opacity: (hoverId === song.id || isCurrentlyPlaying) ? 1 : 0
                  }}
                >
                  <IconButton 
                    disabled={isCurrentlyPlaying}
                    sx={{ 
                      backgroundColor: isCurrentlyPlaying 
                        ? 'rgba(25, 118, 210, 0.9)' 
                        : 'rgba(255, 255, 255, 0.95)', 
                      size: 'large',
                      '&:hover': !isCurrentlyPlaying ? { 
                        backgroundColor: '#fff', 
                        transform: 'scale(1.1)' 
                      } : {},
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(25, 118, 210, 0.9)',
                        color: '#fff'
                      },
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      width: 55,
                      height: 55,
                      animation: isCurrentlyPlayingAndActive ? 'pulse 2s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)' },
                        '70%': { boxShadow: '0 0 0 15px rgba(25, 118, 210, 0)' },
                        '100%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)' }
                      }
                    }}
                  >
                    {isCurrentlyPlaying ? (
                      isCurrentlyPlayingAndActive ? 
                        <PlayArrowIcon  sx={{ color: '#fff', fontSize: 32 }} /> : 
                        <PauseIcon sx={{ color: '#fff', fontSize: 32 }} />
                    ) : (
                      <PlayArrowIcon sx={{ color: '#1976d2', fontSize: 32 }} />
                    )}
                  </IconButton>
                </Box>

                {/* בר התקדמות */}
                {isCurrentlyPlaying && (
                  <LinearProgress
                    variant="determinate"
                    value={audioProgress[song.id] || 0}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#1976d2'
                      }
                    }}
                  />
                )}
              </Box>

              <CardContent 
                sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  flexGrow: 1, 
                  p: 2, 
                  "&:last-child": { pb: 2 } 
                }}
              >
                {/* כותרת ואמן */}
                <Typography 
                  variant="h6" 
                  fontWeight={700} 
                  textAlign="center" 
                  sx={{ 
                    mb: 0.5, 
                    color: isCurrentlyPlaying ? '#1565c0' : '#333', 
                    fontSize: isCurrentlyPlaying ? '1.2rem' : '1rem',
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.3
                  }}
                >
                  {song.title}
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  fontWeight={500} 
                  textAlign="center" 
                  sx={{ 
                    mb: isCurrentlyPlaying ? 2 : 1.5,
                    fontSize: '0.9rem',
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 1, 
                    WebkitBoxOrient: 'vertical' 
                  }}
                >
                  {song.artist}
                </Typography>

                {/* נגן אודיו - תמיד קיים אבל נסתר */}
                <Box sx={{ display: 'none' }}>
                  <audio 
                    ref={(el) => { if (el) audioRefs.current[song.id] = el; }} 
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => {
                      setPlayingId(null);
                      setIsPlaying(false);
                      setAudioProgress(prev => ({ ...prev, [song.id]: 0 }));
                    }}
                  >
                    <source src={song.audioUrl} type="audio/mp3" />
                    הדפדפן שלך לא תומך בתגית האודיו.
                  </audio>
                </Box>

                {/* כפתורי פעולה */}
                <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button 
                    onClick={() => fetchLyrics(song)} 
                    disabled={loadingLyricsId === song.id}
                    variant="outlined" 
                    startIcon={loadingLyricsId === song.id ? null : <SmartToyIcon />}
                    sx={{ 
                      borderRadius: 2,
                      py: 0.8,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      borderColor: '#e0e0e0',
                      color: '#555',
                      backgroundColor: '#fafafa',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                        borderColor: '#d0d0d0'
                      },
                      '&.Mui-disabled': {
                        backgroundColor: '#f5f5f5',
                        color: '#888'
                      }
                    }}
                  >
                    {loadingLyricsId === song.id ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} sx={{ color: '#6437c9' }} />
                        מזהה מילות שיר...
                      </Box>
                    ) : lyricsMap[song.id] ? 
                      "הצג מילות שיר" : 
                      "זהה מילות שיר עם AI"
                    }
                  </Button>

                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      gap: 1.5,
                      opacity: (hoverId === song.id || isCurrentlyPlaying) ? 1 : 0.6, 
                      transition: 'opacity 0.3s ease' 
                    }}
                  >
                    <Tooltip title="הורד שיר">
                      <IconButton 
                        onClick={() => handleDownload(song)} 
                        sx={{ 
                          color: (hoverId === song.id || isCurrentlyPlaying) ? '#1976d2' : '#666', 
                          backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          '&:hover': { 
                            backgroundColor: 'rgba(25, 118, 210, 0.15)',
                            transform: 'scale(1.1)'
                          }, 
                          transition: 'all 0.2s ease' 
                        }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    {user?.role == "0" && <DeleteSong id={song.id} />}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Media Player */}
      <MediaPlayer
        song={songs.find(s => s.id === playingId) || null}
        isPlaying={isPlaying}
        progress={playingId !== null ? audioProgress[playingId] || 0 : 0}
        currentTime={getCurrentTime()}
        totalTime={getTotalTime()}
        onPlayPause={handleMediaPlayerPlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onClose={handleCloseMediaPlayer}
      />
    </>
  );
});

export default ShowSongs;