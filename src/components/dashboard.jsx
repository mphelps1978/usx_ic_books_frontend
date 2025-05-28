import { React, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLoads } from "../store/slices/loadsSlice";
import { Bar, Pie } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import {
	Grid,
	Paper,
	Typography,
	Box,
	CircularProgress,
	Alert,
} from "@mui/material";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend
);

function Dashboard() {
	const dispatch = useDispatch();
	const {
		list: loads,
		loading,
		error,
	} = useSelector(
		(state) => state.loads || { list: [], loading: false, error: null }
	);

	useEffect(() => {
		dispatch(fetchLoads());
	}, [dispatch]);

	const milesData = {
		labels: ["Deadhead Miles", "Loaded Miles"],
		datasets: [
			{
				label: "Miles",
				data: [500, 2000], // Dummy data
				backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
				borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
				borderWidth: 1,
			},
		],
	};

	const revenueData = {
		labels: ["Jan", "Feb", "Mar"],
		datasets: [
			{
				label: "Net Revenue ($)",
				data: [5000, 7000, 6000], // Dummy data
				backgroundColor: ["rgba(75, 192, 192, 0.2)"],
				borderColor: ["rgba(75, 192, 192, 1)"],
				borderWidth: 1,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
	};

	const activeLoad = loads.find((load) => !load.dateDelivered);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Typography variant="h4" gutterBottom component="h2" sx={{ mb: 4 }}>
				Dashboard
			</Typography>

			{loading && <CircularProgress />}
			{error && <Alert severity="error">{error}</Alert>}

			<Grid container spacing={3}>
				{activeLoad && (
					<Grid item xs={12} md={12} lg={4}>
						<Paper
							sx={{
								p: 2,
								display: "flex",
								flexDirection: "column",
								height: 300,
								backgroundColor: "primary.light",
							}}
						>
							<Typography
								variant="h6"
								gutterBottom
								component="h3"
								sx={{ color: "primary.contrastText" }}
							>
								Current Active Load
							</Typography>
							<Box sx={{ flexGrow: 1, color: "primary.contrastText" }}>
								<Typography variant="subtitle1">
									PRO Number: {activeLoad.proNumber}
								</Typography>
								<Typography variant="body1">
									Origin: {activeLoad.originCity}, {activeLoad.originState}
								</Typography>
								<Typography variant="body1">
									Destination: {activeLoad.destinationCity},{" "}
									{activeLoad.destinationState}
								</Typography>
								<Typography variant="body1">
									Trailer: {activeLoad.trailerNumber || "N/A"}
								</Typography>
								<Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
									Status: In Transit
								</Typography>
							</Box>
						</Paper>
					</Grid>
				)}

				<Grid item xs={12} md={activeLoad ? 6 : 12} lg={activeLoad ? 4 : 6}>
					<Paper
						sx={{ p: 2, display: "flex", flexDirection: "column", height: 300 }}
					>
						<Typography variant="h6" gutterBottom component="h3">
							Deadhead vs Loaded Miles
						</Typography>
						<Box sx={{ flexGrow: 1, position: "relative" }}>
							<Pie data={milesData} options={chartOptions} />
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={12} md={activeLoad ? 6 : 12} lg={activeLoad ? 4 : 6}>
					<Paper
						sx={{ p: 2, display: "flex", flexDirection: "column", height: 300 }}
					>
						<Typography variant="h6" gutterBottom component="h3">
							Net Revenue by Month
						</Typography>
						<Box sx={{ flexGrow: 1, position: "relative" }}>
							<Bar data={revenueData} options={chartOptions} />
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}

export default Dashboard;
