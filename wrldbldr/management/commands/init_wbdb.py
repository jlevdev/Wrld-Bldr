from wrldbldr.models import Settlement
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from glob import glob
from django.conf import settings
import requests
from os import path
from wrldbldr.constants import Constants


class Command(BaseCommand):
    help = 'Creates an initial settlement and user.'

    def handle(self, *args, **options):
        # generate avatars
        # server must be running for this
        for f in glob(
                path.join(settings.BASE_DIR, 'initial_files\\avatars') +
                '\\*.png'):

            filename = f.split("\\")[-1]

            r = None
            s = None
            if 'halfelf' in f:
                r = Constants.RACE_HALF_ELF
            elif 'elf' in f:
                r = Constants.RACE_ELF
            elif 'dwarf' in f:
                r = Constants.RACE_DWARF
            elif 'gnome' in f:
                r = Constants.RACE_GNOME
            elif 'halfling' in f:
                r = Constants.RACE_HALFLING
            elif 'halforc' in f:
                r = Constants.RACE_HALF_ORC
            elif 'human' in f:
                r = Constants.RACE_HUMAN

            if '-f' in f:
                s = 'f'
            elif '-m' in f:
                s = 'm'
            else:
                s = 'n'

            headers = {'cache-control': "no-cache"}
            payload = {"name": filename, "race": r, "sex": s}
            files = {'file': (filename, open(f, 'rb'), "multipart/form-data")}

            response = requests.request("POST",
                                        verify=False,
                                        url='http://localhost/api/avatar/',
                                        data=payload,
                                        files=files,
                                        headers=headers)

            print(response.text)
        self.stdout.write(self.style.SUCCESS('Successfully generated Avatars'))

        # generate wallpapers
        for f in glob(
                path.join(settings.BASE_DIR, 'initial_files\\backgrounds') +
                '\\*.jpg'):

            filename = f.split("\\")[-1]

            headers = {'cache-control': "no-cache"}
            payload = {"name": filename}
            files = {'file': (filename, open(f, 'rb'), "multipart/form-data")}

            response = requests.request("POST",
                                        verify=False,
                                        url='http://localhost/api/background/',
                                        data=payload,
                                        files=files,
                                        headers=headers)
            print(response.text)
        self.stdout.write(
            self.style.SUCCESS('Successfully generated Backgrounds'))

        # generate icons
        for f in glob(
                path.join(settings.BASE_DIR, 'initial_files\\icons') +
                '\\*.png'):

            filename = f.split("\\")[-1]

            headers = {'cache-control': "no-cache"}
            payload = {"name": filename.split('.')[0]}
            files = {'file': (filename, open(f, 'rb'), "multipart/form-data")}

            response = requests.request("POST",
                                        verify=False,
                                        url='http://localhost/api/icon/',
                                        data=payload,
                                        files=files,
                                        headers=headers)
            print(response.text)
        self.stdout.write(self.style.SUCCESS('Successfully generated Icons'))

        superuser = User.objects.create_user('admin', password='admin')
        superuser.is_superuser = True
        superuser.is_staff = True
        superuser.save()

        user = User.objects.create_user('gary', password='iroll20s')
        user.save()

        Settlement.objects.create_with_random_shops(name="Thunder Bluff",
                                                    map_data={
                                                        'seed':
                                                        1,
                                                        'shopIndexes':
                                                        [1, 2, 3, 4, 5]
                                                    },
                                                    owner_id=2)

        self.stdout.write(
            self.style.SUCCESS('Successfully initialized first Settlement'))
