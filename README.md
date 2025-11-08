# NECX Messaging App - Take-Home Project Submission

Thank you for the opportunity to build the NECX Messaging App. This document outlines the completed project, which was built upon the provided foundation to create a feature-rich, polished, and robust full-stack application using React and Express.js.

The project not only fulfills all core requirements but also implements a comprehensive suite of the optional enhancements to demonstrate a deeper understanding of modern web development best practices.

- **Figma Design Link:** [https://www.figma.com/design/afV98h5H455Pmx1ZqlNgbM/Messaging-App](https://www.figma.com/design/afV98h5H455Pmx1ZqlNgbM/Messaging-App)
___
### Demo Video

https://github.com/user-attachments/assets/bf9329d3-0747-4009-92f8-2023cc7be0e1

---

## Getting Started

### Installation & Setup

The entire project (frontend, backend, and root) can be set up with a single command.

1.  Navigate to the project's root directory (`Messaging-App-NECX/`).
2.  Install all dependencies:
    ```bash
    npm install
    ```
3.  Start both frontend and backend development servers concurrently:
    ```bash
    npm run dev
    ```
The application will now be running.

### Application URLs
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:4000`
- **Backend Health Check:** `http://localhost:4000/api/health`

---

## Core Requirements Checklist

All essential functionalities and technical requirements were successfully implemented.

#### Essential Functionality
- **[✓] Messaging System:** Users can send messages and view a complete, persistent message history.
- **[✓] User Management:** Multiple user personas can be created and selected as the sender.
- **[✓] Data Persistence:** Messages and users persist between sessions via a backend JSON file.
- **[✓] User Interface:** The UI is clean, intuitive, and adheres to the dark mode theme and general aesthetic of the provided Figma designs.

#### Technical Implementation
- **[✓] Backend:** A RESTful Express.js server runs on port **4000**, handling all data operations for users and messages with full CRUD capabilities.
- **[✓] Frontend:** A component-based React application runs on port **5173**, managing state and integrating with the backend API.
- **[✓] Development Requirements:** The application runs with `npm run dev`, and the code is clean, well-organized, and includes robust error handling.

---

## Implemented Optional Enhancements

To demonstrate creativity, performance, and robust design, the following optional enhancements were implemented:

- **[✓] Advanced Message Features:**
    - **Editing:** Users can edit their sent messages, with an "(edited)" tag displayed upon update.
    - **Deletion:** Users can delete any message.
    - **Search:** The header contains a real-time search bar to filter messages by content or sender.

- **[✓] Real-time Updates or Auto-refresh:** The frontend intelligently polls the backend for new data every few seconds. This polling automatically pauses when the browser tab is inactive to conserve resources, demonstrating an awareness of performance optimization.

- **[✓] Better User Experience and Interface Polish:**
    - A professional UI layout with a fixed header and footer was implemented for a seamless chat experience.
    - All actions (sending, editing, creating) provide immediate feedback with loading/disabled states on buttons and non-intrusive toast notifications for success or error messages.
    - The header was redesigned to be more compact and professional, tucking data management features into a clean settings dropdown.

- **[✓] Data Export/Import Capabilities:** A robust, **backend-powered** import/export system was implemented. The backend handles all file write operations to prevent race conditions and data corruption, a critical consideration for stability.

- **[✓] Improved Accessibility Features:** Semantic HTML (`<header>`, `<main>`, `<form>`) is used throughout, and interactive icon-only buttons include `aria-label` attributes for screen readers.

- **[✓] Performance Optimizations:** In addition to the smart polling, `useMemo` and `useCallback` hooks are used to prevent unnecessary re-renders, and the backend logic was optimized to avoid redundant file system reads.

- **[✓] Additional Validation and Error Handling:** The backend includes robust validation for all endpoints. The frontend gracefully handles API errors and displays user-friendly feedback.

- **[✓] Testing Implementation:** Unit tests for the core `<Message />` component were written using **Vitest** and **React Testing Library** to verify conditional rendering logic, demonstrating a commitment to code quality and maintainability.

---

## Design Decisions & Architecture

- **Data Storage:** A local `db.json` file managed by `lowdb` on the backend was chosen as the persistence strategy. This decision makes the project entirely self-contained and portable, requiring **zero database setup** for the reviewer and ensuring a seamless "clone and run" experience.

- **State Management:** The React Context API was used for global frontend state management. This choice provides a modern, clean, and built-in solution for sharing state across the application without the heavy boilerplate of external libraries like Redux, which would be inappropriate for a project of this scale.

- **Backend Stability:** Race conditions that could cause the server to crash (e.g., during file import or simultaneous read/write requests) were identified and solved. The final backend architecture ensures atomic operations and includes explicit logic to pause frontend polling during critical backend tasks like data import, resulting in a highly stable application.

- **Styling:** Tailwind CSS was chosen for its utility-first approach, which allows for rapid and precise implementation of the Figma design system. A custom theme was configured in `tailwind.config.js` to enforce project-specific branding and color consistency.

## Future Improvements

The following areas could be explored:

- **WebSocket Integration:** Replace the polling system with WebSockets (e.g., using `socket.io`) for true, instantaneous, event-driven communication, reducing unnecessary network traffic.
- **Database Migration:** For a production environment, transition from `lowdb` to a more scalable database system like PostgreSQL or MongoDB.
- **User Authentication:** Implement a proper login/registration system with password hashing and session management to transition this into a true multi-user application.
- **End-to-End Testing:** Supplement the existing unit tests with end-to-end tests using a framework like Cypress to automate and validate full user flows.

---
- **For any support** - Email: [jalaluddin0046356@gmail.com](jalaluddin0046356@gmail.com)
---

_This project was built to showcase a comprehensive understanding of full-stack principles and a dedication to writing high-quality, professional-grade code. Thank you for the opportunity._
