# Generated by Django 5.0.7 on 2024-08-21 19:42

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Drones',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=80)),
                ('serial_no', models.CharField(max_length=80)),
                ('battery_capacity', models.IntegerField(default=100)),
                ('current_charge', models.IntegerField(default=100)),
                ('geom', django.contrib.gis.db.models.fields.PointField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='HealthFacilities',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=80, null=True)),
                ('healthcare', models.CharField(blank=True, max_length=167, null=True)),
                ('amenity', models.CharField(blank=True, max_length=80, null=True)),
                ('operatorty', models.CharField(blank=True, max_length=80, null=True)),
                ('geom', django.contrib.gis.db.models.fields.PointField(srid=4326)),
            ],
        ),
    ]
