from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import User, ServiceProvider
from core.models import ActivityLog

def login_view(request):
    if request.user.is_authenticated:
        if request.user.is_admin_user:
            return redirect('admin_dashboard')
        return redirect('dashboard')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            ActivityLog.objects.create(
                user=user,
                action='login',
                ip_address=request.META.get('REMOTE_ADDR')
            )
            if user.is_admin_user:
                return redirect('admin_dashboard')
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid username or password')
    
    return render(request, 'accounts/login.html')

def logout_view(request):
    if request.user.is_authenticated:
        ActivityLog.objects.create(
            user=request.user,
            action='logout',
            ip_address=request.META.get('REMOTE_ADDR')
        )
    logout(request)
    return redirect('home')

def register(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        phone = request.POST.get('phone', '')
        city = request.POST.get('city', '')
        
        if password != password2:
            messages.error(request, 'Passwords do not match')
            return render(request, 'accounts/register.html')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
            return render(request, 'accounts/register.html')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered')
            return render(request, 'accounts/register.html')
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            city=city,
            user_type='patient',
            is_approved=True
        )
        
        ActivityLog.objects.create(
            user=user,
            action='registration',
            details=f'New patient registration: {first_name} {last_name}',
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        login(request, user)
        messages.success(request, 'Registration successful! Welcome to HealthTrack+')
        return redirect('dashboard')
    
    return render(request, 'accounts/register.html')

def register_provider(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        business_name = request.POST.get('business_name')
        provider_type = request.POST.get('provider_type')
        phone = request.POST.get('phone', '')
        city = request.POST.get('city', '')
        
        if password != password2:
            messages.error(request, 'Passwords do not match')
            return render(request, 'accounts/register_provider.html')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
            return render(request, 'accounts/register_provider.html')
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            phone=phone,
            city=city,
            user_type='provider',
            is_approved=False
        )
        
        ServiceProvider.objects.create(
            user=user,
            business_name=business_name,
            provider_type=provider_type
        )
        
        ActivityLog.objects.create(
            user=user,
            action='registration',
            details=f'New provider registration: {business_name}',
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        messages.success(request, 'Registration submitted! Please wait for admin approval.')
        return redirect('login')
    
    return render(request, 'accounts/register_provider.html')

def forgot_password(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        if User.objects.filter(email=email).exists():
            messages.success(request, 'Password reset instructions sent to your email')
        else:
            messages.error(request, 'Email not found')
    
    return render(request, 'accounts/forgot_password.html')
