from rest_framework import serializers
from .models import *


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ('image',)


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


class ShortClientSerializer(serializers.ModelSerializer):
    text = serializers.SerializerMethodField('get_name')

    def get_name(self, obj):
        return obj.name

    class Meta:
        model = Client
        fields = ('id', 'text')


class EventSerializer(serializers.ModelSerializer):
    start_time = serializers.DateTimeField(format="%H:%M")
    end_time = serializers.TimeField(format="%H:%M")
    client = ShortClientSerializer()

    class Meta:
        model = MassageSession
        fields = '__all__'


class EventClientSerializer(serializers.ModelSerializer):
    start_time = serializers.DateTimeField(format="%H:%M")
    end_time = serializers.TimeField(format="%H:%M")
    own = serializers.SerializerMethodField('set_own')

    class Meta:
        model = MassageSession
        fields = ['start_time', 'end_time', 'own', 'active', 'constant']

    def set_own(self, obj):
        return True if obj.client == self.context['client'] else False


class ValidateEventSerializer(serializers.ModelSerializer):
    start_time = serializers.DateTimeField(format="%H:%M")
    end_time = serializers.TimeField(format="%H:%M")

    class Meta:
        model = MassageSession
        fields = '__all__'


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ('id', 'title', 'content')
