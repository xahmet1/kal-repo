const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const BOT_TOKEN = 'MTM4NDEyMTA4MzgxMjM4NDc2OA.GGVCb7._o4C78nZEVsq-SnBWpg-oiDpg4LMTichcS6Dok';
const CLIENT_ID = '1384121083812384768';
const GUILD_ID = '1376899286486482974';
const DOGRU_SIFRE = '1234';

const commands = [
  new SlashCommandBuilder()
    .setName('komut')
    .setDescription('Kali terminalinde komut çalıştırır (şifreli)')
    .addStringOption(option =>
      option.setName('şifre').setDescription('Komut çalıştırma şifresi').setRequired(true))
    .addStringOption(option =>
      option.setName('komut').setDescription('Çalıştırılacak komut').setRequired(true))
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => console.log('✅ Slash komut yüklendi!'))
  .catch(console.error);

client.on('ready', () => {
  console.log(`${client.user.tag} çalışıyor!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'komut') return;

  const sifre = interaction.options.getString('şifre');
  const komut = interaction.options.getString('komut');

  if (sifre !== DOGRU_SIFRE) {
    await interaction.reply({ content: '❌ Şifre hatalı.', ephemeral: true });
    return;
  }

  const etkileyiciKomutlar = {
    'sistem': 'uname -a',
    'kullanici': 'whoami',
    'tarih': 'date',
    'uptime': 'uptime',
    'disk': 'df -h',
  };

  const calisacakKomut = etkileyiciKomutlar[komut] || komut;

  exec(calisacakKomut, (error, stdout, stderr) => {
    if (error) {
      interaction.reply({ content: `❌ Hata:
\`\`\`${error.message}\`\`\``, ephemeral: true });
      return;
    }

    const sonuc = (stdout + stderr)
      .replace(/(\d{1,3}\.){3}\d{1,3}/g, '***.***.***.***')
      .slice(0, 1900);

    interaction.reply({ content: `✅ Çıktı:
\`\`\`${sonuc || 'Boş çıktı.'}\`\`\``, ephemeral: true });
  });
});

client.login(BOT_TOKEN);
