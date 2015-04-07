from locust import HttpLocust, TaskSet, task
# from bs4 import BeautifulSoup
import random
import json
# import urllib3
# urllib3.disable_warnings()
lat = 47.614848
lng = -122.3359059


class UserBehavior(TaskSet):
    def on_start(self):
        pass

    @task(1)
    def index(self):
        self.client.get("/")

    @task(1)
    def create(self):
        self.client.get("/create")

    @task(5)
    class SubTaskCreate(TaskSet):
        def on_start(self):
            self.lat = random.uniform(-1, 1) + lat
            self.lng = random.uniform(-1, 1) + lng
            print self.lat, self.lng
            self.response = self.client.post(
                                        url="/scene_options_ajax",
                                        data={'lat': self.lat, 'lng': self.lng}
                                             )

        @task(10)
        def map_move(self):
            self.lat = random.uniform(-1, 1) + lat
            self.lng = random.uniform(-1, 1) + lng
            self.response = self.client.post(
                                        url="/scene_options_ajax",
                                        data={'lat': self.lat, 'lng': self.lng}
                                             )

        @task(3)
        def preview(self):
            self.map_move()
            json_data = json.loads(self.response.text)
            print json_data["scenes"][0]
            num_scenes = len(json_data["scenes"][0]) - 1
            if num_scenes > 0:
                random_num = random.randint(0, num_scenes)
                random_url = json_data["scenes"][0][random_num]["download_url"]
                self.client.get(random_url)
                scene_id = json_data["scenes"][0][random_num]["entityid"]
                rand_band = random.choice(["432", "543", "532"])
                url = "/request_preview/{}".format(scene_id)
                print url
                print rand_band
                self.client.post(url=url, data={'band_combo': rand_band})
                print 'requested preview'

        @task(1)
        def stop(self):
            self.interrupt()


class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 500
    max_wait = 1000
