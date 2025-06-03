import { Avatar, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Box, Typography, Divider } from "@mui/material"
import { useContext, useState } from "react"
import React from "react"
import { Logout, Settings, AccountCircle } from "@mui/icons-material"
import { UserContext } from "./userContext"
import { useNavigate } from "react-router-dom"

const UserProfil = ({ setUpdate }: { setUpdate: Function }) => {
  const userContext = useContext(UserContext)
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const update = () => {
    handleClose()
    setUpdate(true)
  }
  const logOut = () => {
    userContext?.setUser(null)
   sessionStorage.removeItem("token")
    navigate('/')
  }

  return (
    <>
      <Tooltip 
        title="הגדרות חשבון" 
        arrow
        sx={{
          '& .MuiTooltip-arrow': {
            color: 'rgba(25, 118, 210, 0.9)'
          },
          '& .MuiTooltip-tooltip': {
            backgroundColor: 'rgba(25, 118, 210, 0.9)',
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: '6px',
            padding: '6px 12px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }
        }}
      >
        <IconButton 
          onClick={handleClick}
          size="small" 
          sx={{
            ml: 1,
            padding: 0,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: 'white',
              color: '#1a237e', 
              width: 38, 
              height: 38,
              fontWeight: 'bold',
              fontSize: '1rem',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 2px 6px rgba(0, 77, 153, 0.2)'
            }}
          >
            {userContext?.user?.name[0]}
          </Avatar>
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 12px rgba(0,0,0,0.32))',
              mt: 1.5,
              borderRadius: '12px',
              width: 220,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translatey(-50%) rotate(45deg)',
                zIndex: 0,
                boxShadow: '-3px -3px 5px rgba(0,0,0,0.08)'
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User profile header */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center'
        }}>
          <Avatar 
            sx={{ 
              bgcolor: 'rgb(25, 118, 210)',
              color: 'white', 
              width: 60, 
              height: 60,
              fontSize: '1.5rem',
              mb: 1,
              border: '3px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 8px rgba(0, 77, 153, 0.2)'
            }}
          >
            {userContext?.user?.name[0]}
          </Avatar>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 'bold',
              color: 'rgb(25, 118, 210)'
            }}
          >
            {userContext?.user?.name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.8rem',
              opacity: 0.7
            }}
          >
            משתמש פעיל
          </Typography>
        </Box>
        
        <Divider 
          sx={{
            my: 1,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.2), transparent)'
          }}
        />
        
        <MenuItem 
          onClick={update}
          sx={{
            py: 1.5,
            pl: 2,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(0, 77, 153, 0.08)',
              paddingLeft: '16px'
            }
          }}
        >
          <ListItemIcon sx={{ color: 'rgb(25, 118, 210)' }}>
            <Settings fontSize="small" />
          </ListItemIcon>
          <Typography 
            sx={{ 
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          >
            עדכון פרטים
          </Typography>
        </MenuItem>
        
        <MenuItem 
          onClick={() => logOut()}
          sx={{
            py: 1.5,
            pl: 2,
            color: 'error.main',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.08)',
              paddingLeft: '16px'
            }
          }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Typography 
            sx={{ 
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          >
            התנתקות
          </Typography>
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserProfil