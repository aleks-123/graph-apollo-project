import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

import Header from "./components/Header";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Project from "./pages/Project";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:id" element={<Project />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </>
  );
}

export default App;
