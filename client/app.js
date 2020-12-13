const login = require("./user/login")
const register = require("./user/register")
const colors = require("colors")
const { Select } = require('enquirer');
const chalk = require('chalk');
const figlet = require('figlet');

console.clear()

async function main(){
  const prompt = new Select({
    name: 'Main',
    message: 'İşleminizi Seçiniz',
    choices: ['Giris Yap', 'Kayit Ol', 'Sifre Degistir (Coming Soon)', 'Cikis Yap']
  });
  
  console.log(chalk.yellow(figlet.textSync("TMWG", { horizontalLayout: 'full' })))
  const islem = await prompt.run()

  switch (islem) {
    case 'Giris Yap':
      login()
      break;
    case 'Kayit Ol':
      register()
      break;

    case 'Sifre Degistir (Coming Soon)':
      console.clear()
      console.log(colors.red("Coming Soon..."))
      main()
      break;
    
    case 'Cikis Yap':
      break
  }
}

main()