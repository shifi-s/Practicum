import { Box, Container, Typography, Grid, Link, IconButton, Divider } from "@mui/material";
import { Facebook, Instagram, Twitter, YouTube, Email, Phone, LocationOn } from "@mui/icons-material";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        // עוקף את הגבלות #root הגלובליות
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        width: "100vw",
        maxWidth: "100vw", // מונע overflow
        overflowX: "hidden", // מונע גלילה אופקית
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #5a67d8 100%)",
        color: "white",
        pt: 6,
        pb: 3,
        mt: "auto",
        boxSizing: "border-box",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(to right, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3))",
        },
      }}
    >
      <Container 
        maxWidth="lg"
        sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: { xs: "0 16px", sm: "0 24px" },
          boxSizing: "border-box",
        }}
      >
        <Grid container spacing={4}>
          {/* לוגו ותיאור */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box
                  component="img"
                  src="/logoMusic.png"
                  alt="מוזיקה ללא הפסקה"
                  sx={{
                    height: "40px",
                    filter: "drop-shadow(0 2px 8px rgba(255,255,255,0.3))",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    background: "linear-gradient(45deg, #ffffff, #e3f2fd)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "'Inter', 'Rubik', sans-serif",
                  }}
                >
                  מוזיקה ללא הפסקה
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 1.6,
                  fontSize: "0.9rem",
                }}
              >
                הפלטפורמה המובילה למוזיקה עברית. אלפי שירים, רשימות השמעה אישיות, 
                והמוזיקה הטובה ביותר בעברית - הכל במקום אחד.
              </Typography>
            </Box>
          </Grid>

          {/* קישורים מהירים */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: "1.1rem",
                color: "white",
              }}
            >
              דפים
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { to: "/songs", label: "כל השירים" },
                { to: "/newSongs", label: "מה חדש" },
                { to: "/myPlaylists", label: "השירים שלי" },
                { to: "/about", label: "אודות" },
              ].map((link) => (
                <Link
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "white",
                      transform: "translateX(-3px)",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* מידע משפטי */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: "1.1rem",
                color: "white",
              }}
            >
              מידע משפטי
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { to: "/terms", label: "תנאי שימוש" },
                { to: "/privacy", label: "מדיניות פרטיות" },
                { to: "/cookies", label: "מדיניות עוגיות" },
                { to: "/contact", label: "צור קשר" },
              ].map((link) => (
                <Link
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "white",
                      transform: "translateX(-3px)",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* יצירת קשר ורשתות חברתיות */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: "1.1rem",
                color: "white",
              }}
            >
              בואו נישאר בקשר
            </Typography>
            
            {/* פרטי קשר */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Email sx={{ fontSize: 18, color: "rgba(255, 255, 255, 0.8)" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}
                >
                  info@musicwebsite.co.il
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Phone sx={{ fontSize: 18, color: "rgba(255, 255, 255, 0.8)" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}
                >
                  03-1234567
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, color: "rgba(255, 255, 255, 0.8)" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}
                >
                  תל אביב, ישראל
                </Typography>
              </Box>
            </Box>

            {/* רשתות חברתיות */}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              עקבו אחרינו
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { icon: Facebook, label: "Facebook", color: "#1877F2" },
                { icon: Instagram, label: "Instagram", color: "#E4405F" },
                { icon: Twitter, label: "Twitter", color: "#1DA1F2" },
                { icon: YouTube, label: "YouTube", color: "#FF0000" },
              ].map((social) => (
                <IconButton
                  key={social.label}
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: social.color,
                      color: "white",
                      transform: "translateY(-2px) scale(1.1)",
                      boxShadow: `0 8px 20px ${social.color}40`,
                    },
                  }}
                  size="small"
                >
                  <social.icon sx={{ fontSize: 20 }} />
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* קו הפרדה */}
        <Divider
          sx={{
            my: 4,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }}
        />

        {/* זכויות יוצרים */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "0.85rem",
            }}
          >
            © {currentYear} מוזיקה ללא הפסקה. כל הזכויות שמורות.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            Made with ❤️ in Israel
          </Typography>
        </Box>

        {/* אלמנט דקורטיבי */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(to right, rgba(255, 215, 0, 0.3), rgba(255, 255, 255, 0.8), rgba(255, 215, 0, 0.3))",
            animation: "footerGlow 3s ease-in-out infinite alternate",
          }}
        />
      </Container>

      {/* CSS נוסף */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Rubik:wght@400;500;600;700;800&display=swap');
          
          @keyframes footerGlow {
            0% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default Footer;