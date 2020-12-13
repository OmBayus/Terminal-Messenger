const prompt = require('prompt');
const colors = require("colors")
const { gql,GraphQLClient } = require('graphql-request');
const bcrypt = require('bcrypt');



module.exports = function register(){
      
      const endpoint = 'http://localhost:4000/graphql'

      const client = new GraphQLClient(endpoint)

      const properties = [
            {
                name: 'username'
            },
            {
                name: 'password',
                hidden: true,
                replace: "*"
            },
            {
              name: 'confirm_password',
              hidden: true,
              replace: "*"
          }
        ];
      prompt.message = colors.red("Username");
      prompt.delimiter = colors.green(">");
    
      prompt.get(properties, async function (err, result) {
            if (err) { return onErr(err); }
            const query = gql`
            {
                  users{
                        name
                        id
                  }
            }
            `

            if(result.confirm_password === result.password){
                  const data = await client.request(query)

                  if(data.user === null){
                        console.log("Bir hata Olustu!")
                        register()
                  }
                  else{
                        var checkuser = data.users.filter(user=>{
                              return user.name === result.username
                        })

                        if(checkuser[0]){
                              console.log("Kullanici adi daha önce alınmış.")
                              register()
                        }
                        else{
                              const mutation = gql`
                                    mutation addUser($name:String!,$online:Boolean!,$password:String!){
                                          addUser(name:$name,online:$online,password:$password){
                                                name
                                                id
                                          }
                                    }
                              `
                              bcrypt.hash(result.password,10, async function(err,hash){
                                    if(!err)
                                    {
                                          console.log(hash)
                                          const variables = {
                                                name: result.username,
                                                password: hash,
                                                online: false
                                          }
                                          const data_2 = await client.request(mutation,variables)
                                          console.log(data_2)
                                    }
                                    else{
                                          console.log(err)
                                    }
                              })
                              
                        }
                  }
            }
            else{
                  console.log("Sifre Eşleşmiyor...")
                  register()
            }
 
            
        
      });
}




