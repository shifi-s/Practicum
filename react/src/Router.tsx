import { createBrowserRouter } from "react-router";
import AppLayOut from "./components/ApplayOut";
import Songs from "./components/Songs";
import UploadSong from "./components/uploadSong";

import NewSongs from "./components/newSongs";
import CreatePlaylistModal from "./components/AddPlalist";
import PlaylistSongs from "./components/playlistSongs";
import Terms from "./components/terms";
import PlaylistsList from "./components/mySongs";
import Home from "./components/Home";





const MyRouter = createBrowserRouter([{

    path: '/',
    element: <AppLayOut />,
    children: [
      {path:'/', element: <Home />},
          {path: '/terms', element: <Terms /> },
    // {path:'login',element:<Login  />},
    // {path:'register',element:<Register/>},
   { path:"myPlaylists/:id",element:<PlaylistSongs/>},
     {path:'myPlaylists',element:<PlaylistsList/>,children:[{path:"addPlaylist",element:<CreatePlaylistModal/>}]}, 
     {path:"songs", element:<Songs />, children:[{path:"uploadSong", element:<UploadSong/>}
]},{path:'newSongs',element:<NewSongs/>}]}])

export default MyRouter;