# Generated by Django 4.0 on 2022-01-18 10:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('audio', '0023_alter_noiseclip_endtime_alter_noiseclip_starttime'),
    ]

    operations = [
        migrations.AddField(
            model_name='referenceclip',
            name='color',
            field=models.CharField(default='none', max_length=120),
        ),
    ]
