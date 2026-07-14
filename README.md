# BunkSpot Marketplace Engine

BunkSpot is a highly scalable, multi-tenant marketplace platform built to streamline regional labor, accommodation, and crew tracking metrics for seasonal agricultural sectors. 

The architecture is built using a highly performant, multi-cloud model orchestrated entirely by **SST v3 (Ion)**.

---

## 🛠️ Technology Stack & Core Infrastructure

The application leverages a hybrid topology designed for single-digit millisecond scale, zero managed maintenance, and absolute operational cost-efficiency:

* **Infrastructure as Code (IaC):** [SST v3 (Ion)](https://sst.dev) built on Pulumi.
* **State Management & Deployment Locking:** Managed via secure Amazon S3 partitions (`home: "aws"`).
* **Frontend PWA Application Layer:** React + TypeScript + Vite, deployed directly to **Cloudflare Pages** edge nodes for instant rendering in remote regional locations.
* **User Identity & Access Management:** **AWS Cognito User Pools** (Roles segregated into Hostels, Contractors, and Workers via JWT claims).
* **Primary Data Engine:** **Amazon DynamoDB** (Single-Table Architecture optimized for unbounded horizontal scaling).

---

## 📐 Database Data Modeling (Single-Table Architecture)

To maximize performance efficiency and scale beyond millions of operational rows without penalty, BunkSpot uses a single global DynamoDB table configuration (`BunkSpot_Master`).

### Key Structure Patterns

| Entity Access Tier | Partition Key (`PK`) | Sort Key (`SK`) | Description |
| :--- | :--- | :--- | :--- |
| **Hostel Profile** | `HOSTEL#<Cognito_sub>` | `METADATA` | Core metadata fields, pricing tier, and geo-coordinates. |
| **Active Bunk Inventory** | `HOSTEL#<Cognito_sub>` | `BUNK#<Bunk_ID>` | Daily capacity metrics, room assignments, and maintenance logs. |
| **Contractor Profile** | `CONTRACTOR#<Cognito_sub>` | `METADATA` | Master contractor business details and regional license numbers. |
| **Seasonal Crew Worker** | `HOSTEL#<Cognito_sub>` | `WORKER#<Worker_ID>` | Worker records linked directly to active hostel check-ins. |

*Note: Access control patterns utilize `GSI1` mappings for cross-entity dashboard views (e.g., loading regional harvest metrics by field assignment).*

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed globally on your development machine:
* [Bun Runtime](https://bun.sh) (`v1.x` or higher)
* AWS CLI authenticated with your development profile
* Cloudflare Account Access Tokens

### Environment Setup

Create an isolated environment configuration file in the project root directory:

```bash
touch .env
```

Add the following values to `.env`:

```env
# Cloudflare Infrastructure Routing Keys
CLOUDFLARE_API_TOKEN="your_cloudflare_workers_edit_token"
CLOUDFLARE_DEFAULT_ACCOUNT_ID="your_cloudflare_account_hash_id"

# Local AWS Access Profile Definition
AWS_PROFILE="default"
```

### Dependency Installation

Initialize the workspace dependencies from the root monorepo tracking file using Bun:

```bash
bun install
```

### Local Development Workflow

To launch the local hot-reloading development loop, execute the orchestrator script:

```bash
npx sst dev
// http://localhost:3000
```

This sequence triggers the following real-time workflow operations:

* Evaluates your architecture mappings defined within `sst.config.ts`.
* Establishes the safe remote deployment state tracking bucket on AWS.
* Provisions local live framework links for `BunkSpot_Master` and your Cognito endpoints.
* Generates real-time static environment injection parameters inside the local Vite project directory (`/frontend`).
* Hands you an interactive dashboard URL to test and build against.

### Production Build & Deploy

To compile, optimize, and deploy your entire infrastructure stack onto global Cloudflare edge distribution channels and AWS data centers simultaneously:

```bash
npx sst deploy --stage production
```
