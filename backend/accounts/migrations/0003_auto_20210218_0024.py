# Generated by Django 3.1.5 on 2021-02-17 16:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_trialsimulationdata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trialsimulationdata',
            name='data',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='trialsimulationdata',
            name='imported_courses',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='trialsimulationdata',
            name='last_updated_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
