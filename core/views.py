from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.db.models import Count, Avg, Sum
from django.db.models.functions import TruncMonth, TruncDate
from django.utils import timezone
from datetime import timedelta
from accounts.models import User, ServiceProvider
from .models import (
    HealthRecord, Medicine, Prescription, MentalHealthLog,
    InsurancePolicy, LifestyleLog, ActivityLog, SystemSettings
)

def home(request):
    if request.user.is_authenticated:
        if request.user.is_admin_user:
            return redirect('admin_dashboard')
        return redirect('dashboard')
    return render(request, 'core/home.html')

@login_required
def dashboard(request):
    latest_record = HealthRecord.objects.filter(user=request.user).first()
    active_medicines = Medicine.objects.filter(user=request.user, is_active=True).count()
    recent_activities = ActivityLog.objects.filter(user=request.user)[:5]
    latest_lifestyle = LifestyleLog.objects.filter(user=request.user).first()
    
    context = {
        'latest_record': latest_record,
        'active_medicines': active_medicines,
        'recent_activities': recent_activities,
        'latest_lifestyle': latest_lifestyle,
    }
    return render(request, 'core/dashboard.html', context)

@login_required
def medicines(request):
    medicines = Medicine.objects.filter(user=request.user)
    active_count = medicines.filter(is_active=True).count()
    context = {
        'medicines': medicines,
        'active_count': active_count,
    }
    return render(request, 'core/medicines.html', context)

@login_required
def add_medicine(request):
    if request.method == 'POST':
        Medicine.objects.create(
            user=request.user,
            name=request.POST.get('name'),
            dosage=request.POST.get('dosage'),
            frequency=request.POST.get('frequency'),
            start_date=request.POST.get('start_date'),
            end_date=request.POST.get('end_date') or None,
            prescribed_by=request.POST.get('prescribed_by', ''),
            notes=request.POST.get('notes', ''),
        )
        ActivityLog.objects.create(
            user=request.user,
            action='medicine_added',
            details=f"Added medicine: {request.POST.get('name')}"
        )
        messages.success(request, 'Medicine added successfully')
        return redirect('medicines')
    return render(request, 'core/add_medicine.html')

@login_required
def health_track(request):
    records = HealthRecord.objects.filter(user=request.user)[:30]
    context = {'records': records}
    return render(request, 'core/health_track.html', context)

@login_required
def add_health_record(request):
    if request.method == 'POST':
        HealthRecord.objects.create(
            user=request.user,
            blood_pressure_systolic=request.POST.get('bp_systolic') or None,
            blood_pressure_diastolic=request.POST.get('bp_diastolic') or None,
            blood_sugar=request.POST.get('blood_sugar') or None,
            weight=request.POST.get('weight') or None,
            heart_rate=request.POST.get('heart_rate') or None,
            temperature=request.POST.get('temperature') or None,
            oxygen_level=request.POST.get('oxygen_level') or None,
            notes=request.POST.get('notes', ''),
        )
        ActivityLog.objects.create(
            user=request.user,
            action='record_added',
            details='Added new health record'
        )
        messages.success(request, 'Health record added successfully')
        return redirect('health_track')
    return render(request, 'core/add_health_record.html')

@login_required
def mental_health(request):
    logs = MentalHealthLog.objects.filter(user=request.user)[:30]
    avg_mood = logs.aggregate(Avg('mood_score'))['mood_score__avg'] or 0
    context = {
        'logs': logs,
        'avg_mood': round(avg_mood, 1),
    }
    return render(request, 'core/mental_health.html', context)

@login_required
def prescriptions(request):
    prescriptions = Prescription.objects.filter(user=request.user)
    context = {'prescriptions': prescriptions}
    return render(request, 'core/prescriptions.html', context)

@login_required
def add_prescription(request):
    if request.method == 'POST':
        Prescription.objects.create(
            user=request.user,
            doctor_name=request.POST.get('doctor_name'),
            hospital_name=request.POST.get('hospital_name', ''),
            diagnosis=request.POST.get('diagnosis'),
            prescription_date=request.POST.get('prescription_date'),
            follow_up_date=request.POST.get('follow_up_date') or None,
            notes=request.POST.get('notes', ''),
        )
        ActivityLog.objects.create(
            user=request.user,
            action='prescription_added',
            details=f"Added prescription from {request.POST.get('doctor_name')}"
        )
        messages.success(request, 'Prescription added successfully')
        return redirect('prescriptions')
    return render(request, 'core/add_prescription.html')

@login_required
def lifestyle(request):
    logs = LifestyleLog.objects.filter(user=request.user)[:30]
    context = {'logs': logs}
    return render(request, 'core/lifestyle.html', context)

@login_required
def insurance(request):
    policies = InsurancePolicy.objects.filter(user=request.user)
    active_policies = policies.filter(is_active=True).count()
    context = {
        'policies': policies,
        'active_policies': active_policies,
    }
    return render(request, 'core/insurance.html', context)

@login_required
def past_records(request):
    health_records = HealthRecord.objects.filter(user=request.user)
    prescriptions = Prescription.objects.filter(user=request.user)
    context = {
        'health_records': health_records,
        'prescriptions': prescriptions,
    }
    return render(request, 'core/past_records.html', context)

@login_required
def profile(request):
    if request.method == 'POST':
        user = request.user
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        user.phone = request.POST.get('phone', user.phone)
        user.address = request.POST.get('address', user.address)
        user.city = request.POST.get('city', user.city)
        user.blood_group = request.POST.get('blood_group', user.blood_group)
        user.emergency_contact = request.POST.get('emergency_contact', user.emergency_contact)
        user.emergency_phone = request.POST.get('emergency_phone', user.emergency_phone)
        user.save()
        
        ActivityLog.objects.create(
            user=user,
            action='profile_updated',
            details='Profile information updated'
        )
        messages.success(request, 'Profile updated successfully')
        return redirect('profile')
    
    return render(request, 'core/profile.html')


def is_admin(user):
    return user.is_authenticated and (user.is_admin_user or user.is_superuser)

@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    total_users = User.objects.count()
    total_patients = User.objects.filter(user_type='patient').count()
    total_providers = User.objects.filter(user_type='provider').count()
    pending_approvals = User.objects.filter(is_approved=False, user_type='provider').count()
    total_records = HealthRecord.objects.count()
    
    recent_users = User.objects.order_by('-created_at')[:5]
    recent_activities = ActivityLog.objects.select_related('user')[:10]
    pending_registrations = User.objects.filter(is_approved=False)[:5]
    
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    new_users_this_week = User.objects.filter(created_at__date__gte=week_ago).count()
    
    context = {
        'total_users': total_users,
        'total_patients': total_patients,
        'total_providers': total_providers,
        'pending_approvals': pending_approvals,
        'total_records': total_records,
        'recent_users': recent_users,
        'recent_activities': recent_activities,
        'pending_registrations': pending_registrations,
        'new_users_this_week': new_users_this_week,
    }
    return render(request, 'admin_panel/dashboard.html', context)

@login_required
@user_passes_test(is_admin)
def admin_users(request):
    user_type_filter = request.GET.get('type', 'all')
    search_query = request.GET.get('search', '')
    
    users = User.objects.all()
    
    if user_type_filter != 'all':
        users = users.filter(user_type=user_type_filter)
    
    if search_query:
        users = users.filter(
            username__icontains=search_query
        ) | users.filter(
            email__icontains=search_query
        ) | users.filter(
            first_name__icontains=search_query
        )
    
    context = {
        'users': users,
        'user_type_filter': user_type_filter,
        'search_query': search_query,
    }
    return render(request, 'admin_panel/users.html', context)

@login_required
@user_passes_test(is_admin)
def admin_user_detail(request, user_id):
    user = get_object_or_404(User, id=user_id)
    health_records = HealthRecord.objects.filter(user=user)[:10]
    activities = ActivityLog.objects.filter(user=user)[:20]
    
    context = {
        'profile_user': user,
        'health_records': health_records,
        'activities': activities,
    }
    return render(request, 'admin_panel/user_detail.html', context)

@login_required
@user_passes_test(is_admin)
def admin_approve_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    user.is_approved = True
    user.save()
    messages.success(request, f'User {user.username} has been approved')
    return redirect('admin_users')

@login_required
@user_passes_test(is_admin)
def admin_delete_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'POST':
        username = user.username
        user.delete()
        messages.success(request, f'User {username} has been deleted')
        return redirect('admin_users')
    return render(request, 'admin_panel/confirm_delete.html', {'profile_user': user})

@login_required
@user_passes_test(is_admin)
def admin_providers(request):
    providers = ServiceProvider.objects.select_related('user').all()
    context = {'providers': providers}
    return render(request, 'admin_panel/providers.html', context)

@login_required
@user_passes_test(is_admin)
def admin_health_data(request):
    records = HealthRecord.objects.select_related('user').order_by('-created_at')[:100]
    
    stats = {
        'total_records': HealthRecord.objects.count(),
        'total_medicines': Medicine.objects.count(),
        'total_prescriptions': Prescription.objects.count(),
        'total_policies': InsurancePolicy.objects.count(),
    }
    
    context = {
        'records': records,
        'stats': stats,
    }
    return render(request, 'admin_panel/health_data.html', context)

@login_required
@user_passes_test(is_admin)
def admin_reports(request):
    today = timezone.now().date()
    month_ago = today - timedelta(days=30)
    
    user_registrations = User.objects.filter(
        created_at__date__gte=month_ago
    ).annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(count=Count('id')).order_by('date')
    
    health_records_by_month = HealthRecord.objects.annotate(
        month=TruncMonth('created_at')
    ).values('month').annotate(count=Count('id')).order_by('-month')[:6]
    
    user_type_distribution = User.objects.values('user_type').annotate(count=Count('id'))
    
    context = {
        'user_registrations': list(user_registrations),
        'health_records_by_month': list(health_records_by_month),
        'user_type_distribution': list(user_type_distribution),
    }
    return render(request, 'admin_panel/reports.html', context)

@login_required
@user_passes_test(is_admin)
def admin_settings(request):
    settings = SystemSettings.objects.all()
    
    if request.method == 'POST':
        key = request.POST.get('key')
        value = request.POST.get('value')
        description = request.POST.get('description', '')
        
        SystemSettings.objects.update_or_create(
            key=key,
            defaults={'value': value, 'description': description}
        )
        messages.success(request, 'Setting saved successfully')
        return redirect('admin_settings')
    
    context = {'settings': settings}
    return render(request, 'admin_panel/settings.html', context)
