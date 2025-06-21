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
 
  Fade,
  Grow
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

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.user?.id) {
      playlistStore.fetchPlaylists(user.user.id);
    }
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
    <Box 
      sx={{ 
        direction: "rtl", 
        py: 4, 
        pt: 2,
        px: 3,
        marginTop: 8,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        position: 'relative'
      }}
    >
      <Outlet />
      
      {/* Header Section */}
      <Fade in timeout={800}>
        <Box 
          sx={{ 
            direction: 'rtl',
            mb: 5, 
            p: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            color: 'white',
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
            position: 'relative',
            overflow: 'hidden',
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
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              <PlaylistPlayIcon sx={{ ml: 2, fontSize: 40 }} />
              רשימות ההשמעה שלי
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.9,
                fontWeight: 300,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              נהל והאזן לאוספי המוזיקה המועדפים עליך
            </Typography>
          </Box>
        </Box>
      </Fade>

      {/* Playlists Grid */}
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
              onMouseEnter={() => setHoveredCard(p.id)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                borderRadius: 3,
                overflow: 'hidden',
                height: 180,
                position: 'relative',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: hoveredCard === p.id 
                  ? '0 20px 40px rgba(0, 0, 0, 0.15)' 
                  : '0 8px 25px rgba(0, 0, 0, 0.08)',
                transform: hoveredCard === p.id ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  opacity: hoveredCard === p.id ? 1 : 0.6,
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
                direction: 'rtl',
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
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    boxShadow: hoveredCard === p.id 
                      ? '0 12px 24px rgba(102, 126, 234, 0.4)'
                      : '0 8px 20px rgba(99, 102, 241, 0.3)',
                    mb: 2,
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: hoveredCard === p.id ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '20px',
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                      opacity: hoveredCard === p.id ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }
                  }}
                >
                  <FolderIcon sx={{ fontSize: 35, zIndex: 1 }} />
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
                    color: '#1e293b',
                    transition: 'color 0.3s ease',
                    ...(hoveredCard === p.id && {
                      color: '#667eea'
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
                  opacity: 0.7,
                  transition: 'opacity 0.3s ease',
                  ...(hoveredCard === p.id && { opacity: 1 })
                }}>
                  <MusicNoteIcon sx={{ fontSize: 16, color: '#64748b' }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '0.85rem',
                      color: '#64748b',
                      fontWeight: 500
                    }}
                  >
                    פלייליסט אישי
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Fade in={hoveredCard === p.id} timeout={200}>
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: 12,
                      right: 12,
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
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          width: 32,
                          height: 32,
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: '#e3f2fd',
                            transform: 'scale(1.1)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                          }
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16, color: '#667eea' }} />
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
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          width: 32,
                          height: 32,
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: '#ffebee',
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
              height: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              border: '2px dashed rgba(102, 126, 234, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 15px 35px rgba(102, 126, 234, 0.2)',
                background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                borderColor: 'rgba(102, 126, 234, 0.5)',
                '&::before': {
                  opacity: 1
                }
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }
            }}
            onClick={() => navigate("addPlaylist")}
          >
            <CardContent sx={{ 
              p: 3,
              textAlign: 'center',
              direction: 'rtl',
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  margin: '0 auto 20px',
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 12px 25px rgba(102, 126, 234, 0.4)'
                  }
                }}
              >
                <AddCircleIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  mb: 1,
                  fontSize: '1.1rem'
                }}
              >
                צור פלייליסט חדש
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  fontWeight: 500
                }}
              >
                הוסף אוסף שירים חדש
              </Typography>
            </CardContent>
          </Card>
        </Grow>
      </Box>

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
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            direction: "rtl",
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 3,
            px: 4,
            fontWeight: 700,
            textAlign: 'center',
            fontSize: '1.3rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.3) 100%)'
            }
          }}
        >
          עריכת שם פלייליסט
        </DialogTitle>
        <DialogContent sx={{ dir: "rtl", p: 4 }}>
          <TextField
            fullWidth
            label="שם חדש"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            autoFocus
            variant="outlined"
            sx={{
              direction: 'rtl',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.8)',
                '&:hover fieldset': {
                  borderColor: '#667eea',
                  borderWidth: '2px'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                  borderWidth: '2px',
                  boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#667eea',
                fontWeight: 600
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2, direction: 'rtl', gap: 2 }}>
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
          <Button 
            variant="contained" 
            onClick={handleEditSave}
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 1,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            שמור
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
            background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            direction: "rtl",
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            py: 3,
            px: 4,
            fontWeight: 700,
            fontSize: '1.3rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.3) 100%)'
            }
          }}
        >
          אישור מחיקת פלייליסט
        </DialogTitle>
        <DialogContent sx={{ direction: "rtl", p: 4 }}>
          <Typography 
            sx={{ 
              textAlign: 'right', 
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
              textAlign: 'right',
              color: '#64748b',
              lineHeight: 1.6,
              fontSize: '0.95rem'
            }}
          >
            פעולה זו תמחק את הפלייליסט וכל השירים שבו לא יהיו זמינים עוד ברשימה זו. 
            פעולה זו לא ניתנת לביטול.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2, direction: 'rtl', gap: 2 }}>
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
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default PlaylistsList;