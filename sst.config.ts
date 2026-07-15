/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "bunkspot",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: "7.20.0",
        cloudflare: "6.15.0"
      },
    };
  },
  async run() {
    // 1. Core Data Engine (Single-Table Architecture)
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

    // 2. Identity & Access Management (AWS Cognito User Pool)
    const cognitoAuth = new sst.aws.CognitoUserPool("BunkSpot_Auth", {
      usernames: ["email"],
    });
    
    // Create a public Web Client enabling Amplify to handle client-side authentication
    const cognitoClient = cognitoAuth.addClient("WebClient", {
      // ✅ FIX: Use the native transform property to configure underlying AWS client arguments safely
      transform: {
        client: {
          explicitAuthFlows: [
            "ALLOW_USER_SRP_AUTH",
            "ALLOW_REFRESH_TOKEN_AUTH"
          ]
        }
      }
    });

    // 3. Frontend PWA Deployed via Cloudflare StaticSite
    const webApp = new sst.cloudflare.StaticSite("BunkSpot_PWA", {
      path: "frontend",
      build: {
        command: "bun run build",
        output: "dist",
      },
      // Safely pass down environment variables straight into your Vite frontend application
      environment: {
        VITE_AWS_REGION: aws.getRegionOutput().name,
        VITE_TABLE_NAME: mainTable.name,
        VITE_USER_POOL_ID: cognitoAuth.id,
        VITE_USER_POOL_CLIENT_ID: cognitoClient.id,
      },
    });

    // 4. Campaign site deployed as a plain static site on Cloudflare
    const campaignSite = new sst.cloudflare.StaticSite("BunkSpot_Campaign", {
      path: "website",
    });

    // 5. Console Outputs
    return {
      FrontendUrl: webApp.url,
      CampaignSiteUrl: campaignSite.url,
      DatabaseTable: mainTable.name,
      UserPoolId: cognitoAuth.id,
      UserPoolClientId: cognitoClient.id,
    };
  },
});