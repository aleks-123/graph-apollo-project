import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PROJECTS } from "../queries/projectQuery";
import { ADD_PROJECT } from "../mutations/projectsMutations";
import { GET_CLIENTS } from "../queries/clientQuery";

function AddProjectModal() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientId: "0",
    status: "new",
  });

  // Get clients for select
  const { loading, error, data } = useQuery(GET_CLIENTS);

  const isFormComplete = () => {
    return (
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.clientId !== "0"
    );
  };

  const [addProject] = useMutation(ADD_PROJECT, {
    variables: {
      name: formData.name,
      description: formData.description,
      clientId: formData.clientId,
      status: formData.status,
    },
    update(cache, { data: { addProject } }) {
      const { projects } = cache.readQuery({
        query: GET_PROJECTS,
      });
      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: [...projects, addProject] },
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
    addProject(
      formData.name,
      formData.description,
      formData.clientId,
      formData.status
    );
  };

  if (loading) return null;
  if (error) return "Something went wrong";

  return (
    <>
      {!loading && !error && (
        <>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addProjectModal"
          >
            <div className="d-flex align-items-center">
              <FaUser className="icon" />
              <div>Add Project</div>
            </div>
          </button>

          <div
            className="modal fade"
            id="addProjectModal"
            aria-labelledby="addProjectModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="addProjectModalLabel">
                    Add new project
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
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        name="status"
                        id="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="new">Not Started</option>
                        <option value="progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Client</label>
                      <select
                        name="clientId"
                        id="clientId"
                        className="form-select"
                        value={formData.clientId}
                        onChange={handleChange}
                      >
                        <option value="0">Select Client</option>
                        {data.clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
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
                      className="btn btn-primary m-2"
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
      )}
    </>
  );
}
export default AddProjectModal;
