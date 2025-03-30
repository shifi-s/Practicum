import { makeAutoObservable } from "mobx";
import { Song } from "../models/Song";
import axios from "axios";

class SongStore {
apiUrl="https://localhost:7265"

  songs: Song[] = []; // רשימת השירים

  constructor() {
    makeAutoObservable(this);
  }

  // פונקציה להוספת שיר
  async addSong(song:Partial<Song>,token:string) {
    
    if (!token) {
        return;
    }
    try {
        await axios.post("https://localhost:7265/api/songs", song, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error: any) {
        console.error("Upload failed:", error.response?.data?.message);
    }
  }

  // פונקציה למחיקת שיר לפי ID
  removeSong(id: number) {
    const token = localStorage.getItem("token");
    async () => {
      if (!token) {
          ("Unauthorized: You must be logged in");
          return;
      }

      try {
          await axios.delete(`https://localhost:7265/api/songs/${id}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          ("Song deleted successfully!");
          this.fetchSongs()
      } catch (error: any) {
          console.error("Delete failed:", error);
         (error.response?.data?.message || "Delete failed.");
      }
  };
  }

  // פונקציה להוספת שירים מהשרת
  fetchSongs = async () => {
    try {
      const response = await axios.get(this.apiUrl + "/api/songs");
      this.songs=(response.data);
    } catch (err) {
      console.error("Error fetching songs:", err);
    }
  };
}

const songStore = new SongStore();
export default songStore;
