import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from './userContext';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Container,
  Fade,
  Grow,
  CircularProgress
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Playlist } from '../models/playlist';
import { observer } from 'mobx-react-lite';
import playlistStore from '../stores/playlistStore';

const PlaylistsList = observer(() => {
  const user = useContext(UserContext);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (user?.user?.id) {
        await playlistStore.fetchPlaylists(user.user.id);
      }
      setIsLoading(false);
    };
    
    fetchData();
  }, [user]);

  const openDeleteConfirmation = (id: string) => {
    setPlaylistToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (playlistToDelete) {
      playlistStore.deletePlaylist(playlistToDelete);
      setOpenDeleteDialog(false);
      setPlaylistToDelete(null);
    }
  };

  const handleEditClick = (playlist: Playlist) => {
    setEditName(playlist.name);
    setEditId(playlist.id);
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editId) return;
    playlistStore.updatePlaylist(editId, editName);
    setEditDialogOpen(false);
    setEditName('');
  };

  return (
    <>
      {/* CSS for preventing card stretching and RTL support */}
      <style>
        {`
          [id^="playlist-card-"] {
            align-self: start !important;
            height: auto !important;
            min-height: auto !important;
          }
          [id^="playlist-card-"] .MuiCardContent-root {
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

        {/* Floating Add Playlist Button */}
       
        {/* Header Section */}
        <Fade in timeout={800}>
          <Box 
            sx={{ 
              mb: 4, 
              p: 4,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              color: 'white',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                pointerEvents: 'none'
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                רשימות ההשמעה שלי
                <PlaylistPlayIcon sx={{ fontSize: 40 }} />
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 300,
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                נהל והאזן לאוספי המוזיקה המועדפים עליך
              </Typography>
            </Box>
          </Box>
        </Fade>

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
          <Fade in={!isLoading} timeout={800}>
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
                xl: 'repeat(5, 1fr)'
              }}
              gap={3}
            >
              {/* Playlist Cards */}
              {playlistStore.playlists.map((p, index) => (
                <Grow
                  key={p.id}
                  in
                  timeout={500 + index * 100}
                >
                  <Card
                    id={`playlist-card-${p.id}`}
                    onMouseEnter={() => setHoveredCard(p.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      height: 'auto',
                      minHeight: '200px',
                      position: 'relative',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: hoveredCard === p.id 
                        ? '0 20px 40px rgba(0, 0, 0, 0.2)' 
                        : '0 8px 25px rgba(0, 0, 0, 0.1)',
                      transform: hoveredCard === p.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #3a86ff 0%, #4361ee 100%)',
                        opacity: hoveredCard === p.id ? 1 : 0.7,
                        transition: 'opacity 0.3s ease'
                      }
                    }}
                    onClick={() => navigate(`/myPlaylists/${p.id}`)}
                  >
                    <CardContent sx={{ 
                      p: 3,
                      display: 'flex', 
                      flexDirection: 'column',
                      height: '100%',
                      position: 'relative',
                      zIndex: 1,
                      alignItems: 'center',
                      textAlign: 'center'
                    }}>
                      {/* Playlist Icon */}
                      <Box 
                        sx={{ 
                          width: 70, 
                          height: 70, 
                          borderRadius: '20px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          background: hoveredCard === p.id 
                            ? 'linear-gradient(135deg, #3a86ff 0%, #4361ee 100%)'
                            : 'linear-gradient(135deg, rgba(58, 134, 255, 0.8) 0%, rgba(67, 97, 238, 0.8) 100%)',
                          color: 'white',
                          boxShadow: hoveredCard === p.id 
                            ? '0 12px 24px rgba(58, 134, 255, 0.4)'
                            : '0 8px 20px rgba(58, 134, 255, 0.3)',
                          mb: 2,
                          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          transform: hoveredCard === p.id ? 'scale(1.1)' : 'scale(1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        <FolderIcon sx={{ fontSize: 35 }} />
                      </Box>
                      
                      {/* Playlist Name */}
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          textAlign: 'center',
                          width: '100%',
                          mb: 1,
                          minHeight: '2.6em',
                          color: 'white',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          transition: 'all 0.3s ease',
                          ...(hoveredCard === p.id && {
                            transform: 'scale(1.05)'
                          })
                        }}
                      >
                        {p.name}
                      </Typography>
                      
                      {/* Playlist Info */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        mt: 'auto',
                        opacity: 0.8,
                        transition: 'opacity 0.3s ease',
                        ...(hoveredCard === p.id && { opacity: 1 })
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontWeight: 500,
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                          }}
                        >
                          פלייליסט אישי
                        </Typography>
                        <MusicNoteIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.8)' }} />
                      </Box>

                      {/* Action Buttons */}
                      <Fade in={hoveredCard === p.id} timeout={200}>
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            display: 'flex',
                            gap: 0.5,
                            opacity: hoveredCard === p.id ? 1 : 0,
                            pointerEvents: hoveredCard === p.id ? 'auto' : 'none'
                          }}
                        >
                          <Tooltip title="ערוך" placement="top" arrow>
                            <IconButton 
                              size="small" 
                              onClick={e => {
                                e.stopPropagation();
                                handleEditClick(p);
                              }}
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                width: 32,
                                height: 32,
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 1)',
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 4px 12px rgba(58, 134, 255, 0.3)'
                                }
                              }}
                            >
                              <EditIcon sx={{ fontSize: 16, color: '#3a86ff' }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="מחק" placement="top" arrow>
                            <IconButton 
                              size="small" 
                              onClick={e => {
                                e.stopPropagation();
                                openDeleteConfirmation(p.id);
                              }}
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                width: 32,
                                height: 32,
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 1)',
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                                }
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Fade>
                    </CardContent>
                  </Card>
                </Grow>
              ))}

              {/* Add New Playlist Card */}
              <Grow in timeout={800}>
                <Card
                  sx={{
                    height: 'auto',
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '2px dashed rgba(255, 255, 255, 0.4)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderColor: 'rgba(255, 255, 255, 0.6)',
                    }
                  }}
                  onClick={() => navigate("addPlaylist")}
                >
                  <CardContent sx={{ 
                    p: 3,
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #3a86ff 0%, #4361ee 100%)',
                        color: 'white',
                        margin: '0 auto 20px',
                        boxShadow: '0 8px 20px rgba(58, 134, 255, 0.4)',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: '0 12px 25px rgba(58, 134, 255, 0.5)'
                        }
                      }}
                    >
                      <AddCircleIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: 'white',
                        mb: 1,
                        fontSize: '1.1rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      צור פלייליסט חדש
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: 500,
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                      }}
                    >
                      הוסף אוסף שירים חדש
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Box>
          </Fade>
        )}

        {/* Edit Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              background: 'linear-gradient(135deg, #3a86ff 0%, #4361ee 100%)',
              color: 'white',
              py: 3,
              px: 4,
              fontWeight: 700,
              textAlign: 'center',
              fontSize: '1.3rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              position: 'relative',
              direction: 'rtl'
            }}
          >
            עריכת שם פלייליסט
          </DialogTitle>
          <DialogContent sx={{ p: 4, direction: 'rtl' }}>
            <TextField
              fullWidth
              label="שם חדש"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoFocus
              variant="outlined"
              InputProps={{
                dir: 'rtl'
              }}
              InputLabelProps={{
                dir: 'rtl'
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.8)',
                  '&:hover fieldset': {
                    borderColor: '#3a86ff',
                    borderWidth: '2px'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3a86ff',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 3px rgba(58, 134, 255, 0.1)'
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#3a86ff',
                  fontWeight: 600
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 4, pt: 2, gap: 2, flexDirection: 'row-reverse', direction: 'rtl' }}>
            <Button 
              variant="contained" 
              onClick={handleEditSave}
              sx={{ 
                borderRadius: 2,
                px: 4,
                py: 1,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #3a86ff 0%, #4361ee 100%)',
                boxShadow: '0 4px 12px rgba(58, 134, 255, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #3730a3 100%)',
                  boxShadow: '0 6px 16px rgba(58, 134, 255, 0.4)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              שמור
            </Button>
            <Button 
              onClick={() => setEditDialogOpen(false)}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                }
              }}
            >
              ביטול
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              py: 3,
              px: 4,
              fontWeight: 700,
              fontSize: '1.3rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              direction: 'rtl'
            }}
          >
            אישור מחיקת פלייליסט
          </DialogTitle>
          <DialogContent sx={{ p: 4, textAlign: 'right', direction: 'rtl' }}>
            <Typography 
              sx={{ 
                mb: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#1e293b'
              }}
            >
              האם אתה בטוח שברצונך למחוק את הפלייליסט?
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#64748b',
                lineHeight: 1.6,
                fontSize: '0.95rem'
              }}
            >
              פעולה זו תמחק את הפלייליסט וכל השירים שבו לא יהיו זמינים עוד ברשימה זו. 
              פעולה זו לא ניתנת לביטול.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 4, pt: 2, gap: 2, flexDirection: 'row-reverse', direction: 'rtl' }}>
            <Button 
              onClick={confirmDelete}
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              מחק
            </Button>
            <Button 
              onClick={() => setOpenDeleteDialog(false)}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                borderColor: '#d1d5db',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb'
                }
              }}
            >
              ביטול
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
});

export default PlaylistsList;