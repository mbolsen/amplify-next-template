import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "todosStorage",
  access: (allow) => ({
    "media/*": [
      // allow.authenticated.to(["read", "write", "delete"]), // additional actions such as "write" and "delete" can be specified depending on your use case
      allow.groups(["EVERYONE"]).to(["read", "write", "delete"]),
      allow.groups(["ADMIN"]).to(["delete"]),
    ],
  }),
});