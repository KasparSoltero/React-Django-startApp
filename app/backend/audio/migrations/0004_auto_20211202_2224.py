# Generated by Django 3.2.9 on 2021-12-02 22:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('audio', '0003_dosomething'),
    ]

    operations = [
        migrations.DeleteModel(
            name='DoSomething',
        ),
        migrations.AddField(
            model_name='unprocessedaudio',
            name='value',
            field=models.IntegerField(default=0),
        ),
    ]
