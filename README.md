# Real-Time Water Treatment Monitoring Dashboard

Video Walkthrough: https://youtu.be/Eizr5SLf2TE

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/RB0810/code.git
cd water-dashboard
```

### 2. Run the backend server
```bash
cd backend
npm install
node server.js
```

### 3. Run the frontend 
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173/ in your browser to access the dashboard


## Tech Stack

### Backend
- **Node.js**
- **CSV Streaming**: Reads sensor-actuator data at 1-second intervals to simulate real-time updates
- **WebSocket**: Sends streaming data to frontend in real time

### Frontend
- **React** with **TypeScript**
- **TailwindCSS** for styling
- **Recharts** for time-series visualizations
- **Modular component structure**: Sensor graphs, actuator status, and anomaly panels are all separated into reusable components


> Built with production-readiness in mind. <br/>
> Developed using clean code practices, prioritizing modularity and readability<br/>
> Current setup uses WebSockets for rapid prototyping; scalable protocols like ZeroMQ or Apache Kafka can be integrated later for enhanced security and scalability <br/>

## Features

- **Live Time-Series Charts**: Inflow, outflow, pH, chemical levels, energy usage, and turbidity
- **Actuator Status Panel**: Clear ON/OFF/MAINTENANCE indicators
- **Anomaly Alert Panel**: Dedicated section to highlight and filter anomalies
- **Responsive Layout**: Suitable for desktop, tablet or mobile displays
- **Real-Time Simulation**: Reads and sends data rows line by line every second to mimic live sensor behavior
