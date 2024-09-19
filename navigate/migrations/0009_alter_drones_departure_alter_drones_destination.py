# Generated by Django 4.2.13 on 2024-09-19 09:21

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('navigate', '0008_remove_drones_battery_capacity_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='drones',
            name='departure',
            field=django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326),
        ),
        migrations.AlterField(
            model_name='drones',
            name='destination',
            field=django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326),
        ),
    ]
