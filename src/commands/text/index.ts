import type { TextCommand } from "@/types/commands";
import { Collection } from "discord.js";
import * as moderation from "./moderation";
import * as utility from "./utility";
import * as modmail from "./modmail";

const collection = new Collection<string, TextCommand>();

const commands = { ...moderation, ...utility, ...modmail };
for (const [key, value] of Object.entries(commands)) {
  collection.set(key, value);
}

export default collection;
