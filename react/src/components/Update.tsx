import { useContext, useState } from "react";
import { Modal, TextField, Button, Stack, Snackbar, Alert, Fade, Paper, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";

import { UserContext } from "./userContext";
import axios from "axios";
import { User } from "../models/User";

interface UpdateUserDto {
  name: string;
  email: string;
}

export default function UpdateUserModal({ onClose }: { onClose: Function }) {
  const apiUrl = import.meta.env.VITE_API_URL 
  const { user, setUser } = useContext(UserContext)!;
  const [open] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserDto>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const updateUser = async (userToUpdate: UpdateUserDto, token: string) => {
    const response = await axios.put(`${apiUrl}/api/users/${user?.id}`, userToUpdate, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  const onSubmit = async (data: UpdateUserDto) => {
    try {
      const token = sessionStorage.getItem("token") || "";
      const result = await updateUser(data, token);
       const user: User = {
                name: result.user1.userName,
                email: result.user1.email,
                role: result.user1.role,
                id: result.user1.id,
              };
      setUser(user); // מהחזרת השרת
      localStorage.setItem("user", JSON.stringify(user));
      setSuccess(true);
      reset();
       // סגירת המודל לאחר עדכון מוצלח
    } catch {
      setError(true);
    }
  };

  return (
    <Modal open={open} onClose={() => onClose()}>
      <>
        <Fade in={open} timeout={300}>
          <Paper
            sx={{
              maxWidth: 450,
              mx: "auto",
              mt: 10,
              p: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f0f4ff, #ffffff)',
              boxShadow: 6,
              position: "relative"
            }}
          >
            <IconButton
              onClick={() => onClose()}
              sx={{ position: "absolute", top: 12, left: 12, color: "gray" }}
            >
              <Close />
            </IconButton>
            <Typography variant="h6" fontWeight={600} mb={3} textAlign="center">
              עדכון פרטי משתמש
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <TextField
                  label="שם מלא"
                  {...register("name", { required: "שדה חובה" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                />
                <TextField
                  label="אימייל"
                  {...register("email", {
                    required: "שדה חובה",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "אימייל לא תקין",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    fontWeight: 600,
                    background: "linear-gradient(45deg, #3a86ff, #4361ee)",
                    boxShadow: "0 3px 10px rgba(58, 134, 255, 0.3)",
                    '&:hover': {
                      background: "linear-gradient(45deg, #4361ee, #3a86ff)",
                    }
                  }}
                >
                  שמירה
                </Button>
              </Stack>
            </form>
          </Paper>
        </Fade>

        {/* התראות */}
        <Snackbar open={success} anchorOrigin={{ vertical: "top", horizontal: "center" }} autoHideDuration={500} onClose={() => {setSuccess(false);onClose();}}>
          <Alert severity="success" variant="filled" onClose={() => {setSuccess(false);onClose();}}>
            המשתמש עודכן בהצלחה
          </Alert>
        </Snackbar>

        <Snackbar open={error} autoHideDuration={4000} anchorOrigin={{ vertical: "top", horizontal: "center" }} onClose={() => setError(false)}>
          <Alert severity="error" variant="filled" onClose={() => setError(false)}>
            שגיאה בעדכון המשתמש
          </Alert>
        </Snackbar>
      </>
    </Modal>
  );
}
