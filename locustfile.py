from locust import HttpLocust, TaskSet, task
from bs4 import BeautifulSoup
from requests import Session
import random


class UserBehavior(TaskSet):
    def on_start(self):
        pass

    @task
    def index(self):
        self.client.get("/")

    @task
    def move_map(self):
        lat = random.uniform(-1, 1)
        lon = random.uniform(-1, 1)
        response = self.client.post(
            url="/ajax",
            data={'lat': lat, 'lng': lng,}
            )

        self.client.get("")

        @task
        def select_scene(self):
            # Get url
            soup = BeautifulSoup(self.client.get(""))


            self.client.get()

            @task
            def render_preview(self):
                self.client.get()

            @task
            def render_full(self):
                self.client.get()


class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 1000
    max_wait = 5000
