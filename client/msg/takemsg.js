const { gql,GraphQLClient } = require('graphql-request')
const colors = require("colors")

const endpoint = 'http://localhost:4000/graphql'

const client = new GraphQLClient(endpoint)

const query = gql`
      query {
            sonmsg{
                  msg
                  id
                  user{
                        name
                        id
                  }
            }
      }
`


module.exports = async function msg(){

      
        const data = await client.request(query)

        const yenimsg = colors.green(data.sonmsg.user.name.toUpperCase() + ":") + data.sonmsg.msg

        return {msg:yenimsg,msgId: data.sonmsg.id,userId:data.sonmsg.user.id,normalmesaj:data.sonmsg.msg,username:data.sonmsg.user.name}
}


