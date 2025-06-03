import { createBrowserRouter } from "react-router";
import AppLayOut from "./components/ApplayOut";
import Songs from "./components/Songs";
import UploadSong from "./components/uploadSong";

import MySongs from "./components/mySongs";
import NewSongs from "./components/newSongs";
import CreatePlaylistModal from "./components/AddPlalist";
import PlaylistSongs from "./components/playlistSongs";
import Terms from "./components/terms";





const MyRouter = createBrowserRouter([{

    path: '/',
    element: <AppLayOut />,
    children: [
      {path: '/terms', element: <Terms /> },
    // {path:'login',element:<Login  />},
    // {path:'register',element:<Register/>},
   { path:"playlists/:id",element:<PlaylistSongs/>},
     {path:'mySongs',element:<MySongs/>,children:[{path:"addPlaylist",element:<CreatePlaylistModal/>}]}, 
     {path:"songs", element:<Songs />, children:[{path:"uploadSong", element:<UploadSong/>}
]},{path:'newSongs',element:<NewSongs/>}]}])

export default MyRouter;