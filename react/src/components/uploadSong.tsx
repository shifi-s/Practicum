import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  MenuItem, 
  Select, 
  TextField, 
  FormControl, 
  InputLabel, 
  Button, 
  Modal, 
  Box, 
  Typography, 
  Snackbar, 
  Alert,
  Paper, 
  IconButton,
  Stack,
  LinearProgress,
  Fade,
  Divider,
  InputAdornment
} from "@mui/material";
import { 
  Upload, 
  Close, 
  MusicNote, 
  Person, 
  Label, 
  AudioFile 
} from "@mui/icons-material";
import songStore from "../stores/songsStore";

import { parseBlob } from "music-metadata-browser";
import { Buffer } from "buffer";
import { observer } from "mobx-react-lite";
(window as any).Buffer = Buffer;

const genres = ["סוער","רגש","שבת", "חנוכה", "פסח", "פורים", "סוכות", "חתונה", "שירי מלחמה", "חסידי", "מזרחי", "אחר"];

const UploadSong = observer(() => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [isOpen, setIsOpen] = useState(true);
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState<string>("");
    const [customGenre, setCustomGenre] = useState("");
    const [message] = useState("");
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL
    const token = sessionStorage.getItem('token')

    const uploadCoverToS3 = async (coverBlob: Blob, fileName: string): Promise<string | null> => {
        try {
            const coverRes = await axios.get(apiUrl + '/api/upload/presigned-url', {
                params: { fileName:fileName,contentType: coverBlob.type }   
            });
            const coverUrl = coverRes.data.url;
            await axios.put(coverUrl, coverBlob, {
                headers: { 'Content-Type': coverBlob.type }
            });
            
            return coverUrl.substring(0, coverUrl.lastIndexOf('/')) + '/' + fileName;
        } catch (err) {
            console.error("Failed to upload cover:", err);
            return null;
        }
    }

    const extractCoverArtUrl = async (fileUrl: string): Promise<string | null> => {
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const metadata = await parseBlob(blob);
            if (metadata.common.picture?.length) {
                const cover = metadata.common.picture[0];
                const coverBlob = new Blob([cover.data], { type: cover.format });
                return await uploadCoverToS3(coverBlob, `cover-${Date.now()}.jpg`);
            }
        } catch (error) {
            console.error("Error extracting cover art:", error);
        }
        return null;
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        try {
            const response = await axios.get(apiUrl + '/api/upload/presigned-url', {
                params: { fileName: file.name, contentType: file.type }
            });
            const presignedUrl = response.data.url;
            await axios.put(presignedUrl, file, { 
                headers: { 'Content-Type': file.type },
                onUploadProgress: (progressEvent: any) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setProgress(percent);
                },
            });
            const url = presignedUrl.substring(0, presignedUrl.lastIndexOf('/')) + "/" + file.name;
            if(customGenre.length>0)genres.push(customGenre);

            const coverUrl = await extractCoverArtUrl(url);

            await songStore.addSong({
                title: title,
                artist: artist,
                genre: genre === "אחר" ? customGenre : genre,
                audioUrl: url,
                coverUrl: coverUrl || "",
            }, token!);
            setTimeout(() => {
                setIsOpen(false);
                navigate('/songs');
              }, 1500);
              songStore.fetchSongs()
            
        } catch (error) {
            alert(error);
        }
    };

    return (
        <Modal 
          open={isOpen} 
          onClose={() => navigate('/songs')}
          closeAfterTransition
          sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            backdropFilter: 'blur(8px)'
          }}
        >
          <>
            <Fade in={isOpen} timeout={400}>
              <Paper 
                elevation={24} 
                sx={{ 
                  maxWidth: "550px",
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
                  p: 3, 
                  pb: 2, 
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
                  <MusicNote sx={{ mr: 1.5, fontSize: 26, filter: 'drop-shadow(0 2px 3px rgba(58, 134, 255, 0.3))' }} />
                  הוספת שיר חדש
                </Typography>
                <IconButton 
                  onClick={() => navigate('/songs')}
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
              <Box p={3}>
                {message && <Typography color="error" sx={{ mb: 2 }}>{message}</Typography>}
                <form onSubmit={handleUpload}>
                  <Stack spacing={2.5}>
                    <TextField 
                      label="שם השיר" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      required 
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MusicNote sx={{ color: '#3a86ff' }} />
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
                      label="שם האמן" 
                      value={artist} 
                      onChange={(e) => setArtist(e.target.value)} 
                      required 
                      fullWidth
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
                    
                    <FormControl 
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2.5,
                          transition: 'all 0.2s',
                          backgroundColor: 'rgba(245, 247, 255, 0.8)',
                          '&:hover': {
                            backgroundColor: 'rgba(245, 247, 255, 1)'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3a86ff',
                            borderWidth: '1.5px'
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                            boxShadow: '0 0 0 3px rgba(58, 134, 255, 0.15)'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3a86ff',
                            borderWidth: '1.5px'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#3a86ff'
                        },
                        '& .MuiSelect-icon': {
                          color: '#3a86ff'
                        }
                      }}
                    >
                      <InputLabel 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px'
                        }}
                      >
                        <Label sx={{ fontSize: 20, color: '#3a86ff' }} />
                        בחר תגית
                      </InputLabel>
                      <Select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        required
                        MenuProps={{
                          PaperProps: { 
                            style: { 
                              maxHeight: 300, 
                              width: 250,
                              borderRadius: '12px',
                              padding: '6px',
                              marginTop: '8px'
                            } 
                          },
                          anchorOrigin: { vertical: "bottom", horizontal: "left" },
                          transformOrigin: { vertical: "top", horizontal: "left" },
                        }}
                      >
                        {genres.map((g) => (
                          <MenuItem 
                            key={g} 
                            value={g}
                            sx={{
                              borderRadius: '8px',
                              my: 0.5,
                              transition: 'all 0.2s',
                              '&:hover': {
                                backgroundColor: 'rgba(58, 134, 255, 0.08)'
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(58, 134, 255, 0.15)',
                                '&:hover': {
                                  backgroundColor: 'rgba(58, 134, 255, 0.2)'
                                }
                              }
                            }}
                          >
                            {g}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    {genre === "אחר" && (
                      <TextField
                        label="הכנס תגית משלך"
                        value={customGenre}
                        onChange={(e) => setCustomGenre(e.target.value)}
                        fullWidth
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Label sx={{ color: '#3a86ff' }} />
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
                    )}
                    
                    <Box 
                      sx={{ 
                        mt: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5
                      }}
                    >
                      <Button 
                        variant="outlined" 
                        component="label" 
                        fullWidth
                        startIcon={<AudioFile />}
                        sx={{
                          borderColor: '#3a86ff',
                          color: '#3a86ff',
                          borderRadius: 2.5,
                          borderWidth: '1.5px',
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          py: 1.2,
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#4361ee',
                            backgroundColor: 'rgba(58, 134, 255, 0.08)',
                            borderWidth: '1.5px'
                          }
                        }}
                      >
                        בחר קובץ אודיו
                        <input 
                          type="file" 
                          accept="audio/*" 
                          hidden 
                          onChange={(e) => setFile(e.target.files?.[0] || null)} 
                          required 
                        />
                      </Button>
                      
                      {file && (
                        <Box 
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'rgba(58, 134, 255, 0.08)',
                            border: '1px dashed rgba(58, 134, 255, 0.4)'
                          }}
                        >
                          <AudioFile 
                            sx={{ 
                              color: '#3a86ff',
                              fontSize: 28
                            }} 
                          />
                          <Typography 
                            sx={{ 
                              fontWeight: 600,
                              color: '#3a86ff'
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {progress > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress} 
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(58, 134, 255, 0.15)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#3a86ff',
                              borderRadius: 4
                            }
                          }}
                        />
                        <Typography 
                          align="center" 
                          sx={{ 
                            mt: 1, 
                            color: '#3a86ff',
                            fontWeight: 600 
                          }}
                        >
                          {progress}% בהעלאה
                        </Typography>
                      </Box>
                    )}
                    
                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        startIcon={<Upload />}
                        type="submit"
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
                      >
                        העלה שיר
                      </Button>
                    </Box>
                  </Stack>
                </form>
              </Box>
            </Paper>
          </Fade>
          
          <Snackbar
            open={progress >= 100}
            autoHideDuration={3000}
            onClose={() => {
              setProgress(0);
              navigate('/songs');
            }}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert 
              severity="success" 
              variant="filled"
              sx={{ 
                fontSize: "1rem", 
                borderRadius: 2,
                boxShadow: '0 6px 16px rgba(46, 184, 114, 0.2)',
                fontWeight: 500
              }}
            >
              {file?.name} הועלה בהצלחה!
            </Alert>
          </Snackbar>
          </>
        </Modal>
    );
})
export default UploadSong;