
import { Typography,  Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import ShowSongs from "./showSongs";
import songStore from "../stores/songsStore";
import { Whatshot, MusicNote } from "@mui/icons-material";

const NewSongs = observer(() => {
  return (
    <>
      {/* Reset only necessary styles - הסרת הסגנונות הגלובליים המיותרים */}
      <style>
        {`
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          #root {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* תיקון עבור grid layout בתוך NewSongs */
          .new-songs-container [style*="display: grid"] {
            place-items: initial !important;
            align-items: start !important;
            justify-items: stretch !important;
          }
          /* מניעת מתיחת קלפי השירים בגובה */
          .new-songs-container [id^="song-card-"] {
            align-self: start !important;
            height: auto !important;
            min-height: auto !important;
          }
          /* תיקון עבור תוכן הקלף */
          .new-songs-container [id^="song-card-"] .MuiCardContent-root {
            flex-grow: 0 !important;
          }
        `}
      </style>
      
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #5a67d8 100%)",
          paddingTop: "140px",
          paddingBottom: "40px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "auto",
          margin: 0,
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
      {/* רקע אפקטים */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* כוכבים קטנים */}
      {[...Array(8)].map((_, i) => (
        <Box
          key={`star-${i}`}
          sx={{
            position: "absolute",
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.4)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            pointerEvents: "none",
          }}
        >
          ✨
        </Box>
      ))}

        <Box sx={{ padding: "0 20px", width: "100%", boxSizing: "border-box" }}>
          {/* כותרת עם אפקטים */}
        <Box
          sx={{
            textAlign: "center",
            marginBottom: 4,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              padding: "20px 40px",
              borderRadius: "25px",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              animation: "fadeInUp 1s ease-out",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* אפקט זוהר */}
            <Box
              sx={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
                animation: "shimmer 3s ease-in-out infinite",
                pointerEvents: "none"
              }}
            />
            
            {/* אייקון אש */}
            <Whatshot 
              sx={{ 
                fontSize: 32, 
                color: "#ff4757",
                filter: "drop-shadow(0 4px 8px rgba(255, 71, 87, 0.4))",
                animation: "iconPulse 2s ease-in-out infinite",
                zIndex: 1,
                position: "relative"
              }} 
            />
            
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "white",
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                background: "linear-gradient(45deg, #ffffff, #f0f9ff)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Inter', 'Rubik', sans-serif",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                zIndex: 1,
                position: "relative"
              }}
            >
              שירים שהועלו בשבוע האחרון
            </Typography>
            
            {/* אייקון נוט */}
            <MusicNote 
              sx={{ 
                fontSize: 32, 
                color: "rgba(255, 255, 255, 0.8)",
                animation: "iconFloat 3s ease-in-out infinite",
                zIndex: 1,
                position: "relative"
              }} 
            />
          </Box>

          {/* תת כותרת */}
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              marginTop: 2,
              fontWeight: 500,
              animation: "fadeInUp 1.2s ease-out",
            }}
          >
            🔥 הכי חדש והכי חם שיש לנו 🔥
          </Typography>
        </Box>

        {/* תוכן */}
        <Box
          sx={{
            position: "relative",
            animation: "fadeInUp 1.4s ease-out",
          }}
        >
          {songStore.fetchNewSongs.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                padding: "60px 20px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                maxWidth: "500px",
                margin: "0 auto",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Box
                sx={{
                  fontSize: "4rem",
                  marginBottom: 2,
                  animation: "bounce 2s ease-in-out infinite",
                }}
              >
                😔
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: "white",
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  fontWeight: 600,
                  marginBottom: 1
                }}
              >
                לא נמצאו שירים חדשים
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "rgba(255, 255, 255, 0.8)",
                  textShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                נסה שוב מאוחר יותר או בדוק את כל השירים
              </Typography>
            </Box>
          ) : (
            <Box
              className="new-songs-container"
              sx={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "20px",
                padding: "20px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                // הוספת הגבלת רוחב מקסימלי למניעת מתיחת יתר
                maxWidth: "100%",
                overflow: "hidden"
              }}
            >
              <ShowSongs />
            </Box>
          )}
        </Box>
      </Box>

      {/* CSS Animations */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Rubik:wght@400;500;600;700;800&display=swap');
          
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes shimmer {
            0% {
              transform: translateX(-100%) translateY(-100%) rotate(45deg);
            }
            100% {
              transform: translateX(100%) translateY(100%) rotate(45deg);
            }
          }
          
          @keyframes iconPulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
          }
          
          @keyframes iconFloat {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
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
          
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>
    </Box>
    </>
)
});

export default NewSongs;