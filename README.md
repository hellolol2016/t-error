## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/PratikPaudel/your-repo.git
    cd your-repo
    ```

2. Set up environment variables:
    Create a `.env.local` file in the root directory.
    Obtain your MongoDB connection details and API key, then add the following line to the `.env.local` file:

    ```dotenv
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```

3. Set up the backend:
    Navigate to the backend directory and install the required dependencies:
    ```sh
    cd ./backend
    npm install
    ```
    Start the Express server:

    ```sh
    node index.js
    ```

4. Set up the frontend:
    Navigate to the frontend directory, install the dependencies, and start the application:

    ```sh
    cd ../frontend
    npm install
    npm run dev
    ```

## Usage

2. Open your browser and navigate to `http://localhost:3000`.
