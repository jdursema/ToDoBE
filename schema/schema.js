const graphql = require('graphql');
const Task = require('../models/task');
const Project = require('../models/project')

const { 
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema, 
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean
} = graphql;

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields:()=> ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    done: {type: GraphQLBoolean},
    project: {
      type: ProjectType,
      resolve(parent, args){
        return Project.findById(parent.projectId)
      }
    }
  })
})

const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields:() => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString},
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args){
        return Task.find({ projectId: parent.id })
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args){
        return Task.findById(args.id);
      }
    },
    project: {
      type: ProjectType,
      args: { id: {type: GraphQLID}},
      resolve(parent, args){
        return Project.findById(args.id)
      }
    },
    tasks:{
      type: new GraphQLList(TaskType),
      resolve(parent, args){
        return Task.find({});
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args){
        return Project.find({})
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLString }
      },
      resolve(parent, args){
        let project = new Project({
          name: args.name
        });
        return project.save();
      }
    },
    addTask: {
      type: TaskType,
      args: {
        name: { type: GraphQLString },
        done: { type: GraphQLBoolean },
        projectId: { type: GraphQLID }
      },
      resolve(parent, args){
        let task = new Task({
          name: args.name,
          done: args.done,
          projectId: args.projectId
        })
        return task.save();
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});