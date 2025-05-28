import React from "react";
import { Route, Routes, Navigate, Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Loads from "./components/Loads";
import FuelStops from "./components/FuelStops";
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Toolbar,
	Typography,
	AppBar,
} from "@mui/material";

const drawerWidth = 240;

function App() {
	const auth = useSelector((state) => state.auth || {});
	const { token } = auth;

	// Simple Nav items for now
	const navItems = [
		{ text: "Dashboard", path: "/dashboard" },
		{ text: "Loads", path: "/loads" },
		{ text: "Fuel Stops", path: "/fuel-stops" },
	];

	if (!token) {
		// Render routes for unauthenticated users
		return (
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="*" element={<Navigate to="/login" />} />
			</Routes>
		);
	}

	// Render layout for authenticated users
	return (
		<Box sx={{ display: "flex" }}>
			<AppBar
				position="fixed"
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
			>
				<Toolbar>
					<Typography variant="h6" noWrap component="div">
						USX IC Books
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
				<Toolbar /> {/* Spacer for under the AppBar */}
				<Box sx={{ overflow: "auto" }}>
					<List>
						{navItems.map((item) => (
							<ListItem
								key={item.text}
								disablePadding
								component={RouterLink}
								to={item.path}
								sx={{ color: "inherit", textDecoration: "none" }}
							>
								<ListItemButton>
									<ListItemText primary={item.text} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar /> {/* Spacer for under the AppBar */}
				<Routes>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/loads" element={<Loads />} />
					<Route path="/fuel-stops" element={<FuelStops />} />
					<Route path="/" element={<Navigate to="/dashboard" />} />
					{/* Add other authenticated routes here */}
					<Route path="*" element={<Navigate to="/dashboard" />} />{" "}
					{/* Catch-all for authenticated */}
				</Routes>
			</Box>
		</Box>
	);
}

export default App;
