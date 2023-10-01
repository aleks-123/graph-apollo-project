import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useQuery } from "@apollo/client";
import { GET_PROJECT } from "../queries/projectQuery";
import ClientInfo from "../components/ClientInfo";
import DeleteProjectButton from "../components/DeleteProjectButton";
import EditProjectForm from "../components/EditProjectForm";

function Project() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { id },
  });

  console.log(data);
  if (loading) return null;
  if (error) return <p>Something went wrong!</p>;

  return (
    <>
      {!loading && !error && (
        <div className="mx-auto w-75 card p-5">
          <Link to="/" className="btn btn-light btn-sm w-25 d-inline ms-auto">
            Back
          </Link>
          <h1>{data.project.name}</h1>
          <p>{data.project.description}</p>
          <h5 className="mt-3">Project status</h5>
          <p className="lead">{data.project.status}</p>
          <ClientInfo client={data.project.client} />
          <EditProjectForm project={data.project} />
          <DeleteProjectButton projectId={data.project.id} />
        </div>
      )}
    </>
  );
}
export default Project;
