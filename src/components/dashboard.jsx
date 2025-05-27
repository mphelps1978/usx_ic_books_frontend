import { React, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Dashboard() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const milesData = {
    labels: ['Deadhead Miles', 'Loaded Miles'],
    datasets: [
      {
        label: 'Miles',
        data: [500, 2000], // Dummy data
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Net Revenue ($)',
        data: [5000, 7000, 6000], // Dummy data
        backgroundColor: ['rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

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
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Deadhead vs Loaded Miles</h3>
            <Pie data={milesData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Net Revenue by Month</h3>
            <Bar data={revenueData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;