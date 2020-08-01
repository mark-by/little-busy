from django.core.management.base import BaseCommand, CommandError
from leads.models import MassageSession
from leads.utils import send_template_email
import pytz
from django.db.models import Q
from django.utils import timezone


class Command(BaseCommand):
    help = "notify"

    def handle(self, *args, **kwargs):
        timezone.activate(timezone.get_default_timezone_name())
        today = timezone.now().today()
        tomorrow = today + timezone.timedelta(days=1)
        after_tomorrow = today + timezone.timedelta(days=2)
        sessions = MassageSession.objects.filter(
            Q(active=True) & ((Q(constant=True) & Q(start_time__week_day=(tomorrow.weekday() + 2) % 7)) | (Q(start_time__gt=today) & Q(start_time__lt=after_tomorrow))))
        for session in sessions:
            if session.client.email and session.client.notify:
                time = session.start_time.astimezone(pytz.timezone(timezone.get_default_timezone_name()))
                send_template_email("Оповещение о массаже", "emails/notify.html", {"time": time.strftime("%H:%M")}, [session.client.email], False)
