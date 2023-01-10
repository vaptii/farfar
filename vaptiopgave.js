const {Client,SlashCommandBuilder,ChatInputCommandInteraction,PermissionFlagsBits,EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle, messageLink, TimestampStyles} = require('discord.js')
var database = require("../../Database/db.js");
const ms = require('ms');
let count = 0;

module.exports = {
    data: new SlashCommandBuilder()
      .setName("vaptiopgave")
      .setDescription("Will respond with Vapti Opgave."),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
 
    
        database.query('SELECT * FROM tilmeldinger', function(error, results, fields) {
            if (error) return console.error(error);  

            let choice = ''
            for (let i = 0; i < results.length; i++) {
               choice = choice + `${results[i].choice}`
            }
  
            const Response = new EmbedBuilder()
            .setTitle("Vapti Opgave")
            .setDescription(`Number: ${count}`)
            .setTimestamp(Date.now())
            .setFooter({ text: `${choice}`})
            .setColor("Blurple")            
  
            interaction.reply({embeds: [Response], ephemeral: true})
            })

            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('primary1')
                    .setLabel('+')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('primary2')
                    .setLabel('-')
                    .setStyle(ButtonStyle.Primary),

                await interaction.reply({components: [row], ephemeral: true})
        )          
                     

        // const Responsee = new EmbedBuilder()
        // .setTitle("You have got a new dwdwe! ✉️")
        // .setDescription(`Number:`, num++)
        // .setTimestamp(Date.now())
        // .setColor("Blurple")
        
        
        const collector = interaction.channel.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.customId === 'primary1') {
                database.query(`INSERT INTO tilmeldinger (username, userid, choice, timestamp) VALUES (?, ?, ?, ?)`, [interaction.user.username, interaction.user.id, '1', new Date().toLocaleString()], (err, row) => {
                    if (err) return console.error(err);        
                })
                count = count + 1;
                const Response = new EmbedBuilder()
                .setTitle("Vapti Opgave")
                .setDescription(`Number: ${count}`)
                .setTimestamp(Date.now())
                .setColor("Blurple")

                await i.update({ embeds: [Response], components: [row], ephemeral: true});
            } else {
                if (i.customId === 'primary2') {
                    database.query(`INSERT INTO tilmeldinger (username, userid, choice, timestamp) VALUES (?, ?, ?, ?)`, [interaction.user.username, interaction.user.id, '0', new Date().toLocaleString()], (err, row) => {
                        if (err) return console.error(err);        
                    })
                    count = count - 1;

                    const Response = new EmbedBuilder()
                    .setTitle("Vapti Opgave")
                    .setDescription(`Number: ${count}`)
                    .setTimestamp(Date.now())
                    .setColor("Blurple")

                    // let timed = "5m"
                    // const editEmbed = new EmbedBuilder()
                    // setTimeout(function(){
                    //     embed.setColor('#5e4242');
                    //     editEmbed.update(embed);
                    //  }, ms(timed));

                     await i.update({ embeds: [Response], components: [row], ephemeral: true });
                }
            }
        });
    }}
