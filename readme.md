# Web-Apps mit offenen Geodaten

Diese Web-App gibt stellt die Denkmalschutzobjekte Zürichs auf einem Stadtplan von 1900 da. Dieses Anwendungsbeispiel zeigt, wie sich offene Geodaten der Stadt Zürich mit [OpenLayers 3](http://openlayers.org/) in einfache Web-Apps verwandeln lassen. 

Mehr Dazu im zugehörigen Blogpost "Sachen machen mit Open Data und Fidel – Episode 2" im [Open Data Blog](https://www.stadt-zuerich.ch/portal/de/index/ogd/blog.html) von Open Data Zürich.

## Projektstruktur
### index.html
Definiert den Aufbau der Web-App und bindet die benötigten Ressourcen (Libraries, Stylesheet, JavasScript) ein.
### style.css
Definiert das Aussehen (Grösse und Position) der Karte
### map.js
Erstellt einen Container zum anzeigen der Karte und bindet die Hintergrundkarte per WMTS und die Denkmalschutzobjekte als GeoJSON ein.
### libs
Beinhaltet die Benötigten Libraries ([OpenLayers 3](http://openlayers.org/) und [Proj4js](http://proj4js.org/)), sowie das Stylesheet von OpenLayers.