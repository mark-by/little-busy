from django.contrib import admin
from django.urls import path, include, re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('manage', include('manage_front.urls')),
    re_path('^client-schedule/.*', include('client_schedule_front.urls')),
    path('froala_editor/', include('froala_editor.urls')),
    path('api/', include('leads.urls')),
    path('', include('client_front.urls')),
    path('certificate', include('client_front.urls')),
    path('schedule', include('client_front.urls')),
    path('feedback', include('client_front.urls')),
]
