from locust import HttpLocust, TaskSet, task
# from bs4 import BeautifulSoup
import random
import json
# import urllib3
# urllib3.disable_warnings()
lat = 47.614848
lng = -122.3359059


class UserBehavior(TaskSet):
    """Class defining snapsat user behavior/tasks."""
    @task(1)
    def index(self):
        """User goes to main page."""
        self.client.get("/")

    @task(1)
    def create(self):
        """User goes to create page."""
        self.client.get("/create")

    @task(5)
    class SubTaskCreate(TaskSet):
        """Class defining user behavior on create page."""
        def on_start(self):
            """Send post request simulating map movement."""
            self.lat = random.uniform(-1, 1) + lat
            self.lng = random.uniform(-1, 1) + lng
            print self.lat, self.lng
            self.response = self.client.post(
                                        url="/scene_options_ajax",
                                        data={'lat': self.lat, 'lng': self.lng}
                                             )

        @task(10)
        def map_move(self):
            """Method defining random map movement."""
            self.lat = random.uniform(-1, 1) + lat
            self.lng = random.uniform(-1, 1) + lng
            self.response = self.client.post(
                                        url="/scene_options_ajax",
                                        data={'lat': self.lat, 'lng': self.lng}
                                             )

        # @task(3)
        # def preview(self):
        #     """Request preview for random scene."""
        #     self.map_move()
        #     json_scenes = json.loads(self.response.text)["scenes"][0]
        #     num_scenes = len(json_scenes) - 1
        #     if num_scenes > 0:
        #         random_num = random.randint(0, num_scenes)
        #         random_url = json_scenes[random_num]["download_url"]
        #         self.client.get(random_url)
        #         scene_id = json_scenes[random_num]["entityid"]
        #         band1, band2, band3 = self.random_bands()
        #         url = "/request_preview/{}".format(scene_id)
        #         self.client.post(url=url, data={'band1': band1,
        #                                         'band2': band2,
        #                                         'band3': band3})

        # @task(2)
        # def full(self):
        #     """Request full render for random scene."""
        #     self.map_move()
        #     json_scenes = json.loads(self.response.text)["scenes"][0]
        #     num_scenes = len(json_scenes) - 1
        #     if num_scenes > 0:
        #         random_num = random.randint(0, num_scenes)
        #         random_url = json_scenes[random_num]["download_url"]
        #         self.client.get(random_url)
        #         scene_id = json_scenes[random_num]["entityid"]
        #         band1, band2, band3 = self.random_bands()
        #         url = "/request_composite/{}".format(scene_id)
        #         self.client.post(url=url, data={'band1': band1,
        #                                         'band2': band2,
        #                                         'band3': band3})

        @task(1)
        def stop(self):
            """Stop class."""
            self.interrupt()

        def random_bands(self):
            """Return 3 random bands (non-repeating) from possible bands."""
            choices = [1, 2, 3, 4, 5, 6, 7, 9]
            return random.sample(choices, 3)


class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 1500
    max_wait = 5000
