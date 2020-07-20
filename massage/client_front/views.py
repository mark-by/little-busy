from django.shortcuts import render


def index(request):
    return render(request, 'client_front/index.html')
