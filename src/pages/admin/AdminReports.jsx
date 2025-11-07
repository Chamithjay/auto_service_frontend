import { useEffect, useState, useRef } from "react";
import API from "../../api/Api";
import { useReactToPrint } from "react-to-print";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Our new reusable components
import KpiCard from "../../components/KpiCard";
import ReportChartCard from "../../components/ReportChartCards";

// Chart palette (modern accents that complement the layout palette)
const COLORS = [
  "#6366F1",
  "#06B6D4",
  "#F59E0B",
  "#10B981",
  "#A78BFA",
  "#F97316",
];

// --- 1. REUSABLE CHART COMPONENTS ---
// These are the new, styled chart components

const RevenueChart = ({ data, formatCurrency }) => (
  <ResponsiveContainer minWidth={0}>
    <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
      <defs>
        <linearGradient id="revStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
      <YAxis
        stroke="#6b7280"
        fontSize={12}
        tickFormatter={(val) => formatCurrency(val).replace("$", "")} // Shorter Y-axis labels
      />
      <Tooltip
        wrapperClassName="!rounded-xl !border-gray-300 !shadow-lg !bg-white/70 !backdrop-blur-sm"
        formatter={(value) => formatCurrency(value)}
      />
      <Line
        type="monotone"
        dataKey="totalRevenue"
        stroke="url(#revStroke)"
        strokeWidth={3}
        dot={{ r: 2, stroke: "#6366F1", strokeWidth: 1, fill: "white" }}
        activeDot={{ r: 5 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

const ServiceChart = ({ data }) => (
  <ResponsiveContainer minWidth={0}>
    <BarChart
      data={data}
      layout="vertical"
      margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis type="number" stroke="#6b7280" fontSize={12} />
      <defs>
        <linearGradient id="svcBar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      <YAxis
        dataKey="serviceName"
        type="category"
        stroke="#6b7280"
        fontSize={12}
        width={120}
      />
      <Tooltip
        wrapperClassName="!rounded-xl !border-gray-300 !shadow-lg !bg-white/70 !backdrop-blur-sm"
        cursor={{ fill: "#f3f4f6" }} // Light gray hover
      />
      <Bar
        dataKey="count"
        fill="url(#svcBar)"
        radius={[4, 4, 4, 4]}
        barSize={22}
      />
    </BarChart>
  </ResponsiveContainer>
);

const EmployeeChart = ({ data }) => (
  <ResponsiveContainer minWidth={0}>
    <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
      <defs>
        {/* Blue gradients to match the rest of analytics */}
        <linearGradient id="jobsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis dataKey="employeeName" stroke="#6b7280" fontSize={12} />
      <YAxis stroke="#6b7280" fontSize={12} />
      <Tooltip wrapperClassName="!rounded-xl !border-gray-300 !shadow-lg !bg-white/70 !backdrop-blur-sm" />
      <Legend verticalAlign="top" height={36} />
      <Bar
        dataKey="totalJobs"
        name="Jobs"
        fill="url(#jobsGrad)"
        radius={[8, 8, 0, 0]}
      />
      <Bar
        dataKey="totalHours"
        name="Hours"
        fill="url(#hoursGrad)"
        radius={[8, 8, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
);

const LeaveChart = ({ data }) => (
  <ResponsiveContainer minWidth={0}>
    <PieChart>
      <Pie
        data={data}
        dataKey="count"
        nameKey="leaveType"
        cx="50%"
        cy="50%"
        innerRadius={60} // This makes it a Donut chart
        outerRadius={90}
        paddingAngle={3}
        labelLine={false}
        label={({ percent }) => `${(percent * 100).toFixed(0)}%`} // Simple % label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip wrapperClassName="!rounded-xl !border-gray-300 !shadow-lg !bg-white/70 !backdrop-blur-sm" />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  </ResponsiveContainer>
);

// --- 2. MAIN ADMIN REPORTS COMPONENT ---

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30"); // days
  const [revenueData, setRevenueData] = useState([]);
  const [servicePopularity, setServicePopularity] = useState([]);
  const [employeePerformance, setEmployeePerformance] = useState([]);
  const [leaveReport, setLeaveReport] = useState([]);
  const [error, setError] = useState(null);

  // --- Print & CSV Setup ---
  const dashboardRef = useRef(null);
  const pageStyle = `
    @page { size: auto; margin: 20mm; }
    @media print {
      body { -webkit-print-color-adjust: exact; }
      .no-print { display: none !important; }
      .chart-print-wrapper { width: 900px !important; height: 350px !important; display: block !important; }
      .recharts-responsive-container { width: 100% !important; height: 100% !important; min-width: 0; }
      .page-break { break-after: page; page-break-after: always; }
      /* Avoid extra blank page if the last card has page-break */
      .page-break:last-child { break-after: auto; page-break-after: auto; }
    }
  `;
  const handlePrint = useReactToPrint({
    contentRef: dashboardRef,
    documentTitle: `AutoCare_Analytics_Report_${
      new Date().toISOString().split("T")[0]
    }`,
    pageStyle,
  });

  // CSV Headers (moved from the main body for cleanliness)
  const revenueCsvHeaders = [
    { label: "Date", key: "date" },
    { label: "Total Revenue", key: "totalRevenue" },
  ];
  const serviceCsvHeaders = [
    { label: "Service Name", key: "serviceName" },
    { label: "Count", key: "count" },
  ];
  const employeeCsvHeaders = [
    { label: "Employee Name", key: "employeeName" },
    { label: "Total Jobs", key: "totalJobs" },
    { label: "Total Hours", key: "totalHours" },
  ];
  const leaveCsvHeaders = [
    { label: "Leave Type", key: "leaveType" },
    { label: "Count", key: "count" },
  ];
  // --- End Print & CSV Setup ---

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [revRes, svcRes, empRes, leaveRes] = await Promise.all([
        API.get(`admin/reports/revenue-over-time?range=${range}`),
        API.get(`admin/reports/service-popularity?range=${range}`),
        API.get(`admin/reports/employee-performance?range=${range}`),
        API.get(`admin/reports/leave-report?range=${range}`),
      ]);
      setRevenueData(revRes.data || []);
      setServicePopularity(svcRes.data || []);
      setEmployeePerformance(empRes.data || []);
      setLeaveReport(leaveRes.data || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      const status = err?.response?.status;
      const serverMessage = err?.response?.data?.message || err.message;
      setError(
        `Failed to fetch report data. Status: ${
          status || "unknown"
        }. Message: ${serverMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = revenueData.reduce(
    (s, it) => s + (parseFloat(it.totalRevenue) || 0),
    0
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  return (
    <div ref={dashboardRef} className="p-4 sm:p-6 print-container">
      {/* Print styles are injected via react-to-print pageStyle */}

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
        Analytics
      </h1>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 sm:mb-6 no-print">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
            Date Range
          </label>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 365 days</option>
          </select>

          <button
            type="button"
            onClick={() => handlePrint()}
            className="w-full sm:w-auto rounded-lg bg-[#14274E] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#394867]"
          >
            Print Report (PDF)
          </button>
        </div>

        {/* --- KPI CARDS --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <KpiCard title="Total Revenue" value={formatCurrency(totalRevenue)} />
          <KpiCard
            title="Total Services"
            value={servicePopularity.reduce((s, it) => s + it.count, 0)}
          />
          <KpiCard
            title="Active Employees"
            value={employeePerformance.length}
          />
        </div>
      </div>

      {/* --- CHARTS GRID --- */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14274E]"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-3 sm:p-4 border border-red-200 text-red-700 text-sm sm:text-base">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <ReportChartCard
            title="Revenue Over Time"
            csvData={revenueData}
            csvHeaders={revenueCsvHeaders}
            csvFilename={`revenue_report_${range}days.csv`}
            breakAfter
          >
            <RevenueChart data={revenueData} formatCurrency={formatCurrency} />
          </ReportChartCard>

          <ReportChartCard
            title="Service Popularity"
            csvData={servicePopularity}
            csvHeaders={serviceCsvHeaders}
            csvFilename={`service_popularity_${range}days.csv`}
            breakAfter
          >
            <ServiceChart data={servicePopularity} />
          </ReportChartCard>

          <ReportChartCard
            title="Employee Performance"
            csvData={employeePerformance}
            csvHeaders={employeeCsvHeaders}
            csvFilename={`employee_performance_${range}days.csv`}
            breakAfter
          >
            <EmployeeChart data={employeePerformance} />
          </ReportChartCard>

          <ReportChartCard
            title="Leave Type Distribution"
            csvData={leaveReport}
            csvHeaders={leaveCsvHeaders}
            csvFilename={`leave_report_${range}days.csv`}
          >
            <LeaveChart data={leaveReport} COLORS={COLORS} />
          </ReportChartCard>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
