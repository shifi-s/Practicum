import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Alert, 
  Button, 
  Snackbar, 
  Stack, 
  TextField, 
  Modal, 
  Typography, 
  Box, 
  InputAdornment,
  Paper,
  IconButton,
  Divider,
  Fade
} from "@mui/material";
import { UserContext } from "./userContext";
import { useModal } from "./modalContext"; // ייבוא הקונטקסט החדש
import { User } from "../models/User";
import { 
  Login as LoginIcon, 
  Lock, 
  Email, 
  Close,
  Visibility,
  VisibilityOff,
  PersonAdd
} from "@mui/icons-material";

const Login = ({onClose}:{onClose:Function}) => {
  const { setUser } = useContext(UserContext)!;
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // שימוש בקונטקסט המודלים
  const { openModal } = useModal();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const response = await axios.post("https://nonstopmusicserver.onrender.com/api/auth/login", data);
      if (response?.data?.token) {
        sessionStorage.setItem("token", response.data.token);
        const user: User = {
          name: response.data.user.userName,
          email: response.data.user.email,
          role: response.data.user.role,
          id: response.data.user.id,
        };
        setUser(user);
        setIsOpen(false);
        onClose();
        reset()
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };
  
  const handleModalClose = () => {
    setIsOpen(false);
    onClose();
    reset();
  };
  
  // פונקציה משופרת למעבר להרשמה - משתמשת בקונטקסט
  const goToRegister = () => {
    setIsOpen(false);
    onClose();
    // במקום לנווט לעמוד, פותחת את מודל ההרשמה
    openModal('register');
  };
  
  return (
    <>
      <Modal 
        open={isOpen} 
        onClose={handleModalClose}
        closeAfterTransition
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          backdropFilter: 'blur(8px)' 
        }}
      >
        <Fade in={isOpen} timeout={400}>
          <Paper 
            elevation={24} 
            sx={{ 
              maxWidth: "450px",
              width: "90%", 
              borderRadius: 4,
              overflow: 'hidden',
              background: 'linear-gradient(145deg, #ffffff, #f9faff)',
              boxShadow: '0 12px 40px rgba(58, 134, 255, 0.15), 0 2px 10px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #3a86ff, #4361ee, #3a86ff)',
                zIndex: 1
              }
            }}
          >
            {/* Header */}
            <Box 
              sx={{ 
                p: 3.5, 
                pb: 2.5, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0,0,0,0.06)'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#3a86ff',
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: "'Rubik', sans-serif",
                  letterSpacing: '-0.01em'
                }}
              >
                <LoginIcon sx={{ mr: 1.5, fontSize: 26, filter: 'drop-shadow(0 2px 3px rgba(58, 134, 255, 0.3))' }} />
                התחברות למערכת
              </Typography>
              <IconButton 
                onClick={handleModalClose}
                size="small"
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.5)',
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    transform: 'rotate(90deg)'
                  }
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>

            {/* Form */}
            <Box p={3.5} pt={2.5}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <TextField
                    label="אימייל"
                    fullWidth
                    type="email"
                    {...register("email", { required: "נא להזין אימייל" })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#3a86ff' }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        transition: 'all 0.2s',
                        backgroundColor: 'rgba(245, 247, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(245, 247, 255, 1)'
                        },
                        '&:hover fieldset': {
                          borderColor: '#3a86ff',
                          borderWidth: '1.5px'
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          boxShadow: '0 0 0 3px rgba(58, 134, 255, 0.15)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3a86ff',
                          borderWidth: '1.5px'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#3a86ff'
                      }
                    }}
                  />

                  <TextField
                    label="סיסמה"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: "נא להזין סיסמה" })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#3a86ff' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                            sx={{
                              color: 'rgba(0, 0, 0, 0.4)',
                              '&:hover': {
                                color: '#3a86ff',
                                backgroundColor: 'rgba(58, 134, 255, 0.08)'
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        transition: 'all 0.2s',
                        backgroundColor: 'rgba(245, 247, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(245, 247, 255, 1)'
                        },
                        '&:hover fieldset': {
                          borderColor: '#3a86ff',
                          borderWidth: '1.5px'
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          boxShadow: '0 0 0 3px rgba(58, 134, 255, 0.15)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3a86ff',
                          borderWidth: '1.5px'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#3a86ff'
                      }
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      sx={{
                        background: "linear-gradient(45deg, #3a86ff, #4361ee)",
                        color: 'white',
                        borderRadius: 2.5,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 700,
                        px: 4,
                        py: 1.2,
                        minWidth: '180px',
                        boxShadow: '0 4px 12px rgba(58, 134, 255, 0.3)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          background: "linear-gradient(45deg, #4361ee, #3a86ff)",
                          boxShadow: '0 6px 20px rgba(58, 134, 255, 0.4)',
                          transform: 'translateY(-2px)'
                        },
                        '&:active': {
                          transform: 'translateY(1px)',
                          boxShadow: '0 2px 6px rgba(58, 134, 255, 0.3)'
                        }
                      }}
                      startIcon={<LoginIcon sx={{ fontSize: 20 }} />}
                    >
                      התחברות
                    </Button>
                  </Box>
                  
                  {/* Register link */}
                  <Box mt={1}>
                    <Divider sx={{ 
                      my: 2,
                      '&::before, &::after': {
                        borderColor: 'rgba(0, 0, 0, 0.08)'
                      }
                    }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: '0.9rem', 
                          px: 1.5,
                          color: 'rgba(0, 0, 0, 0.6)',
                          fontWeight: 500
                        }}
                      >
                        ?עדיין אין לך חשבון
                      </Typography>
                    </Divider>
                    
                    <Button
                      variant="outlined"
                      onClick={goToRegister} // השינוי העיקרי: כעת מפעיל מודל במקום ניווט
                      fullWidth
                      startIcon={<PersonAdd sx={{ fontSize: 18 }} />}
                      sx={{
                        mt: 1.5,
                        borderColor: '#3a86ff',
                        color: '#3a86ff',
                        borderRadius: 2.5,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        py: 1.2,
                        backgroundColor: 'rgba(58, 134, 255, 0.03)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: '#4361ee',
                          backgroundColor: 'rgba(58, 134, 255, 0.08)',
                          transform: 'translateY(-2px)'
                        },
                        '&:active': {
                          transform: 'translateY(0px)'
                        }
                      }}
                    >
                      הרשמה למערכת
                    </Button>
                  </Box>
                </Stack>
              </form>
            </Box>
          </Paper>
        </Fade>
      </Modal>

      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          severity="error" 
          onClose={() => setError(false)}
          variant="filled"
          sx={{ 
            borderRadius: 2.5,
            boxShadow: '0 6px 16px rgba(211, 47, 47, 0.2)',
            '& .MuiAlert-icon': {
              fontSize: '22px'
            },
            fontSize: '0.95rem',
            fontWeight: 500
          }}
        >
          המשתמש לא נמצא: האימייל או הסיסמה אינם נכונים
        </Alert>
      </Snackbar>
    </>
  );
};
export default Login;