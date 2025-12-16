
<div align="center">
  <h1 align="center">Firefly: The Game - Automated Setup Guide</h1>
  <p align="center">
    A digital companion app to streamline the setup process for the board game <strong>Firefly: The Game</strong>.
  </p>
</div>

## 🚀 Overview

Setting up *Firefly: The Game* can be complex, especially when combining multiple expansions with specific Story Card requirements. This application automates the rules logic to provide a step-by-step, guided setup for any game configuration.

This guide ensures you never miss a rule by dynamically adjusting the setup flow based on your selections.

## ✨ Features

*   **Comprehensive Setup Support**: Handles all official Setup Cards (like "The Blitz" and "The Browncoat Way") and Story Cards, applying specific rule overrides automatically.
*   **Full Expansion Compatibility**: Supports all official expansions, from *Breakin' Atmo* to the *10th Anniversary Edition*.
*   **Solo Campaign Mode**: Streamlines setup for continuing solo campaigns with adjusted rules for supplies, jobs, and game length.
*   **Interactive Draft Tools**: Manages ship/leader drafting and tie-breaking rolls.
*   **Dynamic Rule Engine**: Automatically calculates starting credits, fuel/parts, and deck composition based on selected options.
*   **PWA & Offline Ready**: Installable on any device for full offline functionality.
*   **Persistent State**: Saves your setup progress locally, so you never lose your place.
*   **Light & Dark Modes**: Themed UI for any environment.
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
