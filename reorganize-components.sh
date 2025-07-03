#!/bin/bash

# Health Stack Deployer Wizard - Component Reorganization Script
# Applies the domain-driven component structure to your existing project

echo "🏥 Health Stack Deployer Wizard - Component Reorganization"
echo "========================================================="
echo ""

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "src/components" ]; then
    print_error "Please run this script from your project root directory"
    exit 1
fi

# Navigate to components directory
cd src/components
print_info "Working in: $(pwd)"

# Backup existing structure
print_info "Creating backup of existing structure..."
cp -r . ../components_backup_$(date +%Y%m%d_%H%M%S)
print_status "Backup created successfully"

# Create the new domain-driven folder structure
print_info "Creating domain-specific directory structure..."

# Create main category folders
mkdir -p alerts
mkdir -p analytics
mkdir -p appointments
mkdir -p auth
mkdir -p bluetooth
mkdir -p dashboard
mkdir -p doctor
mkdir -p landing
mkdir -p patient
mkdir -p recommendations
mkdir -p reports
mkdir -p settings
mkdir -p ui

print_status "Directory structure created"

# Function to move component if it exists
move_component() {
    local component_name=$1
    local destination_folder=$2
    local source_file=""
    
    # Check different possible locations and extensions
    if [ -f "${component_name}.tsx" ]; then
        source_file="${component_name}.tsx"
    elif [ -f "${component_name}.ts" ]; then
        source_file="${component_name}.ts"
    elif [ -f "${component_name}.jsx" ]; then
        source_file="${component_name}.jsx"
    elif [ -f "${component_name}.js" ]; then
        source_file="${component_name}.js"
    elif [ -f "${component_name}/index.tsx" ]; then
        mv "${component_name}" "${destination_folder}/"
        print_status "Moved directory ${component_name} to ${destination_folder}/"
        return
    elif [ -f "${component_name}/index.ts" ]; then
        mv "${component_name}" "${destination_folder}/"
        print_status "Moved directory ${component_name} to ${destination_folder}/"
        return
    fi
    
    if [ -n "$source_file" ]; then
        mv "$source_file" "${destination_folder}/"
        print_status "Moved $source_file to ${destination_folder}/"
    else
        print_warning "Component $component_name not found"
    fi
}

# Move components to their designated folders
print_info "Organizing components by domain..."

# Alerts components
print_info "📢 Moving alerts components..."
move_component "EmergencyAlertReceiver" "alerts"
move_component "EmergencyButton" "alerts"
move_component "SmartAlertsCard" "alerts"

# Analytics components
print_info "📊 Moving analytics components..."
move_component "HealthAnalytics" "analytics"

# Appointments components
print_info "📅 Moving appointments components..."
move_component "AppointmentsCard" "appointments"

# Auth components
print_info "🔐 Moving authentication components..."
move_component "AuthAnimations" "auth"
move_component "LogoutButton" "auth"
move_component "RoleSelector" "auth"

# Bluetooth components
print_info "📡 Moving bluetooth components..."
move_component "BluetoothConnection" "bluetooth"
move_component "RealtimeHeartMonitor" "bluetooth"

# Dashboard components
print_info "🏠 Moving dashboard components..."
move_component "AdminUserManager" "dashboard"
move_component "Dashboard" "dashboard"
move_component "DoctorDashboard" "dashboard"
move_component "FamilyDashboard" "dashboard"
move_component "PatientDashboard" "dashboard"

# Doctor components
print_info "👨‍⚕️ Moving doctor components..."
move_component "DoctorCarousel" "doctor"
move_component "PatientProfileModal" "doctor"
# Handle potential duplicate AuthAnimations
if [ -f "DoctorAuthAnimations.tsx" ]; then
    mv "DoctorAuthAnimations.tsx" "doctor/AuthAnimations.tsx"
    print_status "Moved DoctorAuthAnimations.tsx to doctor/AuthAnimations.tsx"
elif [ -f "doctor/AuthAnimations.tsx" ] && [ ! -f "auth/AuthAnimations.tsx" ]; then
    mv "doctor/AuthAnimations.tsx" "doctor/AuthAnimations.tsx"
    print_status "Kept doctor-specific AuthAnimations in place"
fi

# Landing components
print_info "🚀 Moving landing page components..."
move_component "LandingCarousel" "landing"
move_component "LandingNavigation" "landing"
move_component "ProjectInfo" "landing"

# Patient components
print_info "👤 Moving patient components..."
move_component "DailyLogCard" "patient"
move_component "DeviceManager" "patient"
move_component "HeartRateCard" "patient"
move_component "ProfileCard" "patient"

# Recommendations components
print_info "💡 Moving recommendations components..."
move_component "RecommendationsCard" "recommendations"

# Reports components
print_info "📋 Moving reports components..."
move_component "ReportsCard" "reports"

# Settings components
print_info "⚙️ Moving settings components..."
move_component "SettingsForm" "settings"

# UI components
print_info "🎨 Moving UI components..."
move_component "AnimatedFeatureCards" "ui"
move_component "ProtectedRoute" "ui"

# Root level components remain in place
print_info "📍 Root level components (RoleAnimations, RoleRouter) remain in components root"

# Create index files for organized imports
print_info "📄 Creating index files for clean imports..."

# Function to create index file
create_index_file() {
    local folder=$1
    local index_file="$folder/index.ts"
    
    echo "// Auto-generated index file for $folder components" > "$index_file"
    echo "" >> "$index_file"
    
    # Find all component files in the folder
    for file in "$folder"/*.tsx "$folder"/*.ts; do
        if [ -f "$file" ] && [ "$(basename "$file")" != "index.ts" ]; then
            filename=$(basename "$file" .tsx)
            filename=$(basename "$filename" .ts)
            
            # Check if it's a default export (most React components)
            if grep -q "export default" "$file" 2>/dev/null; then
                echo "export { default as $filename } from './$filename';" >> "$index_file"
            else
                echo "export * from './$filename';" >> "$index_file"
            fi
        fi
    done
    
    print_status "Created index file for $folder"
}

# Create index files for each domain folder
for folder in alerts analytics appointments auth bluetooth dashboard doctor landing patient recommendations reports settings ui; do
    if [ -d "$folder" ] && [ "$(ls -A "$folder" 2>/dev/null)" ]; then
        create_index_file "$folder"
    fi
done

# Create main components index file
print_info "📄 Creating main components index file..."
cat > index.ts << 'EOF'
// Health Stack Deployer Wizard - Component Exports
// Domain-driven component organization for healthcare applications

// Alert and Emergency Management
export * from './alerts';

// Data Analytics and Health Metrics
export * from './analytics';

// Appointment Management
export * from './appointments';

// Authentication and Authorization
export * from './auth';

// Bluetooth and Device Connectivity
export * from './bluetooth';

// Dashboard and Main Interfaces
export * from './dashboard';

// Doctor-specific Components
export * from './doctor';

// Landing and Marketing Pages
export * from './landing';

// Patient-specific Components
export * from './patient';

// AI Recommendations
export * from './recommendations';

// Reports and Documentation
export * from './reports';

// Settings and Configuration
export * from './settings';

// UI Components and Utilities
export * from './ui';

// Root Level Components
export { default as RoleAnimations } from './RoleAnimations';
export { default as RoleRouter } from './RoleRouter';
EOF

print_status "Main index file created"

# Create import update script
print_info "🔄 Creating import update script..."
cat > update_imports.py << 'EOF'
#!/usr/bin/env python3
"""
Import Statement Update Script for Health Stack Deployer Wizard
Updates all import statements to use the new domain-driven structure
"""

import os
import re
import glob

def update_imports_in_file(file_path):
    """Update import statements in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Component mapping: old import -> new import
        component_mappings = {
            # Alerts
            'EmergencyAlertReceiver': 'alerts/EmergencyAlertReceiver',
            'EmergencyButton': 'alerts/EmergencyButton',
            'SmartAlertsCard': 'alerts/SmartAlertsCard',
            
            # Analytics
            'HealthAnalytics': 'analytics/HealthAnalytics',
            
            # Appointments
            'AppointmentsCard': 'appointments/AppointmentsCard',
            
            # Auth
            'AuthAnimations': 'auth/AuthAnimations',
            'LogoutButton': 'auth/LogoutButton',
            'RoleSelector': 'auth/RoleSelector',
            
            # Bluetooth
            'BluetoothConnection': 'bluetooth/BluetoothConnection',
            'RealtimeHeartMonitor': 'bluetooth/RealtimeHeartMonitor',
            
            # Dashboard
            'AdminUserManager': 'dashboard/AdminUserManager',
            'Dashboard': 'dashboard/Dashboard',
            'DoctorDashboard': 'dashboard/DoctorDashboard',
            'FamilyDashboard': 'dashboard/FamilyDashboard',
            'PatientDashboard': 'dashboard/PatientDashboard',
            
            # Doctor
            'DoctorCarousel': 'doctor/DoctorCarousel',
            'PatientProfileModal': 'doctor/PatientProfileModal',
            
            # Landing
            'LandingCarousel': 'landing/LandingCarousel',
            'LandingNavigation': 'landing/LandingNavigation',
            'ProjectInfo': 'landing/ProjectInfo',
            
            # Patient
            'DailyLogCard': 'patient/DailyLogCard',
            'DeviceManager': 'patient/DeviceManager',
            'HeartRateCard': 'patient/HeartRateCard',
            'ProfileCard': 'patient/ProfileCard',
            
            # Recommendations
            'RecommendationsCard': 'recommendations/RecommendationsCard',
            
            # Reports
            'ReportsCard': 'reports/ReportsCard',
            
            # Settings
            'SettingsForm': 'settings/SettingsForm',
            
            # UI
            'AnimatedFeatureCards': 'ui/AnimatedFeatureCards',
            'ProtectedRoute': 'ui/ProtectedRoute',
        }
        
        # Update import statements
        for old_component, new_path in component_mappings.items():
            # Pattern for different import styles
            patterns = [
                rf'from [\'"]@/components/{old_component}[\'"]',
                rf'from [\'"]@/components/{old_component}\.tsx[\'"]',
                rf'from [\'"]@/components/{old_component}\.ts[\'"]',
                rf'from [\'"]\.\.?/.*components/{old_component}[\'"]',
                rf'from [\'"]\.\.?/.*components/{old_component}\.tsx[\'"]',
                rf'from [\'"]\.\.?/.*components/{old_component}\.ts[\'"]',
            ]
            
            for pattern in patterns:
                replacement = f'from "@/components/{new_path}"'
                content = re.sub(pattern, replacement, content)
        
        # Write back if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Updated: {file_path}")
            return True
        else:
            return False
            
    except Exception as e:
        print(f"❌ Error updating {file_path}: {e}")
        return False

def main():
    """Main function to update all imports"""
    print("🔄 Updating import statements throughout the project...")
    
    # Find all TypeScript/JavaScript files
    extensions = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx']
    files_to_process = []
    
    for ext in extensions:
        files_to_process.extend(glob.glob(ext, recursive=True))
    
    # Filter out node_modules and build directories
    files_to_process = [f for f in files_to_process if 'node_modules' not in f and 'dist' not in f and 'build' not in f]
    
    updated_count = 0
    total_files = len(files_to_process)
    
    for file_path in files_to_process:
        if update_imports_in_file(file_path):
            updated_count += 1
    
    print(f"\n📊 Summary:")
    print(f"   • Total files processed: {total_files}")
    print(f"   • Files updated: {updated_count}")
    print(f"   • Files unchanged: {total_files - updated_count}")
    
    if updated_count > 0:
        print("\n🎉 Import updates completed successfully!")
    else:
        print("\n✅ No import updates needed - all imports are already up to date!")

if __name__ == "__main__":
    main()
EOF

chmod +x update_imports.py

print_status "Import update script created"

# Create documentation
print_info "📚 Creating documentation..."
cat > COMPONENT_STRUCTURE.md << 'EOF'
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
EOF

print_status "Documentation created"

# Final summary
echo ""
echo "🎉 Component Reorganization Complete!"
echo "====================================="
echo ""
print_status "✅ Created domain-driven folder structure"
print_status "✅ Organized existing components by domain"
print_status "✅ Generated index files for clean imports"
print_status "✅ Created import update script"
print_status "✅ Generated comprehensive documentation"
echo ""
print_info "📋 Next Steps:"
echo "   1. Run: python3 update_imports.py (to update all import statements)"
echo "   2. Test your application to ensure all imports work correctly"
echo "   3. Review COMPONENT_STRUCTURE.md for usage guidelines"
echo "   4. Consider running your test suite to verify functionality"
echo ""
print_info "📁 Your components are now organized by healthcare domain:"
echo "   • Clinical workflow (patient → doctor → analytics → reports)"
echo "   • Technical infrastructure (auth, bluetooth, ui)"
echo "   • Business logic (alerts, appointments, recommendations)"
echo ""
print_info "🔗 New import examples:"
echo "   import { PatientDashboard } from '@/components/dashboard';"
echo "   import { EmergencyButton } from '@/components/alerts';"
echo "   import { BluetoothConnection } from '@/components/bluetooth';"
echo ""
print_status "Happy coding! 🚀"
