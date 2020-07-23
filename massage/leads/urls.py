from rest_framework import routers
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings as django_settings
from .api import *

router = routers.DefaultRouter()

urlpatterns = router.get_urls() + [
    path('get-certificates', get_certificates),
    path('get-articles', get_articles),
    path('get-feedback', get_feedback),
    path('get-events', get_events),
    path('get-avatar', get_avatar),

    path('get-events-for-month', get_events_for_month),

    path('save-event', save_event),
    path('create-event', create_event),
    path('delete-event', delete_event),

    path('sign-up-to-massage', sign_up_to_massage_session),
] + static(django_settings.MEDIA_URL, document_root=django_settings.MEDIA_ROOT)
