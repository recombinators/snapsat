[![Build Status](https://travis-ci.org/recombinators/landsat.svg)](https://travis-ci.org/recombinators/landsat)

**[Snapsat](http://snapsat.org/)**, an opensource webapp that makes it easy to create custom Landsat band composites in a browser.

![](https://cldup.com/RTFc6FzfcU-2000x2000.png)

What Snapsat does
-----------------

The cost of working with Landsat has dropped incredibly fast over the last year. Projects like [AWS's Landsat bucket](https://aws.amazon.com/blogs/aws/start-using-landsat-on-aws/), [Developmentseed's](http://developmentseed.org)  [landsat-util](https://github.com/developmentseed/landsat-util), and [Libra](http://libra.developmentseed.org/) have all helped to drive down both the technical and temporal requirements.

We wanted to take it one step further, and make it possible for anyone to quickly create custom Landsat band composites without needing to install of the software traditionally required. [Check it out](http://snapsat.org/), [let us know what you think](https://github.com/recombinators/landsat/issues).

How Snapsat is built
--------------------

At it's core, Snapsat is a [Pyramid](http://docs.pylonsproject.org/projects/pyramid/en/latest/index.html) powered web interface to [landsat-util](https://github.com/developmentseed/landsat-util). Data is sourced exclusively from the [AWS Public Landsat dataset](https://aws.amazon.com/public-data-sets/landsat/), piped from an S3 bucket to EC2, processed with landsat-util, and piped back to a Cloudfront-backed S3 bucket. In between, there's a significant amount of querying and messaging happening with RDS and SQS. 

In addition to powering the majority of our stack, Amazon generously provided us with the credits required to get things running. If you apprecaite this project, make sure to thank [Jed](https://twitter.com/jedsundwall).

Contributing
------------

There are a number of ways to contribute.

1. Make something awesome with it.
2. Share it. If you know someone that might find Snapsat useful, please let them know!
3. Review our code. We'd love feedback. This project began as our final project at [CodeFellows](https://www.codefellows.org/). We're proud of it, but we're well aware that there are improvements that could be made. __Feedback is welcome and encouraged.__
4. Submit a Pull Request.

See Also
--------

- [When the Earth Began Looking at Itself: the Landsat Program](http://socks-studio.com/2013/07/22/when-the-earth-began-looking-at-itself-the-landsat-program/)
- [Putting Landsat 8's Bands to work](https://www.mapbox.com/blog/putting-landsat-8-bands-to-work/)
- [The Many Band Combinations of Landsat 8](http://www.exelisvis.com/Company/PressRoom/Blogs/TabId/836/ArtMID/2928/ArticleID/14305/The-Many-Band-Combinations-of-Landsat-8.aspx)
