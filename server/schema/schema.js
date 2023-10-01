const { projects, clients } = require("../sampleData.js");

//Mongoose models

const Project = require("../models/Project.js");
const Client = require("../models/Client.js");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GrapgQLNonNull,
  GraphQLNonNull,
  GraohQLEnumType,
  GraphQLEnumType,
} = require("graphql");

// Client type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

// Project type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        const clients = Client.findById(parent.clientId);
        console.log(clients);
        return Client.findById(parent.clientId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
  },
});

// mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const client = await Client.create({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client;
      },
    },
    // Delete clinet
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        await Project.deleteMany({ clientId: args.id });
        const client = await Client.findByIdAndDelete(args.id);

        if (!client) {
          return { success: false, message: "Client not found." };
        }
        return client;
      },
    },
    //Add a project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        const project = await Project.create({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return project;
      },
    },
    // Delete project
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        const project = await Project.findByIdAndDelete(args.id);
        return project;
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
      },
      resolve: async (parent, args) => {
        const updatedProject = await Project.findByIdAndUpdate(
          args.id,
          {
            name: args.name,
            description: args.description,
            status: args.status,
          },
          { new: true }
        );

        return updatedProject;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
