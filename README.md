# Orbit Task Management App

## 🚀 Short Description
Orbit Task Management is a modern web application designed to help users manage their tasks efficiently. It features drag-and-drop task organization, real-time updates using WebSockets, and a user-friendly interface powered by React and Ant Design.

## 🌍 Live Demo
[Orbit Task Management App](https://orbit-task.netlify.app/)

## 🛠️ Dependencies

### 📌 Frontend Dependencies
- **Drag & Drop**:
  - `@dnd-kit/core`: ^6.3.1
  - `@dnd-kit/sortable`: ^10.0.0
  - `@dnd-kit/utilities`: ^3.2.2
  - `@hello-pangea/dnd`: ^18.0.1
- **UI & Styling**:
  - `antd`: ^5.24.1
  - `tailwindcss`: ^4.0.7
  - `@tailwindcss/vite`: ^4.0.7
  - `react-icons`: ^5.5.0
- **State & Data Fetching**:
  - `@tanstack/react-query`: ^5.66.8
  - `axios`: ^1.7.9
- **Routing & Core React**:
  - `react`: ^19.0.0
  - `react-dom`: ^19.0.0
  - `react-router`: ^7.2.0
- **Realtime Communication**:
  - `socket.io-client`: ^4.8.1
- **Other Utilities**:
  - `firebase`: ^11.3.1
  - `proptypes`: ^1.1.0

### 📌 Backend Dependencies
- **Core Backend**:
  - `express`: ^4.21.2
  - `cors`: ^2.8.5
  - `dotenv`: ^16.4.7
- **Database**:
  - `mongodb`: ^6.13.0
- **Realtime Communication**:
  - `socket.io`: ^4.8.1

## 📥 Installation

### Prerequisites:
- Node.js installed
- MongoDB setup (local or cloud)

### Backend Setup:
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/orbit-task-management.git
   cd orbit-task-management/backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add your environment variables:
   ```sh
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup:
1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### 🎉 You’re all set! Open `http://localhost:5173/` in your browser to see the app in action.


---
Enjoy using **Orbit Task Management**! 🚀

