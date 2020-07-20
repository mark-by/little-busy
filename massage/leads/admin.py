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
    list_display = ('name', 'start_time', 'end_time')
    autocomplete_fields = ['client', 'kind']
    list_filter = ('active', 'constant')


class MassageSessionInline(admin.TabularInline):
    model = MassageSession
    autocomplete_fields = ['kind']
    exclude = ['name']
    extra = 0


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'tel')
    inlines = (MassageSessionInline, )
    search_fields = ['name']


@admin.register(Kind)
class KindAdmin(admin.ModelAdmin):
    search_fields = ['title']