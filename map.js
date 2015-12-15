// Beispielanwendung basierend auf offenen Geodaten der Stadt Zürich. http://data.stadt-zuerich.ch

// WMTS Daten der Stadt Zürich basieren auf dem Schweizer Koordinatensystem LV03, was der Projektion EPSG:21781 entspricht.
// Zur korrekten Darstellung der Geodaten, muss diese Projektion defineirt werden. Siehe: http://epsg.io/21781
proj4.defs("EPSG:21781", "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs");

// Nachfolgender Code wird ausgeführt, sobald die Webseite vollständig geladen ist.
$(document).ready(function() {

	// Der Variable "map" wird eine neue Instanz von ol.Map zugewiesen. "map" wird damit zum logischen Gegenstück der dargestellten Karte.
	// Mitgegebene Parameter beschreiben die Eigenschaften der Karte.
	var map = new ol.Map({
		// Die Karte wird in das HTML-Element mit der id "map" eingebettet.
		target: 'map',
		// Im "view" wird die Karte angezeigt. Es werden weitere Parameter angegeben.
		view: new ol.View({
			// Als "projection" ist die zuvor definierte Projektion "EPSG:21781" anzugeben.
			projection: ol.proj.get('EPSG:21781'),
			// Die Kartenmitte soll beim Start der Anwendung beim Bellevue liegen.
			// Die Koordinaten [8.545079, 47.366989] beschreiben die Lage des Bellevue im verbreiteten Koordinatensystem WGS84 (Projektion EPSG:4326).
			// Mit der funktion proj4(...) werden diese Koordinaten in die Projektion "EPSG:21781" umgerechnet.
			center: proj4('EPSG:4326', 'EPSG:21781', [8.545079, 47.366989]),
			// Die drei folgenden Parameter beschreiben die Zoomstufe beim Start der Anwendung sowie die niedrigste und höchste Zoomstufe.
			zoom: 17,
			minZoom: 13,
			maxZoom: 20
		}),
	});

	// Die Hintergrundkarte wird per WMTS eingebunden. Dafür müssen dessen Eigenschaften (WMTS-Capabilities) geladen werden.
	// $.get(...) führt einen HTTP-Request auf die angegebene Ressource aus. 
	// Wichtig: Die Seite der Stadt Zürich unterstütz kein CORS (https://de.wikipedia.org/wiki/Cross-Origin_Resource_Sharing).
	// Daher muss die Ressource über einen CORS-Proxy wie http://api.flaneur.io/cors/ geladen werden.
	$.get("http://api.flaneur.io/cors/http://www.gis.stadt-zuerich.ch/wmts/wmts-zh-stzh-ogd.xml").success(function(data) {

		// Sobald die Capabilities erfolgreich geladen wurden, wird der folgende Code ausgeführt.
		// Mit ol.format.WMTSCapabilities().read(data) werden die geladenen Daten eingelesen.
		var capabilities = new ol.format.WMTSCapabilities().read(data)

		// Um die gewünschte Kartenebene zu laden muss die Datenquelle (source) definiert werden. Diese lässt sich mit den eingelesenen Capabilities erstellen. 
		// Angegeben werden muss zusätzlich die gewünschte Kartenebene (layer) und das requestEncoding, für die Karten der Stadt Zürich ist das "REST"
		// Für andere Kartenebenen muss ein anderer "Identifier" angegeben werden. z.B: Stadtplan, Stadtplan_1793, UebersichtsplanAktuell, Luftbild_2011, Luftbild_1976
		var source = ol.source.WMTS.optionsFromCapabilities(capabilities, {
			layer: "Stadtplan_1900",
			requestEncoding: "REST"
		})

		// Jetzt muss in der Anwendung eine neue Kartenebene mit der zuvor definierten "source" erstellt werden.
		var layer = new ol.layer.Tile({
			source: new ol.source.WMTS(source)
		})

		// Dann wird die Ebene der Karte hinzugefügt. Damit ist der WMTS fertig eingebunden und die Karte ist nutzbar.
		map.addLayer(layer)

		// Für die Positionen der Denkmalschutzobjekte wird die entsprechende GeoJSON-Datei vom Open Data Katalog geladen.
		// Auch dafür wird der CORS-Proxy benötigt.
		$.get("http://api.flaneur.io/cors/https://data.stadt-zuerich.ch/storage/f/denkmalschutzobjekt/denkmalschutzobjekt.json").success(function(data) {
			
			// Für die Vektordaten muss eine neue Ebene erstellt werden, die dann über den Stadplan gelegt wird.
			// Dafür braucht es auch hier die Angabe der Datenquelle. In diesem Fall das gerade geladene GeoJSON
			var source = new ol.source.Vector({
				features: (new ol.format.GeoJSON()).readFeatures(data, {
					// Die Punktdaten im GeoJSON sind im Koordinatensystem WGS84 (Projektion EPSG:4326)
					// Für die korrekte Darstellung werden sie mit dem Parameter "featureProjection" beim einlesen in die angegebene Projektion umgerechnet.
					featureProjection: "EPSG:21781"
				})
			})

			// Bei Vektordaten lässt sich definieren, wie die Geodaten dargestellt werden sollen.
			var style = new ol.style.Style({
				// Die Positionen der Denkmalschutzobjekte sollen auf der Karte als violetter Punkt mit einem Radius von 2 Pixeln dargestellt werden.
				image: new ol.style.Circle({
					fill: new ol.style.Fill({
						color: '#A100FF',
					}),
					radius: 2
				})
			});

			// Auch hier wird die Ebene erstellt, neben der Quelle wird jetzt aber auch der definierte Darstellungsstil angegeben.
			var layer = new ol.layer.Vector({
				source: source,
				style: style
			});

			// Abschliessend wird auch diese Ebene der Karte hinzugefügt.
			map.addLayer(layer)
		})
	})
})
// Fertig \o/