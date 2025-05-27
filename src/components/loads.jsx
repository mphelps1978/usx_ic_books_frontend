import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoads, addLoad, updateLoad, deleteLoad } from '../store/slices/loadsSlice';
import { updateFormData, resetForm, setFormData } from '../store/slices/formSlice';
import { Link } from 'react-router-dom';

function Loads() {
  const dispatch = useDispatch();
  const loads = useSelector((state) => state.loads);
  const formData = useSelector((state) => state.form);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.proNumber && loads.some((load) => load.proNumber === formData.proNumber)) {
      await dispatch(updateLoad({ proNumber: formData.proNumber, load: formData }));
    } else {
      await dispatch(addLoad(formData));
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (proNumber) => {
    await dispatch(deleteLoad(proNumber));
  };

  const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <div>
          <Link to="/dashboard" className="mr-4">Dashboard</Link>
          <Link to="/loads">Loads</Link>
        </div>
        <button onClick={() => dispatch(logout())} className="hover:underline">Logout</button>
      </nav>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Loads</h2>
        <button
          onClick={handleAddLoad}
          className="mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add New Load
        </button>
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">PRO Number</th>
              <th className="p-2">Date Dispatched</th>
              <th className="p-2">Date Delivered</th>
              <th className="p-2">Trailer Number</th>
              <th className="p-2">Origin</th>
              <th className="p-2">Destination</th>
              <th className="p-2">Deadhead Miles</th>
              <th className="p-2">Loaded Miles</th>
              <th className="p-2">Weight</th>
              <th className="p-2">Linehaul</th>
              <th className="p-2">FSC</th>
              <th className="p-2">Calculated Gross</th>
              <th className="p-2">Fuel Cost</th>
              <th className="p-2">Scale Cost</th>
              <th className="p-2">Projected Net</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loads.map((load) => (
              <tr key={load.proNumber}>
                <td className="p-2">{load.proNumber}</td>
                <td className="p-2">{new Date(load.dateDispatched).toLocaleDateString()}</td>
                <td className="p-2">{load.dateDelivered ? new Date(load.dateDelivered).toLocaleDateString() : ''}</td>
                <td className="p-2">{load.trailerNumber}</td>
                <td className="p-2">{`${load.originCity}, ${load.originState}`}</td>
                <td className="p-2">{`${load.destinationCity}, ${load.destinationState}`}</td>
                <td className="p-2">{load.deadheadMiles}</td>
                <td className="p-2">{load.loadedMiles}</td>
                <td className="p-2">{load.weight}</td>
                <td className="p-2">${load.linehaul.toFixed(2)}</td>
                <td className="p-2">${load.fsc.toFixed(2)}</td>
                <td className="p-2">${load.calculatedGross.toFixed(2)}</td>
                <td className="p-2">${load.fuelCost.toFixed(2)}</td>
                <td className="p-2">${load.scaleCost.toFixed(2)}</td>
                <td className="p-2">${load.projectedNet.toFixed(2)}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditLoad(load)}
                    className="text-blue-500 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(load.proNumber)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">{loads.some((load) => load.proNumber === formData.proNumber) ? 'Edit Load' : 'Add New Load'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">PRO Number</label>
                  <input
                    type="text"
                    name="proNumber"
                    value={formData.proNumber}
                    onChange={(e) => dispatch(updateFormData({ proNumber: e.target.value }))}
                    className="w-full p-2 border rounded"
                    disabled={loads.some((load) => load.proNumber === formData.proNumber)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Date Dispatched</label>
                  <input
                    type="date"
                    name="dateDispatched"
                    value={formData.dateDispatched}
                    onChange={(e) => dispatch(updateFormData({ dateDispatched: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Date Delivered</label>
                  <input
                    type="date"
                    name="dateDelivered"
                    value={formData.dateDelivered}
                    onChange={(e) => dispatch(updateFormData({ dateDelivered: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Trailer Number</label>
                  <input
                    type="text"
                    name="trailerNumber"
                    value={formData.trailerNumber}
                    onChange={(e) => dispatch(updateFormData({ trailerNumber: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Origin City</label>
                  <input
                    type="text"
                    name="originCity"
                    value={formData.originCity}
                    onChange={(e) => dispatch(updateFormData({ originCity: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Origin State</label>
                  <select
                    name="originState"
                    value={formData.originState}
                    onChange={(e) => dispatch(updateFormData({ originState: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Destination City</label>
                  <input
                    type="text"
                    name="destinationCity"
                    value={formData.destinationCity}
                    onChange={(e) => dispatch(updateFormData({ destinationCity: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Destination State</label>
                  <select
                    name="destinationState"
                    value={formData.destinationState}
                    onChange={(e) => dispatch(updateFormData({ destinationState: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Deadhead Miles</label>
                  <input
                    type="number"
                    name="deadheadMiles"
                    value={formData.deadheadMiles}
                    onChange={(e) => dispatch(updateFormData({ deadheadMiles: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Loaded Miles</label>
                  <input
                    type="number"
                    name="loadedMiles"
                    value={formData.loadedMiles}
                    onChange={(e) => dispatch(updateFormData({ loadedMiles: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Weight (lbs)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={(e) => dispatch(updateFormData({ weight: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Linehaul ($)</label>
                  <input
                    type="number"
                    name="linehaul"
                    value={formData.linehaul}
                    onChange={(e) => dispatch(updateFormData({ linehaul: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2 border rounded"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">FSC ($)</label>
                  <input
                    type="number"
                    name="fsc"
                    value={formData.fsc}
                    onChange={(e) => dispatch(updateFormData({ fsc: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2 border rounded"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Calculated Gross ($)</label>
                  <input
                    type="text"
                    value={formData.calculatedGross.toFixed(2)}
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Fuel Cost ($)</label>
                  <input
                    type="text"
                    value={formData.fuelCost.toFixed(2)}
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Scale Cost ($)</label>
                  <input
                    type="text"
                    value={formData.scaleCost.toFixed(2)}
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Projected Net ($)</label>
                  <input
                    type="text"
                    value={formData.projectedNet.toFixed(2)}
                    className="w-full p-2 border rounded bg-gray-100"
                    disabled
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                  >
                    {loads.some((load) => load.proNumber === formData.proNumber) ? 'Update Load' : 'Save Load'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Loads;