import React from 'react'
import { Link } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import HomeIcon from '@mui/icons-material/Home'
import GroupIcon from '@mui/icons-material/Group'
// import Button from '@mui/material/Button'
// import CartIcon from '@mui/icons-material/ShoppingCart'
// import Badge from '@mui/material/Badge'

const Menu = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        MERN Online Shop
      </Typography>
      <div>
        <Link to="/">
          <IconButton aria-label="Home">
            <HomeIcon />
          </IconButton>
        </Link>
        <Link to="/users">
          <IconButton aria-label="Users">
            <GroupIcon />
          </IconButton>
        </Link>
      </div>
    </Toolbar>
  </AppBar>
)

export default Menu
