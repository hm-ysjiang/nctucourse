# Generated by Django 3.1.5 on 2021-01-04 18:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('simulation', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='simcollect',
            name='visible',
            field=models.BooleanField(default=True),
        ),
    ]
