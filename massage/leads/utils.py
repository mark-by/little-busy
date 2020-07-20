from django.core.paginator import Paginator, EmptyPage
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

import re


def certificate_upload(instance, filename):
    return f'certificates/{filename}'


def avatar_upload(instance, filename):
    return f'avatar/{filename}'


def paginate(request, qs, serializer):
    default_limit = 3
    try:
        limit = int(request.GET.get('limit', default_limit))
    except ValueError:
        limit = default_limit
    if limit > 100:
        limit = default_limit
    try:
        page = int(request.GET.get('page', 1))
    except ValueError:
        raise Http404
    paginator = Paginator(qs, limit)
    try:
        return Response(serializer(paginator.page(page).object_list, many=True).data)
    except EmptyPage:
        return Response(status=status.HTTP_204_NO_CONTENT)


def clear_froala(text):
    return re.split(r"<p\sdata-f-id.*>.*?</p>", text)[0]


def send_template_email(subject, template, context, to, notify=False):
    html_message = render_to_string(template, context)
    plain_message = strip_tags(html_message)
    from_email = 'i@irina-massage.ru'
    recipients = to
    if notify:
        recipients.append(from_email)
    send_mail(subject, plain_message, from_email, recipients, html_message=html_message)

