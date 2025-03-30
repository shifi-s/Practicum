import { createBrowserRouter } from "react-router";
import AppLayOut from "./components/ApplayOut";
import Home from "./components/Home";
import Songs from "./components/Songs";
import UploadSong from "./components/uploadSong";
import Register from "./components/register";
import Login from "./components/login";
import MySongs from "./components/mySongs";
import NewSongs from "./components/newSongs";





const MyRouter = createBrowserRouter([{

    path: '/',
    element: <AppLayOut />,
    children: [
    {path:'login',element:<Login/>},
    {path:'register',element:<Register/>},
     {path:'mySongs',element:<MySongs/>}, 
     {path:"songs", element:<Songs />, children:[{path:"uploadSong", element:<UploadSong/>}
]},{path:'newSongs',element:<NewSongs/>}]}])

export default MyRouter;