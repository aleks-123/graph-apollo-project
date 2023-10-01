import { useState } from "react";
import { useMutation } from "@apollo/client";
import { GET_PROJECT } from "../queries/projectQuery";
import { UPDATE_PROJECT } from "../mutations/projectsMutations";

function EditProjectForm({ project }) {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    status: project.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    variables: {
      id: project.id,
      name: formData.name,
      description: formData.description,
      status: formData.status,
    },
    refetchQueries: [{ query: GET_PROJECT, variables: { id: project.id } }],
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.status) {
      return alert("Please fill out all fields");
    }
    updateProject(formData.name, formData.description, formData.status);
  };

  return (
    <div className="mt-5">
      <h3>Update Project Details</h3>
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
        <button type="submit" className="btn btn-primary m-2">
          Submit
        </button>
      </form>
    </div>
  );
}
export default EditProjectForm;
