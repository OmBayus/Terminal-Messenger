const prompt = require('prompt');
const colors = require("colors")
const { gql,GraphQLClient } = require('graphql-request')
const lobi = require("../msg/lobi")
const bcrypt = require('bcrypt');
const islogin = require("../configs/isonline")





module.exports = function login(){
    
    const endpoint = 'http://localhost:4000/graphql'

    const client = new GraphQLClient(endpoint)



    const properties = [
        {
            name: 'username',
            validator: /^[a-zA-Z\s\-]+$/,
            warning: 'Username must be only letters, spaces, or dashes'
        },
        {
            name: 'password',
            hidden: true,
            replace: "*"
        }
    ];
    prompt.message = colors.red("Username");
    prompt.delimiter = colors.green(">");
    
    prompt.get(properties, async function (err, result) {
        if (err) { return onErr(err); }
        const query = gql`
            query user($name:String!){
                user(name:$name){
                    name
                    password
                    id
                }
            }
        `
        
        const variables = {
            name: result.username
        }
    
        const data = await client.request(query,variables)

        if(data.user === null){
            console.log("Kullanici Adi veya sifre Yanlis!")
            login()
        }
        else{
            bcrypt.compare(result.password, data.user.password, function(err,result){
                if (result){
                    lobi(data.user.id)
                    islogin(data.user.id)
                }
                else{
                    console.log("Kullanici Adi veya sifre Yanlis!!")
                }
            })
            
        }
        
    });
}




