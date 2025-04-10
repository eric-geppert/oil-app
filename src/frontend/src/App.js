import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  People as PeopleIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import Properties from "./components/Properties";
import Companies from "./components/Companies";
import CompanyOwnership from "./components/CompanyOwnership";
import Accounts from "./components/Accounts";
import Entries from "./components/Entries";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";

const drawerWidth = 240;
const collapsedDrawerWidth = 65;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("properties");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerCollapse = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: "Properties", icon: <HomeIcon />, value: "properties" },
    { text: "Companies", icon: <BusinessIcon />, value: "companies" },
    {
      text: "Company Ownership",
      icon: <PeopleIcon />,
      value: "company-ownership",
    },
    { text: "Accounts", icon: <AccountBalanceIcon />, value: "accounts" },
    { text: "Entries", icon: <DescriptionIcon />, value: "entries" },
  ];

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {drawerOpen && (
          <Typography variant="h6" noWrap component="div">
            Oil & Gas App
          </Typography>
        )}
        <IconButton
          onClick={handleDrawerCollapse}
          sx={{ ml: drawerOpen ? "auto" : 0 }}
        >
          {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => setSelectedTab(item.value)}
            selected={selectedTab === item.value}
            sx={{
              minHeight: 48,
              justifyContent: drawerOpen ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: drawerOpen ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {drawerOpen && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
    </div>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "properties":
        return <Properties />;
      case "companies":
        return <Companies />;
      case "company-ownership":
        return <CompanyOwnership />;
      case "accounts":
        return <Accounts />;
      case "entries":
        return <Entries />;
      default:
        return <Properties />;
    }
  };

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: {
              sm: `calc(100% - ${
                drawerOpen ? drawerWidth : collapsedDrawerWidth
              }px)`,
            },
            ml: { sm: `${drawerOpen ? drawerWidth : collapsedDrawerWidth}px` },
            transition: theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Oil & Gas Management
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{
            width: { sm: drawerOpen ? drawerWidth : collapsedDrawerWidth },
            flexShrink: { sm: 0 },
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                transition: theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
                transition: theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                overflowX: "hidden",
              },
            }}
            open
          >
            <Toolbar />
            <Box sx={{ overflow: "auto" }}>
              <List>
                <ListItem button component={Link} to="/">
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/companies">
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Companies" />
                </ListItem>
                <ListItem button component={Link} to="/company-ownership">
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Company Ownership" />
                </ListItem>
                <ListItem button component={Link} to="/entries">
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Entries" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: {
              sm: `calc(100% - ${
                drawerOpen ? drawerWidth : collapsedDrawerWidth
              }px)`,
            },
            transition: theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/company-ownership" element={<CompanyOwnership />} />
            <Route path="/entries" element={<Entries />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
