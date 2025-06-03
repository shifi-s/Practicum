import { makeObservable, observable, action, runInAction, computed } from 'mobx';
import axios from 'axios';
import { Playlist } from '../models/playlist';
import { Song } from '../models/Song';
import { useContext } from 'react';
import { UserContext } from '../components/userContext';

// URL בסיס ל-API
const API_BASE_URL = 'https://localhost:7265';
class PlaylistStore {
  // מצב אובזרבבל
  playlists: Playlist[] = [];
  playlistSongs: { [playlistId: string]: Song[] } = {};
  loading: boolean = false;
  error: string | null = null;
  
  constructor() {
    // הגדרת מצבים והפעולות כאובזרבבלים
    makeObservable(this, {
      // מצבים
      playlists: observable,
      playlistSongs: observable,
      loading: observable,
      error: observable,
      
      // פעולות
      fetchPlaylists: action,
      addPlaylist: action,
      updatePlaylist: action,
      deletePlaylist: action,
      fetchPlaylistSongs: action,
      addSongToPlaylist: action,
      removeSongFromPlaylist: action,
      setLoading: action,
      setError: action,
      
      // תכונות מחושבות
      playlistCount: computed,
      hasSongs: computed
    });
  }
  
  // תכונות מחושבות
  get playlistCount() {
    return this.playlists.length;
  }
  
  get hasSongs() {
    return Object.values(this.playlistSongs).some(songs => songs.length > 0);
  }
  
  // סטטוס טעינה
  setLoading(status: boolean) {
    this.loading = status;
  }
  
  // הגדרת שגיאה
  setError(message: string | null) {
    this.error = message;
  }
  
  // טעינת כל הפלייליסטים
  async fetchPlaylists(userId: number) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const response =  await axios
      .get(`https://localhost:7265/api/playlists?userId=${userId}`)

      // עדכון המצב באמצעות runInAction כדי לשמור על אטומיות
      runInAction(() => {
        this.playlists = response.data;
        this.loading = false;
      });
    } catch (error) {
      console.error('Error fetching playlists:', error);
      
      runInAction(() => {
        this.error = 'שגיאה בטעינת רשימות השמעה';
        this.loading = false;
      });
    }
  }
  
  // יצירת פלייליסט חדש
  async addPlaylist( name: string,userId:number): Promise<string | null> {
    this.setLoading(true);
    this.setError(null);
  
      try {
        const response = await axios.post('https://localhost:7265/api/playlists', { name: name, userId: userId });  
        
   
      
      runInAction(() => {
        this.playlists.push(response.data);
        this.loading = false;
      });
      
      return response.data.id; // החזרת ה-ID של הפלייליסט החדש
    } catch (error) {
      console.error('Error adding playlist:', error);
      
      runInAction(() => {
        this.error = 'שגיאה ביצירת פלייליסט חדש';
        this.loading = false;
      });
      
      return null;
    }
  }


  // עדכון שם פלייליסט
  async updatePlaylist(playlistId: string, name: string) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      await axios.put(
        `${API_BASE_URL}/api/playlists/${playlistId}`, 
        name, 
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      runInAction(() => {
        // עדכון הפלייליסט במערך
        const index = this.playlists.findIndex(p => p.id === playlistId);
        if (index !== -1) {
          this.playlists[index] = { ...this.playlists[index], name };
        }
        this.loading = false;
      });
    } catch (error) {
      console.error('Error updating playlist:', error);
      
      runInAction(() => {
        this.error = 'שגיאה בעדכון פלייליסט';
        this.loading = false;
      });
    }
  }
  
  // מחיקת פלייליסט
  async deletePlaylist(playlistId: string) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      await axios.delete(`${API_BASE_URL}/api/playlists/${playlistId}`);
      
      runInAction(() => {
        // מחיקת הפלייליסט מהמערך
        this.playlists = this.playlists.filter(p => p.id !== playlistId);
        
        // מחיקת השירים השייכים לפלייליסט
        if (this.playlistSongs[playlistId]) {
          delete this.playlistSongs[playlistId];
        }
        
        this.loading = false;
      });
    } catch (error) {
      console.error('Error deleting playlist:', error);
      
      runInAction(() => {
        this.error = 'שגיאה במחיקת פלייליסט';
        this.loading = false;
      });
    }
  }
  
  // טעינת שירים מפלייליסט ספציפי
  async fetchPlaylistSongs(playlistId: string) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/playlists/${playlistId}/songs`);
      
      runInAction(() => {
        this.playlistSongs[playlistId] = response.data;
        this.loading = false;
      });
    } catch (error) {
      console.error('Error fetching playlist songs:', error);
      
      runInAction(() => {
        this.error = 'שגיאה בטעינת שירים מהפלייליסט';
        this.loading = false;
      });
    }
  }
  
  // הוספת שיר לפלייליסט
  async addSongToPlaylist(playlistId: string, songId: string) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      await axios.post(
        `${API_BASE_URL}/api/playlists/${playlistId}/addSong`, 
        songId, 
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      // קבלת מידע מלא על השיר שנוסף
      const songResponse = await axios.get(`${API_BASE_URL}/api/songs/${songId}`);
      
      runInAction(() => {
        // אם עדיין אין רשימת שירים לפלייליסט זה, נייצר אחת חדשה
        if (!this.playlistSongs[playlistId]) {
          this.playlistSongs[playlistId] = [];
        }
        
        // הוספת השיר לרשימה
        this.playlistSongs[playlistId].push(songResponse.data);
        this.loading = false;
      });
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      
      runInAction(() => {
        this.error = 'שגיאה בהוספת שיר לפלייליסט';
        this.loading = false;
      });
    }
  }
  
  // הסרת שיר מפלייליסט
  async removeSongFromPlaylist(playlistId: string, songId: string) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      await axios.delete(`${API_BASE_URL}/api/playlists/${playlistId}/removeSong/${songId}`);
      
      runInAction(() => {
        // אם קיימת רשימת שירים לפלייליסט זה
        if (this.playlistSongs[playlistId]) {
          // הסרת השיר מהרשימה
          this.playlistSongs[playlistId] = this.playlistSongs[playlistId].filter(
            song => song.id !== Number(songId)
          );
        }
        
        this.loading = false;
      });
    } catch (error) {
      console.error('Error removing song from playlist:', error);
      
      runInAction(() => {
        this.error = 'שגיאה בהסרת שיר מהפלייליסט';
        this.loading = false;
      });
    }
  }
  
  // איפוס שגיאות
  resetError() {
    this.error = null;
  }
}

// יצירת סינגלטון של הסטור
const playlistStore = new PlaylistStore();
export default playlistStore;