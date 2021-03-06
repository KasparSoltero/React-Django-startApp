# Generated by Django 4.0 on 2022-02-02 21:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('audio', '0028_noiseclip_color_noiseclip_useasreference_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Animal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='animal_name', max_length=120)),
                ('color', models.CharField(max_length=120, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='AudioClip',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='audioclip_title', max_length=120)),
                ('filedata', models.FileField(blank=True, upload_to='')),
                ('start_time', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('end_time', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('use_as_ref', models.BooleanField(default=False)),
                ('animal', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='audio.animal')),
            ],
        ),
        migrations.RenameField(
            model_name='audiofile',
            old_name='denoisedFile',
            new_name='denoised_filedata',
        ),
        migrations.AlterField(
            model_name='audiofile',
            name='title',
            field=models.CharField(default='audiofile_title', max_length=120),
        ),
        migrations.DeleteModel(
            name='NoiseClip',
        ),
        migrations.DeleteModel(
            name='Referenceclip',
        ),
        migrations.AddField(
            model_name='audioclip',
            name='parent_audio',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='audio.audiofile'),
        ),
        migrations.AddField(
            model_name='audioclip',
            name='reference_audio',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='audio.audioclip'),
        ),
    ]
