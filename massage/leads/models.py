from django.db import models
from froala_editor.fields import FroalaField
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from .utils import *

import hashlib


class Article(models.Model):
    title = models.CharField(max_length=128, verbose_name='Заголовок')
    content = FroalaField(verbose_name='Содержание')
    priority = models.PositiveSmallIntegerField(default=0, verbose_name='Порядок')

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.content = clear_froala(self.content)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['priority']
        verbose_name = 'Статья'
        verbose_name_plural = 'Статьи'


class Feedback(models.Model):
    content = FroalaField(verbose_name='Содержание')
    date = models.DateField(default=timezone.now)

    def __str__(self):
        max_len = 32
        if len(self.content) <= max_len:
            return self.content
        else:
            return f"{self.content[:max_len]}..."

    def save(self, *args, **kwargs):
        self.content = clear_froala(self.content)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-date']
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'


class Certificate(models.Model):
    image = models.ImageField(upload_to=certificate_upload, verbose_name='Сертификат')
    date = models.DateField(default=timezone.now, verbose_name='Дата выдачи')

    def __str__(self):
        return f"Сертификат №{self.pk} - {self.date}"

    class Meta:
        ordering = ['-date']
        verbose_name = 'Сертификат'
        verbose_name_plural = 'Сертификаты'


class Avatar(models.Model):
    image = models.ImageField(upload_to=avatar_upload)

    def __str__(self):
        return "Аватар"

    class Meta:
        verbose_name = "Аватар"
        verbose_name_plural = "Аватар"


class Client(models.Model):
    name = models.CharField(max_length=32, verbose_name="Имя")
    tel = models.CharField(max_length=15, verbose_name="Телефон", blank=True, null=True)
    description = models.TextField(blank=True, null=True, verbose_name="Комментарий")
    token = models.CharField(max_length=40, verbose_name="Токен", null=True, blank=True)
    email = models.EmailField(blank=True, null=True, verbose_name="E-mail")
    notify = models.BooleanField(default=False, verbose_name="Оповещать")

    def __str__(self):
        return self.name

    def take_token(self):
        self.token = hashlib.sha1(f"{self.name}{self.pk}".encode()).hexdigest()
        self.description += f"\n{settings.HOST}/client-schedule/{self.token}"
        self.save()

    class Meta:
        ordering = ['name']
        verbose_name = "Клиент"
        verbose_name_plural = "Клиенты"


class MassageSession(models.Model):
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, verbose_name="Клиент")
    start_time = models.DateTimeField(default=timezone.now, verbose_name="Начало")
    end_time = models.TimeField(default=timezone.now, verbose_name="Конец")
    description = models.TextField(blank=True, null=True, verbose_name="Комментарий")
    active = models.BooleanField(default=True, verbose_name="Действительна")
    constant = models.BooleanField(default=False, verbose_name="Постоянна")

    def __str__(self):
        return f"Сеанс c {self.client}"

    class Meta:
        ordering = ['-start_time']
        verbose_name = "Cеанс"
        verbose_name_plural = "Сеансы"

