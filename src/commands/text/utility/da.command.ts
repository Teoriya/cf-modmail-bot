import { getMember } from "@/action";
import type { TextCommand } from "@/types/commands";
import { CustomDiscordError } from "@/types/errors";
import { GuildMember, PermissionFlagsBits } from "discord.js";

const regexforids = new RegExp(/^\d{16,20}$/); //put this as a util and use it for any id validation

export const da: TextCommand = {
  name: "digitalarena",
  aliases: ["da"],
  argumentParser: async (message) => {
    const args: GuildMember[] = [];
    if (message.mentions.members) {
      message.mentions.members.forEach((member) => {
        args.push(member);
      });
    }
    const parsedArgs = message.content.split(" ");
    parsedArgs.shift();
    let distinctArgs = [...new Set(parsedArgs)];
    await Promise.all(
      distinctArgs.map(async (arg) => {
        if (message.guild && regexforids.test(arg)) {
          const member = await getMember(arg, message.guild); // write a utility to populate an array of ids to discord.js objects
          if (member) {
            args.push(member);
          }
        }
      })
    );
    if (!args.length || !args[0]) {
      if (message.guild)
        args.push(await getMember(message.author, message.guild));
    }
    return args;
  },
  validator: async (message, args) => {
    if (!message.guild)
      throw new Error(
        "You need to be in a server to use this command"
      );
    const member = await getMember(message.author, message.guild);
    if (!member.permissions.has(PermissionFlagsBits.ManageMessages))
      throw new Error(
        "You don't have permission to use this command"
      );
    if (args.length > 1)
      throw new CustomDiscordError(
        "You can only mention only 1 member at a time"
      ); // in the custom error implementation, the error message will be sent to the user and then deleted after a certain time and all this config will be optional and present in the generic custom error implementation
  },
  execute: async (message, args) => {
      const member = args[0];
      const role = member.guild.roles.cache.find(role => role.id === "1224523701156839545");
      if(role) await member.roles.add(role);
      else throw new CustomDiscordError("Role not found");
      if (member.roles.cache.some(role => role.id === "1224523701156839545")) {
        message.reply(
          `Added <@&1224523701156839545> role to <@${member.id}>`
        );
      } else {
        message.channel.send(`${member.displayName} is not assigned the role.`);
      }
    
  },
};
