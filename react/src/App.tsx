
import { BrowserRouter as Router, Routes, Route, NavLink, RouterProvider } from "react-router-dom";
import './App.css'

import MyRouter from "./Router";
import { Modal } from "@mui/material";
import { ModalProvider } from "./components/modalContext";

function App() {
  

  return (
    <>
 <RouterProvider router={MyRouter} />

    </>
  )
}

export default App
