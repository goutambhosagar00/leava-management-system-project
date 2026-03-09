import { useEffect, useState, useCallback, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  Check,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
  CalendarCheck,
  Clock,
  XCircle,
  TrendingUp,
  Eye,
  AlertTriangle,
  RefreshCw,
  Building2,
  Calendar,
} from "lucide-react";

const API_BASE =
  "http://localhost:8080/Leave-Management-System/backend/api/admin";

const PALETTE = {
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
  CL: "#6366f1",
  SL: "#10b981",
  LOP: "#ef4444",
};

/* ─── Toast ────────────────────────────────────────── */
function Toast({ toasts, remove }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.message}</span>
          <button onClick={() => remove(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);
  const remove = useCallback(
    (id) => setToasts((p) => p.filter((t) => t.id !== id)),
    [],
  );
  return { toasts, add, remove };
}

/* ─── KPI Card ─────────────────────────────────────── */
function KPICard({ icon: Icon, label, value, sub, color, loading }) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ background: `${color}18`, color }}>
        <Icon size={20} />
      </div>
      <div className="kpi-body">
        <p className="kpi-label">{label}</p>
        {loading ? (
          <div className="skeleton skeleton-h2" />
        ) : (
          <h2 className="kpi-value">{value ?? "—"}</h2>
        )}
        {sub && <p className="kpi-sub">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Custom Tooltip ───────────────────────────────── */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tt-name">{payload[0].name}</p>
      <p className="tt-val">{payload[0].value} leaves</p>
    </div>
  );
}

/* ─── Donut Chart ──────────────────────────────────── */
function DonutCard({ title, data, loading }) {
  if (loading)
    return (
      <div className="chart-card">
        <div className="skeleton skeleton-chart" />
      </div>
    );
  if (!data?.length)
    return <div className="chart-card chart-empty">No data</div>;

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <div className="donut-wrap">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
            >
              {data.map((e, i) => (
                <Cell
                  key={i}
                  fill={PALETTE[e.name] || "#6366f1"}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <span className="donut-total">{total}</span>
          <span className="donut-sub">Total</span>
        </div>
      </div>
      <div className="chart-legend">
        {data.map((e, i) => (
          <div key={i} className="legend-item">
            <span
              className="legend-dot"
              style={{ background: PALETTE[e.name] || "#6366f1" }}
            />
            <span className="legend-name">{e.name}</span>
            <span className="legend-val">{e.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Trend Chart ──────────────────────────────────── */
function TrendCard({ data, loading }) {
  if (loading)
    return (
      <div className="chart-card chart-wide">
        <div className="skeleton skeleton-chart" />
      </div>
    );
  return (
    <div className="chart-card chart-wide">
      <h3 className="chart-title">Monthly Leave Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={data || []}
          margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="clGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="slGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lopGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,.08)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          <Area
            type="monotone"
            dataKey="CL"
            stroke="#6366f1"
            fill="url(#clGrad)"
            strokeWidth={2}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="SL"
            stroke="#10b981"
            fill="url(#slGrad)"
            strokeWidth={2}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="LOP"
            stroke="#ef4444"
            fill="url(#lopGrad)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Department Chart ─────────────────────────────── */
function DeptCard({ data, loading }) {
  if (loading)
    return (
      <div className="chart-card chart-wide">
        <div className="skeleton skeleton-chart" />
      </div>
    );
  return (
    <div className="chart-card chart-wide">
      <h3 className="chart-title">Department Leave Breakdown</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data || []}
          margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="department"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,.08)",
            }}
          />
          <Bar
            dataKey="total"
            fill="#6366f1"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Confirm Dialog ───────────────────────────────── */
function ConfirmDialog({ open, title, message, onConfirm, onCancel, type }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-icon confirm-${type}`}>
          <AlertTriangle size={24} />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className={`btn-solid btn-${type}`} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Reason Modal ─────────────────────────────────── */
function ReasonModal({ leave, onClose }) {
  if (!leave) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="reason-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Leave Details</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="detail-row">
            <span>Employee</span>
            <strong>{leave.name}</strong>
          </div>
          <div className="detail-row">
            <span>Department</span>
            <strong>{leave.department || "—"}</strong>
          </div>
          <div className="detail-row">
            <span>Leave Type</span>
            <span className={`badge badge-${leave.leave_type?.toLowerCase()}`}>
              {leave.leave_type}
            </span>
          </div>
          <div className="detail-row">
            <span>Original Type</span>
            <strong>{leave.original_type}</strong>
          </div>
          <div className="detail-row">
            <span>Duration</span>
            <strong>
              {leave.start_date} → {leave.end_date} ({leave.total_days}d)
            </strong>
          </div>
          <div className="detail-row">
            <span>Status</span>
            <span className={`status-pill status-${leave.status}`}>
              {leave.status}
            </span>
          </div>
          <div className="detail-row detail-reason">
            <span>Reason</span>
            <p>{leave.reason || "No reason provided."}</p>
          </div>
          {leave.approved_at && (
            <div className="detail-row">
              <span>Actioned At</span>
              <strong>{leave.approved_at}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Leave Table ──────────────────────────────────── */
const PAGE_SIZE = 8;

function LeaveTable({ data, loading, onApprove, onReject, onView }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = (data || []).filter((r) => {
    const matchSearch = r.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchType = typeFilter === "all" || r.leave_type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [search, statusFilter, typeFilter]);

  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">Employees Leave List</h3>
          <p className="table-sub">{filtered.length} records found</p>
        </div>
        <div className="table-controls">
          <div className="search-box">
            <Search size={15} />
            <input
              placeholder="Search employee…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="CL">CL</option>
            <option value="SL">SL</option>
            <option value="LOP">LOP</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="leave-table">
          <thead>
            <tr>
              <th>SL No</th>
              <th>Emp Code</th>
              <th>Name</th>
              {/* <th>Email</th> */}
              <th>Department</th>
              <th>Designation</th>
              {/* <th>Joining Date</th> */}
              <th>Leave Type</th>
              <th>Start</th>
              <th>End</th>
              <th>Days</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 13 }).map((_, j) => (
                    <td key={j}>
                      <div className="skeleton skeleton-text" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="13" className="empty-row">
                  No records found
                </td>
              </tr>
            ) : (
              paginated.map((leave, idx) => (
                <tr key={leave.id} className="table-row">
                  {/* SL NO */}
                  <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>

                  {/* EMP CODE */}
                  <td>{leave.emp_code}</td>

                  {/* NAME */}
                  <td>{leave.name}</td>

                  {/* DEPARTMENT */}
                  <td>{leave.department}</td>

                  {/* DESIGNATION */}
                  <td>{leave.designation}</td>

                  {/* LEAVE TYPE */}
                  <td>
                    <span
                      className={`badge badge-${leave.leave_type?.toLowerCase()}`}
                    >
                      {leave.leave_type}
                    </span>
                  </td>

                  {/* START DATE */}
                  <td>{leave.start_date}</td>

                  {/* END DATE */}
                  <td>{leave.end_date}</td>

                  {/* TOTAL DAYS */}
                  <td>
                    <span className="days-chip">{leave.total_days}</span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span className={`status-pill status-${leave.status}`}>
                      {leave.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td>
                    <div className="action-btns">
                      <button
                        className="action-btn view-btn"
                        title="View Details"
                        onClick={() => onView(leave)}
                      >
                        <Eye size={14} />
                      </button>

                      {leave.status === "pending" && (
                        <>
                          <button
                            className="action-btn approve-btn"
                            title="Approve"
                            onClick={() => onApprove(leave)}
                          >
                            <Check size={14} />
                          </button>

                          <button
                            className="action-btn reject-btn"
                            title="Reject"
                            onClick={() => onReject(leave)}
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────── */
function AdminLeaves() {
  const { toasts, add: addToast, remove: removeToast } = useToast();

  const [summary, setSummary] = useState(null);
  const [approval, setApproval] = useState([]);
  const [leaveType, setLeaveType] = useState([]);
  const [leaveList, setLeaveList] = useState([]);
  const [trend, setTrend] = useState([]);
  const [dept, setDept] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirm, setConfirm] = useState(null);
  const [viewLeave, setViewLeave] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/leaves_dashboard.php`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.status !== "success") throw new Error(json.message);
      setSummary(json.data.summary);
      setApproval(json.data.approvalStats);
      setLeaveType(json.data.leaveTypeStats);
      setLeaveList(json.data.leaveList);
      setTrend(json.data.monthlyTrend || []);
      setDept(json.data.deptBreakdown || []);
    } catch (e) {
      setError(e.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleAction = async (leaveId, action) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/leave_action.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leaveId, action }),
      });
      const json = await res.json();
      if (json.status !== "success") throw new Error(json.message);
      setLeaveList((prev) =>
        prev.map((l) =>
          l.id === leaveId
            ? { ...l, status: action === "approve" ? "approved" : "rejected" }
            : l,
        ),
      );
      setSummary((prev) =>
        prev
          ? {
              ...prev,
              pending: prev.pending - 1,
              approved:
                action === "approve" ? prev.approved + 1 : prev.approved,
              rejected: action === "reject" ? prev.rejected + 1 : prev.rejected,
            }
          : prev,
      );
      addToast(
        `Leave ${action === "approve" ? "approved" : "rejected"} successfully`,
        "success",
      );
    } catch (e) {
      addToast(e.message || "Action failed", "error");
    } finally {
      setActionLoading(false);
      setConfirm(null);
    }
  };

  const onApprove = (leave) => setConfirm({ leave, action: "approve" });
  const onReject = (leave) => setConfirm({ leave, action: "reject" });

  if (error) {
    return (
      <div className="error-state">
        <XCircle size={40} />
        <h3>Failed to load dashboard</h3>
        <p>{error}</p>
        <button className="btn-solid btn-approve" onClick={fetchDashboard}>
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="al-root">
      <Toast toasts={toasts} remove={removeToast} />

      {/* Header */}
      <div className="al-header">
        <div>
          <h1 className="al-title">Leave Management</h1>
          <p className="al-subtitle">
            Monitor and manage employee leave requests
          </p>
        </div>
        <button
          className="refresh-btn"
          onClick={fetchDashboard}
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          icon={Users}
          label="Total Employees"
          value={summary?.totalEmployees}
          color="#6366f1"
          loading={loading}
        />
        <KPICard
          icon={CalendarCheck}
          label="Total Leaves"
          value={summary?.totalLeaves}
          color="#10b981"
          loading={loading}
          sub="All time"
        />
        <KPICard
          icon={Clock}
          label="Pending Requests"
          value={summary?.pending}
          color="#f59e0b"
          loading={loading}
          sub="Awaiting action"
        />
        <KPICard
          icon={TrendingUp}
          label="Approved This Month"
          value={summary?.approvedMonth}
          color="#06b6d4"
          loading={loading}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="charts-row">
        <DonutCard title="Approval Status" data={approval} loading={loading} />
        <DonutCard title="Leave Type" data={leaveType} loading={loading} />
        <TrendCard data={trend} loading={loading} />
      </div>

      {/* Charts Row 2 */}
      <div className="charts-row-2">
        <DeptCard data={dept} loading={loading} />
      </div>

      {/* Table */}
      <LeaveTable
        data={leaveList}
        loading={loading}
        onApprove={onApprove}
        onReject={onReject}
        onView={setViewLeave}
      />

      {/* Modals */}
      <ConfirmDialog
        open={!!confirm}
        type={confirm?.action === "approve" ? "approve" : "reject"}
        title={confirm?.action === "approve" ? "Approve Leave" : "Reject Leave"}
        message={`Are you sure you want to ${confirm?.action} the leave request for ${confirm?.leave?.name}?`}
        onConfirm={() => handleAction(confirm.leave.id, confirm.action)}
        onCancel={() => setConfirm(null)}
      />

      <ReasonModal leave={viewLeave} onClose={() => setViewLeave(null)} />
    </div>
  );
}

export default AdminLeaves;
