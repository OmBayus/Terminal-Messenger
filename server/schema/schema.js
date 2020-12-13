const {
      GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLList, GraphQLBoolean, GraphQLNonNull,

} = require("graphql")
const _ = require("lodash")
const User = require("../models/user")
const Msg = require("../models/msg")


const userType = new GraphQLObjectType({

      name: "User",
      fields: ()=>({
            id: {type:GraphQLID},
            name: {type:GraphQLString},
            online:{type:GraphQLBoolean},
            password:{type:GraphQLString},
            msgs:{
                  type: new GraphQLList(msgType),
                  resolve(parent,args){
                        // return _.filter(msgs,{userId:parent.id})
                        return Msg.find({userId:parent.id}) 
                  }
            }
      })
})

const msgType = new GraphQLObjectType({

      name: "msg",
      fields: ()=>({
            id: {type:GraphQLID},
            msg:{type:GraphQLString},
            user:{
                  type:userType,
                  resolve(parent,args){
                        // return _.find(users,{id:parent.userId})
                        return User.findById(parent.userId)
                  }
            }
      })
})


const RootQuery = new GraphQLObjectType({
      name:"RootQueryType",
      fields:{
            user:{
                  type:userType,
                  args:{name:{type:GraphQLString}},
                  resolve(parent,args){
                        return User.findOne({name:args.name})
                  }
            },
            msg:{
                  type:msgType,
                  args:{id:{type:GraphQLID}},
                  resolve(parent,args){
                        return Msg.findById(args.id)
                  }
            },
            users:{
                  type: new GraphQLList(userType),
                  resolve(parent,args){
                        return User.find({})
                  }
            },
            msgs:{
                  type: new GraphQLList(msgType),
                  resolve(parent,args){
                        return Msg.find({})
                  }
            },
            sonmsg:{
                  type: msgType,
                  resolve(parent,args){
                        return Msg.findOne().sort({$natural: -1}).limit(1)
                  }
            }
      }
})

const Mutation = new GraphQLObjectType({
      name:"Mutation",
      fields:{
            addUser:{
                  type:userType,
                  args:{
                        name:{type:new GraphQLNonNull(GraphQLString)},
                        online:{type:new GraphQLNonNull(GraphQLBoolean)},
                        password:{type:new GraphQLNonNull(GraphQLString)}
                  },
                  resolve(parent,args){
                        let user = new User({
                              name:args.name,
                              online:args.online,
                              password:args.password
                        })
                        return user.save()
                  }
            },
            addMsg:{
                  type:msgType,
                  args:{
                        msg:{type:new GraphQLNonNull(GraphQLString)},
                        userId:{type:new GraphQLNonNull(GraphQLID)}
                  },
                  resolve(parent,args){
                        let yenimsg = new Msg({
                              msg:args.msg,
                              userId:args.userId
                        })
                        return yenimsg.save()
                  }
            },
            checkonline:{
                  type:userType,
                  args:{
                        userId:{type:new GraphQLNonNull(GraphQLID)},
                        online:{type:new GraphQLNonNull(GraphQLBoolean)}
                  },
                  async resolve(parent,args){
                        if(args.userId !== "all"){
                              if(args.online){
                                    await User.updateOne({_id:args.userId},{online:true})
                                    return User.findOne({_id:args.userId})
                              }
                              else{
                                    await User.updateOne({_id:args.userId},{online:false})
                                    return User.findOne({_id:args.userId})
                              }
                        }
                        else{
                              const users = await User.find({online:true})
                              users.forEach(async (item)=>{
                                    await User.updateOne({_id:item._id},{online:false})
                              })

                              return User.find({})
                        }
                  }
            }
      }
})


module.exports = new GraphQLSchema({
      query:RootQuery,
      mutation:Mutation
})