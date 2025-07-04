# Component Structure Documentation

## Overview
This document describes the domain-driven component organization implemented for the Health Stack Deployer Wizard project.

## Directory Structure

```
📁 components/
├── 📁 alerts/              # Emergency and notification components
├── 📁 analytics/           # Health data analytics and metrics
├── 📁 appointments/        # Appointment management
├── 📁 auth/               # Authentication and authorization
├── 📁 bluetooth/          # Device connectivity and monitoring
├── 📁 dashboard/          # Main interface dashboards
├── 📁 doctor/             # Doctor-specific components
├── 📁 landing/            # Landing page components
├── 📁 patient/            # Patient-specific components
├── 📁 recommendations/    # AI-powered recommendations
├── 📁 reports/            # Report generation and display
├── 📁 settings/           # Configuration and settings
├── 📁 ui/                 # Shared UI components
├── RoleAnimations.tsx     # Root-level role animations
└── RoleRouter.tsx         # Root-level routing logic
```

## Import Patterns

### Clean Imports (Recommended)
```typescript
// Import multiple components from same domain
import { EmergencyButton, SmartAlertsCard } from '@/components/alerts';

// Import from specific domains
import { PatientDashboard } from '@/components/dashboard';
import { BluetoothConnection } from '@/components/bluetooth';
```

### Legacy Imports (Still supported)
```typescript
// Direct component imports
import EmergencyButton from '@/components/alerts/EmergencyButton';
import PatientDashboard from '@/components/dashboard/PatientDashboard';
```

## Domain Descriptions

### 🚨 Alerts
Components handling emergency situations, notifications, and urgent communications.

### 📊 Analytics
Data visualization, health metrics analysis, and reporting components.

### 📅 Appointments
Scheduling, calendar management, and appointment-related functionality.

### 🔐 Auth
Authentication, authorization, and user access control components.

### 📡 Bluetooth
Device connectivity, real-time monitoring, and hardware integration.

### 🏠 Dashboard
Main interface components for different user roles (patient, doctor, admin, family).

### 👨‍⚕️ Doctor
Doctor-specific tools, patient management, and clinical decision support.

### 🚀 Landing
Marketing, onboarding, and initial user experience components.

### 👤 Patient
Patient-facing components, personal health management, and self-care tools.

### 💡 Recommendations
AI-powered suggestions, treatment recommendations, and decision support.

### 📋 Reports
Report generation, data export, and documentation components.

### ⚙️ Settings
Configuration, preferences, and system settings management.

### 🎨 UI
Shared user interface components, utilities, and common elements.

## Benefits of This Structure

1. **Domain-Driven Design**: Components are organized by business domain
2. **Improved Maintainability**: Related components are grouped together
3. **Better Scalability**: Easy to add new components within existing domains
4. **Clear Separation**: Each domain has specific responsibilities
5. **Healthcare-Focused**: Structure reflects medical workflow patterns
6. **Academic Research**: Supports empirical analysis of component interactions

## Migration Guidelines

1. All imports have been automatically updated
2. Each domain folder includes an index.ts file for clean imports
3. Legacy import paths are still supported for backward compatibility
4. New components should be added to the appropriate domain folder
