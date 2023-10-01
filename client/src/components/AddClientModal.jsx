import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { ADD_CLIENT } from "../mutations/clientMutations";
import { GET_CLIENTS } from "../queries/clientQuery";

function AddClientModal() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const isFormComplete = () => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== ""
    );
  };

  const [addClient] = useMutation(ADD_CLIENT, {
    variables: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    },
    update(cache, { data: { addClient } }) {
      const { clients } = cache.readQuery({
        query: GET_CLIENTS,
      });
      cache.writeQuery({
        query: GET_CLIENTS,
        data: { clients: [...clients, addClient] },
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addClient(formData.name, formData.email, formData.phone);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        data-bs-toggle="modal"
        data-bs-target="#addClientModal"
      >
        <div className="d-flex align-items-center">
          <FaUser className="icon" />
          <div>Add Client</div>
        </div>
      </button>

      <div
        className="modal fade"
        id="addClientModal"
        aria-labelledby="addClientModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addClientModalLabel">
                Add Client
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control"
                    id="phone"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-danger  "
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  data-bs-dismiss="modal"
                  className="btn btn-secondary m-2"
                  disabled={!isFormComplete()} // Disable the Submit button if the form is not complete
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AddClientModal;
