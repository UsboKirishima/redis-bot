import { Client, Message, MessageEmbed } from 'discord.js';
import Redis from 'ioredis';
import "dotenv/config";

const prefix = '?';
const redis = new Redis();


const client: Client = new Client({
    intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_PRESENCES",
        "GUILD_VOICE_STATES"
    ]
});

client.on('ready', async (): Promise<void> => {
    console.log('Online');
    await client.user.setActivity({
        name: 'you <$',
        type: 'LISTENING'
    })
})

client.on('messageCreate', async (message: Message): Promise<any> => {
    const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);

    switch (args[0]) {
        case 'set': {
            await redis.set(`${message.author.id}_${args[1]}`, args.slice(2).join(" "));
            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`
                    **Database path**
                    \`\`\`${message.author.id}_${args[1]}\`\`\`

                    **Database value**
                    \`\`\`${args.slice(2).join(" ")}\`\`\`
                    `)
                ]
            })
        } break;
        case 'get': {
            let getInfo = await redis.get(`${message.author.id}_${args[1]}`);
            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('GREEN')
                    .addField('Item', `${args[1]}`)
                    .addField('Value', getInfo)
                ]
            })
        } break;
        default: {
            return;
        } break;
    }
})

client.login(process.env.token);