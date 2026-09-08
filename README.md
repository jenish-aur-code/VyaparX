📒 VyaparX

A modern, responsive business management web application built with React.js for managing companies, items, parties, Sauda orders, payments, dispatches, bills, reports, and business profiles.

The application is designed based on the existing VyaparX mobile application UI/UX and recreated as a responsive web application for both desktop and mobile devices.

🚀 Features

🏠 Dashboard

Total Sauda Orders

Current Company information

Current Financial Year

Item summary

Party List

Sauda Order List

Create New Sauda Order

Item List

Sauda Dispatch

Sauda Bill

Quick navigation to major modules

🏢 Company Management

Add, edit, delete and search companies

Set Default Company

Switch Company

GST Number

PAN Number

Bank Details

Account Number

Account Holder Name

IFSC Code

UPI ID

Sauda Note Color

Sauda Note PDF Template

Signature setting

📦 Item Management

Add, edit, delete and search items

Item selection modal

Item ID and location information

Item quality/variety

Example items:

KAPAS

RAM

SKY

👥 Party Management

Manage sellers and buyers from a single party module.

Party Types

Seller

Buyer

Both

Party Information

Party Name

Contact Person

Phone Number

Address

City

State

PIN Code

GST Number

PAN Number

Bank Details

Commission Rate

📝 Sauda Order Management

Create and manage complete Sauda orders using a multi-step workflow:

Item

Seller

Buyer

Item Details

Date

Item Name

Item Quality / Variety

Quantity

Unit

Bill Rate

GST

Bill Number

Payment Terms

Delivery Terms

Remarks

Terms & Conditions

Seller Details

Seller Name

Commission Rate

Commission Amount

Seller Contact Person

Buyer Details

Buyer Name

Commission Rate

Commission Amount

Buyer Contact Person

💰 Automatic Calculations

Bill Amount

Bill Amount = Quantity × Unit × Bill Rate

Commission

Commission Amount = Base Amount × Commission Rate / 100

Payment Balance

Remaining Amount = Total Bill Amount - Total Payments

Dispatch Balance

Remaining Quantity = Order Quantity - Dispatched Quantity

GST is applied when the With GST option is enabled. All calculations are dynamic and are not hardcoded.

🚚 Sauda Dispatch

Sauda ID

Dispatch Date

Quantity

Vehicle Number

Transporter

Driver / Contact

Remarks

Dispatch Status

Statuses:

Pending

Partial

Dispatched

Completed

💳 Payment Management

Payment Date

Amount

Payment Mode

Reference Number

Remarks

Payment Status

Payment modes:

Cash

Bank Transfer

UPI

Cheque

Other

Automatically displays:

Bill Amount

Paid Amount

Remaining Amount

🧾 Sauda Bill & PDF

Professional Sauda notes/bills with:

Template 1

Template 2

Template 3

Template 4

Company Details

Seller Details

Buyer Details

Item Details

Quantity

Rate

Payment Terms

Delivery Terms

Remarks

Terms & Conditions

Signature

Actions:

Preview

Print

Download

📊 Reports

Brokerage Total Amount Party Wise Report

Generated Brokerage Bills

Filters:

Company

Financial Year

Date Range

Item

Seller

Buyer

Party

Status

⚡ Quick Values

Save frequently used values for faster Sauda creation:

Payment Terms

Delivery Terms

Remarks

Quality / Variety

Units

Other recurring fields

🔐 Security

Set PIN

Confirm PIN

Change PIN

Enable / Disable PIN Lock

This is a browser-based implementation and should not be considered production-grade cryptographic security until a secure backend authentication system is implemented.

🎁 Referral System

Referral Code

Copy Referral Code

Share App

My Referral Users

👤 Profile

Includes:

Personal Information

Change Company / Financial Year

Reports

Quick Values

Terms & Conditions

Privacy Policy

How to Use App

Rate Us

About Us

Contact Us

Get Desktop App

Device Management

Set PIN

Referral Code

Share App

My Referral Users

Logout

💾 Data Storage

The current version uses IndexedDB for browser-based persistent data storage.

Data remains available after:

Page refresh

Browser restart

Application restart

IndexedDB Stores

companies
financialYears
items
parties
saudaOrders
dispatches
payments
quickValues
settings
referrals
users

🏗️ Project Architecture

src/
│
├── components/
│   ├── common/
│   ├── forms/
│   ├── cards/
│   ├── modals/
│   └── navigation/
│
├── pages/
│   ├── Home/
│   ├── Items/
│   ├── Parties/
│   ├── Sauda/
│   ├── Companies/
│   └── Profile/
│
├── services/
│   ├── companyService
│   ├── itemService
│   ├── partyService
│   ├── saudaService
│   ├── paymentService
│   ├── dispatchService
│   └── reportService
│
├── db/
│   ├── indexedDB
│   ├── repositories
│   └── seedData
│
├── hooks/
├── utils/
├── routes/
├── layouts/
├── data/
└── styles/

🛠️ Technology Stack

Technology

Purpose

React.js

Frontend framework

Vite

Development & build tool

React Router

Application routing

JavaScript / TypeScript

Application development

IndexedDB

Persistent browser storage

Lucide React

Icons

CSS

Responsive UI

PDF Library

Bill/PDF generation

📱 Responsive Design

Mobile

Mobile-first forms

Bottom navigation

Floating action buttons

Touch-friendly controls

Mobile search dialogs

Responsive cards

Tablet

Adaptive layouts

Responsive grids

Optimized forms

Desktop

Sidebar navigation

Top header

Dashboard cards

Tables

Multi-column layouts

🎨 UI Design

The application follows the visual style of the VyaparX mobile application.

Primary Brand Color: Orange / Amber

#FF9800

Supporting Colors

Success  → Green
Buyer    → Blue
Danger   → Red
Security → Purple
Support  → Teal

The UI uses:

Rounded cards

Soft shadows

Clean typography

Consistent spacing

Responsive components

Touch-friendly controls

⚙️ Installation

Clone the repository:

git clone <YOUR_REPOSITORY_URL>

Navigate to the project:

cd vyaparx

Install dependencies:

npm install

Start development server:

npm run dev

Application:

http://localhost:5173

🏭 Production Build

npm run build

Preview production build:

npm run preview

Before committing changes, verify:

No build errors

No broken imports

No missing routes

No major console errors

🌱 Demo Data

The first application launch includes sample data.

Company

KRISHNA FIBERS
PALIYAD ROAD BOTAD
GUJARAT

Items

KAPAS
RAM
SKY

Parties

SKY
RAM

Sample Sauda

Item        : KAPAS
Seller      : SKY
Buyer       : RAM
Quantity    : 200
Unit        : 100
Bill Rate   : 5353
Seller Comm : 2.8%
Buyer Comm  : 2.6%
Date        : 08/09/2026

Demo data can be modified or deleted from the application.

🔄 Data Persistence

Create Company
       ↓
IndexedDB
       ↓
Refresh Browser
       ↓
Company Still Available

The same persistence applies to:

Items

Parties

Sauda Orders

Payments

Dispatch

Quick Values

Settings

🔮 Future Backend Integration

The current application is intentionally designed without a backend.

Future architecture:

React
   ↓
REST API
   ↓
Node.js
   ↓
Express.js
   ↓
MongoDB

The service architecture allows:

IndexedDBRepository

to be replaced by:

ApiRepository

without rewriting the entire UI.

🗺️ Planned MERN Architecture

                 ┌──────────────────┐
                 │   React Frontend │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │  Express REST API│
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │    Node.js       │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │     MongoDB      │
                 └──────────────────┘

🔒 Production Security Roadmap

Before production deployment:

User authentication

JWT / session authentication

Secure password hashing

Server-side validation

Role-based access control

API authorization

Secure payment records

Encrypted sensitive data

HTTPS

Rate limiting

Audit logs

Secure PDF generation

Server-side database backups

📂 Main Application Routes

/
├── /home
│
├── /items
│   ├── /new
│   ├── /:id
│   └── /edit/:id
│
├── /parties
│   ├── /new
│   ├── /:id
│   └── /edit/:id
│
├── /sauda
│   ├── /create
│   ├── /:id
│   ├── /:id/edit
│   ├── /:id/dispatch
│   ├── /:id/payment
│   └── /bills
│
├── /companies
│   ├── /new
│   ├── /:id
│   └── /edit/:id
│
└── /profile
    ├── /edit
    ├── /reports
    ├── /quick-values
    ├── /legal
    ├── /security
    └── /referrals

📌 Current Status

Frontend              : React.js
Storage               : IndexedDB
Responsive Design     : Yes
Mobile UI             : Yes
Desktop UI            : Yes
Company Management    : Available
Item Management       : Available
Party Management      : Available
Sauda Management      : Available
Payment Management    : Available
Dispatch Management   : Available
Reports               : Available
PDF Bills             : Available
Quick Values          : Available
PIN Security          : Available
Referral System       : Available
Backend               : Planned
MongoDB               : Planned

🤝 Contributing

Recommended workflow:

Create a development branch:

git checkout -b dev

Make changes:

git add .
git commit -m "feat: update sauda order module"

Push the development branch:

git push origin dev

After testing, merge the changes into main.

📜 License

This project is intended for business application development and demonstration purposes.

Add an appropriate commercial or open-source license before public distribution.

👨‍💻 Developer

VyaparX

A modern digital solution for managing:

Companies
Items
Parties
Sauda Orders
Payments
Dispatch
Bills
Reports
Business Operations

⭐ Project Vision

The goal of VyaparX is to provide a simple, fast and reliable digital platform for managing day-to-day trading and business transactions.

Simple UI + Fast Data Entry + Automatic Calculations + Business Reports + Digital Bills