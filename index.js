import { Client, IntentsBitField } from "discord.js"
import * as dotenv from "dotenv"

dotenv.config()

const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

client.on('messageCreate', (message)=>{
    if(message.author.bot) return
    var soma = 0
    function validar_nums(quantidade_lados) {
        let chamada = true
        for(const element of quantidade_lados){
            if(!isFinite(element)) {
                chamada = false
                break
            }
        }
        return chamada
    }
    
    function gerarDado(quantidade, lados){
        let resultados = []
        for(let x = 0; x < quantidade; x++){
            let dado = Math.floor(Math.random() * parseInt(lados) + 1)
            resultados.push(dado)
            soma += dado
        }

        return resultados.sort(sortFunction).reverse()
    }
    function sortFunction(a,b){
        return(a - b)
    }

    function formatarResultado(dado, tiragem=[]){
        let maior_num = tiragem[0]
        tiragem.shift()
        return `[**${maior_num}**${tiragem.length >= 1 ? ', ' : ''}${tiragem.join(', ')}]${dado}`
    }

    const mensagem = message.content.toLowerCase()
    
    let multiplos_dados = mensagem.split('+')
    let resultados = []

    
    for( let dado of multiplos_dados){
        let dado_formatado = dado.trim()
        let quantidade_lados = dado_formatado.split('d')
        
        if(!validar_nums(quantidade_lados)) return
        
        let quantidade = quantidade_lados[0]
        let lados = quantidade_lados[1]
        let tiragem = gerarDado(quantidade, lados)

        resultados.push(formatarResultado(dado_formatado, tiragem))
    }

    message.reply(`${soma} ⟵ ${resultados.join(' + ')}`)
    // soma ⟵ [9, 6]1d20 + [2, 1]2d3
})

client.on('ready', (e)=> {
    console.log('Você tem dado em casa?');
})

client.login(process.env.TOKEN)

