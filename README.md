# NECX Messaging - Full-Stack Take-Home Project Submission

This is a complete, feature-rich personal messaging application built for the NECX take-home assessment. The project was developed from the provided foundation into a full-stack solution using React, Node.js, and Express.js, with a strong focus on clean code, modern features, and an excellent user experience.

---

## ✅ Key Features Implemented

This project successfully implements all core requirements as well as a majority of the optional enhancements, demonstrating a comprehensive skill set.

#### Core Functionality
- **Full-Stack Application:** React frontend and Express.js backend running concurrently.
- **Messaging System:** Users can send messages from different personas, and the history is displayed in a familiar chat interface.
- **User Management:** Ability to create new user personas on-the-fly.
- **Data Persistence:** All users and messages are persisted between sessions using a local JSON file managed by the backend.

#### ✨ Advanced Features & Enhancements
- **Real-Time Updates:** The message list automatically refreshes every 3 seconds to fetch new messages, simulating a real-time experience. This polling is intelligently paused when the browser tab is inactive to conserve resources.
- **Message Editing:** Users can edit the text of messages they have sent. An "(edited)" tag is displayed on modified messages.
- **Message Deletion:** Users can delete any message from the conversation.
- **Live Search:** A search bar in the header allows for instant filtering of the conversation history by message text or sender name.
- **Data Export/Import:** Users can export their entire conversation history as a JSON file and import a backup via the settings menu in the header.

#### 💅 UI/UX & Polish
- **Professional Layout:** The UI is structured like a modern messaging app with a fixed header and footer, allowing only the message list to scroll.
- **Loading & Disabled States:** All buttons provide clear visual feedback by changing text and becoming disabled during API requests to prevent duplicate submissions.
- **Toast Notifications:** The application provides clear, non-intrusive toast notifications for all actions (e.g., "Message sent," "User created," "Error").
- **Responsive Design:** The layout is built with responsiveness in mind for a consistent experience on different screen sizes.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, `axios`, `date-fns`, `react-icons`
- **Backend:** Node.js, Express.js, `cors`, `lowdb`, `multer`
- **Development:** `concurrently`, `nodemon`
- **Testing:** `vitest`, `@testing-library/react`

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

#### Prerequisites
- Node.js (version 16 or higher)
- npm

#### Installation & Setup
1.  Unzip the submission file.
2.  Open your terminal and navigate to the root directory of the project.
3.  Install all dependencies for the root, frontend, and backend with a single command:
    ```bash
    npm install
    ```
4.  Once installation is complete, start both the frontend and backend servers concurrently:
    ```bash
    npm run dev
    ```

The application will now be running.
- **Frontend URL:** `http://localhost:5173`
- **Backend API URL:** `http://localhost:4000`

---

## 🧪 Running Tests

Unit tests have been implemented for the `<Message />` component to ensure rendering logic is correct.

1. Navigate to the `/frontend` directory:
   ```bash
   cd frontend
   ```
2. Run the test script:
   ```bash
   npm test
   ```

---

## 🏛️ Technical Decisions & Architecture

- **State Management:** The React Context API was chosen for global state management. It provides a clean, built-in solution for sharing state (like users, messages, and loading status) across the component tree without the need for external libraries like Redux, which would be overkill for an application of this scale.
- **Styling:** Tailwind CSS was used for its utility-first approach, enabling rapid and consistent UI development that closely matches design specifications. A custom theme was configured in `tailwind.config.js` to enforce the project's color palette.
- **Data Persistence:** A local `db.json` file managed by `lowdb` on the backend was selected as the storage method. This choice ensures the project is fully portable and requires zero database setup for the reviewer, allowing for an immediate "clone and run" experience.
- **Real-time Updates:** A smart polling mechanism was implemented on the frontend. This provides a "real-time" feel while being simple to implement and reliable. The system is optimized to pause polling when the tab is inactive, demonstrating an understanding of performance conservation.
- **Backend Import:** The data import feature is handled securely on the backend via a dedicated `multipart/form-data` endpoint using `multer`. This is the robust, correct approach, preventing security issues and data corruption that would arise from a frontend-only implementation.

