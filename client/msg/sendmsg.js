const { prompt } = require('enquirer');
const { gql,GraphQLClient } = require('graphql-request')
var Jetty = require("jetty");

var jetty = new Jetty(process.stdout);

module.exports = async function msg(id){

      jetty.moveTo([18,0]);
      process.stdout.clearLine();

      const user = id

      const endpoint = 'http://localhost:4000/graphql'

      const client = new GraphQLClient(endpoint)

      const mutation = gql`
            mutation addMsg($msg:String!,$userId:ID!){
                  addMsg(msg:$msg,userId:$userId){
                        msg
                  }
            }
      `


      const prom = await prompt({
            type: 'input',
            name: 'msg',
            message: ':'
      });

      const mesaj = prom.msg

      if(mesaj!=="exit"){

            const variables = {
                  msg:mesaj,
                  userId:user
            }

            const data = await client.request(mutation,variables)



            msg(user)
            return data
      }else{
            process.exit(1);
      }
      
}