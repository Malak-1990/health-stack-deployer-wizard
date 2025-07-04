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
