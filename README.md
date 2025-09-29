# SonusPrime: AI Stem Weaver

An intelligent web application that analyzes two versions of a song's audio stems, selects the best take for each instrument, and combines them into a definitive master mix.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Livvux/Suno-Decider)

SonusPrime is a sophisticated, minimalist web application designed for music producers and audio engineers. It streamlines the process of 'comping' (compiling the best takes) from audio stems. The user uploads two separate ZIP archives, each containing a full set of instrumental and vocal stems for the same song (e.g., 'Version A' and 'Version B'). The application then presents a beautifully designed interface where it simulates a sophisticated AI-powered analysis of each corresponding stem pair (e.g., Drums_A vs. Drums_B). For each pair, it assigns a 'quality score' and automatically selects the superior stem. The user can review these selections and manually override any choice. Once satisfied, the user initiates the final step, where the application simulates compiling the chosen stems into a single, new ZIP archive, ready for download.

## ✨ Key Features

-   **Dual ZIP Upload:** Simple and intuitive drag-and-drop interface for uploading two versions of your song's stems.
-   **Simulated AI Analysis:** Experience a mock AI-powered analysis that assigns quality scores to each stem.
-   **Automatic Stem Selection:** The "best" stem for each instrument is automatically selected based on its score.
-   **Manual Override:** Full control to review and override the AI's choices to fit your creative vision.
-   **One-Click Mixdown:** Generate and download a (mock) final ZIP file containing the "best-of" compiled stems.
-   **Stunning Minimalist UI:** A clean, responsive, and visually polished interface built for a seamless user experience.

## 🚀 Technology Stack

-   **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
-   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Deployment:** [Cloudflare Pages](https://pages.cloudflare.com/) & [Cloudflare Workers](https://workers.cloudflare.com/)

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A code editor of your choice (e.g., VSCode).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/sonusprime.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd sonusprime
    ```
3.  **Install dependencies:**
    ```bash
    bun install
    ```

### Environment Variables

For the initial phase (frontend simulation), no environment variables are required. For future phases involving Cloudflare services, you will need to create a `.env` file and add your Cloudflare credentials.

## 💻 Development

To start the local development server, run the following command:

```bash
bun dev
```

This will start the application, typically available at `http://localhost:3000`. The page will auto-update as you edit the files.

##  usage

The application guides you through a simple three-step process:

1.  **Upload:** Drag and drop your 'Version A' and 'Version B' ZIP files into their respective upload zones.
2.  **Analyze & Select:** The application will simulate an AI analysis. Review the scores and the automatically selected stems. Click on an alternative stem card to override a selection.
3.  **Download:** Once you are satisfied with your selections, click the "Create & Download Mix" button to download the final compiled (mock) ZIP file.

## 🚀 Deployment

This project is optimized for deployment on the Cloudflare network.

1.  **Build the application:**
    ```bash
    bun run build
    ```
2.  **Deploy to Cloudflare:**
    Make sure you have the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and configured. Then, run:
    ```bash
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Livvux/Suno-Decider)

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improving the application, please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.