import { useEffect, useState } from "react";

const PendingLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReason, setSelectedReason] = useState(null);

  const fetchLeaves = async () => {
    try {
      const res = await fetch(
        "https://leave-management-system.wuaze.com/backend/api/admin/getPendingLeaves.php",
        { credentials: "include" },
      );

      const data = await res.json();
      setLeaves(data);
    } catch (err) {
      console.log("Error fetching leaves:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const approveLeave = async (id) => {
    const res = await fetch(
      "https://leave-management-system.wuaze.com/backend/api/admin/approveLeave.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ request_id: id }),
      },
    );

    const data = await res.json();

    if (data.status === "success") {
      fetchLeaves();
    } else {
      alert("Approve failed");
    }
  };

  const rejectLeave = async (id) => {
    await fetch(
      "https://leave-management-system.wuaze.com/backend/api/admin/rejectLeave.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ request_id: id }),
      },
    );

    fetchLeaves();
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="admin-leaves-page">
      <div className="page-header">
        <h2>Pending Leave Requests</h2>
        <p>Review and manage employee leave applications</p>
      </div>

      {leaves.length === 0 ? (
        <div className="card empty-state">No pending leave requests</div>
      ) : (
        <div className="card admin-table-card">
          <div className="table-wrap">
            <table className="leave-table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Emp Code</th>
                  <th>Name</th>
                  {/* <th>Email</th> */}
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Joining Date</th>
                  <th>Leave Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave, index) => (
                  <tr key={leave.id} className="table-rows">
                    <td className="pending-td">{index + 1}</td>

                    <td>{leave.emp_code}</td>

                    <td>
                      {leave.first_name} {leave.last_name}
                    </td>

                    {/* <td>{leave.email}</td> */}

                    <td>{leave.department}</td>

                    <td>{leave.designation}</td>

                    <td>{leave.date_of_joining}</td>

                    <td>
                      <span
                        className={`badge badge-${leave.leave_type?.toLowerCase()}`}
                      >
                        {leave.leave_type}
                      </span>
                    </td>

                    <td className="date-cell">{leave.start_date}</td>

                    <td className="date-cell">{leave.end_date}</td>

                    <td>
                      <span className="days-chip">{leave.total_days}</span>
                    </td>

                    <td>
                      <button
                        className="reason-btn"
                        onClick={() => setSelectedReason(leave.reason)}
                      >
                        View
                      </button>
                    </td>

                    <td>
                      <div className="action-btns">
                        <button
                          className="btn-approve"
                          onClick={() => approveLeave(leave.id)}
                        >
                          Approve
                        </button>

                        <button
                          className="btn-reject"
                          onClick={() => rejectLeave(leave.id)}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedReason && (
        <div className="modal">
          <div className="modal-box reason-modal">
            <h3>Leave Reason</h3>

            <div className="reason-content">{selectedReason}</div>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => setSelectedReason(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingLeaves;
