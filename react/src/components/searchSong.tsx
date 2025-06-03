import { Fade, InputAdornment, TextField } from "@mui/material";
import { Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import React from "react";
import songStore from "../stores/songsStore";

const SearchSong = observer(() => {  

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    songStore.setQuery(e.target.value)
  }

console.log("Filtered Songs:");

    return(<>
                    <Fade  in={true} timeout={600}>
                  <TextField
                    dir="rtl"
                    type="text"
                    fullWidth
                    value={songStore.query}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="חפש שירים..."
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search 
                            style={{ 
                              color: "#667eea", 
                              fontSize: "20px",
                              filter: "drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))" 
                            }} 
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(20px)",
                      borderRadius: "25px",
                      width: { xs: "140px", sm: "200px", md: "240px" },
                      "& .MuiInputBase-root": {
                        height: "44px",
                        overflow: "hidden",
                        borderRadius: "25px",
                        boxShadow: "0 4px 20px rgba(255, 255, 255, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.8)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        "&:hover": {
                          boxShadow: "0 8px 32px rgba(255, 255, 255, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.9)",
                          transform: "translateY(-2px) scale(1.02)",
                        },
                        "&.Mui-focused": {
                          boxShadow: "0 12px 40px rgba(102, 126, 234, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.9)",
                          transform: "translateY(-2px) scale(1.02)",
                          backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "transparent",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(102, 126, 234, 0.3)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#667eea",
                        borderWidth: "2px",
                      },
                      input: {
                        color: "#4c63d2",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        padding: "12px 16px 12px 0",
                        "&::placeholder": {
                          color: "#8b9dc3",
                          opacity: 0.9,
                          fontWeight: 500,
                        },
                      },
                    }}
                  />
                </Fade>
                
    </>)
})
export default SearchSong;