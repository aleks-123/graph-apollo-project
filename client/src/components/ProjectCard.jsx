function ProjectCard({ project }) {
  return (
    <div className="col-md-6">
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title">{project.name}</h3>
            <a className="btn btn-light" href={`/project/${project.id}`}>
              View
            </a>
          </div>
          <p className="small">
            status: <strong>{project.status}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
export default ProjectCard;
