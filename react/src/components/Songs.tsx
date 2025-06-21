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
  Grow
} from "@mui/material";
import {  Outlet, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import songStore from "../stores/songsStore";
import { UserContext } from "./userContext";
import { useModal } from "./modalContext"; // ייבוא הקונטקסט החדש
import { 
  Add, 
 
  ErrorOutline 
} from "@mui/icons-material";
import ShowSongs from "./showSongs";

const Songs = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const userContext = useContext(UserContext);
  
  const { user } = userContext!;
  const [connect, setIsConnect] = useState(true);
  const navigate = useNavigate();
  
  // שימוש בקונטקסט המודלים
  const { openModal } = useModal();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await songStore.fetchSongs();
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  // פונקציה לטיפול בלחיצה על הלינק "כאן"
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault(); // מונע ניווט ברירת מחדל
    setIsConnect(true); // סוגר את הסנאקבר
    openModal('register'); // פותח את מודל ההתחברות
  };

  return (
    <>
      {/* תיקון עבור מניעת מתיחת קלפי השירים בגובה */}
      <style>
        {`
          /* מניעת מתיחת קלפי השירים בגובה */
          [id^="song-card-"] {
            align-self: start !important;
            height: auto !important;
            min-height: auto !important;
          }
          /* תיקון עבור תוכן הקלף */
          [id^="song-card-"] .MuiCardContent-root {
            flex-grow: 0 !important;
          }
          /* תיקון עבור grid layout */
          [style*="display: grid"] {
            align-items: start !important;
          }
        `}
      </style>

      {/* רקע מלא על כל העמוד */}
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

      {/* אפקטי רקע */}
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

      {/* כוכבים קטנים */}
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

      {/* אייקוני מוזיקה צפים */}
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
      
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Outlet />
        
        {/* פס תכלת פשוט */}
        
        
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

        {/* Loading State */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
          <Box sx={{
          width: '100%',
          height: '60px',
          background: 'linear-gradient(160deg, rgba(58, 134, 255, 0.08), rgba(67, 97, 238, 0.04))',
          borderRadius: '12px',
          marginBottom: '30px',
          marginTop: '20px'
        }} />
            {/* Empty State or Results */}
            {songStore.filteredSongs.length === 0&&songStore.query!="" ? (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  maxWidth: '600px',
                  mx: 'auto',
                  mt: 4
                }}
              >
                  <Box>
                    <ErrorOutline sx={{ fontSize: 60, color: '#f44336', mb: 2, opacity: 0.7 }} />
                    <Typography variant="h6" sx={{ color: '#555', fontWeight: 500, mb: 1 }}>
                    "לא נמצאו שירים תואמים לחיפוש "{songStore.query}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#777', mb: 2 }}>
                      נסה לחפש מחדש עם מילות מפתח אחרות
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      onClick={() => songStore.setQuery("")}
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
            כדי להעלות שיר יש להתחבר&nbsp;
            <Box
              component="span" 
              onClick={handleLoginClick} // השינוי העיקרי: פונקציה לפתיחת מודל
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
          </Alert>
        </Snackbar>
      </Container>

      {/* CSS Animations */}
      <style>
        {`
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
    </>
  );
});

export default Songs;