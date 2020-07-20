from django.contrib import admin
from django.urls import path, include, re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('froala_editor/', include('froala_editor.urls')),
    path('api/', include('leads.urls')),
    re_path('^.*', include('client_front.urls')),
]
