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
  Container
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
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
    <Container sx={{ direction: "rtl", py: 25, pt: 3 ,marginTop: 10 }}>
      <Outlet />
      
      <Box 
        sx={{ 
          direction: 'rtl',
          mb: 4, 
          p: 3,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: 2,
          color: 'white',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)'
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PlaylistPlayIcon sx={{ ml: 1, fontSize: 30 }} />
          רשימות ההשמעה שלי
        </Typography>
        <Typography variant="body1">
          נהל והאזן לאוספי המוזיקה המועדפים עליך
        </Typography>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        }}
        gap={2.5}
      >
        {playlistStore.playlists.map(p => (
          <Card
            key={p.id}
            onMouseEnter={() => setHoveredCard(p.id)}
            onMouseLeave={() => setHoveredCard(null)}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              borderRadius: 2,
              overflow: 'hidden',
              height: 160, // גובה קבוע חזרה
              position: 'relative',
              boxShadow: hoveredCard === p.id 
                ? '0px 10px 25px rgba(0, 0, 0, 0.2)' 
                : '0px 4px 15px rgba(0, 0, 0, 0.1)',
              transform: hoveredCard === p.id ? 'translateY(-8px)' : 'translateY(0)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: 'linear-gradient(to left, #667eea, #764ba2)',
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
              background: 'linear-gradient(135deg, #ffffff, #f5f8ff)',
              direction: 'rtl',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              {/* אייקון תיקיה גדול */}
              <Box 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.3)',
                  mb: 2,
                  transition: 'transform 0.3s ease',
                  transform: hoveredCard === p.id ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                <FolderIcon sx={{ fontSize: 40 }} />
              </Box>
              
              {/* שם הפלייליסט */}
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  textAlign: 'center',
                  width: '100%',
                  mb: 1,
                  minHeight: '2.4em' // מקום לשתי שורות
                }}
              >
                {p.name}
              </Typography>
              
              {/* טקסט תחתון */}
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.85rem',
                  mt: 'auto'
                }}
              >
                פלייליסט אישי
              </Typography>

              {/* כפתורי פעולה */}
              {hoveredCard === p.id && (
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 0.5,
                    opacity: hoveredCard === p.id ? 1 : 0,
                    transition: 'opacity 0.2s ease'
                  }}
                >
                  <Tooltip title="ערוך" placement="top">
                    <IconButton 
                      size="small" 
                      onClick={e => {
                        e.stopPropagation();
                        handleEditClick(p);
                      }}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        width: 28,
                        height: 28,
                        '&:hover': {
                          backgroundColor: '#e3f2fd'
                        }
                      }}
                    >
                      <EditIcon sx={{ fontSize: 16, color: '#667eea' }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="מחק" placement="top">
                    <IconButton 
                      size="small" 
                      onClick={e => {
                        e.stopPropagation();
                        openDeleteConfirmation(p.id);
                      }}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        width: 28,
                        height: 28,
                        '&:hover': {
                          backgroundColor: '#ffebee'
                        }
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}

        {/* כפתור יצירת פלייליסט */}
        <Card
          sx={{
            height: 160, // גובה קבוע זהה
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f5f8ff, #e3f2fd)',
            border: '2px dashed rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0px 8px 20px rgba(102, 126, 234, 0.15)',
              background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)'
            }
          }}
          onClick={() => navigate("addPlaylist")}
        >
          <CardContent sx={{ 
            p: 3,
            textAlign: 'center',
            direction: 'rtl'
          }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                margin: '0 auto 16px',
                boxShadow: '0 4px 10px rgba(102, 126, 234, 0.2)'
              }}
            >
              <AddCircleIcon fontSize="large" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#667eea',
                mb: 1
              }}
            >
              צור פלייליסט חדש
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              הוסף אוסף שירים חדש
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Dialog לעריכת שם הפלייליסט */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            direction: "rtl",
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            pb: 2,
            pt: 2,
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          עריכת שם פלייליסט
        </DialogTitle>
        <DialogContent sx={{ dir: "rtl", pt: 3, pb: 2, px: 3 }}>
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
                borderRadius: 1,
                '&:hover fieldset': {
                  borderColor: '#667eea'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea'
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#667eea'
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, direction: 'rtl', gap: 1 }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            sx={{ 
              borderRadius: 4,
              px: 2
            }}
          >
            ביטול
          </Button>
          <Button 
            variant="contained" 
            onClick={handleEditSave}
            sx={{ 
              borderRadius: 4,
              px: 3,
              background: 'linear-gradient(to left, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(to left, #5a6fd8, #6a4190)'
              }
            }}
          >
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      {/* מודל אישור מחיקת פלייליסט */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            maxWidth: 400
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            direction: "rtl",
            textAlign: 'center',
            bgcolor: '#f44336',
            color: 'white',
            py: 2
          }}
        >
          אישור מחיקת פלייליסט
        </DialogTitle>
        <DialogContent sx={{ direction: "rtl", p: 3, pt: 3 }}>
          <Typography sx={{ textAlign: 'right', mb: 2 }}>
            האם אתה בטוח שברצונך למחוק את הפלייליסט?
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ textAlign: 'right' }}
          >
            פעולה זו תמחק את הפלייליסט וכל השירים שבו לא יהיו זמינים עוד ברשימה זו. פעולה זו לא ניתנת לביטול.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, direction: 'rtl', gap: 1 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3
            }}
          >
            ביטול
          </Button>
          <Button 
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              px: 3
            }}
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
});

export default PlaylistsList;