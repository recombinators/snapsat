from locust import HttpLocust, TaskSet, task
from bs4 import BeautifulSoup
import random
import json
lat = 47.614848
lng = -122.3359059


class UserBehavior(TaskSet):
    def on_start(self):
        pass

    @task(1)
    def index(self):
        self.client.get("/")

    # @task(1)
    # def stop(self):
    #     self.interrupt()
    # @task(1)
    # def create(self):
    #     print "create"
    #     self.response = self.client.get("/create")

    @task(3)
    class SubTaskCreate(TaskSet):
        def on_start(self):
            self.response = self.client.get("/create")
            self.lat = lat
            self.lng = lng
            self.response = self.client.post(
                url="/scene_options_ajax",
                json="True",
                data={'lat': self.lat, 'lng': self.lng}
                )

        @task(10)
        def move_map(self):
            self.lat = random.uniform(-10, 10) + self.lat
            self.lng = random.uniform(-10, 10) + self.lng
            print self.lat, self.lng
            self.response = self.client.post(
                url="/scene_options_ajax",
                json="True",
                data={'lat': self.lat, 'lng': self.lng}
                )

        @task(1)
        def stop(self):
            self.interrupt()

        @task(3)
        class Click_link(TaskSet):
            def on_start(self):
                json_data = json.loads(self.parent.response.text)
                random_num = random.randint(0,
                                            len(json_data['scenes_date']) - 1)
                random_url = json_data["scenes_date"][random_num]["download_url"]
                self.scene_id = json_data["scenes_date"][random_num]["entityid"]
                print random_url
                self.response = self.client.get(random_url)

            @task(3)
            def preview(self):
                rand_band = random.choice(["432", "543", "532"])
                print self.scene_id
                self.response = self.client.post(
                                url="/request_preview/{}".format(self.scene_id),
                                json="True",
                                data={'band_combo': rand_band}
                                )
                print 'requested preview'

            @task(1)
            def stop(self):
                self.interrupt()

                # soup = BeautifulSoup(self.response.text)

        # @task(1)
        # def select_scene(self):
        #     # Get url
        #     soup = BeautifulSoup(self.client.get(""))


        #     self.client.get()

        #     @task
        #     def render_preview(self):
        #         self.client.get()

        #     @task
        #     def render_full(self):
        #         self.client.get()


class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 500
    max_wait = 1000
