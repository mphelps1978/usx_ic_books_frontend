import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchLoads,
	addLoad,
	updateLoad,
	deleteLoad,
} from "../store/slices/loadsSlice";
import {
	updateFormData,
	resetForm,
	setFormData,
} from "../store/slices/formSlice";
import {
	Box,
	Button,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
	CircularProgress,
	Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function Loads() {
	const dispatch = useDispatch();
	const {
		list: loadsForTable,
		loading,
		error,
	} = useSelector(
		(state) => state.loads || { list: [], loading: false, error: null }
	);
	const formData = useSelector((state) => state.form || {});
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		dispatch(fetchLoads());
	}, [dispatch]);

	const handleAddLoad = () => {
		dispatch(resetForm());
		setIsModalOpen(true);
	};

	const handleEditLoad = (load) => {
		dispatch(setFormData(load));
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		dispatch(resetForm());
	};

	const handleSubmitModal = async (e) => {
		e.preventDefault();
		const payload = {
			...formData,
			deadheadMiles: parseFloat(formData.deadheadMiles) || 0,
			loadedMiles: parseFloat(formData.loadedMiles) || 0,
			weight: parseFloat(formData.weight) || 0,
			linehaul: parseFloat(formData.linehaul) || 0,
			fsc: parseFloat(formData.fsc) || 0,
		};

		if (
			payload.id ||
			(payload.proNumber &&
				loadsForTable.some((load) => load.proNumber === payload.proNumber))
		) {
			await dispatch(
				updateLoad({ proNumber: payload.proNumber, load: payload })
			);
		} else {
			await dispatch(addLoad(payload));
		}
		handleCloseModal();
	};

	const handleDelete = async (proNumber) => {
		await dispatch(deleteLoad(proNumber));
	};

	const handleCompleteLoad = async (loadToComplete) => {
		const currentDate = new Date();
		const year = currentDate.getFullYear();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
		const day = currentDate.getDate().toString().padStart(2, "0");
		const formattedDate = `${year}-${month}-${day}`;

		const updatedLoadData = {
			...loadToComplete,
			dateDelivered: formattedDate,
		};
		await dispatch(
			updateLoad({ proNumber: loadToComplete.proNumber, load: updatedLoadData })
		);
	};

	const states = [
		"AL",
		"AK",
		"AZ",
		"AR",
		"CA",
		"CO",
		"CT",
		"DE",
		"FL",
		"GA",
		"HI",
		"ID",
		"IL",
		"IN",
		"IA",
		"KS",
		"KY",
		"LA",
		"ME",
		"MD",
		"MA",
		"MI",
		"MN",
		"MS",
		"MO",
		"MT",
		"NE",
		"NV",
		"NH",
		"NJ",
		"NM",
		"NY",
		"NC",
		"ND",
		"OH",
		"OK",
		"OR",
		"PA",
		"RI",
		"SC",
		"SD",
		"TN",
		"TX",
		"UT",
		"VT",
		"VA",
		"WA",
		"WV",
		"WI",
		"WY",
	];

	const isEditing =
		formData.proNumber &&
		loadsForTable.some((l) => l.proNumber === formData.proNumber);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 2,
				}}
			>
				<Typography variant="h4" component="h2" gutterBottom>
					Loads Management
				</Typography>
				<Button variant="contained" onClick={handleAddLoad}>
					Add New Load
				</Button>
			</Box>

			{loading && (
				<CircularProgress sx={{ display: "block", margin: "20px auto" }} />
			)}
			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}
			{!loading && !error && loadsForTable.length === 0 && (
				<Paper sx={{ textAlign: "center", p: 3, mt: 2 }}>
					<Typography variant="subtitle1">
						No loads found. Click "Add New Load" to get started.
					</Typography>
				</Paper>
			)}

			{!loading && !error && loadsForTable.length > 0 && (
				<TableContainer component={Paper} sx={{ boxShadow: 3 }}>
					<Table sx={{ minWidth: 650 }} aria-label="loads table">
						<TableHead sx={{ backgroundColor: "grey.200" }}>
							<TableRow>
								<TableCell>PRO Number</TableCell>
								<TableCell>Date Dispatched</TableCell>
								<TableCell>Date Delivered</TableCell>
								<TableCell>Trailer Number</TableCell>
								<TableCell>Origin</TableCell>
								<TableCell>Destination</TableCell>
								<TableCell align="right">Deadhead Miles</TableCell>
								<TableCell align="right">Loaded Miles</TableCell>
								<TableCell align="right">Weight</TableCell>
								<TableCell align="right">Linehaul</TableCell>
								<TableCell align="right">FSC</TableCell>
								<TableCell align="right">Calculated Gross</TableCell>
								<TableCell align="right">Fuel Cost</TableCell>
								<TableCell align="right">Scale Cost</TableCell>
								<TableCell align="right">Projected Net</TableCell>
								<TableCell align="center">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{loadsForTable.map((load) => (
								<TableRow
									key={load.proNumber}
									sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
								>
									<TableCell component="th" scope="row">
										{load.proNumber}
									</TableCell>
									<TableCell>
										{new Date(load.dateDispatched).toLocaleDateString()}
									</TableCell>
									<TableCell>
										{load.dateDelivered ? (
											new Date(
												load.dateDelivered + "T00:00:00"
											).toLocaleDateString()
										) : (
											<Typography
												color="error"
												variant="caption"
												sx={{ fontStyle: "italic" }}
											>
												In Transit
											</Typography>
										)}
									</TableCell>
									<TableCell>{load.trailerNumber || "N/A"}</TableCell>
									<TableCell>{`${load.originCity || ""}, ${
										load.originState || ""
									}`}</TableCell>
									<TableCell>{`${load.destinationCity || ""}, ${
										load.destinationState || ""
									}`}</TableCell>
									<TableCell align="right">{load.deadheadMiles}</TableCell>
									<TableCell align="right">{load.loadedMiles}</TableCell>
									<TableCell align="right">{load.weight}</TableCell>
									<TableCell align="right">
										${(load.linehaul || 0).toFixed(2)}
									</TableCell>
									<TableCell align="right">
										${(load.fsc || 0).toFixed(2)}
									</TableCell>
									<TableCell align="right">
										${(load.calculatedGross || 0).toFixed(2)}
									</TableCell>
									<TableCell align="right">
										${(load.fuelCost || 0).toFixed(2)}
									</TableCell>
									<TableCell align="right">
										${(load.scaleCost || 0).toFixed(2)}
									</TableCell>
									<TableCell align="right">
										${(load.projectedNet || 0).toFixed(2)}
									</TableCell>
									<TableCell align="center">
										{!load.dateDelivered && (
											<IconButton
												onClick={() => handleCompleteLoad(load)}
												color="success"
												size="small"
												title="Complete Load"
											>
												<CheckCircleOutlineIcon />
											</IconButton>
										)}
										<IconButton
											onClick={() => handleEditLoad(load)}
											color="primary"
											size="small"
										>
											<EditIcon />
										</IconButton>
										<IconButton
											onClick={() => handleDelete(load.proNumber)}
											color="error"
											size="small"
										>
											<DeleteIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<Dialog
				open={isModalOpen}
				onClose={handleCloseModal}
				PaperProps={{ component: "form", onSubmit: handleSubmitModal }}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>{isEditing ? "Edit Load" : "Add New Load"}</DialogTitle>
				<DialogContent>
					<Grid container spacing={2} sx={{ mt: 1 }}>
						<Grid item xs={12} sm={6}>
							<TextField
								label="PRO Number"
								name="proNumber"
								value={formData.proNumber || ""}
								onChange={(e) =>
									dispatch(updateFormData({ proNumber: e.target.value }))
								}
								fullWidth
								required
								disabled={isEditing}
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Date Dispatched"
								type="date"
								name="dateDispatched"
								value={formData.dateDispatched || ""}
								onChange={(e) =>
									dispatch(updateFormData({ dateDispatched: e.target.value }))
								}
								fullWidth
								required
								InputLabelProps={{ shrink: true }}
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Date Delivered"
								type="date"
								name="dateDelivered"
								value={formData.dateDelivered || ""}
								onChange={(e) =>
									dispatch(updateFormData({ dateDelivered: e.target.value }))
								}
								fullWidth
								InputLabelProps={{ shrink: true }}
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Trailer Number"
								name="trailerNumber"
								value={formData.trailerNumber || ""}
								onChange={(e) =>
									dispatch(updateFormData({ trailerNumber: e.target.value }))
								}
								fullWidth
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Origin City"
								name="originCity"
								value={formData.originCity || ""}
								onChange={(e) =>
									dispatch(updateFormData({ originCity: e.target.value }))
								}
								fullWidth
								required
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth margin="dense" required>
								<InputLabel id="origin-state-label">Origin State</InputLabel>
								<Select
									labelId="origin-state-label"
									label="Origin State"
									name="originState"
									value={formData.originState || ""}
									onChange={(e) =>
										dispatch(updateFormData({ originState: e.target.value }))
									}
								>
									<MenuItem value="">
										<em>Select State</em>
									</MenuItem>
									{states.map((state) => (
										<MenuItem key={`origin-${state}`} value={state}>
											{state}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Destination City"
								name="destinationCity"
								value={formData.destinationCity || ""}
								onChange={(e) =>
									dispatch(updateFormData({ destinationCity: e.target.value }))
								}
								fullWidth
								required
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth margin="dense" required>
								<InputLabel id="destination-state-label">
									Destination State
								</InputLabel>
								<Select
									labelId="destination-state-label"
									label="Destination State"
									name="destinationState"
									value={formData.destinationState || ""}
									onChange={(e) =>
										dispatch(
											updateFormData({ destinationState: e.target.value })
										)
									}
								>
									<MenuItem value="">
										<em>Select State</em>
									</MenuItem>
									{states.map((state) => (
										<MenuItem key={`dest-${state}`} value={state}>
											{state}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Deadhead Miles"
								type="number"
								name="deadheadMiles"
								value={formData.deadheadMiles || ""}
								onChange={(e) =>
									dispatch(updateFormData({ deadheadMiles: e.target.value }))
								}
								fullWidth
								required
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Loaded Miles"
								type="number"
								name="loadedMiles"
								value={formData.loadedMiles || ""}
								onChange={(e) =>
									dispatch(updateFormData({ loadedMiles: e.target.value }))
								}
								fullWidth
								required
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Weight (lbs)"
								type="number"
								name="weight"
								value={formData.weight || ""}
								onChange={(e) =>
									dispatch(updateFormData({ weight: e.target.value }))
								}
								fullWidth
								required
								margin="dense"
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Linehaul ($"
								type="number"
								name="linehaul"
								value={formData.linehaul || ""}
								onChange={(e) =>
									dispatch(updateFormData({ linehaul: e.target.value }))
								}
								fullWidth
								required
								margin="dense"
								InputProps={{
									startAdornment: <Typography sx={{ mr: 0.5 }}>$</Typography>,
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="FSC ($"
								type="number"
								name="fsc"
								value={formData.fsc || ""}
								onChange={(e) =>
									dispatch(updateFormData({ fsc: e.target.value }))
								}
								fullWidth
								required
								margin="dense"
								InputProps={{
									startAdornment: <Typography sx={{ mr: 0.5 }}>$</Typography>,
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Calculated Gross"
								value={
									formData.linehaul && formData.fsc
										? (
												parseFloat(formData.linehaul) + parseFloat(formData.fsc)
										  ).toFixed(2)
										: "0.00"
								}
								fullWidth
								margin="dense"
								disabled
								InputProps={{
									startAdornment: <Typography sx={{ mr: 0.5 }}>$</Typography>,
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Fuel Cost"
								value={(formData.fuelCost || 0).toFixed(2)}
								fullWidth
								margin="dense"
								disabled
								InputProps={{
									startAdornment: <Typography sx={{ mr: 0.5 }}>$</Typography>,
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Scale Cost"
								value={(formData.scaleCost || 0).toFixed(2)}
								fullWidth
								margin="dense"
								disabled
								InputProps={{
									startAdornment: <Typography sx={{ mr: 0.5 }}>$</Typography>,
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<TextField
								label="Projected Net"
								value={(formData.projectedNet || 0).toFixed(2)}
								fullWidth
								margin="dense"
								disabled
								InputProps={{
									startAdornment: <Typography sx={{ mr: 0.5 }}>$</Typography>,
								}}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions sx={{ p: "16px 24px" }}>
					<Button onClick={handleCloseModal} color="secondary">
						Cancel
					</Button>
					<Button type="submit" variant="contained" color="primary">
						{isEditing ? "Update Load" : "Save Load"}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default Loads;
