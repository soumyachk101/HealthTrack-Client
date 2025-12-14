# HealthTrack+ - Health Management Platform

## Overview
A comprehensive health management platform built with Django and PostgreSQL, featuring a modern Bootstrap 5 UI and a complete admin panel. The platform allows patients to track their health metrics, medicines, prescriptions, and lifestyle data, while administrators can manage users and monitor platform activity.

## Tech Stack
- **Backend**: Django 5.2 with Python 3.11
- **Database**: PostgreSQL
- **Frontend**: HTML5, Bootstrap 5.3, JavaScript, Chart.js
- **Styling**: Custom CSS with modern design

## Project Structure
```
/
├── healthtracker/          # Django project settings
│   ├── settings.py         # Main configuration
│   ├── urls.py             # Root URL routing
│   └── wsgi.py             # WSGI config
├── accounts/               # User authentication app
│   ├── models.py           # User and ServiceProvider models
│   ├── views.py            # Auth views (login, register)
│   └── urls.py             # Auth URL routing
├── core/                   # Main application
│   ├── models.py           # Health data models
│   ├── views.py            # Dashboard and admin views
│   └── urls.py             # App URL routing
├── templates/              # HTML templates
│   ├── base.html           # Base template
│   ├── core/               # User-facing pages
│   ├── accounts/           # Auth pages
│   └── admin_panel/        # Admin panel pages
├── static/                 # Static assets
│   ├── css/style.css       # Main stylesheet
│   └── images/             # Logo and images
└── manage.py               # Django management
```

## Features

### User Features
- Dashboard with health metrics overview
- Monthly health tracking (BP, sugar, weight, heart rate)
- Medicine management and tracking
- Mental health logging
- Prescription management
- Lifestyle tracking
- Insurance policy management
- User profile management

### Admin Panel Features
- Dashboard with platform statistics
- User management (view, approve, delete users)
- Service provider management
- Health data overview
- Reports with charts and analytics
- System settings configuration

## Running the Application
```bash
python manage.py runserver 0.0.0.0:5000
```

## Admin Credentials
- Username: admin
- Password: admin123

## Database Models
- **User**: Custom user model with patient/provider/admin types
- **ServiceProvider**: Extended profile for healthcare providers
- **HealthRecord**: Vital signs and health metrics
- **Medicine**: Medication tracking
- **Prescription**: Doctor prescriptions
- **MentalHealthLog**: Mood and mental wellness tracking
- **InsurancePolicy**: Health and life insurance
- **LifestyleLog**: Daily lifestyle activities
- **ActivityLog**: User activity tracking
- **SystemSettings**: Platform configuration
