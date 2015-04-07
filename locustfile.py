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

    @task
    def index(self):
        self.client.get("/")

    @task
    class SubTaskCreate(TaskSet):
        def on_start(self):
            self.lat = random.uniform(-10, 10) + lat
            self.lng = random.uniform(-10, 10) + lng
            # response = self.client.get("/create")
            # print self.lat, self.lng
            self.response = self.client.post(
                                        url="/scene_options_ajax",
                                        json="True",
                                        data={'lat': self.lat, 'lng': self.lng}
                                             )


        @task(3)
        def preview(self):
            json_data = json.loads(self.response.text)
            random_num = random.randint(0, len(json_data['scenes'][0]) - 1)
            # random_url = json_data["scenes"][random_num]["download_url"]
            scene_id = json_data["scenes"][0][random_num]["entityid"]
            # print random_url
            # self.response = self.client.get(random_url)
            rand_band = random.choice(["432", "543", "532"])
            url = "/request_preview/{}".format(scene_id)
            print url
            print rand_band
            self.client.post(url=url, data={'band_combo': rand_band})
            print 'requested preview'

        @task(1)
        def stop(self):
            self.interrupt()

        # soup = BeautifulSoup(self.response.text)


        # def on_start(self):
        #     json_data = json.loads(self.parent.response2.text)
        #     random_num = random.randint(0,
        #                                 len(json_data['scenes_date']) - 1)
        #     random_url = json_data["scenes_date"][random_num]["download_url"]
        #     self.scene_id = json_data["scenes_date"][random_num]["entityid"]
        #     print random_url
        #     self.response = self.client.get(random_url)


class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 500
    max_wait = 1000
