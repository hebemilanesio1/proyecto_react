import './App.css';
import { IoCloseCircle } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from 'axios';

// Configura correctamente la URL base para Axios
axios.defaults.baseURL = "http://localhost:5000";

function App() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false); // Nuevo estado para modo edición
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [dataList, setDataList] = useState([]);
  const [editId, setEditId] = useState(null); // Nuevo estado para almacenar el ID del elemento a editar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Lógica de actualización cuando está en modo edición
        const response = await axios.put(`/update/${editId}`, formData);
        if (response.data.success) {
          alert(response.data.message);
          setEditMode(false);
          setEditId(null);
        }
      } else {
        // Lógica de creación cuando no está en modo edición
        const response = await axios.post("/create", formData);
        if (response.data.success) {
          alert(response.data.message);
        }
      }
      setFormVisible(false);
      setFormData({ name: "", email: "", mobile: "" });
      getFetchData(); // Actualiza la lista después de enviar el formulario
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const getFetchData = async () => {
    try {
      const response = await axios.get("/");
      if (response.data.success) {
        setDataList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEdit = (item) => {
    setFormVisible(true);
    setEditMode(true);
    setEditId(item._id);
    setFormData({
      name: item.name,
      email: item.email,
      mobile: item.mobile,
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/delete/${id}`);
      if (response.data.success) {
        alert(response.data.message);
        getFetchData();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  console.log("Data List: ", dataList);

  return (
    <div className="container">
      <button className="btn btn-add" onClick={() => {
        setFormVisible(!isFormVisible);
        setEditMode(false);
        setFormData({ name: "", email: "", mobile: "" });
      }}>
        {isFormVisible ? "Hide Form" : "Add"}
      </button>

      {isFormVisible && (
        <div className="addContainer">
          <form onSubmit={handleSubmit}>
            <button type="button" className="close-button" onClick={() => setFormVisible(false)}>
              <IoCloseCircle />
            </button>
            
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="mobile">Mobile:</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />

            <button className="btn" type="submit">
              {isEditMode ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      )}

      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App;

