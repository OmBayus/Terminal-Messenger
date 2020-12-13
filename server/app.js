const express = require("express")
const {graphqlHTTP} = require("express-graphql")
const schema = require("./schema/schema")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const { gql,GraphQLClient } = require('graphql-request')

const endpoint = 'http://localhost:4000/graphql'

const client = new GraphQLClient(endpoint)

const app = express()

app.use(cors())

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.once("open",()=>{
      console.log("Connected to Database")
})

app.use("/graphql",graphqlHTTP({
      schema,
      graphiql:true
}))

app.listen(4000,()=>{
      console.log("Server Started")
})

setInterval(async ()=>{

      const mutation = gql`
            mutation checkonline($userId:ID!,$online:Boolean!){
                  checkonline(userId:$userId,online:$online){
                        id
                        name
                        online
                  }
            }
      `
      const variables = {
            userId:"all",
            online:false

      }

      await client.request(mutation,variables)
      
},(1000*10))