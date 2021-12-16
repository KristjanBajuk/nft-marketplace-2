import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import TokenIcon from '@mui/icons-material/Token';
import HardwareIcon from '@mui/icons-material/Hardware';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Container from '@mui/material/Container';
import '../styles/globals.css'
import './app.css'
import Link from 'next/link'

const drawerWidth = 240;

function KryptoBirdMarketplace({Component, pageProps}) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            NFT MARKETPLACE
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
          <Link href='/'>
            <ListItem button key={"Marketplace"}>
              <ListItemIcon>
                <StorefrontIcon />
              </ListItemIcon>
              <ListItemText primary={"Marketplace"} />
            </ListItem>
            </Link>
            <Link href='/mint-item'>
            <ListItem button key={"Mint Tokens"}>
              <ListItemIcon>
                <HardwareIcon />
              </ListItemIcon>
              <ListItemText primary={"Mint Tokens"} />
            </ListItem>
             </Link>
             <Link href='/my-nfts'>
            <ListItem button key={"My NFTs"}>
              <ListItemIcon>
                <TokenIcon />
              </ListItemIcon>
              <ListItemText primary={"My NFTs"} />
            </ListItem>
             </Link>
             <Link href='/account-dashboard'>
            <ListItem button key={"Account Dashboard"}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={"Account Dashboard"} />
            </ListItem>
             </Link>
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="xl">
           <Component {...pageProps} />
        </Container>
      </Box>
    </Box>
  );
}

export default KryptoBirdMarketplace;



