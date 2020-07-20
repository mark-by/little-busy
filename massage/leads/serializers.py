from rest_framework import serializers
from .models import *


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ('image', )


class FeedbackSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format="%d.%m.%y")

    class Meta:
        model = Feedback
        fields = ('content', 'date')


class ShortEventSerializer(serializers.ModelSerializer):
    start_time = serializers.DateTimeField(format="%H:%M")
    end_time = serializers.TimeField(format="%H:%M")

    class Meta:
        model = MassageSession
        fields = ('start_time', 'end_time')


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ('id', 'title', 'content')
