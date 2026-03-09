import { useState, useEffect } from "react";

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Legal",
  "Customer Success",
];

const POSITIONS = [
  "Junior Engineer",
  "Senior Engineer",
  "Tech Lead",
  "Manager",
  "Director",
  "VP",
  "Analyst",
  "Designer",
  "Coordinator",
  "Executive",
];

export default function AddEmployee() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    date_of_joining: "",
    password: "",
    profile_image: null,
  });

  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const validate = (data = form) => {
    const e = {};

    if (!data.first_name) e.first_name = "First name required";
    if (!data.last_name) e.last_name = "Last name required";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = "Invalid email";

    if (!/^[6-9]\d{9}$/.test(data.phone)) e.phone = "Phone must be 10 digits";

    if (!data.department) e.department = "Select department";
    if (!data.position) e.position = "Select position";
    if (!data.date_of_joining) e.date_of_joining = "Select joining date";

    if (!data.password || data.password.length < 6)
      e.password = "Min 6 characters";

    return e;
  };

  const handleChange = (e) => {
    let { name, value, files } = e.target;

    if (name === "profile_image") {
      const file = files[0];
      setForm({ ...form, profile_image: file });

      if (file) {
        setPreview(URL.createObjectURL(file));
        setFileName(file.name);
      }

      return;
    }

    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    const updated = { ...form, [name]: value };

    setForm(updated);

    if (touched[name]) {
      const errs = validate(updated);
      setErrors((p) => ({ ...p, [name]: errs[name] || "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((p) => ({ ...p, [name]: true }));

    const errs = validate();

    setErrors((p) => ({ ...p, [name]: errs[name] || "" }));
  };

  const handleReset = () => {
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      date_of_joining: "",
      password: "",
      profile_image: null,
    });

    setPreview(null);
    setFileName("No file chosen");

    setErrors({});
    setTouched({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = Object.fromEntries(
      Object.keys(form).map((k) => [k, true]),
    );

    setTouched(allTouched);

    const errs = validate();

    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      const res = await fetch(
        "https://leave-management-system.wuaze.com/backend/api/admin/addEmployee.php",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      const data = await res.json();

      if (data.status === "success") {
        setToast({
          type: "success",
          text: `Employee ${data.emp_code} added successfully 🎉`,
        });

        handleReset();
      } else {
        setToast({
          type: "error",
          text: data.message,
        });
      }
    } catch {
      setToast({
        type: "error",
        text: "Server error. Try again.",
      });
    }

    setLoading(false);
    setToast({
      type: "success",
      text: `Employee ${data.emp_code} added successfully 🎉`,
    });
  };

  return (
    <>
      <div className="ae-root">
        <div className="ae-card">
          <div className="ae-header">
            <h1>Add New Employee</h1>
            <p>Register a new employee into the HR system</p>
          </div>

          {/* Avatar */}

          <div className="avatar-section">
            <div className="avatar-wrapper">
              {preview ? (
                <img src={preview} alt="avatar" />
              ) : (
                <div className="avatar-placeholder">👤</div>
              )}
            </div>

            <div className="avatar-upload">
              <label className="upload-btn">
                Upload Image
                <input
                  type="file"
                  name="profile_image"
                  hidden
                  accept="image/*"
                  onChange={handleChange}
                />
              </label>

              <span className="file-name">{fileName}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* PERSONAL */}

            <div className="form-section">
              <h3>Personal Information</h3>

              <div className="ae-grid">
                <div className="field">
                  <label>First Name</label>
                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.first_name && (
                    <span className="error">{errors.first_name}</span>
                  )}
                </div>

                <div className="field">
                  <label>Last Name</label>
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.last_name && (
                    <span className="error">{errors.last_name}</span>
                  )}
                </div>

                <div className="field">
                  <label>Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && (
                    <span className="error">{errors.email}</span>
                  )}
                </div>

                <div className="field">
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.phone && (
                    <span className="error">{errors.phone}</span>
                  )}
                </div>
              </div>

              <h3>Employment Details</h3>

              <div className="ae-grid">
                <div className="field">
                  <label>Department</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Position</label>
                  <select
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select position</option>
                    {POSITIONS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Date of Joining</label>
                  <input
                    type="date"
                    name="date_of_joining"
                    value={form.date_of_joining}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="field">
                  <label>Temporary Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
              >
                Clear Form
              </button>

              <button type="submit" className="btn-primary">
                {loading ? "Saving..." : "Add Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast && <div className={`ae-toast ${toast.type}`}>{toast.text}</div>}
    </>
  );
}
