const takemsg = require("../msg/takemsg")
const sendmsg = require("../msg/sendmsg")
const colors = require("colors")
var Jetty = require("jetty");
const chalk = require('chalk');
const figlet = require('figlet');
const whoonline = require("../configs/whoonline")

var jetty = new Jetty(process.stdout);



module.exports = function main(id){

      console.clear()


      var mesajlar = []
      var lastmsgId

      var online

      function mesajyazdirma(){
            jetty.moveTo([0,0]);
            console.log(
                  chalk.yellow(
                        figlet.textSync("TMWG-Lobi", { horizontalLayout: 'full' })
                  )
            );
            process.stdout.clearLine();
            console.log(online)
            mesajlar.forEach((item,index)=>{
                  jetty.moveTo([(index + 7),0]);
                  process.stdout.clearLine();
                  console.log(item)
            })
      
      }


      setInterval(async ()=>{

            online = await whoonline()

            data = await takemsg()
            yenimsg = data.msg

            if(mesajlar[10] === undefined){
                  mesajlar[10] = yenimsg
                  lastmsgId = data.msgId
                  mesajyazdirma()
            }
            else{
                  if (lastmsgId  !== data.msgId){
                        mesajlar.forEach((item,index)=>{
                              if(index !== 0){
                                    mesajlar[(index-1)] = item
                              }
                        })

                        if(id === data.userId){
                              yenimsg = colors.white(data.username.toUpperCase() + ":") + data.normalmesaj
                        }
                        lastmsgId = data.msgId
                        mesajlar[10] = yenimsg
                        mesajyazdirma()
                        
                  }
            }
      },500)
      sendmsg(id)
}

