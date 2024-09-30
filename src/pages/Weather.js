import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AiFillFileExcel, AiOutlineReload, AiOutlineSearch } from 'react-icons/ai';
import { FaChartLine, FaChartBar, FaChartPie, FaWind, FaThermometerHalf, FaTint } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import {
  Chart,
  LineController,
  BarController,
  PieController,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  LineController, BarController, PieController, LineElement, BarElement, ArcElement,
  PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend
);

const CustomAlert = ({ message, type = 'error' }) => (
  <div className={`p-4 mb-4 rounded-md ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
    <span>{message}</span>
  </div>
);

const WeatherIcon = ({ type, value }) => {
  const icons = {
    temperature: <FaThermometerHalf />,
    humidity: <FaTint />,
    wind_speed: <FaWind />,
  };
  return (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-500">
      {icons[type]}
      <span className="ml-2 text-sm font-semibold">{value}</span>
    </div>
  );
};

const WeatherSummary = ({ data }) => {
  // Filtrar los datos para ignorar los registros con valores en '0'
  const latestData = data
    .filter(
      item => item.temperature > 0 || item.humidity > 0 || item.wind_speed > 0
    )
    .pop() || {}; // Obtener el último registro válido

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <WeatherIcon type="temperature" value={`${latestData.temperature || 'N/A'} °C`} />
        <h3 className="mt-2 text-lg font-semibold">Temperatura</h3>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <WeatherIcon type="humidity" value={`${latestData.humidity || 'N/A'} %`} />
        <h3 className="mt-2 text-lg font-semibold">Humedad</h3>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <WeatherIcon type="wind_speed" value={`${latestData.wind_speed || 'N/A'} m/s`} />
        <h3 className="mt-2 text-lg font-semibold">Velocidad del viento</h3>
      </div>
    </div>
  );
};




export default function EnhancedWeatherDashboard() {
  const [weatherData, setWeatherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVariable, setSelectedVariable] = useState('temperature');
  const [chartType, setChartType] = useState('line');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataRange, setDataRange] = useState({ start: '', end: '' });
  const [showRawData, setShowRawData] = useState(false);
  const chartRef = useRef(null);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/weather');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (Array.isArray(data)) {
        setWeatherData(data);
        setFilteredData(data);
        updateDataRange(data);
      } else {
        throw new Error('API response is not an array');
      }
    } catch (error) {
      setError('Error fetching data from API: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = weatherData.filter(item =>
      item.date.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!dataRange.start || new Date(item.date) >= new Date(dataRange.start)) &&
      (!dataRange.end || new Date(item.date) <= new Date(dataRange.end))
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, weatherData, dataRange]);

  const updateDataRange = (data) => {
    if (data.length > 0) {
      const dates = data.map(item => new Date(item.date));
      const start = new Date(Math.min(...dates));
      const end = new Date(Math.max(...dates));
      setDataRange({
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      });
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Weather Data');
    XLSX.writeFile(workbook, 'weather_data.xlsx');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('weatherChart');
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: chartType,
        data: {
          labels: filteredData.map(item => item.date),
          datasets: [
            {
              label: selectedVariable.charAt(0).toUpperCase() + selectedVariable.slice(1),
              data: filteredData.map(item => item[selectedVariable]),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              tension: 0.4,
              fill: chartType === 'line',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                padding: 5,
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
        },
      });
    }
  }, [filteredData, selectedVariable, chartType]);

  const averageData = useMemo(() => {
    const sum = filteredData.reduce((acc, item) => acc + parseFloat(item[selectedVariable]), 0);
    return (sum / filteredData.length).toFixed(2);
  }, [filteredData, selectedVariable]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-gray-400">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        ECO SCRAPE USO - STATION RECEPTOR
      </h1>

      {error && <CustomAlert message={error} />}

      <WeatherSummary data={weatherData} />

      <div className="flex flex-wrap justify-between items-center mb-8 gap-4 text-gray-600">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por fecha"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <input
            type="date"
            value={dataRange.start}
            onChange={e => setDataRange(prev => ({ ...prev, start: e.target.value }))}
            className="border rounded-md px-3 py-2"
          />
          <input
            type="date"
            value={dataRange.end}
            onChange={e => setDataRange(prev => ({ ...prev, end: e.target.value }))}
            className="border rounded-md px-3 py-2"
          />
        </div>

        <select
          value={selectedVariable}
          onChange={e => setSelectedVariable(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
         <option value="temperature">Temperatura</option>
<option value="humidity">Humedad</option>
<option value="pressure">Presión</option>
<option value="wind_speed">Velocidad del viento</option>
<option value="gust_speed">Velocidad de ráfagas</option>
<option value="rain">Lluvia</option>
<option value="rain_rate">Tasa de lluvia</option>
<option value="solar_radiation">Radiación solar</option>
<option value="evapotranspiration">Evapotranspiración</option>
<option value="uv_index">Índice UV</option>

        </select>

        <select
          value={chartType}
          onChange={e => setChartType(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>

        <button onClick={downloadExcel} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center">
          <AiFillFileExcel className="mr-2" />
          Download Excel
        </button>
      </div>

      <div className="mb-8 bg-white text-gray-500 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Average {selectedVariable.charAt(0).toUpperCase() + selectedVariable.slice(1)}: {averageData}</h2>
        <div className="relative h-64">
          <canvas id="weatherChart" className="w-full h-full"></canvas>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#312293cb]">Datos de Clima</h2>
        <button onClick={() => setShowRawData(prev => !prev)} className="bg-[#312293cb] hover:bg-[#362b79e7] text-white py-2 px-4 rounded-md flex items-center">
          {showRawData ? <FaChartLine className="mr-2" /> : <AiOutlineReload className="mr-2" />}
          {showRawData ? 'Esconder Tabla' : 'Mostrar Tabla'}
        </button>
      </div>

      {showRawData && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#312293cb] text-white rounded-lg shadow-lg">
            <thead>
              <tr>
              <th className="p-4 text-left font-semibold tracking-wider">📅 Fecha</th>
<th className="p-4 text-left font-semibold tracking-wider">🌡️ Temperatura (°C)</th>
<th className="p-4 text-left font-semibold tracking-wider">💧 Humedad (%)</th>
<th className="p-4 text-left font-semibold tracking-wider">📏 Presión (hPa)</th>
<th className="p-4 text-left font-semibold tracking-wider">💨 Velocidad del viento (m/s)</th>
<th className="p-4 text-left font-semibold tracking-wider">⚡ Velocidad de ráfagas (m/s)</th>
<th className="p-4 text-left font-semibold tracking-wider">🌍 Dirección del viento</th>
<th className="p-4 text-left font-semibold tracking-wider">🌧️ Lluvia (mm)</th>
<th className="p-4 text-left font-semibold tracking-wider">🌦️ Tasa de lluvia (mm/h)</th>
<th className="p-4 text-left font-semibold tracking-wider">☀️ Radiación solar (W/m²)</th>
<th className="p-4 text-left font-semibold tracking-wider">🌾 Evapotranspiración (mm)</th>
<th className="p-4 text-left font-semibold tracking-wider">🔆 Índice UV</th>

              </tr>
            </thead>
            <tbody className='bg-white text-gray-500'>
              {currentItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-4">{item.date}</td>
                  <td className="p-4">{item.temperature} °C</td>
                  <td className="p-4">{item.humidity} %</td>
                  <td className="p-4">{item.pressure} hPa</td>
                  <td className="p-4">{item.wind_speed} m/s</td>
                  <td className="p-4">{item.gust_speed} m/s</td>
                  <td className="p-4">{item.wind_direction}</td>
                  <td className="p-4">{item.rain} mm</td>
                  <td className="p-4">{item.rain_rate} mm/h</td>
                  <td className="p-4">{item.solar_radiation} W/m²</td>
                  <td className="p-4">{item.evapotranspiration} mm</td>
                  <td className="p-4">{item.uv_index}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-md"
        >
          Anterior
        </button>
        <span className="text-gray-600">Página {currentPage} de {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-md"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
