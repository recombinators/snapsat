Landsat 8 band recombinations in the browser.

![](http://media.giphy.com/media/Yi4aazIAtbPQA/giphy.gif)


### Acquiring data

- [Libra](http://libra.developmentseed.org/) - [Repo](https://github.com/AstroDigital/libra)
- [developmentseed/landsat-api](https://github.com/developmentseed/landsat-api)
- [developmentseed/landsat-util](https://github.com/developmentseed/landsat-util)
- [Landsat on AWS](https://aws.amazon.com/blogs/aws/start-using-landsat-on-aws/)
- [USGS Earth Explorer](http://earthexplorer.usgs.gov/)
- [NASA Worldview](https://earthdata.nasa.gov/labs/worldview/)
- [LatLongtoWRS](https://github.com/robintw/LatLongToWRS)


### Getting yourself setup

If you expect to be working with or manipulating any of the geospatial datasets, make sure to install the following:

```
brew tap osgeo/osgeo4mac
brew install gdal --enable-unsupported --with-postgres
brew install imagemagick
brew install qgis-28
```

__GDAL__ provides a set of tools (notably, `ogr2ogr` for working with and scripting geospatial files. __Imagemagick__ provides you with tools for manipulating image files. __QGIS__ is an opensource, GUI, swiss army knife for working with anything geospatial.

Got questions? [Go here](- [Installing opensource geo software](https://github.com/nvkelso/geo-how-to/wiki/Installing-Open-Source-Geo-Software:-Mac-Edition).


### Working with the data

Learn about some common Landsat band recombinations [here](http://blogs.esri.com/esri/arcgis/2013/07/24/band-combinations-for-landsat-8/). __543__ and __564__ seem particularly compelling. Mapbox has an excellent [guide on Processing Satellite Imagery](https://www.mapbox.com/foundations/processing-satellite-imagery), which is something we'll need to do.

Here are some nice guides on using GDAL:

- [GDAL cheatsheet](<https://github.com/dwtkns/gdal-cheat-sheet>)
- [Dan's GDAL scripts](https://github.com/gina-alaska/dans-gdal-scripts)
- [Pansharpening Landsat 7 with Dan's scripts](http://blog.remotesensing.io/2013/04/pansharpening-using-a-handy-gdal-tool)	
- [Convert Landsat 8 GeoTIFF images into RGB pan-sharpened JPEGs](https://gist.github.com/briantjacobs/48320e59954ee7ec5cd1)
- [Charlie Lloyd's Rake Task](https://gist.github.com/briantjacobs/0d3f9a62fc7ca115ee5b)

This might all seem overwhelming, but we'll only be using a small subset of the functionality that has been described, and once we get a solid script that does what we want, we won't need to touch it again.


### Telling a story

Lots of directions to go here. Some interesting tools.

- [D3 Image intensity histogram](http://bl.ocks.org/jinroh/4666920)
- [JuxtaposeJS](http://juxtapose.knightlab.com)
- [Leaflet](http://leafletjs.com)
- [Leaflet.Sync](https://github.com/turban/Leaflet.Sync)
- [Turf](https://www.mapbox.com/developers/turf/)


![](https://cloud.githubusercontent.com/assets/1131098/5263449/860f9836-7a31-11e4-8c6a-9ac8cd0cdcb1.gif)

### Resources

- [Lightning talk](http://bl.ocks.org/anonymous/raw/6118ab44b51c195ed99d/#0)
