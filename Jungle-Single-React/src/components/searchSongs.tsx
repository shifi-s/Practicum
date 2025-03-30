import { useState, useEffect } from "react";
import { TextField } from "@mui/material";

interface SearchSongsProps {
  onSearch: (query: string) => void;
}

const SearchSongs: React.FC<SearchSongsProps> = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  // שימוש ב-debounce: קריאה לשרת רק אחרי 500ms מהקלדה אחרונה
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchInput);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, onSearch]);

  return (
    <TextField
      type="text"
      placeholder="חפש שיר לפי שם, זמר או תגית..."
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      style={{
        position: "absolute",
        top: "10px",
        left: "160px",
        padding: "10px",
        width: "300px",
      }}
    />
  );
};

export default SearchSongs;
