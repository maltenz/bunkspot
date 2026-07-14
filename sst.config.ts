/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "bunkspot",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws", // Hard target AWS for state tracking
    };
  },
  async run() {
    const providers = {
      aws: true,
      cloudflare: true,
    };

    const mainTable = new sst.aws.Dynamo("BunkSpot_Master", {
      fields: {
        PK: "string",
        SK: "string",
        GSI1PK: "string",
        GSI1SK: "string",
      },
      primaryIndex: { hashKey: "PK", rangeKey: "SK" },
      globalIndexes: {
        GSI1: { hashKey: "GSI1PK", rangeKey: "GSI1SK" },
      },
    });

    const cognitoAuth = new sst.aws.CognitoUserPool("BunkSpot_Auth", {
      usernames: ["email"],
    });

    const webApp = new sst.cloudflare.StaticSite("BunkSpot_PWA", {
      path: "frontend",
      build: {
        command: "bun run build",
        output: "dist",
      },
      environment: {
        VITE_TABLE_NAME: mainTable.name,
        VITE_USER_POOL_ID: cognitoAuth.id,
      },
    });

    return {
      FrontendUrl: webApp.url,
      DatabaseTable: mainTable.name,
      UserPoolId: cognitoAuth.id,
    };
  },
});