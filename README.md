# Real-time Collaborative Text Editor

This project is a real-time collaborative text editor where multiple users can edit a document simultaneously. 

## Features

- Real-time Editing
- Displays multiple active users and their cursor positions.
- It shows text changes and cursor movements are broadcast in real-time to all connected users.

## Technology Stack

- **Frontend**: React + Vite, TailwindCSS, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO Server

## Setup Instructions

### Prerequisites

- Node.js and editor vs-code recommended
- Yarn or npm or npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/elijahladdie/realtime-document-editor-bn.git backend
   git clone https://github.com/elijahladdie/realtime-document-editor-fn.git frontend
   ```

2. Install dependencies for both the backend and frontend.

   #### Backend Setup:
   ```bash
   cd backend
   yarn install
   ```

   #### Frontend Setup:
   ```bash
   cd frontend
   yarn install
   ```

### Running the Application

1. **Backend**: 

   Run the backend server:

   ```bash
   yarn start
   ```

2. **Frontend**:

   Run the frontend development server:

   ```bash
   yarn dev
   ```

3. Open the app in your browser at ` http://localhost:5173` for real-time collaboration.

## Synchronization & Concurrency Approach

- **Socket.IO**: I used Socket.IO for event-based communication between the backend and frontend.
  
- **Concurrency Management**: Each user's text changes and cursor movements are broadcasted immediately to other clients. 

- **Real-time Updates**: Changes are synchronized on every keystroke or cursor movement.
