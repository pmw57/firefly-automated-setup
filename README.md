<div align="center">
  <h1 align="center">Firefly: The Game - Automated Setup Guide</h1>
  <p align="center">
    A dynamic, offline-first PWA to automate the complex setup process for the board game <strong>Firefly: The Game</strong>, supporting all expansions and story cards.
  </p>
</div>

## 🚀 Overview

Setting up *Firefly: The Game* can be complex, especially when combining multiple expansions with specific Story Card requirements. This application automates the rules logic to provide a step-by-step, guided setup for any game configuration.

This guide ensures you never miss a rule by dynamically adjusting the setup flow based on your selections. It acts as an intelligent rulebook, providing a precise guide tailored to your specific game.

## ✨ Features

### Key Features

*   **Dynamic Step-by-Step Guide**: A guided wizard that walks you from initial configuration (player count, expansions) to a final summary. The steps change dynamically based on your selections.
*   **Comprehensive Rule Engine**: A sophisticated engine that interprets setup and story cards to automatically calculate starting resources, determine active game mechanics (like "The Blitz"), and resolve rule conflicts.
*   **Full Game Content Support**: Includes data for all official expansions, setup cards, and story cards (including popular community content).
*   **Advanced Solo & Campaign Modes**: First-class support for both "Classic Solo" and the 10th Anniversary "Flying Solo" variant, including campaign rules that adjust setup based on progress.
*   **Offline-First PWA**: Installable on your home screen and fully functional without an internet connection, making it a reliable companion at the game table.

### Quality of Life & Theming

*   **Thematic UI**: A user interface styled to match the Firefly 'Verse, with a custom "western" font, game-accurate color palette, and immersive quotes.
*   **Interactive Tools**: Includes tools like an automated dice roller and tie-breaker for the ship/leader draft.
*   **State Persistence**: Saves your setup progress in your browser, preventing data loss if you refresh or close the tab.
*   **Robust Error Handling**: Features a global error boundary and a "Hard Reset" mechanism to recover from application or cache issues.
*   **Light & Dark Modes**: Switch between a light "parchment" theme and a dark "starfield" theme.
*   **Accessibility**: Built with semantic HTML, ARIA attributes, and keyboard navigation support.

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
