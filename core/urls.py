from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('medicines/', views.medicines, name='medicines'),
    path('medicines/add/', views.add_medicine, name='add_medicine'),
    path('health-track/', views.health_track, name='health_track'),
    path('health-track/add/', views.add_health_record, name='add_health_record'),
    path('mental-health/', views.mental_health, name='mental_health'),
    path('prescriptions/', views.prescriptions, name='prescriptions'),
    path('prescriptions/add/', views.add_prescription, name='add_prescription'),
    path('lifestyle/', views.lifestyle, name='lifestyle'),
    path('insurance/', views.insurance, name='insurance'),
    path('past-records/', views.past_records, name='past_records'),
    path('profile/', views.profile, name='profile'),
    
    path('admin-panel/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-panel/users/', views.admin_users, name='admin_users'),
    path('admin-panel/users/<int:user_id>/', views.admin_user_detail, name='admin_user_detail'),
    path('admin-panel/users/<int:user_id>/approve/', views.admin_approve_user, name='admin_approve_user'),
    path('admin-panel/users/<int:user_id>/delete/', views.admin_delete_user, name='admin_delete_user'),
    path('admin-panel/providers/', views.admin_providers, name='admin_providers'),
    path('admin-panel/health-data/', views.admin_health_data, name='admin_health_data'),
    path('admin-panel/reports/', views.admin_reports, name='admin_reports'),
    path('admin-panel/settings/', views.admin_settings, name='admin_settings'),
]
