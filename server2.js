var express = require('express');
var express_graphql = require('express-graphql');
var {buildSchema} = require('graphql');

// GraphQL Schema
var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    }
    type Mutation {
        updateCourseTopic(id: Int!, topic:String!): Course
    }
    type Course {
        id:Int
        title:String
        author: String
        description: String
        topic:String
        url: String
    }
`);

var getCourse = function(args) {
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

var getCourses = function(args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

var updateCourseTopic = function({id, topic}) {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id)[0];
}

// Root resolver
var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
};

// Dummy Data
var coursesData = [
    {
        id:1,
        title: 'the complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js bt building real-world application',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id:2,
        title: 'Node.js , Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by exmaple building & deploying real-world',
        topic: 'Node.js',
        url: 'https://codingthesmarway.com/courses/nodejs-express',
    },
    {
        id:3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript Course for everyone!',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript'
    }

]

// Create an Express Server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000,()=>console.log('Express GraphQL Server running'));