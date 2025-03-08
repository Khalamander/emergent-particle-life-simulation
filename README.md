# Particle Life Simulation Playground

![Project Demo](/public/live-demo-screenshot.png)

## Description

This interactive web application is a particle life simulation, inspired by emergent behavior and complex systems. It demonstrates how simple rules governing the interactions between individual particles can lead to surprisingly intricate and visually captivating patterns at a macroscopic level.

Explore the fascinating world of simulated life as you manipulate parameters and observe the dynamic formations that emerge!

## Key Features

*   **Interactive Particle Simulation:** Witness many many particles interacting in real-time based on customizable rules.
*   **Configurable Interaction Rules:**  Experiment with different attraction and repulsion strengths between particle types using an intuitive control panel.
*   **Rule Visualizer:**  Gain a clear understanding of the interaction matrix with a dynamic visual representation of the rules.
*   **Interactive Camera Controls:**  Pan and zoom to explore the simulation space and observe patterns at different scales.
*   **Particle Trails:**  Visualize particle movement and flow with optional trail effects.
*   **Introduce Particles Tool:** Manually add particles to the simulation canvas to influence patterns and experiment with specific configurations.
*   **Parameter Presets:** Save and load your favorite simulation settings to easily revisit interesting configurations.
*   **Dark Mode:** Enjoy a visually comfortable experience with a selectable dark mode theme.
*   **Performance Monitoring:**  Real-time FPS counter to track simulation performance.
*   **Responsive Design:**  Runs smoothly in modern web browsers across different screen sizes.
*   **Built with React & TypeScript:** Developed using modern web technologies for a component-based and type-safe architecture.
*   **UI Components Library:** Leverages a UI component library (like Radix UI or Shadcn UI - *adjust if you used something different*) for a polished and accessible user interface.

## Technologies Used

*   **React:**  A JavaScript library for building user interfaces.
*   **TypeScript:**  A superset of JavaScript that adds static typing.
*   **HTML:**  For structuring the web page and UI elements.
*   **CSS:**  For styling and visual presentation, including a dark mode theme.
*   **[UI Component Library Name]** (e.g., Radix UI, Shadcn UI): For reusable and accessible UI components.
*   **Vite:**  For fast development and build tooling.
*   **Git:** For version control.
*   **GitHub:** For repository hosting and collaboration.

## How to Run Locally

1.  **Clone this repository:**
    ```bash
    git clone [your-repo-url]
    cd [your-project-directory]
    ```
    (Replace `[your-repo-url]` with the actual URL of your GitHub repository and `[your-project-directory]` with the project folder name)

2.  **Install dependencies:**
    ```bash
    npm install  # or yarn install or pnpm install, depending on your package manager
    ```

3.  **Start the development server:**
    ```bash
    npm run dev  # or yarn dev or pnpm dev
    ```

4.  **Open in your browser:**  Go to `http://localhost:5173` (or the address shown in your terminal after running `npm run dev`) in your web browser.

## Interactive Controls

*   **Simulation Controls:**
    *   **Play/Pause Button:**  Start and stop the simulation.
    *   **Speed Slider:** Adjust the simulation speed (0.1x to 2x).
    *   **Reset Button:**  Restart the simulation with the initial parameters.

*   **Particles:**
    *   **Particle Count Slider:** Control the number of particles in the simulation.

*   **Interaction Rules:**
    *   **Interaction Strength Sliders:**  Adjust the attraction/repulsion strength between different particle types.
    *   **Rule Visualizer:**  Show the visual matrix representing interaction rules.

*   **Display:**
    *   **Trails (Checkbox):** Toggle particle trails on or off.
    *   **Dark Mode (Checkbox):** Toggle between light and dark color themes.

*   **Tools:**
    *   **Introduce Particles:** Select a particle type and click on the canvas to add particles manually (hold mouse for continuous introduction).

*   **Presets:**
    *   **Save Preset Button:** Save the current simulation parameters as a preset.
    *   **Load Preset Dropdown:** Load previously saved parameter presets.

*   **Performance:**
    *   **FPS Counter:** Displays the current frames per second.

## Future Enhancements (Possible Ideas)

*   **More Particle Types:** Expand the simulation with additional particle types and interaction rules.
*   **Particle Shape and Color Customization:** Allow users to customize the visual appearance of particles.
*   **Advanced Trail Styles:**  Implement more diverse and visually appealing trail effects.
*   **Performance Optimizations:**  Further optimize the simulation for even larger particle counts.
*   **Mobile Optimization:**  Refine the UI and interactions for a better mobile experience.
*   **Sound Effects/Music Integration:**  Explore adding sound effects or music that reacts to simulation events.
*   **"Share Simulation" Feature:**  Enable users to share their unique simulation configurations via URLs.
*   **3D Simulation:**  Potentially extend the simulation to three dimensions.

## Author

[**Khaled Alikhan**]

[**GitHub Repository**](https://github.com/Khalamander/emergent-particle-life-simulation.git)

---