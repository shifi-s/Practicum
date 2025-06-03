import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  Stack,
  Modal,
  Typography,
  Box,
  InputAdornment,
  FormControl,
  Paper,
  Divider,
  IconButton,
  Fade
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";
import { useModal } from "./modalContext"; // ייבוא הקונטקסט החדש
import { User } from "../models/User";
import { 
  Email, 
  Lock, 
  Person, 
  PersonAdd, 
  Login,
  Close,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";

const Register = ({onClose}:{onClose:Function}) => {
  const userContext = useContext(UserContext);
  const { setUser } = userContext!;
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // שימוש בקונטקסט המודלים
  const { openModal } = useModal();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: { name: string; email: string; password: string }) => {
    if (!agreed) {
      setError(true);
      return;
    }
    try {
      const userData = await registerUser(data.name, data.email, data.password);
      if (userData) {
        const myUser: User = {
          name: data.name,
          email: data.email,
          role: userData.newUser.role,
          id: userData.newUser.id,
        };
        setUser(myUser);
        setIsOpen(false);
        onClose();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post("https://localhost:7265/api/auth/register", {
        UserName: name,
        email,
        password,
      });
      sessionStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      return null;
    }
  };

  // פונקציה משופרת למעבר למסך לוגין - משתמשת בקונטקסט
  const goToLogin = () => {
    setIsOpen(false);
    onClose();
    // במקום לנווט לעמוד, פותחת את מודל ההתחברות
    openModal('login');
  };

  const handleModalClose = () => {
    setIsOpen(false);
    onClose();
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
                <PersonAdd sx={{ mr: 1.5, fontSize: 26, filter: 'drop-shadow(0 2px 3px rgba(58, 134, 255, 0.3))' }} />
                הרשמה למערכת
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
                    label="שם מלא"
                    fullWidth
                    {...register("name", { required: "נא להזין שם מלא" })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#3a86ff' }} />
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

                  <FormControl error={!agreed}>
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      sx={{ 
                        flexDirection: 'row-reverse',
                        backgroundColor: 'rgba(245, 247, 255, 0.5)',
                        borderRadius: 2,
                        p: 1.5,
                        border: !agreed ? '1px solid rgba(211, 47, 47, 0.3)' : '1px solid transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(245, 247, 255, 0.8)'
                        }
                      }}
                    >
                      <input
                        required
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        style={{ 
                          margin: '0 0 0 12px',
                          width: '18px',
                          height: '18px',
                          accentColor: '#3a86ff',
                          cursor: 'pointer'
                        }}
                      />
                      <Typography variant="body2" sx={{ fontSize: '0.95rem', fontWeight: 500 }}>
                        אני מתחייב/ת לשמור על <a href="/terms" target="_blank" style={{ color: '#3a86ff', textDecoration: 'underline', fontWeight: 700, position: 'relative' }}>תנאי השימוש באתר</a>
                      </Typography>
                    </Box>
                  </FormControl>

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
                      startIcon={<PersonAdd sx={{ fontSize: 20 }} />}
                    >
                      הרשמה
                    </Button>
                  </Box>
                  
                  {/* Login link */}
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
                        ?כבר רשום/ה למערכת
                      </Typography>
                    </Divider>
                    
                    <Button
                      variant="outlined"
                      onClick={goToLogin} // השינוי העיקרי: כעת מפעיל מודל במקום ניווט
                      fullWidth
                      startIcon={<Login sx={{ fontSize: 18 }} />}
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
                      התחברות למערכת
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
          המשתמש קיים כבר במערכת
        </Alert>
      </Snackbar>
    </>
  );
};

export default Register;