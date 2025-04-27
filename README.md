[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/C1S6S1cK)
## Assignment 2: Space Shooter Game

## Description
This project was developed as part of the Web Development Environments course at Ben-Gurion University. It focuses on the creation of an interactive, browser-based arcade-style game using modern web technologies. The game challenges players to control a spaceship, navigate obstacles, and eliminate enemy ships while managing limited lives and time constraints. The project adheres to responsive design principles and demonstrates modular coding practices.

## Authors
Noa Shvets | ID: 322548603
Liel Parparov | ID: 211937354

## Link to Website
[Space Shooter Game](https://wed-2023.github.io/assignment2-211937354_322548603_assignment2/)

## Features
- **Responsive Layout:** Designed for minimum resolution of 1366x768, adaptable to larger screens.
- **Interactive Registration and Login:** Includes form validations, secure password handling, and LocalStorage-based user management.
- **Game Configuration:** Players can configure firing key, game duration, and background theme.
- **Dynamic Gameplay:** Includes accelerating enemy ships, random enemy shooting, and player-controlled spaceship movement.
- **Sound Integration:** Background music and sound effects for shooting, explosions, and player damage.
- **High Score Tracking:** Top 10 scores are stored per user in LocalStorage and displayed after each game.
- **Modal Dialog:** About section implemented as a modal dialog with ESC, outside click, and close button functionality.
- **Game End Scenarios:** Different end screens depending on whether the player wins, loses, or time runs out.

## Content
- **Welcome Screen:** First screen users encounter, offering navigation to Registration or Login.
- **Registration Form:** Validates all inputs including strong password rules, email format, and password confirmation.
- **Login Form:** Authenticates against existing users, with one predefined user (Username: p, Password: testuser).
- **Configuration Screen:** Allows user to set gameplay preferences before starting.
- **Game Screen:** Canvas-based gameplay including score, lives, and timer display.
- **About Modal:** Displays credits and a brief overview of the development challenges.

## Technologies Used
- HTML5 (Semantic elements, Canvas API)
- CSS3 (Flexbox, Grid, Responsive design, Custom fonts)
- JavaScript (ES6+ features, LocalStorage, Event handling, Audio API)

## Challenges Faced
Fine-tuning the movement logic for enemy ships and ensuring consistent collision detection.
Managing multiple screens and navigation states purely with vanilla JavaScript.
Ensuring responsive design without compromising gameplay experience.
Handling audio playback reliably across different browsers.
Implementing dynamic enemy acceleration and bullet firing patterns.

