import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button, TextField, Snackbar, Alert, Stack, Modal, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";
import { User } from "../models/User";

const Register = () => {
  const userContext = useContext(UserContext);
  const { user, setUser } = userContext!;
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: { name: string; email: string; password: string }) => {
    try {
      const userData = await registerUser(data.name, data.email, data.password);
      if (userData) {
        var myUser: User = { name: data.name, email: data.email, role: userData.newUser };
        setUser(myUser);
        navigate("/home");
        setIsOpen(false);
      } else {
        setError(true);
      }
    } catch (error: any) {
      setError(true);
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post("https://localhost:7265/api/auth/register", {
        UserName: name,
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      return null;
    }
  };

  return (
    <>
      <Box textAlign="center" mt={3}>
        {!isOpen && (
            <Button 
          
            onClick={() => setIsOpen(true)}
          sx={{  '&:hover': { backgroundColor: "#e3f2fd", borderColor: "#42a5f5" }}}
          >
           הרשמה
         </Button>
        )}
      </Box>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box bgcolor="white" p={4} borderRadius={3} boxShadow={3} width="30%">
          <Typography variant="h5" textAlign="center" gutterBottom>
            הרשמה למערכת
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="שם מלא"
                fullWidth
                {...register("name", { required: "נא להזין שם מלא" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

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
                <Button type="submit" variant="contained" color="success">
                  הרשמה
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
          ההרשמה נכשלה, נסה שוב.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Register;
