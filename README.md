<div align="center">
  <h1 align="center">Firefly: The Game - Automated Setup</h1>
  <p align="center">
    A digital companion app to streamline the setup process for the board game <strong>Firefly: The Game</strong>.
  </p>
</div>

## 🚀 Overview

Setting up *Firefly: The Game* can be complex, especially when combining multiple expansions (Blue Sun, Kalidasa, Pirates, etc.) with specific Story Card requirements. 

This application automates the rules logic to provide a step-by-step wizard that:
*   Filters components based on owned **Expansions**.
*   Handles **Setup Card** specific overrides (e.g., "The Browncoat Way" market rules).
*   Applies **Story Card** specific setup instructions (e.g., "Smuggler's Blues" contraband placement).
*   Manages **Drafting** for ships and leaders.

## ✨ Features

*   **Dynamic Rule Engine**: Automatically calculates starting credits, fuel/parts, and deck composition based on selected options.
*   **Expansion Management**: Toggle any combination of the 10+ available expansions.
*   **Persistence**: Saves your progress locally, so you don't lose your setup if you refresh or switch apps.
*   **Offline Ready (PWA)**: Installable on iOS and Android. Works perfectly without an internet connection.
*   **Accessibility**: Keyboard navigation support and screen-reader friendly structure.

## 🛠️ Tech Stack

*   **Framework**: React (v18) + TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Testing**: Vitest + React Testing Library

## 📦 Installation & Development

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run locally**:
    ```bash
    npm run dev
    ```

3.  **Run tests**:
    ```bash
    npm test
    ```

4.  **Lint code**:
    ```bash
    npm run lint
    ```

## 🚢 Deployment

This project is configured for **GitHub Pages**.

The `.github/workflows/deploy.yml` pipeline will automatically:
1.  Install dependencies.
2.  Run the test suite (Build fails if tests fail).
3.  Build the production assets.
4.  Deploy to the `gh-pages` branch.

## 📝 License

This is a fan-made project. *Firefly: The Game* is a trademark of Gale Force Nine. This project is not affiliated with or endorsed by GF9.