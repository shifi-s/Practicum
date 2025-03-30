import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Alert, AlertTitle, Button, Snackbar, Stack, TextField, Modal, Typography, Box } from "@mui/material";
import { UserContext } from "./userContext";
import { User } from "../models/User";
import { Login as LoginIcon } from "@mui/icons-material";

const Login = () => {
  const { user, setUser } = useContext(UserContext)!;
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const response = await axios.post("https://localhost:7265/api/auth/login", data);
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
        const user: User = {
          name: response.data.user.userName,
          email: response.data.user.email,
          role: response.data.user.role,
        };
        setUser(user);
        navigate("/mySongs");
        setIsOpen(false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  return (
    <>
      <Box textAlign="center" mt={3}>
        {!isOpen && (
         <Button 

         onClick={() => setIsOpen(true)}
         sx={{ 
         
           '&:hover': { backgroundColor: "#e3f2fd", borderColor: "#42a5f5" }
         }}
       >
          התחברות
        </Button>
        )}
      </Box>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box bgcolor="white" p={4} borderRadius={3} boxShadow={3} width="30%">
          <Typography variant="h5" textAlign="center" gutterBottom>
            התחברות למערכת
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="אימייל"
                fullWidth
                type="email"
                {...register("email", { required: "נא להזין אימייל" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="סיסמה"
                fullWidth
                type="password"
                {...register("password", { required: "נא להזין סיסמה" })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button type="submit" variant="contained" color="success" startIcon={<LoginIcon />}>
                  התחבר
                </Button>
                <Button variant="outlined" color="error" onClick={() => setIsOpen(false)}>
                  ביטול
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Modal>

      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(false)}>
          המשתמש לא נמצא: האימייל או הסיסמה אינם נכונים
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
