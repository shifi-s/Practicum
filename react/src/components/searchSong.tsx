import { InputAdornment, TextField, Box } from "@mui/material";
import { Search, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { useState, useRef } from "react";
import songStore from "../stores/songsStore";

const SearchSong = observer(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    songStore.setQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!songStore.query) {
      setIsExpanded(false);
    }
  };

  const handleClear = () => {
    songStore.setQuery("");
    setIsExpanded(false);
    inputRef.current?.blur();
  };

  const handleContainerClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  console.log("Filtered Songs:");

  return (
    <Box
      onClick={handleContainerClick}
      sx={{
        position: "relative",
        cursor: !isExpanded ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "48px",
        height: "48px",
      }}
    >
      <TextField
        ref={inputRef}
        dir="rtl"
        type="text"
        value={songStore.query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        variant="outlined"
        placeholder={isExpanded ? "חפש שירים..." : ""}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search
                size={20}
                style={{
                  color: "#9ca3af",
                }}
              />
            </InputAdornment>
          ),
          endAdornment: songStore.query && isExpanded ? (
            <InputAdornment position="end">
              <X
                size={18}
                onClick={handleClear}
                style={{
                  color: "#9ca3af",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#6b7280";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#9ca3af";
                }}
              />
            </InputAdornment>
          ) : null,
        }}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 1000,
          width: isExpanded 
            ? { xs: "250px", sm: "300px", md: "350px" }
            : "48px",
          height: "48px",
          "& .MuiInputBase-root": {
            height: "48px",
            borderRadius: isExpanded ? "24px" : "50%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
            },
            "&.Mui-focused": {
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiInputBase-input": {
            color: "#374151",
            fontSize: "0.95rem",
            fontWeight: 500,
            padding: isExpanded ? "12px 16px 12px 0" : "12px 0",
            opacity: isExpanded ? 1 : 0,
            "&::placeholder": {
              color: "#9ca3af",
              opacity: 0.8,
              fontWeight: 400,
            },
          },
          "& .MuiInputAdornment-root": {
            margin: isExpanded ? "0 8px 0 0" : "0",
            position: isExpanded ? "static" : "absolute",
            left: isExpanded ? "auto" : "50%",
            top: isExpanded ? "auto" : "50%",
            transform: isExpanded ? "none" : "translate(-50%, -50%)",
            transition: "all 0.3s ease",
          },
        }}
      />
    </Box>
  );
});

export default SearchSong;