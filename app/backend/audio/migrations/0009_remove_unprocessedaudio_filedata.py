# Generated by Django 3.2.9 on 2021-12-06 04:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('audio', '0008_alter_unprocessedaudio_filedata'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='unprocessedaudio',
            name='filedata',
        ),
    ]
