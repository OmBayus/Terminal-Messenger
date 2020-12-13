const { gql,GraphQLClient } = require('graphql-request')


module.exports = function online(id){

      const endpoint = 'http://localhost:4000/graphql'

      const client = new GraphQLClient(endpoint)

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
            userId:id,
            online:true

      }

      setInterval(async ()=>{
       
            await client.request(mutation,variables)
            
      },1000)

}
