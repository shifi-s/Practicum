import { useContext, useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Snackbar, 
  Alert,
  Fade,
  Paper,
  IconButton
} from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useNavigate } from 'react-router';
import { UserContext } from './userContext';
import playlistStore from '../stores/playlistStore';
import { observer } from 'mobx-react-lite';

interface PlaylistFormInputs {
  name: string;
}

const CreatePlaylistModal = observer(() => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext)
  const [isOpen, setIsOpen] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PlaylistFormInputs>();
  const [successOpen, setSuccessOpen] = useState<boolean>(false);

  const onSubmit: SubmitHandler<PlaylistFormInputs> = async (data) => {
    if (userContext?.user?.id !== undefined) {
      playlistStore.addPlaylist(data.name, userContext.user.id);
    } else {
      console.error("User ID is undefined. Cannot create playlist.");
    }
    setSuccessOpen(true);
    reset();
    setIsOpen(false);
    navigate('/myPlaylists');

  };

  const handleClose = () => {
    setIsOpen(false);
    navigate("/myPlaylists");
  };

  return (
    <>
      {/* מודאל יצירה */}
      <Modal 
        open={isOpen} 
        onClose={handleClose}
        closeAfterTransition
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Fade in={isOpen} timeout={400}>
          <Paper
            elevation={24}
            sx={{
              width: { xs: '90%', sm: '450px', md: '500px' },
              maxWidth: '95%',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Header with gradient background */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'white',
                position: 'relative'
              }}
            >
              <IconButton
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>

              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
              >
                <PlaylistAddIcon sx={{ fontSize: 40 }} />
              </Box>
              
              <Typography 
                variant="h5" 
                fontWeight="bold"
                sx={{ 
                  textAlign: 'center',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                }}
              >
                יצירת רשימת השמעה חדשה
              </Typography>
              
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  opacity: 0.9,
                  maxWidth: '85%',
                  textAlign: 'center'
                }}
              >
                ארגן את השירים האהובים עליך ברשימה חדשה
              </Typography>
            </Box>

            {/* Form content */}
            <Box 
              sx={{ 
                p: 4,
                pt: 3,
                backgroundColor: '#ffffff',
                backgroundImage: 'radial-gradient(circle at 50% 100%, #f5f8ff 0%, rgba(255, 255, 255, 0) 70%)'
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <Box sx={{ position: 'relative' }}>
                    <TextField
                      label="שם רשימת השמעה"
                      placeholder="לדוגמה: שירים לריצה, מוזיקה לעבודה..."
                      fullWidth
                      variant="outlined"
                      autoFocus
                      {...register("name", { 
                        required: "נא להזין שם לרשימה",
                        minLength: {
                          value: 2,
                          message: "שם הרשימה חייב להכיל לפחות 2 תווים"
                        }
                      })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      InputProps={{
                        startAdornment: (
                          <MusicNoteIcon sx={{ mr: 1, color: '#1976d2' }} />
                        ),
                        sx: {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Box>

                  <Stack 
                    direction="row" 
                    spacing={2} 
                    justifyContent="center"
                    sx={{ mt: 2 }}
                  >
                    <Button 
                      variant="outlined" 
                      color="error" 
                      onClick={handleClose}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                          backgroundColor: 'rgba(211, 47, 47, 0.04)'
                        }
                      }}
                    >
                      ביטול
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      startIcon={<PlaylistAddIcon />}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1,
                        background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
                        boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                          background: 'linear-gradient(135deg, #1565c0, #42a5f5)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      צור רשימה
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Paper>
        </Fade>
      </Modal>

      {/* סנאקבר הצלחה */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Fade}
      >
        <Alert 
          severity="success" 
          variant="filled"
          sx={{ 
            fontSize: "1rem", 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
            alignItems: 'center',
            width: '280px'
          }}
          icon={<PlaylistAddIcon fontSize="medium" />}
        >
          רשימת ההשמעה נוצרה בהצלחה! 🎉
        </Alert>
      </Snackbar>
    </>
  );
})
export default CreatePlaylistModal;