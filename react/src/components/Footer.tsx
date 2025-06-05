import { Box, Typography, Divider } from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: "relative", // מבטיח שהפוטר לא יזוז
        width: "100%", // תופס את כל רוחב המסך
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #5a67d8 100%)",
        color: "white",
        overflowX: "hidden", // מונע גלילה אופקית
        pt: 6,
        pb: 4,
        boxSizing: "border-box", // מבטיח שה-padding לא ישפיע על הרוחב
      }}
    >
      <Box sx={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <Divider sx={{ my: 4, backgroundColor: "rgba(255,255,255,0.2)" }} />
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
          © {currentYear} מוזיקה ללא הפסקה. כל הזכויות שמורות.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;