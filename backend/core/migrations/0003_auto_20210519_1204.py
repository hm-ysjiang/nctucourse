# Generated by Django 3.1.5 on 2021-05-19 04:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20210218_1636'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bulletin',
            name='last_updated_time',
            field=models.DateTimeField(),
        ),
    ]
