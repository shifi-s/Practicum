import { useState, useEffect, useContext } from "react";
import { 
  Button, 
  Typography, 
  Box, 
  Alert, 
  Snackbar, 
  Container,
  Paper,
  CircularProgress,
  Fade,
  Grow,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import songStore from "../stores/songsStore";
import { UserContext } from "./userContext";
import { useModal } from "./modalContext";
import { 
  Add, 
  ErrorOutline,
  Sort,
  DateRange,
  Person,
  MusicNote
} from "@mui/icons-material";
import ShowSongs from "./showSongs";

const Songs = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  type SortOption = 'uploadDate' | 'artistName' | 'songName' | 'none';
  const [sortBy, setSortBy] = useState('none');
    const userContext = useContext(UserContext);
  
  const { user } = userContext!;
  const [connect, setIsConnect] = useState(true);
  const navigate = useNavigate();
  
  const { openModal } = useModal();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await songStore.fetchSongs();
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  // פונקציה למיון השירים
  
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsConnect(true);
    openModal('register');
  };


  const getSortIcon = () => {
    switch (sortBy) {
      case 'uploadDate':
        return <DateRange sx={{ fontSize: 18 }} />;
      case 'artistName':
        return <Person sx={{ fontSize: 18 }} />;
      case 'songName':
        return <MusicNote sx={{ fontSize: 18 }} />;
      default:
        return <Sort sx={{ fontSize: 18 }} />;
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'uploadDate':
        return 'תאריך העלאה';
      case 'artistName':
        return 'שם זמר';
      case 'songName':
        return 'שם שיר';
      default:
        return 'ללא מיון';
    }
  };

  return (
    <>
      <style>
        {`
          [id^="song-card-"] {
            align-self: start !important;
            height: auto !important;
            min-height: auto !important;
          }
          [id^="song-card-"] .MuiCardContent-root {
            flex-grow: 0 !important;
          }
          [style*="display: grid"] {
            align-items: start !important;
          }
          
          @keyframes twinkle {
            0%, 100% {
              opacity: 0.3;
              transform: scale(0.8);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            33% {
              transform: translateY(-15px) rotate(5deg);
            }
            66% {
              transform: translateY(-5px) rotate(-3deg);
            }
          }
        `}
      </style>

      {/* Fixed Background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #5a67d8 100%)",
          zIndex: -1,
        }}
      />

      {/* Background Effects */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* Floating Stars */}
      {[...Array(8)].map((_, i) => (
        <Box
          key={`star-${i}`}
          sx={{
            position: "fixed",
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.4)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          ✨
        </Box>
      ))}

      {/* Floating Music Notes */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={`note-${i}`}
          sx={{
            position: "fixed",
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.2)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          🎵
        </Box>
      ))}
      
      <Container maxWidth="lg" sx={{ pb: 10, direction: 'rtl' }}>
        <Outlet />
        
        {/* Decorative Bar */}
        <Box sx={{
          width: '100%',
          height: '60px',
          background: 'linear-gradient(160deg, rgba(58, 134, 255, 0.08), rgba(67, 97, 238, 0.04))',
          borderRadius: '12px',
          marginBottom: '30px',
          marginTop: '20px'
        }} />

        {/* Floating Add Song Button */}
        <Grow in={true} timeout={800}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="fixed"
            top={150}
            right={30}
            zIndex={1000}
          >
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #3a86ff, #4361ee)",
                color: "white",
                fontSize: "15px",
                padding: "10px 16px",
                borderRadius: "12px",
                fontWeight: 600,
                textTransform: "none",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 15px rgba(58, 134, 255, 0.3)",
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                '&:hover': {
                  background: "linear-gradient(90deg, #4361ee, #3a86ff)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 20px rgba(58, 134, 255, 0.4)",
                },
                '&:active': {
                  transform: "translateY(1px)",
                  boxShadow: "0 2px 8px rgba(58, 134, 255, 0.3)",
                }
              }}
              startIcon={
                <Add sx={{ 
                  fontSize: 20,
                  filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))"
                }} />
              }
              onClick={() => user?.name ? navigate("uploadSong") : setIsConnect(false)}
            >
              העלאת שיר
            </Button>
          </Box>
        </Grow>

        {/* Sort Controls */}
        {!isLoading && songStore.filteredSongs.length > 0 && (
          <Fade in timeout={600}>
            <Box sx={{ 
              mb: 3, 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2
            }}>
              <FormControl 
                size="small"
                sx={{ 
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)'
                      }
                    },
                    '&.Mui-focused': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.7)',
                        borderWidth: '2px'
                      }
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    '& .MuiSelect-icon': {
                      color: 'white'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&.Mui-focused': {
                      color: 'white'
                    }
                  }
                }}
              >
                <InputLabel 
                  id="sort-label"
                  sx={{ 
                    direction: 'rtl',
                    right: 14,
                    left: 'auto',
                    transformOrigin: 'top right'
                  }}
                >
                  מיין לפי
                </InputLabel>
                <Select
                  labelId="sort-label"
                  value={sortBy}
                  label="מיין לפי"
                  onChange={(e) =>{songStore.setSortBy(e.target.value as SortOption);setSortBy(e.target.value as SortOption)}}  
                  sx={{
                    direction: 'rtl',
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      pr: 1
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                        '& .MuiMenuItem-root': {
                          direction: 'rtl',
                          justifyContent: 'flex-start',
                          gap: 1,
                          borderRadius: '8px',
                          mx: 1,
                          my: 0.5,
                          '&:hover': {
                            background: 'rgba(58, 134, 255, 0.1)'
                          }
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="none">
                    <Sort sx={{ fontSize: 18 }} />
                    ללא מיון
                  </MenuItem>
                  <MenuItem value="uploadDate">
                    <DateRange sx={{ fontSize: 18 }} />
                    תאריך העלאה (חדש לישן)
                  </MenuItem>
                  <MenuItem value="artistName">
                    <Person sx={{ fontSize: 18 }} />
                    שם זמר (א-ת)
                  </MenuItem>
                  <MenuItem value="songName">
                    <MusicNote sx={{ fontSize: 18 }} />
                    שם שיר (א-ת)
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Current Sort Indicator */}
              {sortBy !== 'none' && (
                <Chip
                  icon={getSortIcon()}
                  label={`ממוין לפי: ${getSortLabel()}`}
                  onDelete={() => {setSortBy('none');songStore.setSortBy('none')}}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '& .MuiChip-icon': {
                      color: 'white'
                    },
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        color: 'white'
                      }
                    }
                  }}
                />
              )}
            </Box>
          </Fade>
        )}

        {/* Loading State */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
              }} 
            />
          </Box>
        ) : (
          <>
            {/* Empty State or Results */}
            {songStore.filteredSongs.length === 0 && songStore.query !== "" ? (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  maxWidth: '600px',
                  mx: 'auto',
                  mt: 4,
                  color: 'white'
                }}
              >
                <Box>
                  <ErrorOutline sx={{ fontSize: 60, color: 'rgba(255, 255, 255, 0.8)', mb: 2 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 500, 
                      mb: 1,
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    לא נמצאו שירים תואמים לחיפוש "{songStore.query}"
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      mb: 3,
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}
                  >
                    נסה לחפש מחדש עם מילות מפתח אחרות
                  </Typography>
                  <Button 
                    variant="contained"
                    onClick={() => songStore.setQuery("")}
                    sx={{
                      background: 'linear-gradient(135deg, #3a86ff 0%, #4361ee 100%)',
                      color: 'white',
                      borderRadius: '12px',
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                      boxShadow: '0 4px 15px rgba(58, 134, 255, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2563eb 0%, #3730a3 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(58, 134, 255, 0.4)'
                      }
                    }}
                  >
                    נקה חיפוש
                  </Button>
                </Box>
              </Paper>
            ) : (
              <Fade in={!isLoading} timeout={800}>
                <Box className="songs-container">
                  <ShowSongs />
                </Box>
              </Fade>
            )}
          </>
        )}

        {/* Connect Alert */}
        <Snackbar 
          open={!connect}
          autoHideDuration={6000}
          onClose={() => setIsConnect(true)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert 
            severity="warning"
            variant="filled"
            sx={{ 
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '& .MuiAlert-icon': {
                fontSize: '24px'
              }
            }}
          >
            <Box sx={{ direction: 'rtl' }}>
              כדי להעלות שיר יש להתחבר&nbsp;
              <Box
                component="span" 
                onClick={handleLoginClick}
                sx={{ 
                  textDecoration: "none", 
                  color: "white", 
                  fontWeight: "bold",
                  background: "rgba(255,255,255,0.2)",
                  padding: "3px 8px",
                  borderRadius: "8px",
                  transition: "background 0.3s ease",
                  cursor: "pointer",
                  '&:hover': {
                    background: "rgba(255,255,255,0.3)"
                  }
                }}
              >
                כאן  
              </Box>
            </Box>
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
});

export default Songs;