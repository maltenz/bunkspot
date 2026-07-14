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