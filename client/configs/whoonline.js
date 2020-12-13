const { gql,GraphQLClient } = require('graphql-request')
const colors = require('colors')



      
const endpoint = 'http://localhost:4000/graphql'

const client = new GraphQLClient(endpoint)

const query = gql`
      query {
            users{
                  name
                  online
            }
      }
      `

module.exports = async function isonline(){

      var online = "Online: "

      
      const data = await client.request(query)
      data.users.forEach(element => {
            if(element.online){
                  online += (colors.green(element.name.toUpperCase()) +" ")
            }
      });

      return online

}




