import {  useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import {Delete} from "@mui/icons-material"
import { set } from "mobx";
const DeleteSong = ({id}:{id:number}) => {
      const[toDelete,setToDelete]=useState(false)
    const [message, setMessage] = useState("");
const navigate=useNavigate()
    const confirmDelete = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Unauthorized: You must be logged in");
            return;
        }

        try {
            await axios.delete(`https://localhost:7265/api/songs/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage("Song deleted successfully!");
            setToDelete(false)
            navigate('/songs')
        } catch (error: any) {
            console.error("Delete failed:", error);
            setMessage(error.response?.data?.message || "Delete failed.");
        }
    };

    return (
        <>
           <Tooltip title="מחק שיר" arrow>
    <IconButton 
      onClick={() => setToDelete(true)} 
      color="error"
      sx={{ mt: 1 }}
    >
      <Delete />
    </IconButton>
  </Tooltip>
      <Dialog open={toDelete} onClose={() => setToDelete(false)}>
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <DialogContentText>האם אתה בטוח שברצונך למחוק את השיר?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(false)} color="primary">ביטול</Button>
          <Button onClick={confirmDelete} color="error">מחק</Button>
        </DialogActions>
      </Dialog>
     </>
    );
};

export default DeleteSong;
