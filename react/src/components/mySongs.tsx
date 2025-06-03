import  { useContext, useEffect, useState } from 'react';
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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Playlist } from '../models/playlist';
import { observer } from 'mobx-react-lite';
import playlistStore from '../stores/playlistStore';


const PlaylistsList = observer(() => { {
  const user = useContext(UserContext);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  // משתני מצב חדשים למודל אישור מחיקה
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.user?.id) {
    playlistStore.fetchPlaylists(user.user.id)  
    }
  }, [user]);

  const openDeleteConfirmation = (id: string) => {
    setPlaylistToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (playlistToDelete) {
      playlistStore.deletePlaylist(playlistToDelete)

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
   playlistStore.updatePlaylist(editId, editName)
        setEditDialogOpen(false);
    setEditName('');
  };

  // הפונקציה שמייצרת צבע רקע רנדומלי עדין לכל פלייליסט
  // const getPlaylistColor = (id: string) => {
  //   // יוצרים צבע עדין מבוסס על ה-ID של הפלייליסט
  //   const colors = [
  //     '#f3e5f5', // סגול עדין
  //     '#e8f5e9', // ירוק עדין
  //     '#e3f2fd', // כחול עדין
  //     '#fff8e1', // צהוב עדין
  //     '#fce4ec', // ורוד עדין
  //     '#f1f8e9', // ירוק-לימון עדין
  //     '#e0f7fa', // תכלת עדין
  //     '#fff3e0'  // כתום עדין
  //   ];
    
    // בדיקה אם ה-ID הוא מחרוזת
  //   if (typeof id !== 'string') {
  //     // אם לא, נשתמש במספר קבוע
  //     return colors[0];
  //   }
    
  //   try {
  //     // משתמשים בתו האחרון של ה-ID כדי לבחור צבע
  //     const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  //     return colors[sum % colors.length];
  //   } catch (error) {
  //     // אם יש שגיאה, נחזיר צבע ברירת מחדל
  //     return colors[0];
  //   }
  // };

  return (
    <Container sx={{ py: 3 }}>
      <Outlet />
      
      <Box 
        sx={{ 
          mb: 4, 
          p: 3,
          background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
          borderRadius: 2,
          color: 'white',
          boxShadow: '0 4px 20px rgba(25, 118, 210, 0.25)'
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PlaylistPlayIcon sx={{ mr: 1, fontSize: 30 }} />
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
              height: 160, // גובה קבוע לכל הכרטיסים
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
                background: 'linear-gradient(to right, #1976d2, #64b5f6)',
                opacity: hoveredCard === p.id ? 1 : 0.7,
                transition: 'opacity 0.3s ease'
              }
            }}
            onClick={() => navigate(`/playlists/${p.id}`)}
          >
            <CardContent sx={{ 
              p: 3,
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              position: 'relative',
              zIndex: 1,
              background: 'linear-gradient(135deg, #ffffff, #f5f8ff)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2,
                width: '100%' // וודא שהקופסה תתפוס את כל הרוחב
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  maxWidth: 'calc(100% - 80px)' // שם הרחבה לא יחרוג לאיזור הכפתורים
                }}>
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      minWidth: 48, // מניעת הקטנת האייקון
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
                      color: 'white',
                      boxShadow: '0 4px 10px rgba(25, 118, 210, 0.2)'
                    }}
                  >
                    <FolderIcon fontSize="medium" />
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%' // מילוי הרוחב הזמין
                    }}
                  >
                    {p.name}
                  </Typography>
                </Box>

                <Box 
                  sx={{ 
                    opacity: hoveredCard === p.id ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                    display: 'flex',
                    gap: 0.5,
                    minWidth: 72, // רוחב מינימלי לכפתורים
                    justifyContent: 'flex-end'
                  }}
                >
                  <Tooltip title="ערוך">
                    <IconButton 
                      size="small" 
                      onClick={e => {
                        e.stopPropagation();
                        handleEditClick(p);
                      }}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          backgroundColor: '#e3f2fd'
                        }
                      }}
                    >
                      <EditIcon fontSize="small" sx={{ color: '#1976d2' }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="מחק">
                    <IconButton 
                      size="small" 
                      onClick={e => {
                        e.stopPropagation();
                        openDeleteConfirmation(p.id);
                      }}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          backgroundColor: '#ffebee'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Box sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    mt: 'auto', 
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <PlayArrowIcon fontSize="small" sx={{ color: '#1976d2' }} />
                  פתח פלייליסט
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* כפתור יצירת פלייליסט */}
        <Card
          sx={{
            height: 160, // גובה קבוע זהה לכרטיסי הפלייליסט
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f5f8ff, #e3f2fd)',
            border: '2px dashed rgba(25, 118, 210, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0px 8px 20px rgba(25, 118, 210, 0.15)',
              background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)'
            }
          }}
          onClick={() => navigate("addPlaylist")}
        >
          <CardContent sx={{ 
            p: 3,
            textAlign: 'center'
          }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
                color: 'white',
                margin: '0 auto 16px',
                boxShadow: '0 4px 10px rgba(25, 118, 210, 0.2)'
              }}
            >
              <AddCircleIcon fontSize="large" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#1976d2',
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
            background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
            color: 'white',
            pb: 2,
            pt: 2,
            fontWeight: 600
          }}
        >
          עריכת שם פלייליסט
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          <TextField
            fullWidth
            label="שם חדש"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            autoFocus
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
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
              background: 'linear-gradient(to right, #1976d2, #64b5f6)',
              '&:hover': {
                background: 'linear-gradient(to right, #1565c0, #42a5f5)'
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
            bgcolor: '#f44336',
            color: 'white',
            py: 2
          }}
        >
          אישור מחיקת פלייליסט
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Typography>
            האם אתה בטוח שברצונך למחוק את הפלייליסט?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            פעולה זו תמחק את הפלייליסט וכל השירים שבו לא יהיו זמינים עוד ברשימה זו. פעולה זו לא ניתנת לביטול.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
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
              px: 3,
              ml: 1
            }}
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
}
)
export default PlaylistsList;