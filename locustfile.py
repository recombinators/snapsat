from locust import HttpLocust, TaskSet, task


class UserBehavior(TaskSet):
    tasks = []

    def on_start(self):
        pass

    @task
    def index(self):
        self.client.get("/")

    @task
    def move_map(self):
        self.client.get("")

    @task
    def select_scene(self):
        # Get url


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
