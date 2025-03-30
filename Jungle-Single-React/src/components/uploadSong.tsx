import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MenuItem, Select, TextField, FormControl, InputLabel, Button, Modal, Box, Typography, Snackbar, Alert } from "@mui/material";
import { Upload } from "@mui/icons-material";
import songStore from "../stores/songsStore";

const genres = ["שבת", "חנוכה", "פסח", "פורים", "סוכות", "חתונה", "שירי מלחמה", "חסידי", "מזרחי", "אחר"];

const UploadSong = () => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [isOpen, setIsOpen] = useState(true);
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("לא ידוע");
    const [genre, setGenre] = useState<string>("");
    const [customGenre, setCustomGenre] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const apiUrl = "https://localhost:7265"
    const token = localStorage.getItem('token')
    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        try {
            // שלב 1: קבלת Presigned URL מהשרת
            const response = await axios.get(apiUrl + '/api/upload/presigned-url', {
                params: { fileName: file.name }
            });

            const presignedUrl = response.data.url;
            (presignedUrl.substring(0, presignedUrl.lastIndexOf('/')))
            //image={`https://login-user-bucket-testpnoren.s3.us-east-1.amazonaws.com/${file?.fileName}`}
            // שלב 2: העלאת הקובץ ישירות ל-S3
            await axios.put(presignedUrl, file, {
                // headers: {
                //   'Content-Type': file.type,
                // },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setProgress(percent);
                },
            });
            const url = presignedUrl.substring(0, presignedUrl.lastIndexOf('/')) + "/" + file.name

            await songStore.addSong({ title: title, artist: artist, genre: genre === "אחר" ? customGenre : genre, audioUrl: url }, token!);
            setIsOpen(false);
            navigate('/songs')
        } catch (error) {
            alert(error);
        }
    };


    return (
        <Modal open={isOpen} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ backgroundColor: "whitesmoke", width: "40%", padding: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>🎵 הוספת שיר חדש</Typography>
                {message && <Typography color="error">{message}</Typography>}

                <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <TextField label="שם השיר" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
                    <TextField label="שם האמן" value={artist} onChange={(e) => setArtist(e.target.value)} required fullWidth />

                    <FormControl fullWidth>
                        <InputLabel>בחר תגית</InputLabel>
                        <Select value={genre} onChange={(e) => setGenre(e.target.value)} required>
                            {genres.map((g) => (
                                <MenuItem key={g} value={g}>{g}</MenuItem>
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
                        />
                    )}

                    <Button variant="contained" component="label" fullWidth>
                        בחר קובץ אודיו
                        <input type="file" accept="audio/*" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} required />
                    </Button>
                    {file && <p style={{ marginTop: "5px", fontWeight: "bold" }}> {file.name}</p>}
                    <Box display="flex" justifyContent="space-between">
                        <Button
                            variant="outlined"
                            startIcon={<Upload />}
                            sx={{
                                borderColor: "#1976d2",
                                color: "#1976d2",
                                borderRadius: "12px",
                                fontWeight: "bold",
                                padding: "8px 16px",
                                '&:hover': { backgroundColor: "rgba(25, 118, 210, 0.1)" }
                            }}
                            type="submit">
                            העלה שיר
                        </Button>
                        <Button onClick={() => navigate('/songs')} color="secondary">❌ ביטול</Button>
                    </Box>
                </form>
                {progress > 0 && <div><div> בהעלאה...{progress}%</div></div>}
                <Snackbar
                    open={progress == 100}
                    autoHideDuration={3000}
                    onClose={() => setProgress(0)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert severity="success" sx={{ fontSize: "1.2rem", textAlign: "center" }}> {file?.name}+ הועלה בהצלחה !</Alert>
                </Snackbar>
            </Box>
        </Modal>

    );
};

export default UploadSong;
