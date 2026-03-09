import { useEffect, useState } from "react";

function LeaveManagement() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [editId, setEditId] = useState(null);

  const [editData, setEditData] = useState({
    casual_leave: "",
    sick_leave: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    fetch(
      "https://leave-management-system.wuaze.com/backend/api/admin/getEmployees.php",
      { credentials: "include" },
    )
      .then((res) => res.json())
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch(() => setEmployees([]));
  };

  const handleEdit = (emp) => {
    setEditId(emp.employee_id);
    setEditData({
      casual_leave: emp.casual_leave,
      sick_leave: emp.sick_leave,
    });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => setEditId(null);

  const handleSave = (id) => {
    fetch(
      "https://leave-management-system.wuaze.com/backend/api/admin/updateLeave.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id,
          casual_leave: editData.casual_leave,
          sick_leave: editData.sick_leave,
        }),
      },
    )
      .then((res) => res.json())
      .then(() => {
        setEditId(null);
        fetchEmployees();
      });
  };

  /* EXPORT CSV */

  const handleExport = () => {
    const headers = [
      "SL No",
      "Employee Code",
      "Name",
      "Email",
      "Designation",
      "Department",
      "CL",
      "SL",
      "Total",
    ];

    const rows = filtered.map((emp, index) => [
      index + 1,
      emp.emp_code,
      emp.name,
      emp.email,
      emp.designation,
      emp.department,
      emp.casual_leave,
      emp.sick_leave,
      Number(emp.casual_leave) + Number(emp.sick_leave),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leave-management.csv";
    a.click();
  };

  const departments = ["All", ...new Set(employees.map((e) => e.department))];

  const filtered = employees
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    .filter((e) => filterDept === "All" || e.department === filterDept);

  return (
    <div className="lm-root">
      {/* HEADER */}

      <div className="lm-page-header">
        <div>
          <div className="lm-page-title">Leave Management</div>

          <div className="lm-page-sub">
            Track and update casual & sick leave balances
          </div>
        </div>

        <div className="lm-header-actions">
          <button className="btn-outline" onClick={handleExport}>
            Export CSV
          </button>
        </div>
      </div>

      {/* TOOLBAR */}

      <div className="lm-toolbar">
        <div className="lm-search-wrap">
          <input
            placeholder="Search employee name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          {departments.map((d, i) => (
            <option key={i} value={d}>
              {d === "All" ? "All Departments" : d}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}

      <div className="lm-table-wrap">
        <table className="lm-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>SL No</th>

              <th style={{ width: 120 }}>Employee Code</th>

              <th>Employee Name</th>

              <th>Email</th>

              <th>Designation</th>

              <th>Department</th>

              <th style={{ width: 80 }}>CL</th>

              <th style={{ width: 80 }}>SL</th>

              <th style={{ width: 80 }}>Total</th>

              <th style={{ width: 140 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  <div className="lm-empty">No employees found</div>
                </td>
              </tr>
            ) : (
              filtered.map((emp, index) => {
                const isEditing = editId === emp.employee_id;

                const cl = isEditing
                  ? Number(editData.casual_leave)
                  : Number(emp.casual_leave);

                const sl = isEditing
                  ? Number(editData.sick_leave)
                  : Number(emp.sick_leave);

                const total = cl + sl;

                return (
                  <tr key={emp.employee_id}>
                    <td>{index + 1}</td>

                    <td>{emp.emp_code}</td>

                    <td>{emp.name}</td>

                    <td>{emp.email}</td>

                    <td>{emp.designation}</td>

                    <td>{emp.department}</td>

                    <td>
                      {isEditing ? (
                        <input
                          className="edit-input"
                          type="number"
                          name="casual_leave"
                          value={editData.casual_leave}
                          onChange={handleChange}
                        />
                      ) : (
                        emp.casual_leave
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          className="edit-input"
                          type="number"
                          name="sick_leave"
                          value={editData.sick_leave}
                          onChange={handleChange}
                        />
                      ) : (
                        emp.sick_leave
                      )}
                    </td>

                    <td>{total}</td>

                    <td>
                      {isEditing ? (
                        <>
                          <button
                            className="btn-cancel-row"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>

                          <button
                            className="btn-save-row"
                            onClick={() => handleSave(emp.employee_id)}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn-edit-row"
                          onClick={() => handleEdit(emp)}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaveManagement;
