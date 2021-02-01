# 📊 InfoVisProject_WS2021 📈
<br/>

## Anzeigen der Visualisierungen
d3.js erfordert das Starten eines Servers. Im Terminal kann hierfür zum Beispiel mit Python ein Server per `python -m SimpleHTTPServer 8080` Befehl im Root Directory des Projektes gestartet werden.
Alternativ kann bei Visual Studio Code eine Extension (Live Server) verwendet werden.

## Projetitel:
Visualisierung der Fallzahlen und Mobilitätsdaten
<br/>

## Ziel
Visualisierungen zu den Auswirkungen der Covid-19-Pandemie auf die Mobilität
<br/>

# Meilensteine:
## Meilenstein 1:
- Themenfindung, Datensichtung und erstes Mock-Up

## Meilenstein 2:
- Vollständige Projektplanung inkl. Mock-Ups

## Meilenstein 3:
- Line Chart mit Corona Daten der jeweiligen Bundesländer

## Meilenstein 4:
- Drop-Down Menü zur Auswahl der anzuzeigenden Monate
- Implementierung einer Deutschlandkarte zur Auswahl der in der Line Chart angezeigten Bundesländer
- Aktualisierung der Line Chart je nach ausgewähltem Monat und Bundesland
- Treemap mit Mobilitätsdaten
- Aktualisierung der Treemap je nach ausgewähltem Monat

## Meilenstein 5:
- Treemaps fertigstellen
- (CSS-)Styling anpassen mit Materialize
- Line Chart: Achsenbeschriftung, Beschriftung der Linien anpassen bzw. eine Legende implementieren
- Pop Ups mit Informationen zu den Abbildungen und Daten 

## Final Solution:
- Fertigstellung
- Anpassung des Stylings
- Bug Fixing
- Dokumentation vervollständingen
- Circular Barplot mit Informationen zu Mobilitätszielen (Kartenabfrage öffentlicher Verkehrsmittel zur Apotheke und Haltestelle pro Bundesland) 

# Featurebeschreibung
## Feature 1: Interaktive Landkarte
- Interaktive Deutschlandkarte mit den 16 Bundesländern
- Auswahl von bis zu 3 Bundesländern per Klick auf die Fläche
- Ausgewählte Bundesländer ändern ihre Farbe auf der Karte
 
## Feature 2: Auswahl des Monats 
- Button für jeden Monat
- März 2020 als Default
- Farbänderung beim Hovern
- ausgewählter Monatsbutton ändert die Farbe

## Feature 3: Line Chart
- Zeigt den Verlauf der COVID-19 Erkrankten für den entsprechenden Monat und das entsprechende Bundesland
- Die auf der Deutschlandkarte ausgewählten und farblich hervorgehobenen Bundesländer werden visualisiert
- Der per Button ausgewählte Monat wird angezeigt
- Die Skalierung der y-Achse passt sich an die Wertebereiche an
- Die x-Achse passt sich an die gefetchten Meldetdaten an. (Zum Beispiel hat Bayern oftmals weniger Meldedaten als Schleswig-Holstein. Werden beide Bundesländer zusammen ausgewählt, wird die x-Achse mit den Meldedaten, die für Bayern verfügbar sind, beschriftet.)

## Feature 4: Treemap
- Die Treemap errechnet einen Monatsdurchschnitt für jeden auswählbaren Monat für alle 16 Bundesländer
- Die Werte repräsentieren das Anfragevolumen nach Apple Routenbeschreibung für Autofahrten
- Die Baseline der Daten ist der 13. Januar 2020
- Sobald ein anderer Monat ausgewählt wird, aktualisiert die Treemap
- Die Einfärbung der einzelnen Bundesländer-Felder ist abhängig von der Prozentzahl. Je höher diese wird, desto dunkler wird das jeweilige Feld.
- über 3 selbsterstellte Icons (Gehen, Auto, öffentliche Verkehrsmittel) wird die Anzeige für das jeweilige Fortbewegungsmittel ergänzt

## Feature 5: Treemap
- Die Treemap errechnet einen Monatsdurchschnitt für jeden auswählbaren Monat für die auf der Deutschlandkarte gewählten Bundesländer
- Die Werte repräsentieren das Anfragevolumen nach Apple Routenbeschreibung für Autofahrten
- Die Baseline der Daten ist der 13. Januar 2020
- Sobald ein anderer Monat ausgewählt wird, aktualisiert die Treemap
- Die Einfärbung der einzelnen Bundesländer-Felder ist abhängig von der Prozentzahl. Je höher diese wird, desto dunkler wird das jeweilige Feld.
- Die zuordnung zum Fortbewegungsmittel erfolgt per selbsterstelltem Icon. Zusätzlich wird die pozuentuale Anzahl abgebildet
- DieGröße des Kästchen entspricht der Ausprägung des Wertes

## Feature 6: Circular Barplot
- Die Mobilitätsziele für Apotheken und Haltestellen werden für jedes Bundesland abgebildet

## Browser:
Getestet in Firefox und Chrome

# technische Dokumentation und Herausfoderungen

## mapGermany.js:

- Recherche zu geojson Dateien und wie diese mithilfe von d3.js visualisiert werden können (Pia)
- Implementieren der Karte (Pia)
- Manuelles Anpassen der Orte, an denen der Name des jeweiligen Bundeslandes in der Darstellung angezeigt wird (Sina)
- Unterschiedliche Farbgebung wenn ein Bundesland per Klick ausgewählt wird (Pia)
- Hinzufügen “selected-bl” bei Auswahl eines Bundeslandes und das Entfernen der Klasse beim Abwählen dessen. So können Veränderungen durch anklicken observiert und Anpassungen der anderen Visualisierungen ausgelöst werden. (Pia)
- Ein Alert wird angezeigt, wenn bereits drei Bundesländer ausgewählt wurden. Nutzertests haben ergeben, dass das Liniendiagramm und die - Treemap bei mehr als drei gleichzeitig ausgewählten Bundesländer zu unübersichtlich wurde. (Pia)
- Manuelle Anpassung der Geojson Datei mithilfe von https://geojson.io/#map=7/48.575/9.701, sodass die Meeresgebiete nicht mehr in der Darstellung angezeigt werden (Pia)
- Änderung des einfach alerts in einen ansprechenden Hinweis (Christina)
- Um die Karte so übersichtlich wie möglich zu gestalten, Entscheidung gegen Beschriftung der Bundesländer und die Beschriftung wieder entfernt (Pia)
- mapGermany.js fungiert als “Single Source of Truth” bezüglich der Farbgebung bei Auswahl der Bundesländer. Die für das Liniendiagramm, die Legende und Fallzahlen zu verwendenden Farben werden in den anderen Dateien mittels getAttribute abgerufen. (Pia)
### Herausforderungen:
- Farbgebung: Es darf keine Farbe gleichzeitig in der Karte verwendet werden. Aus diesem Grund wurde letztendlich ein Array verwendet aus dem die Farben bei Verwendung entfernt und wieder eingefügt werden. (Pia)
- Überlegung, wie getriggert werden kann, welche Bundesländer aktuell ausgewählt sind. Sowie die letztendliche Implementierung, da die jeweiligen Klassen des Bundeslandes extrahiert werden musste und folglich in verschiedenen Arrays gespeichert werden mussten. (Pia)

## main.js

- Einführung der main.js über die die Anwendung zentraler verwaltet werden kann (Christina)
- Initialisierung von Treemaps, Linechart, Deutschlandkarte(Sina, Pia, Christina, Hyerim, Laura)
- Implementierung von Monatsselektion. Über Buttons kann ein Monat ausgewählt werden, welcher die angezeigten Daten entsprechend aktualisiert. (Christina)
- Implementierung des JavaScript “MutationObserver”. Dieser bietet die Möglichkeit Veränderung an dem DOM tree zu überwachen. Es kann spezifiziert werden, dass nur Änderung der Attribute überwacht werden. Somit wird aus der main.js überprüft, welches Bundesland auf der Karte per Klick ausgewählt wurde, da dieses dann die Klasse “selected-bl” erhält. Die angeklickten Bundesländer werden lokal in der main.js in einem Array gespeichert. (Pia)
- Modularer Aufbau der Anwendung und damit die Verwendung von “Import” und “Export” (Christina, Pia)
- Implementierung von Tabs, Tooltips und Info-Dialogen (Christina)
- Hinzufügen der Bevölkerungsdichte der ausgewählten Bundesländer (Christina)
- Debugging der Bevölkerungsdichte nach dem Testen (Pia)
- Implementierung von Checkboxen und Verbindung von main.js für die Auswahl einzelner Bundesländer (Pia)
- Verbindung main.js (Checkbox, Monatsselektion, Mutationobserver) mit treeMapMobilityView.js (Hyerim)
### Herausforderungen:
- Funktionsweise des MutationObservers (Pia)
- Die korrekte Position für Funktionsaufrufe und dementsprechend der Umgang mit asynchronen Funktionen. Es mussten zahlreiche Fehler, die durch die unterschiedliche schnelle Verfügbarkeit von Daten und Visualisierungen entstanden sind, behoben werden. (Pia)
- Unterschiedliche Entwicklungsumgebungen haben gruppenintern ab Verwendung von “Import”/”Export” zu verschiedenen Fehlermeldungen geführt, was das Debuggen erschwerte.

## index.html 
- Verwendung von Materialize-Grid um alle Komponenten responsive zu machen (Christina)
- Verwendung von Materialize Modals um Nutzer Treemap verständlich zu machen (Christina)
- Einbindung von Tabs um zwischen Treemaps zu wechseln (Christina)
### Herausforderung:
sinnvolle Aufteilung aller Komponenten um Daten auf einen Blick sichtbar zu machen
Größenverhältnisse anpassen

## styles.css
- Stringente Farbgebung (Christina)
- Responsive Layout (Christina)
- Highlighting von angeklickten Buttons und Tabs (Christina)

## lineChartView.js

- Recherche zur Fallzahlen-Datenquelle https://hub.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0/geoservice
- Implementierung der Datenabfrage (Christina)
- Erste Implementierung des Liniendiagramms (Christina)
- Responiveness implementiert (Christina)
- Debugging des Prototypens, da die Daten nicht korrekt sortiert abgespeichert wurden (Pia)
- Überarbeitung der live Datenabfrage. Hierbei wurden die Erstellung des Objektes, das die Daten beinhaltet überarbeitet. Es erfolgt eine Datenabfrage für das ausgewählte Bundesland in dem ausgewählten Zeitraum. Die zurückgegebenen Werte müssen aufsummiert und nach Datum sortiert abgespeichert werden. Hierfür wurde die JavaScript Funktion reduce verwendet. Außerdem wurde die Query angepasst, um sie zu beschleunigen. (Pia)
- Darstellung mehrerer ausgewählter Bundesländer gleichzeitig in dem gleichen Diagramm (Pia)
- Die Gesamtanzahl der Fälle pro Bundesland variierten von März 2020 bis Dezember 2020 stark, sodass die Achsen sich entsprechend aktualisieren mussten. Dies führte zu mehreren Szenarien, in denen das Liniendiagramm angepasst werden musste: (Pia)
- Ein Bundesland, das mehr Covid19-Fälle meldete als die bisher dargestellten Bundesländer, wurde hinzugefügt und die y-Achse entsprechend aktualisiert.
- Eben jenes Bundesland wurde wieder abgewählt. Nun musste überprüft werden, welches noch dargestellte Bundesland die höchsten Dimensionen der y-Achse benötigt, um diese zu übernehmen.
- Nur die Linien, der ausgewählten Bundesländer dürfen angezeigt werden.
- Sobald ein anderer Monat ausgewählt wird, aktualisieren sich die Linien der Bundesländer. Damit kann auch die benötigte Dimension der y-Achse variieren und musste ermittelt werden.
- Gruppeninterne Diskussionen zeigten jedoch, dass das Aktualisieren der Achsen innerhalb eines Monats je nach ausgewähltem Bundesland zu einer Täuschung des Nutzers führen könnte. Dementsprechend einigten wir uns darauf, für jeden Monat die gemeldeten Covid19-Infektionen der gesamten Bundesrepublik für das jeweilige Meldedatum als Balkendiagramm mit anzuzeigen. Die Gesamtzahlen legen folglich die Dimensionen der x- und y-Achse fest, was den Code auch deutlich vereinfachte und lesbarer machte. (Pia)
- Das Prinzip des “Single point of truth” wurde auf kleiner Basis inkorporiert, da bis zu dem Zeitpunkt in der lineChartView.js sowie in der main.js Arrays existierten, die die ausgewählten Bundesländer speicherten. Dies führte jedoch zu Fehlverhalten der Anwendung. Im folgenden wurde der ausgewählte Monat und Bundesland nur noch aus der main.js übergeben. (Pia)
- Auslagerung der Datenabfragen-Logik und Formatierung der Daten in getLineChartData.js (Pia)
- Erst zu einem fortgeschrittenen Zeitpunkt kam die Realisierung, dass die Datenquelle nicht die vollständigen Daten zurückgibt. Die Response ist auf eine Rückgabe von 5000 Objekten limitiert. Besonders in Bundesländern mit einer hohen Anzahl an Fällen wie zum Beispiel Bayern ist dies oftmals der Fall gewesen. Ebenso wenn die Fälle nicht gesammelt, sondern einzeln übermittelt wurden. Dies bedingte, dass die Begrenzung von 5000 zurückgegebenen Objekten schnell erreicht war. Die Daten für einen gesamten Monat können somit nicht mithilfe einer Abfrage erfolgen, sondern nur für einzelne Tage, damit das Limit nicht überschritten wird und die tatsächlichen Fälle zurückgegeben werden. Diese kleingranulare Abfrage bedingte jedoch nun Probleme bei langsameren Internetverbindungen.
- Die Berechnung der insgesamt gemeldeten Infektionen in Deutschland betrug in den Herbst- und Wintermonaten bis zu 50 Sekunden (ggf. noch länger bei einer langsameren Internetverbindung). Dies ist deutlich zu lange und kann den Nutzer irritieren, dementsprechend wurde gruppenintern beschlossen, die Daten nicht live abzurufen. Da über einen Großteil des Projekts davon ausgegangen wurde die Daten live abzufragen, entschieden wir uns dazu die Grundstruktur der Applikation nicht zu ändern, sondern mit dataHelperFunctions.js eine Funktion zu schreiben, die die Daten als json Datei herunterladen kann (Pia). Somit kann die Applikation theoretisch live Daten visualisieren, dies ist jedoch bei einer langsamen Internetverbindung nicht gut realisierbar und trat letztendlich außerdem in den Hintergrund, da uns die Mobilitätsdaten nur bis Dezember 2020 vorlagen.
- Implementierung der Interaktivität des Liniendiagramms (Pia)
- - Die Maus verändert sich zum Pointer sobald sie sich über die Rechtecke bewegt.
- - Beim Klick auf ein Rechteck wird das entsprechende Meldedatum ausgewählt.
- - Rechts von dem Liniendiagramm wird die Anzahl der gemeldeten Covid19 Infektionen für das gewählte Datum angezeigt. Zum einen die in der gesamten Bundesrepublik gemeldeten Fälle und entsprechend eingefärbt die der ausgewählten Bundesländer.
- - Wird ein anderes Meldedatum ausgewählt, werden die Fälle aktualisiert.
- - Klickt der Nutzer einen anderen Monat an, wird die Auswahl zurückgesetzt und es kann ein Meldedatum des neuen Monats ausgewählt werden.
- Die Anzahl der durchschnittlich gemeldeten Covid19 Fälle für die gesamte Bundesrepublik und für die ausgewählten Bundesländer wird unterhalb des Liniendiagramms angezeigt und bei einem Wechsel des Monats aktualisiert. (Pia)
### Herausforderung zusammengefasst
- Formatierung der Achsen
- Abfrage der vollständigen Daten

## treeMapMobilityView.js

- Erste Implementierung der TreeMap nach Auswahl der Bundesländer und des Monats (Hyerim)
- Erstellen der arithmetische Funktion des Monatsdurchschnitts nach ausgewählten Regionen und erstellen der map Funktion, sodass der Durchschnittswert mittels Transport berechnet wird  (Hyerim) 
- Aus- und Abwählen der Bundesländer (Hyerim)
- Farbe pro Verkehrsmittel + Opacity + Beschriftung (Sina, Hyerim)
- Hierarchische Strukturierung der Daten für Treemap (Sina)
- Debuggen der für die Treemap erforderlichen Hierarchie (Hyerim, Sina, Laura, Christina, Pia)
- Umschreiben der reduce Funktion, sodass das für die Hierarchie notwendige Objekt korrekt erstellt wird (Pia)
- Icons + Textdarstellung (Sina) 
- Farbe der ausgewählten Bundesländer werden korrekt in der Treemap übernommen (Christina , Sina)
- Responiveness implementiert (Christina)
### Herausforderungen:
- Richtiger Durchschnittswert bekommen (fehlende Daten, unterschiedliche Anzahl von Tagen für jeden Monat etc.)
- Geeignete Hierarchie für die Treemap erstellen (Die Treemapdaten müssen hierarchisch vorhanden sein. Da dies nicht der Fall war musste die Datenstruktur angepasst werden)
- Die Farbe der in der Treemap angezeigten Bundesländer entspricht der ausgewählten Bundesländer der DE-Karte

## treeMapView.js


## Sonstiges

- Anlegen eines remote Repositories in github Pages (Herausforderung: Anpassung der Dokumentstruktur und der Pfade, Security Policy) (Sina)
- Erstellung von Mock Ups mit UX Pin (Christina, Hyerim) (https://preview.uxpin.com/c8ca4a35ba3a0b488e158603b871828d04452121#/pages/134594727/simulate/no-panels?mode=chdm)
- [CARP] Konzeption der Seite mit Miro (Christina, Pia)
- Auswahl der Farben mittels Color Blindness Stimulator (https://www.color-blindness.com/coblis-color-blindness-simulator/) (Hyerim, Christina, Pia, Laura, Sina) 
- Dokumentation (Hyerim, Christina, Pia, Laura, Sina) 
- Erstellen der Präsentation (Hyerim, Christina, Pia, Laura, Sina) 
- Erstellen der finalen Präsentation & Screencast (Sina) 
- Gantt Chart (Sina) 
