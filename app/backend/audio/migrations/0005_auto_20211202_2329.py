# Generated by Django 3.2.9 on 2021-12-02 23:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('audio', '0004_auto_20211202_2224'),
    ]

    operations = [
        migrations.RenameField(
            model_name='unprocessedaudio',
            old_name='value',
            new_name='filedata',
        ),
        migrations.RenameField(
            model_name='unprocessedaudio',
            old_name='testdata',
            new_name='filename',
        ),
    ]