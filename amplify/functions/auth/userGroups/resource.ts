import { defineFunction } from "@aws-amplify/backend";

export const userGroups = defineFunction({
  name: 'userGroups', // this will default to the directory name, so in this case is optional
  entry: './handler.ts', // this will default to ./handler.ts so really it is optional
})