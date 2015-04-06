from locust import HttpLocust, TaskSet, task
from bs4 import BeautifulSoup
from requests import Session
import random
lat = 47.614848
lng = -122.3359059


class UserBehavior(TaskSet):
    def on_start(self):
        pass

    @task
    def index(self):
        self.client.get("/")

    @task
    def create(self):
        response = self.client.get("/create")

        @task(5)
        def move_map(self):
            lat = random.uniform(-1, 1) + lat
            lng = random.uniform(-1, 1) + lng

            response = self.client.post(
                url="/ajax",
                json="True",
                data={'lat': lat, 'lng': lng}
                )

            self.client.get("")

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
    min_wait = 1000
    max_wait = 5000
