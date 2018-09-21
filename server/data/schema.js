import { gql } from 'apollo-server';

export const typeDefs = gql`
  # declare custom scalars
  scalar Date

  # input for creating messages
  input CreateMessageInput {
    groupId: Int!
    text: String!
  }

  # input for creating groups
  input CreateGroupInput {
    name: String!
    userIds: [Int!]
  }

  # input for updating groups
  input UpdateGroupInput {
    id: Int!
    name: String
    userIds: [Int!]
  }

  # input for signing in users
  input SigninUserInput {
    email: String!
    password: String!
    username: String
  }

  # input for updating users
  input UpdateUserInput {
    username: String
  }

  # input for relay cursor connections
  input ConnectionInput {
    first: Int
    after: String
    last: Int
    before: String
  }

  type MessageConnection {
    edges: [MessageEdge]
    pageInfo: PageInfo!
  }

  type MessageEdge {
    cursor: String!
    node: Message!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  # a group chat entity
  type Group {
    id: Int! # unique id for the group
    name: String # name of the group
    users: [User]! # users in the group
    messages(messageConnection: ConnectionInput): MessageConnection # messages sent to the group
  }

  # a user -- keep type really simple for now
  type User {
    id: Int! # unique id for the user
    email: String! # we will also require a unique email per user
    username: String # this is the name we'll show other users
    messages: [Message] # messages sent by user
    groups: [Group] # groups the user belongs to
    friends: [User] # user's friends/contacts
    jwt: String # json web token for access
  }

  # a message sent from a user to a group
  type Message {
    id: Int! # unique id for message
    to: Group! # group message was sent in
    from: User! # user who sent the message
    text: String! # message text
    createdAt: Date! # when message was created
  }

  type Users {
    _id: ID!
    name: String!
    email: String!
    todos: [Todo!]
  }

  type AuthPayload {
    token: String!
    user: Users
  }


  type Todo {
    _id: ID!
    content: String!
  }



    type Column {
      id: Int!
      updatedAt: String!
      createdAt: String!
      name: String!
      order: Int
      project: Project!
      tasks: [Task]
    }
    type Priority {
      id: Int!,
      name: String!,
    }
    type Glossary {
      priorities: [Priority]!,
    }

    type Project {
      id: ID!
      createdAt: String
      updatedAt: String
      title: String
      name: String
      description: String
      creator: User!
      columns: [Column]
      parentId: Int!
    }
    type ProjectGroup {
      id: Int!
      name: String!
      parentId: Int!
      projectGroups: [ProjectGroup]
      projects: [Project]
    }
    type Task {
      id: String
      createdAt: String
      updatedAt: String
      name: String
      description: String
      columnId: Int
      priority: Int
      column: Column
      creator: User
      index: Int
    }
    input TaskInput {
      name: String
      description: String
      columnId: Int
      priority: Int
      createdBy: Int
    }

  # query for types
  type Query {
    # Return a user by their email or id
    user(email: String, id: Int): User

    # Return messages sent by a user via userId
    # Return messages sent to a group via groupId
    messages(groupId: Int, userId: Int): [Message]

    # Return a group by its id
    group(id: Int!): Group

    column(id: Int): Column
    columns(ids: [Int], projectId: Int): [Column]
    glossary: Glossary!
    project (id: Int): Project!
    projects (userId: Int, parentId: Int): [Project]!
    projectGroup (id: Int!): ProjectGroup
    projectGroups (parentId: Int!): [ProjectGroup]
    task(id: String!): Task
    tasks(columnId: Int, columnIds: [Int], projectId: Int): [Task]
  }

  type Mutation {
    # send a message to a group
    createMessage(message: CreateMessageInput!): Message
    createGroup(group: CreateGroupInput!): Group
    deleteGroup(id: Int!): Group
    leaveGroup(id: Int!): Group # let user leave group
    updateGroup(group: UpdateGroupInput!): Group
    login(user: SigninUserInput!): User
    signup(user: SigninUserInput!): User

    createColumn (projectId: Int!, name: String!, order: Int): Column!
    updateColumn (id: Int!, name: String, order: Int): Boolean!
    deleteColumn (id: Int!): Boolean!
    createProject (title: String, name: String, description: String, createdBy: Int!, parentId: Int!): Project!
    updateProject (id: Int!, title: String, description: String): Boolean
    deleteProject (id: Int!): Boolean
    createProjectGroup (name: String!, parentId: Int!, createdBy: Int!): ProjectGroup
    updateProjectGroup (id: Int!, name: String!, parentId: Int): Boolean
    deleteProjectGroup (id: Int!): Boolean
    createTask (input: TaskInput): Task
    updateTask (id: String!, input: TaskInput): Boolean
    deleteTask (id: String!): Boolean
  }

  type Subscription {
    # Subscription fires on every message added
    # for any of the groups with one of these groupIds
    messageAdded(groupIds: [Int]): Message
    groupAdded(userId: Int): Group
  }
  
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

export default typeDefs;
