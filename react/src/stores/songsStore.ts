import { makeAutoObservable } from "mobx";
import { Song } from "../models/Song";
import axios from "axios";
const apiUrl=import.meta.env.VITE_API_URL
class SongStore {


  songs: Song[] = []; // רשימת השירים
  query: string = ""

  constructor() {
    makeAutoObservable(this);
  }
  setQuery(query: string) {
    this.query = query
  }
  sortBy: 'none'|'uploadDate' | 'artistName' | 'songName' = 'none'; // משתנה לסידור השירים

setSortBy(sortBy: 'uploadDate' | 'artistName' | 'songName'|'none') {
  this.sortBy = sortBy;
}

  isFromLastWeek = (date: Date | string) => {
    const uploadDate = new Date(date);
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    
    return uploadDate >= oneWeekAgo && uploadDate <= now;
  };
  get fetchNewSongs(){    
    const newSongs = this.songs.filter(song => this.isFromLastWeek(song.uploadDate));

    return newSongs.slice(0, 5);
  }
  get filteredSongs() {
    const query = this.query.toLowerCase().trim();
    let filtered = this.songs.filter(song => !song.isDeleted);
  
    if (query) {
      const terms = query.split(' ').filter(term => term);
      filtered = filtered.filter(song =>
        terms.every(term =>
          song.tags?.toLowerCase().includes(term)
        )
      );
    }
  
    return filtered.slice().sort((a, b) => {
      if (this.sortBy == 'uploadDate') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
      if (this.sortBy == 'artistName') {
        return a.artist.localeCompare(b.artist);
      }
      if (this.sortBy == 'songName') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }
    // פונקציה להוספת שיר

  async addSong(song:Partial<Song>,token:string) {
    
    if (!token) {
        alert('noo')
        return;
    }
    try {
      alert('add song')
        await axios.post(`${apiUrl}/api/songs`, song, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        await this.fetchSongs();
    } catch (error: any) {
        console.error("Upload failed:", error.response?.data?.message);
    }
  }

  // פונקציה למחיקת שיר לפי ID
  removeSong(id: number) {
    const token = sessionStorage.getItem("token");
    async () => {
      if (!token) {
          ("Unauthorized: You must be logged in");
          return;
      }

      try {
          await axios.delete(`${apiUrl}/api/songs/${id}`, {
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

  searchSongs = async (query: string) => {
  const tags=query.split(" ")
    this.songs=this.songs.filter((song) =>(tags.some(tag => song.tags?.includes(tag)) ))
  
    // if(this.songs.length===0){
    //   this.fetchSongs();
    //   };
    }
  // פונקציה להוספת שירים מהשרת
  fetchSongs = async () => {
    try {
      const response = await axios.get(apiUrl + "/api/songs");
      this.songs=(response.data);
    } catch (err) {
      console.error("Error fetching songs:", err);
    }
  };
}

const songStore = new SongStore();
export default songStore;
