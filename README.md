# FinTrack | AI-Powered Financial Dashboard

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

FinTrack is a premium, high-performance financial management dashboard designed for modern users. It combines sleek design aesthetics with powerful features like real-time data visualization, AI-driven financial insights, and comprehensive transaction management.

## ✨ Key Features

### 🏢 Core Dashboard
- **Real-time Overview**: Instant access to Balance, Income, Expense, and Savings stats.
- **Dynamic Charts**: Interactive area and pie charts powered by Recharts for cash flow and spending breakdown.
- **Recent Activity**: Quick view of latest financial movements.

### 🤖 AI Financial Assistant
- **Provider Choice**: Connect your own **OpenAI** or **Google Gemini** API keys.
- **Demo Mode**: Try AI features instantly with high-fidelity simulated responses.
- **Automated Analysis**: Get a Financial Health Score, anomaly detection, and smart saving recommendations.
- **Contextual Chat**: Interactive chat interface that understands your transaction history.

### 💸 Transaction Management
- **Full CRUD**: Add, edit, and delete transactions with ease.
- **Advanced Filtering**: Filter by category, type (Income/Expense), or search by description.
- **Responsive Table**: Premium table UI with pagination and compact mode support.

### 👤 Profile & Customization
- **Global Dark Mode**: Full light/dark mode support with persistent state.
- **User Preferences**: Toggle compact mode, notification settings, and currency displays.
- **Role Switching**: Seamlessly switch between 'Admin' and 'Viewer' roles to test access control.
- **Data Export**: Export your transactions to CSV or JSON formats.

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS (Optimized for Dark Mode)
- **State Management**: Zustand (with Persist Middleware)
- **Visualization**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion & Tailwind Keyframes

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zorvyn_Assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup (Optional)**
   The AI Assistant defaults to a "Test" mode. To use real AI models, you can enter your API keys directly in the app's "AI Assistant" setup screen.

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
src/
├── components/       # Reusable UI & Layout components
│   ├── layout/       # Sidebar, Topbar, Layout wrappers
│   └── ui/           # Buttons, Cards, Modals, Inputs
├── store/            # Zustand stores (Auth, Theme, Transactions, AI)
├── services/         # API services (AI Integration)
├── pages/            # Page-view components
├── types/            # TypeScript interfaces
└── data/             # Mock data and constants
```

## 🎨 Design Principles

- **Premium Aesthetics**: Uses a refined color palette (Indigo, Slate, Emerald) and glassmorphism effects.
- **Responsive-First**: Optimized for Desktop, Tablet, and Mobile with a custom drawer-based navigation on small screens.
- **Accessibility**: Semantic HTML and focus state management.

