from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.utils.datastructures import MultiValueDictKeyError
from datetime import datetime

from .models import *
from .serializers import *


@api_view(['GET'])
def get_certificates(request):
    query_set = Certificate.objects.all()
    return paginate(request, query_set, CertificateSerializer)


@api_view(['GET'])
def get_feedback(request):
    query_set = Feedback.objects.all()
    return paginate(request, query_set, FeedbackSerializer)


@api_view(['GET'])
def get_events(request):
    try:
        year = int(request.GET['year'])
        month = int(request.GET['month'])
        day = int(request.GET['day'])
        weekday = datetime(year=year, month=month, day=day).weekday()
        events = MassageSession.objects.filter(
            (Q(start_time__year=year) & Q(start_time__month=month) & Q(start_time__day=day) & Q(
                active=True)) | (Q(start_time__week_day=(weekday + 2)%7) & Q(constant=True)))

        return Response(ShortEventSerializer(events, many=True).data)
    except (MultiValueDictKeyError, ValueError):
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_articles(request):
    qs = Article.objects.all()
    return Response(ArticleSerializer(qs, many=True).data)


@api_view(['GET'])
def get_avatar(request):
    avatar = Avatar.objects.get(pk=1)
    return Response({"src": avatar.image.url})


@api_view(['POST'])
def sign_up_to_massage_session(request):
    try:
        time = request.data['time'].split(':')
        date = datetime(year=request.data['year'],
                        month=request.data['month'],
                        day=request.data['day'],
                        hour=int(time[0]),
                        minute=int(time[1]))
        tel = request.data['tel']
        name = request.data['name']
        description = request.data['description']
        if len(tel) < 11:
            return Response({"name": "tel", "error": "Неправильный номер"}, status=status.HTTP_400_BAD_REQUEST)
        if not name:
            return Response({"name": "name", "error": "Необходимо указать имя"}, status=status.HTTP_400_BAD_REQUEST)
        massageSession = MassageSession(start_time=date,
                                        name=name,
                                        description=description + f"\nТелефон: {tel}")
    except (KeyError, TypeError):
        return Response(status=status.HTTP_400_BAD_REQUEST)
    massageSession.active = False
    massageSession.save()
    send_template_email('Запрос на запись', 'emails/order.html',
                        {"tel": tel, "name": name, "description": description, "date": date.strftime("%d.%m.%y  %H:%M")},
                        ["smile.mark.cool@gmail.com"])
    return Response()
