# 🚜 Xcavate - Intelligent Excavator Fleet Management System

> **A complete web application for excavator rental, monitoring, and fleet analytics with real-time IoT integration**

## 🎯 Overview

Xcavate is a sophisticated, role-based web application that revolutionizes excavator fleet management through intelligent booking systems, real-time health monitoring, and comprehensive analytics. Built with modern web technologies and designed with industrial aesthetics, it serves three key stakeholder groups with specialized dashboards.

## ✨ Key Features Implemented

### 🔐 **Authentication & Role-Based Access**
- Clean login interface with animated excavator logo
- Three distinct user roles: Project Manager, OEM, Operator
- Automatic role-based dashboard routing
- Demo accounts for easy testing

### 👨‍💼 **Project Manager Dashboard**
- **Intelligent Excavator Booking**
  - Advanced filtering by type, cost, fuel efficiency, and availability
  - Real-time health status monitoring for each machine
  - Dynamic cost calculation in ₹ (Indian Rupees)
  - Smart operator auto-assignment with availability validation
  - Multi-step booking flow with progress tracking

- **Health Monitoring**
  - Live sensor data from AWS API integration
  - Real-time metrics: fuel level, temperature, productivity, engine hours
  - Health status indicators (Excellent, Good, Warning, Critical)
  - Visual progress bars and status badges

- **Payment Integration**
  - Post-booking payment method setup
  - Usage-based billing system
  - No upfront charges - payment on actual usage
  - Booking confirmation with payment details

- **My Bookings Management**
  - Complete booking history with status tracking
  - Filter by booking status (All, Confirmed, Active, Completed, Cancelled)
  - Cost breakdown and payment status
  - Detailed booking information modals

### 🏭 **OEM Dashboard**
- **Fleet Monitoring**
  - Real-time status overview of entire fleet
  - Live sensor data visualization for all machines
  - GPS location tracking and operator assignments
  - Health metrics with color-coded indicators

- **Maintenance Management**
  - Scheduled and emergency maintenance tracking
  - Maintenance logs with cost breakdown
  - Technician assignment and status updates
  - Maintenance alerts and notifications

- **Analytics & Reporting**
  - Monthly revenue trends with interactive charts
  - Fault frequency analysis by machine
  - Fuel efficiency trending over time
  - Fleet utilization and status distribution

- **Revenue Management**
  - Total revenue tracking and monthly breakdowns
  - Booking statistics and utilization rates
  - Revenue visualization with responsive charts

### 👷 **Operator Dashboard**
- **Job Assignment Management**
  - View assigned jobs with detailed information
  - Accept/reject job assignments
  - Job status tracking and project details
  - Schedule visualization and duration tracking

- **Machine Health Monitoring**
  - Real-time metrics for assigned machines
  - Fuel level, temperature, and productivity monitoring
  - Active fault alerts and maintenance notifications
  - Machine location and engine hours tracking

- **Alerts & Notifications**
  - Severity-based alert system (Critical, High, Medium, Low)
  - Machine-specific fault notifications
  - Alert acknowledgment functionality
  - Real-time alert count badges

## 🛠 Technology Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Recharts** - Responsive chart library
- **date-fns** - Modern date utility library

### **Real-time Integration**
- **AWS API Integration** - Live sensor data from IoT devices
- **Real-time Polling** - Background data updates
- **Sensor Data Service** - Centralized data management
- **Fallback Mock Data** - Seamless offline functionality

### **Architecture**
- **Context API** - State management for authentication
- **Component-based Architecture** - Modular and reusable components
- **Custom Hooks** - Shared logic abstraction
- **Responsive Design** - Mobile-first approach

## 🎨 Design System

### **Color Palette**
- **Primary Orange**: `#ff7f00` - Action buttons and primary elements
- **Primary Yellow**: `#ffc107` - Secondary actions and highlights
- **Industrial Theme**: Orange, yellow, and white color scheme
- **Status Colors**: Green (success), Blue (info), Red (alerts), Yellow (warnings)

### **UI Components**
- **Custom CSS Classes**: `.btn-primary`, `.dashboard-card`, `.health-indicator`
- **Animated Elements**: Excavator logo with subtle movement
- **Progress Bars**: Real-time data visualization
- **Status Badges**: Color-coded status indicators
- **Glass Effects**: Modern UI with backdrop blur

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn package manager

### **Installation**
```bash
# Clone the repository
cd /workspace/xcavate

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Demo Accounts**
| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Project Manager** | `pm@xcavate.com` | `password123` | Booking & monitoring |
| **OEM** | `oem@xcavate.com` | `password123` | Fleet management |
| **Operator** | `operator@xcavate.com` | `password123` | Job assignments |

## 🔧 Core Functionalities

### **Intelligent Booking System**
1. **Excavator Selection** - Filter and search available machines
2. **Health Validation** - Real-time status checking before booking
3. **Operator Assignment** - Smart auto-assignment with conflict resolution
4. **Cost Calculation** - Dynamic pricing based on duration and rates
5. **Payment Setup** - Secure payment method configuration
6. **Booking Confirmation** - Complete booking details and usage tracking

### **Real-time Monitoring**
- **AWS Sensor Integration**: `https://6ur6ae6kal.execute-api.eu-north-1.amazonaws.com/prod/sensor-data`
- **Live Data Updates**: Fuel, temperature, productivity, engine hours
- **Health Status Calculation**: Intelligent status determination
- **Alert Generation**: Automatic fault detection and notification

### **Usage-based Billing**
- **No Upfront Charges**: Payment only on actual excavator usage
- **Real-time Tracking**: Monitor actual hours vs estimated
- **Automatic Billing**: Charge based on engine-on duration
- **Payment History**: Complete transaction records

## 📱 Responsive Design

- **Mobile-first Approach**: Optimized for all screen sizes
- **Touch-friendly Interface**: Large buttons and intuitive navigation
- **Adaptive Layouts**: Grid systems that respond to viewport
- **Performance Optimized**: Fast loading and smooth animations

## 🔮 Advanced Features

### **Intelligent Automation**
- **Auto-operator Assignment**: Conflict detection and resolution
- **Auto-technician Dispatch**: Fault-based technician assignment
- **Smart Scheduling**: Availability validation and optimization
- **Predictive Maintenance**: Health-based maintenance alerts

### **Analytics & Insights**
- **Revenue Trending**: Monthly and yearly revenue analysis
- **Fleet Utilization**: Comprehensive usage statistics
- **Fault Analysis**: Pattern recognition and prevention
- **Efficiency Tracking**: Fuel consumption and productivity metrics

### **Security & Reliability**
- **Role-based Access Control**: Secure dashboard separation
- **Data Validation**: Input sanitization and validation
- **Error Handling**: Graceful fallback mechanisms
- **Rate Limiting**: API protection and optimization

## 🌟 Production Readiness

The application is built with production considerations:

- **TypeScript Integration**: Type safety throughout the application
- **Error Boundaries**: Graceful error handling
- **Performance Optimization**: Code splitting and lazy loading
- **SEO Optimization**: Meta tags and structured data
- **Accessibility**: WCAG compliance and screen reader support

## 🤝 Contributing

This application demonstrates modern web development practices including:
- Clean component architecture
- Proper TypeScript usage
- Responsive design principles
- Real-time data integration
- Role-based access control
- Modern UI/UX patterns

## 📄 License

Built as a demonstration of full-stack web application development with industrial IoT integration.

---

**🚀 Ready to revolutionize your excavator fleet management!**

*Access the application at: http://localhost:3000*
