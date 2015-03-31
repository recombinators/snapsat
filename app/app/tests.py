import unittest
import transaction
import os
import app
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep
from pyramid import testing

from .models import DBSession


DEFAULT_WAIT = 5
SCREEN_DUMP_LOCATION = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 'screendumps'
)


class TestMyViewSuccessCondition(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp()

    def tearDown(self):
        DBSession.remove()
        testing.tearDown()

    def test_passing_view(self):
        pass


class TestMyViewFailureCondition(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp()

    def tearDown(self):
        DBSession.remove()
        testing.tearDown()

    def test_failing_view(self):
        pass


class FunctionalTest(unittest.TestCase):

    def setUp(self):
        self.config = testing.setUp()

        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(DEFAULT_WAIT)

    def tearDown(self):
        DBSession.remove()
        testing.tearDown()
        self.browser.quit()


class HomePageTest(FunctionalTest):

    def map_move(self, key_move, repeat=1, sleep_time=.5):
        """Move the map with a repeat and sleep"""
        map_ = self.browser.find_element_by_id("map")
        key_moves = {
            'zoom_in': self.browser.find_element_by_class_name("leaflet-control-zoom-in").click(),
            'zoom_out': self.browser.find_element_by_class_name("leaflet-control-zoom-out").click(),
            'arrow_down': map_.send_keys(Keys.ARROW_DOWN),
            'arrow_right': map_.send_keys(Keys.ARROW_RIGHT),
            'arrow_left': map_.send_keys(Keys.ARROW_LEFT),
            'arrow_up': map_.send_keys(Keys.ARROW_UP),
        }

        for _ in range(repeat):
            key_moves[key_move]
            sleep(sleep_time)

    def test_home_page_loads(self):
        #Billy sees the landsat.club homepage and rejoices.
        self.browser.get('localhost:8000')

        self.map_move('zoom_in', repeat=5)
        self.map_move('arrow_right', repeat=5, sleep_time=.75)


        #zoom_in.click()
        #zoom_in.click()
        #sleep(.5)
        #zoom_in.click()
        #sleep(.75)
        #zoom_in.click()
        #sleep(.75)
        #zoom_in.click()
        #sleep(.5)
        #zoom_in.click()
        #sleep(.5)
        #zoom_in.click()
        #sleep(.5)
        #zoom_in.click()
        #sleep(.5)
        #zoom_in.click()
        #sleep(.5)
        #zoom_in.click()
        #sleep(.75)
        #zoom_in.click()
        #sleep(5)
        #self.browser.find_element_by_class_name('leaflet-control-mapbox-geocoder-toggle').click()
        #self.browser.find_element_by_xpath('//*[@id="map"]/div[2]/div[1]/div[2]/div[2]/form/input').send_keys('10010', Keys.RETURN)
        #
        #
        #sleep(.75)
        #zoom_out.click()
        #sleep(.75)
        #zoom_out.click()
        #sleep(.75)
        #zoom_out.click()
        #sleep(.75)
        #zoom_out.click()
        #
        #sleep(600)
        #
