import { NavLink, useLocation } from "react-router-dom"
import UserProfil from "./Profil"
import { useContext } from "react"
import { UserContext } from "./userContext"
import {
  Button,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Badge,
  Container,
} from "@mui/material"

import { useModal } from "./modalContext"
import { MusicNote, Whatshot, LibraryMusic } from "@mui/icons-material"
import SearchSong from "./searchSong"

const Header = () => {
  const location = useLocation()
  
  const isTerms = location.pathname === "/terms"
  
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserProvider")
  }

  const { openModal } = useModal()

  // Logo component
  const Logo = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
      }}
    >
      <Box
        component="img"
        src="/logoMusic.png"
        alt="מוזיקה ללא הפסקה"
        sx={{
          height: "50px",
          filter: "drop-shadow(0 4px 16px rgba(255,255,255,0.2))",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "scale(1.1) rotate(10deg)",
            filter: "drop-shadow(0 8px 24px rgba(255,255,255,0.3))",
          },
        }}
      />
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "1.1rem", sm: "1.4rem", md: "1.6rem" },
          letterSpacing: "0.5px",
          color: "white",
          textDecoration: "none",
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          fontFamily: "'Inter', 'Rubik', sans-serif",
          background: "linear-gradient(45deg, #ffffff, #e3f2fd)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        מוזיקה ללא הפסקה
      </Typography>
    </Box>
  )

  // Navigation link style
  const getNavLinkClassName = ({ isActive }: { isActive: boolean }) => (isActive ? "nav-link active" : "nav-link")

  return (
    <AppBar
      position="fixed"
      sx={{
        background: isTerms
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #5a67d8 100%)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 16px rgba(102, 126, 234, 0.2)",
        height: isTerms ? "50px" : "auto",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        zIndex: 1300,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          padding: isTerms ? "0" : "20",
          minHeight: isTerms ? "50px" : "auto",
        }}
      >
        <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: isTerms ? 0 : 1.5 }}>
          {!isTerms && (
            <>
              {/* Left section - Logo */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: "0 0 25%",
                }}
              >
                <Logo />
              </Box>

              {/* Middle section - Navigation */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  justifyContent: "center",
                  flex: "0 0 50%",
                }}
              >
                <Box
                  component="nav"
                  sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    borderRadius: "25px",
                    padding: "8px 20px",
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 4px 24px rgba(0, 0, 0, 0.12)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {sessionStorage.getItem("token") && (
                    <>
                      <NavLink to="/myPlaylists" className={getNavLinkClassName}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                          <LibraryMusic fontSize="small" sx={{ fontSize: 18 }} />
                          <span>השירים שלי</span>
                        </Box>
                      </NavLink>

                      <Box
                        sx={{
                          width: "4px",
                          height: "4px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(255,255,255,0.5)",
                          mx: 0.5
                        }}
                      />
                    </>
                  )}

                  <NavLink to="/songs" className={getNavLinkClassName}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      <MusicNote fontSize="small" sx={{ fontSize: 18 }} />
                      <span>כל השירים</span>
                    </Box>
                  </NavLink>

                  <Box
                    sx={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.5)",
                      mx: 0.5
                    }}
                  />

                  <NavLink to="/newSongs" className={getNavLinkClassName}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      <Badge
                        color="error"
                        variant="dot"
                        overlap="circular"
                        sx={{ 
                          "& .MuiBadge-badge": { 
                            animation: "pulse 2s infinite",
                            backgroundColor: "#ff4757",
                            boxShadow: "0 0 8px rgba(255, 71, 87, 0.6)"
                          } 
                        }}
                      >
                        <Whatshot fontSize="small" sx={{ fontSize: 18 }} />
                      </Badge>
                      <span>מה חדש</span>
                    </Box>
                  </NavLink>
                </Box>
              </Box>

              {/* Right section - Search & Profile */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flex: "0 0 25%",
                  gap: 2,
                  position: "relative",
                }}
              >
                {/* Search - חיפוש תמיד במיקום אחיד */}
                {location.pathname === "/songs" && (
                  <Box
                    sx={{
                      position: "absolute",
                      right: sessionStorage.getItem("token") ? "100px" : "200px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 1001,
                    }}
                  >
                    <SearchSong />
                  </Box>
                )}
             
                {/* Profile or login/register buttons */}
                {sessionStorage.getItem("token") ? (
                  <Box sx={{ ml: "auto" }}>
                    <UserProfil />
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
                    <Button
                      onClick={() => openModal("login")}
                      variant="contained"
                      disableElevation
                      sx={{
                        backgroundColor: "white",
                        color: "#5a67d8",
                        fontSize: "0.8rem",
                        padding: "6px 14px",
                        minWidth: 0,
                        borderRadius: "12px",
                        fontWeight: 700,
                        textTransform: "none",
                        boxShadow: "0 4px 20px rgba(255, 255, 255, 0.2)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                          boxShadow: "0 8px 32px rgba(255, 255, 255, 0.3)",
                          transform: "translateY(-2px) scale(1.02)",
                        },
                        "&:active": {
                          transform: "translateY(0) scale(1)",
                          boxShadow: "0 4px 16px rgba(255, 255, 255, 0.2)",
                        },
                      }}
                    >
                      התחברות
                    </Button>
                    <Button
                      onClick={() => openModal("register")}
                      variant="outlined"
                      sx={{
                        color: "white",
                        fontSize: "0.8rem",
                        padding: "6px 14px",
                        minWidth: 0,
                        borderRadius: "12px",
                        fontWeight: 700,
                        textTransform: "none",
                        border: "2px solid rgba(255, 255, 255, 0.8)",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                          borderColor: "white",
                          transform: "translateY(-2px) scale(1.02)",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                        },
                        "&:active": {
                          transform: "translateY(0) scale(1)",
                        },
                      }}
                    >
                      הרשמה
                    </Button>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Container>
      </Toolbar>

      {/* Decorative bottom line with animated glow */}
      {!isTerms && (
        <Box
          sx={{
            height: "2px",
            width: "100%",
            background: "linear-gradient(to right, rgba(102, 126, 234, 0.3), rgba(255, 255, 255, 0.8), rgba(90, 103, 216, 0.3))",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 1), transparent)",
              animation: "shine 4s infinite ease-in-out",
            },
          }}
        />
      )}

      {/* Global CSS */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Rubik:wght@400;500;600;700;800&display=swap');
          
          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.8; }
            50% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(0.8); opacity: 0.8; }
          }
          
          @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
          
          .nav-link {
            color: rgba(255, 255, 255, 0.9);
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 600;
            padding: 10px 18px;
            border-radius: 16px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            position: relative;
            backdrop-filter: blur(10px);
          }

          .nav-link:hover {
            color: white;
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px) scale(1.05);
            box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
          }

          .nav-link.active {
            color: white;
            font-weight: 700;
            background: rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 24px rgba(255, 255, 255, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.3);
            position: relative;
            transform: scale(1.05);
          }

          .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: 6px;
            left: 50%;
            transform: translateX(-50%);
            height: 3px;
            width: 30px;
            background: linear-gradient(90deg, #ffd700, #ffed4e);
            border-radius: 3px;
            box-shadow: 0 0 12px rgba(255, 215, 0, 0.8);
          }

          .nav-link.active::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            pointer-events: none;
          }
        `}
      </style>
    </AppBar>
  )
}

export default Header