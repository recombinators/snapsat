import unittest
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep
from pyramid import testing

from .models import Session


DEFAULT_WAIT = 5
SCREEN_DUMP_LOCATION = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 'screendumps'
)


class TestMyViewSuccessCondition(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp()

    def tearDown(self):
        Session.remove()
        testing.tearDown()

    def test_passing_view(self):
        pass


class TestMyViewFailureCondition(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp()

    def tearDown(self):
        Session.remove()
        testing.tearDown()

    def test_failing_view(self):
        pass


class FunctionalTest(unittest.TestCase):

    def setUp(self):
        self.config = testing.setUp()

        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(DEFAULT_WAIT)

    def tearDown(self):
        Session.remove()
        testing.tearDown()
        self.browser.quit()


class HomePageTest(FunctionalTest):

    def zoom_in(self, repeat=1, sleep_time=1):
        for _ in range(repeat):
            (self.browser.find_element_by_class_name(
                "leaflet-control-zoom-in").click()
            )
            sleep(sleep_time)

    def zoom_out(self, repeat=1, sleep_time=1):
        for _ in range(repeat):
            (self.browser.find_element_by_class_name(
                "leaflet-control-zoom-out").click()
            )
            sleep(sleep_time)

    def arrow_down(self, repeat=1, sleep_time=1):
        for _ in range(repeat):
            self.browser.find_element_by_id("map").send_keys(Keys.ARROW_DOWN)
            sleep(sleep_time)

    def arrow_right(self, repeat=1, sleep_time=1):
        for _ in range(repeat):
            self.browser.find_element_by_id("map").send_keys(Keys.ARROW_RIGHT)
            sleep(sleep_time)

    def arrow_left(self, repeat=1, sleep_time=1):
        for _ in range(repeat):
            self.browser.find_element_by_id("map").send_keys(Keys.ARROW_LEFT)
            sleep(sleep_time)

    def arrow_up(self, repeat=1, sleep_time=1):
        for _ in range(repeat):
            self.browser.find_element_by_id("map").send_keys(Keys.ARROW_UP)
            sleep(sleep_time)

    # Tests here
    def test_home_page_loads(self):
        #Billy sees the landsat.club homepage and rejoices. Clicking ensues.
        self.browser.get('localhost:8000')

        self.zoom_out(repeat=5, sleep_time=.5)
        self.arrow_right(repeat=5, sleep_time=.2)
        self.arrow_down(repeat=3, sleep_time=.2)

        self.browser.find_element_by_class_name(
            'leaflet-control-mapbox-geocoder-toggle').click()

        map_input_form = '//*[@id="map"]/div[2]/div[1]/div[2]/div[2]/form/input'
        (self.browser.find_element_by_xpath(map_input_form)
         .send_keys('10010', Keys.RETURN)
        )

        sleep(.75)
        self.zoom_out(repeat=3)

        self.assertIn('Snapsat', self.browser.page_source)
