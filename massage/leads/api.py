from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.utils.datastructures import MultiValueDictKeyError
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime, timedelta

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
                active=True)) | (Q(start_time__week_day=(weekday + 2) % 7) & Q(constant=True)))

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
        init_description = ''
        try:
            init_description = request.data['description']
        except KeyError:
            pass
        description = init_description + f"\nИмя: {name}" + f"\nТелефон: {tel}"
        if len(tel) < 11:
            return Response({"name": "tel", "error": "Неправильный номер"},
                            status=status.HTTP_400_BAD_REQUEST)
        if not name:
            return Response({"name": "name", "error": "Необходимо указать имя"},
                            status=status.HTTP_400_BAD_REQUEST)
        massageSession = MassageSession(start_time=date,
                                        end_time=(date + timedelta(hours=1)).time(),
                                        description=description)
    except (KeyError, TypeError):
        return Response(status=status.HTTP_400_BAD_REQUEST)
    massageSession.active = False
    massageSession.save()
    send_template_email('Запрос на запись', 'emails/order.html',
                        {"tel": tel, "name": name, "description": init_description,
                         "date": date.strftime("%d.%m.%y  %H:%M")},
                        [], True)
    return Response()


@api_view(['POST'])
def create_request_event(request):
    try:
        token = request.data['token']
        client = Client.objects.get(token=token)
        try:
            description = request.data['description']
        except KeyError:
            description = None
        date = f"{request.data['date']} {request.data['start_time']}"
        end = (datetime.strptime(date, '%Y-%m-%d %H:%M') + timedelta(hours=1)).time()
        massage_session = MassageSession(client=client, start_time=date, end_time=end, description=description, active=False)
        massage_session.save()
        send_template_email('Запрос на запись', 'emails/order_by_client.html',
                            {"client": client, "description": description,
                             "date": date},
                            [], True)
        return Response(status=status.HTTP_201_CREATED)
    except (KeyError, ObjectDoesNotExist):
        return Response(status=status.HTTP_400_BAD_REQUEST)


def __get_events_for_month(request, admin=True):
    try:
        year = int(request.GET['year'])
        month = int(request.GET['month'])
        now = datetime.now()
        now_init = datetime(year=now.year, month=now.month, day=now.day)
        context = {}
        if admin:
            serializer = EventSerializer
            events = MassageSession.objects.filter(
                (Q(start_time__year=year) & Q(start_time__month=month) & Q(start_time__gte=now_init)) | Q(
                    constant=True))
        else:
            serializer = EventClientSerializer
            token = request.GET['token']
            try:
                client = Client.objects.get(token=token)
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            context['client'] = client
            events = MassageSession.objects.filter(
                (((Q(start_time__year=year) & Q(start_time__month=month) & Q(start_time__gte=now_init)) | Q(
                    constant=True)) & Q(active=True)) | Q(client=client))

        events_by_day = {}
        for event in events:
            date = event.start_time.strftime("%d.%m.%Y")
            if date in events_by_day.keys():
                events_by_day[date].append(event)
            else:
                events_by_day[date] = [event]
        for key in events_by_day.keys():
            events_by_day[key] = serializer(events_by_day[key], many=True, context=context).data
        return Response(events_by_day)
    except (MultiValueDictKeyError, ValueError):
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@login_required(login_url='admin/login')
def get_events_for_month(request):
    return __get_events_for_month(request)


@api_view(["GET"])
def get_client_events_for_month(request):
    return __get_events_for_month(request, False)


def str_time_to_min(time):
    arr_time = [int(num) for num in time.split(':')]
    return arr_time[0] * 60 + arr_time[1]


def __save_event(request, new):
    data = request.data
    errors = {}
    if not data['client']:
        errors['client'] = ["Необходимо выбрать клиента"]
    if str_time_to_min(data['end_time']) < str_time_to_min(data['start_time']):
        errors['end_time'] = ["Конечное время должно быть больше начального"]
    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    data['start_time'] = f"{data['date']} {data['start_time']}"
    if new:
        serialzer = ValidateEventSerializer(data=data)
    else:
        event = MassageSession.objects.get(pk=request.data['id'])
        serialzer = ValidateEventSerializer(event, data=data)
    serialzer.is_valid()
    if serialzer.is_valid():
        serialzer.save()
        if new:
            return Response({"id": serialzer.instance.id}, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_200_OK)
    else:
        return Response(serialzer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@login_required
def save_event(request):
    return __save_event(request, False)


@api_view(["POST"])
@login_required
def create_event(request):
    return __save_event(request, True)


@api_view(["POST"])
def delete_event(request):
    event = MassageSession.objects.get(pk=request.data["id"])
    event.delete()
    return Response()
