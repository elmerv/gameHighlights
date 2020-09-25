const axios = require('axios');

const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInputObjectType
} = require('graphql');


// Hardcoded Data
// var date = new Date();

// const customers = [
//     {id: '1', summonerName: 'felmerv', videos:['dfsdf'], date: date.getDate()},
//     {id: '2', summonerName: 'abort', videos:['sfds'], date: date.getDate()}
// ];

const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: {type:GraphQLString},
        summonerName:{type:GraphQLString},
        videos:{type:GraphQLList(GraphQLString)},
        date:{type:GraphQLInt}
    })
})
// Root Query
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        customer: {
            type: CustomerType,
            args:{
                id:{type:GraphQLString}
            }, 
            resolve(parentValue, args){
                // for(let i = 0; i < customers.length; i++){
                //     if(customers[i].id == args.id){
                //         return customers[i];
                //     }
                // }
                return axios.get('http://localhost:3000/customers/'+ args.id)
                .then(res => res.data);
            }
        },
        customers: {
            //type initializes the type of response you want to send. 
            type: new GraphQLList(CustomerType),
            resolve(parentValue,args){
                return axios.get('http://localhost:3000/customers/')
                .then(res => res.data);            }
        }
    }
    
});
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addCustomer:{
            type:CustomerType,
            args:{
                summonerName:{type: new GraphQLNonNull(GraphQLString)},
                videos:{type: new GraphQLNonNull(GraphQLList(GraphQLString))},
                date:{type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue,args){
                return axios.post('http://localhost:3000/customers', {
                    summonerName:args.summonerName,
                    videos: args.videos,
                    date:args.date
                }).then(res => res.data);
        }

        }
    }
});
module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation
});