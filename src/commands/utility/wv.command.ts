import { getMember } from "@/action";
import type { SlashCommand } from "@/types/commands";
import { SlashCommandBuilder, type CommandInteraction } from "discord.js";

export const wvc: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("wvc")
    .setDescription("Replies with the voice channel of the user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get the voice channel")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: CommandInteraction) {
    // Fetch the guild of the interaction
    const guild = interaction.guild;

    // Fetch the guild id
    if (!guild) {
      await interaction.reply("This command can only be used in a guild.");
      return;
    }

    // Fetch the user to get the voice channel
    const user = interaction.options.getUser("user", true);

    // Fetch the member
    const member = await getMember(user, guild);

    // Fetch the voice channel
    const voiceChannel = member.voice.channelId;

    // Check if the user is not in a voice channel
    if (!voiceChannel) {
      await interaction.reply("The user is not in a voice channel.");
      return;
    }

    // Send the voice channel
    await interaction.reply(`<#${voiceChannel}>`);
  },
};
