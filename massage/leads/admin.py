from django.contrib import admin
from .models import *


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'priority')
    list_editable = ('priority',)


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    pass


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    pass


@admin.register(Avatar)
class AvatarAdmin(admin.ModelAdmin):
    pass


@admin.register(MassageSession)
class MassageSessionAdmin(admin.ModelAdmin):
    list_display = ('client', 'start_time', 'end_time')
    autocomplete_fields = ['client']
    list_filter = ('active', 'constant')


class MassageSessionInline(admin.TabularInline):
    model = MassageSession
    extra = 0


def take_token(modelAdmin, request, queryset):
    for client in queryset:
        client.take_token()


take_token.short_description = "Выпустить ссылку"


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    actions = [take_token]
    readonly_fields = ['token']
    list_display = ('name', 'tel')
    inlines = (MassageSessionInline,)
    search_fields = ['name']
