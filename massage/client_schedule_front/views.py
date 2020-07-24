from django.shortcuts import render


def index(request):
    return render(request, 'client_schedule_front/index.html')
