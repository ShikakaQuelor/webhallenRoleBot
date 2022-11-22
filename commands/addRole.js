const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getClass,
  getCurrentRank,
  getInactiveRanks,
  getInactiveClasses,
} = require('../misc/ranks');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Ansök om din webhallen-level roll')
    .addStringOption((option) =>
      option.setName('id').setDescription('Ditt webhallen id')
    ),

  async execute(interaction) {
    const id = interaction.options.getString('id');
    if (id) return getMember(interaction);
    return interaction.reply({
      content: `Du glömde skriva in ett id!`,
      ephemeral: true,
    });
  },
};

const setRoles = async (guild, user, data) => {
  const rank = getCurrentRank(data.user.rankLevel);
  const stats = getClass(data.user.avatar.stats);
  const s = rank + ' som en ' + stats;

  const roles = await guild.roles.fetch();

  await user.roles.remove(
    Array.from(
      roles
        .filter(
          (role) =>
            getInactiveRanks(data.user.rankLevel).includes(role.name) ||
            getInactiveClasses(data.user.avatar.stats).includes(role.name)
        )
        .values()
    )
  );
  // Force update
  await user.fetch().then((user) => {
    user.roles.add(
      Array.from(
        roles
          .filter((role) => rank.includes(role.name) || role.name == stats)
          .values()
      )
    );
  });

  return Promise.resolve(s);
};

const handleMember = async (interaction, data) => {
  const user = interaction.member;
  const guild = interaction.guild;

  return setRoles(guild, user, data).then((roles) => {
    console.log(roles);
    interaction.reply({
      content: `Webhallen-konto: ${data.user.username} \nAktiverar: ${roles} `,
      ephemeral: true,
    });
  });
};

const getMember = async (interaction) => {
  const member = interaction.options.getString('id');
  const url = 'https://www.webhallen.com/api/user/' + member;

  return axios
    .get(url)
    .then((response) => {
      if (response.data.status == 'Unauthorized') throw response.data.status;
      return handleMember(interaction, response.data);
    })
    .catch((error) => {
      console.log(error);
      return interaction.reply({
        content: `Hittade ingen profil på ${member}, är den kanske privat?`,
        ephemeral: true,
      });
    });
};
