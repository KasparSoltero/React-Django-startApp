# Generated by Django 4.0 on 2022-01-17 05:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('audio', '0019_noiseclip_parentaudio_alter_noiseclip_audiofile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='noiseclip',
            name='parentAudio',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='audio.audiofile'),
        ),
    ]
