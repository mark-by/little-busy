# Generated by Django 3.0.8 on 2021-06-07 16:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0002_auto_20200801_2327'),
    ]

    operations = [
        migrations.AddField(
            model_name='massagesession',
            name='beginning',
            field=models.DateField(blank=True, null=True, verbose_name='Когда начинается курс'),
        ),
        migrations.AddField(
            model_name='massagesession',
            name='finish',
            field=models.DateField(blank=True, null=True, verbose_name='Когда заканчивается курс'),
        ),
    ]
