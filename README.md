# 📊 InfoVisProject_WS2021 📈
<br/>

## Anzeigen der Visualisierungen
https://sinaschnebelt.github.io/src/

Alternativ kann die Anwendung auch lokal verwendet werden. d3.js erfordert das Starten eines Servers. Im Terminal kann hierfür zum Beispiel mit Python ein Server per `python -m SimpleHTTPServer 8080` Befehl im Root Directory des Projektes gestartet werden.
Desweiteren kann bei Visual Studio Code eine Extension (Live Server) verwendet werden.

## Projektitel:
Auswirkungen der Covid-19 Pandemie auf die Mobilität 2020
<br/>

## Ziel
Visualisierungen zu den Auswirkungen der Covid-19-Pandemie auf die Mobilität von März bis Dezember 2020
<br/>

# Meilensteine:
## Meilenstein 1:
- Themenfindung, Datensichtung und erstes Mock-Up

## Meilenstein 2:
- Vollständige Projektplanung inkl. Mock-Ups

## Meilenstein 3:
- Liniendiagramm mit Corona-Daten der jeweiligen Bundesländer

## Meilenstein 4:
- Drop-Down Menü zur Auswahl der anzuzeigenden Monate
- Implementierung einer Deutschlandkarte zur Auswahl der in der Liniendiagramm angezeigten Bundesländer
- Aktualisierung der Liniendiagramm je nach ausgewähltem Monat und Bundesland
- Treemap mit Mobilitätsdaten
- Aktualisierung der Treemap je nach ausgewähltem Monat

## Meilenstein 5:
- Treemaps fertigstellen
- (CSS-)Styling anpassen mit Materialize
- Liniendiagramm: Achsenbeschriftung, Beschriftung der Linien anpassen bzw. eine Legende implementieren
- Pop Ups mit Informationen zu den Abbildungen und Daten 

## Final Solution:
- Fertigstellung
- Anpassung des Stylings
- Bug Fixing
- Dokumentation vervollständingen
- Radiales Balkendiagramm mit Informationen zu Mobilitätszielen (Kartenabfrage öffentlicher Verkehrsmittel zu Apotheken und Haltestellen pro Bundesland) 

# Featurebeschreibung
## Feature 1: Interaktive Landkarte
- Interaktive Deutschlandkarte mit den 16 Bundesländern
- Auswahl von bis zu 3 Bundesländern per Klick auf die Fläche
- Ausgewählte Bundesländer ändern ihre Farbe auf der Karte
- Datenquelle: http://opendatalab.de/projects/geojson-utilities/

## Feature 2: Anzeigen der Bevölkerungsdichte
- Die Bevölkerungsdichte der ausgewählten Bundesländer wird unter der Karte angezeigt
- Abhängig davon, welches Bundesland ausgewählt wurde aktualisiert sie sich
- Die Einfärbung entspricht der Farbe des Bundeslandes in der Karte
- Datenquelle: http://www.statistikportal.de/de/bevoelkerung/flaeche-und-bevoelkerung
 
## Feature 3: Auswahl des Monats 
- Button für jeden Monat
- März 2020 als Default
- Farbänderung beim Hovern
- Der ausgewählte Button ändert seine Farbe

## Feature 4: Liniendiagramm
- Zeigt den Verlauf der COVID-19 Erkrankten für den entsprechenden Monat und das entsprechende Bundesland
- Die insgesamt in Deutschland gemeldeten Covid19-Fälle werden als Balken dargestellt
- Die auf der Deutschlandkarte ausgewählten und farblich hervorgehobenen Bundesländer werden visualisiert
- Der per Button ausgewählte Monat wird angezeigt
- Die Skalierung der y-Achse passt sich an die deutschlandweit gemeldeten Covid19-Fälle an
- Die x-Achse passt sich an die Meldetdaten an
- Die Einfärbung der Linien entspricht der Farbe des Bundeslandes in der Deutschlandkarte
- Unter der Liniendiagramm wird der Monatsdurchschnitt an gemeldeten Infektionen pro Tag für die gesamte Bundesrepublik und die ausgewählten Bundesländer abgebildet
- Klickt man auf einen Balken färbt sich dieser ein. Neben der Liniendiagramm erscheinen die an dem ausgewählten Tag gemeldeten Infektionen für Deutschland und das jeweilige Bundesland
- Datenquelle: https://hub.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0/geoservice

## Feature 5: Treemap (Deutschland)
- Die Treemap errechnet einen Monatsdurchschnitt für jeden auswählbaren Monat für alle 16 Bundesländer
- Die Werte repräsentieren das Anfragevolumen nach Apple Routenbeschreibung für Autofahrten
- Die Baseline der Daten ist der 13. Januar 2020
- Sobald ein anderer Monat ausgewählt wird, aktualisiert die Treemap
- Die Einfärbung der einzelnen Bundesländer-Felder ist abhängig von der Prozentzahl. Je höher diese wird, desto dunkler wird das jeweilige Feld.
- über 3 selbsterstellte Icons (Gehen, Auto, öffentliche Verkehrsmittel) wird die Anzeige für das jeweilige Fortbewegungsmittel ergänzt
- Datenquelle: https://covid19.apple.com/mobility

## Feature 6: Treemap (Bundesland)
- Die Treemap errechnet einen Monatsdurchschnitt für jeden auswählbaren Monat für die auf der Deutschlandkarte gewählten Bundesländer
- Sobald Bundesländer (ab)gewählt werden, aktualisiert sich die Treemap
- Die Werte repräsentieren das Anfragevolumen nach Apple Routenbeschreibung für Autofahrten
- Die Baseline der Daten ist der 13. Januar 2020
- Sobald ein anderer Monat ausgewählt wird, aktualisiert die Treemap
- Die Einfärbung der einzelnen Bundesländer-Felder ist abhängig von der Prozentzahl. Je höher diese wird, desto dunkler wird das jeweilige Feld.
- Die zuordnung zum Fortbewegungsmittel erfolgt per selbsterstelltem Icon. Zusätzlich wird die pozuentuale Anzahl abgebildet
- Die Größe der Kästchen entspricht der Ausprägung des Wertes
- Datenquelle: https://covid19.apple.com/mobility

## Feature 7: Radiales Balkendiagramm
- Das radiale Balkendiagramm veranschaulicht die Google-Maps Anfragen nach Wegbeschreibungen für verschiedene Mobilitätsziele wie beispielsweise Apotheken oder Bahnhöfe und Haltstestellen
- Die dargestellten Mobilitätsziele beinhalten Haltestellen und Apotheken
- Bildet alle 16 Bundesländer gleichzeitig ab
- Neben dem Barplot befindet sich eine Legende
- Datenquelle: https://www.google.com/covid19/mobility/?hl=de

## Browser:
Getestet in Firefox und Chrome

# Technische Dokumentation und Herausfoderungen

## index.html 
- Verwendung von Materialize-Grid um alle Komponenten responsive zu machen (Christina)
- Verwendung von Materialize Modals um Nutzer Treemap verständlich zu machen (Christina)
- Einbindung von Tabs um zwischen Treemaps zu wechseln (Christina)
### Herausforderung:
- Sinnvolle Aufteilung aller Komponenten, um die Daten auf einen Blick sichtbar zu machen
- Das Anpassen der Größenverhältnisse

## styles.css
- Stringente Farbgebung (Christina)
- Responsive Layout (Christina)
- Highlighting von angeklickten Buttons und Tabs (Christina)

## main.js
- Einführung der main.js über die die Anwendung zentraler verwaltet werden kann (Christina)
- Modularer Aufbau der Anwendung und damit die Verwendung von “Import” und “Export” (Christina, Pia)
- Initialisierung von Treemaps, Linechart, Deutschlandkarte (Sina, Pia, Christina, Hyerim, Laura)
- Implementierung der Monatsselektion. Über Buttons kann ein Monat ausgewählt werden, welcher die angezeigten Daten entsprechend aktualisiert. (Christina)
- Implementierung des JavaScript “MutationObserver”. Dieser bietet die Möglichkeit Veränderung an dem DOM tree zu überwachen. Es kann spezifiziert werden, dass nur Änderung der Attribute überwacht werden. Somit wird aus der main.js überprüft, welches Bundesland auf der Karte per Klick ausgewählt wurde. Die ausgewählten Bundesländer erhalten die Klasse “selected-bl”. Die angeklickten Bundesländer werden lokal in der main.js in einem Array gespeichert. (Pia)
- Implementierung von Tabs, Tooltips und Info-Dialogen (Christina)
- Hinzufügen der Bevölkerungsdichte der ausgewählten Bundesländer (Christina)
- Debugging der Bevölkerungsdichte nach dem Testen (Pia)
- Implementierung von Checkboxen und Verbindung von main.js für die Auswahl einzelner Bundesländer (Pia)
- Verbindung main.js (Checkbox, Monatsselektion, Mutationobserver) mit treeMapMobilityView.js (Hyerim)
### Herausforderungen:
- Funktionsweise des MutationObservers (Pia)
- Die korrekte Position für Funktionsaufrufe und dementsprechend der Umgang mit asynchronen Funktionen. Es mussten zahlreiche Fehler, die durch die unterschiedliche schnelle Verfügbarkeit von Daten und Visualisierungen entstanden sind, behoben werden. (Pia)
- Unterschiedliche Entwicklungsumgebungen haben gruppenintern ab Verwendung von “Import”/”Export” zu verschiedenen Fehlermeldungen geführt, was das Debuggen erschwerte.


## mapGermany.js:

- Recherche zu geojson Dateien und wie diese mithilfe von d3.js visualisiert werden können (Pia)
- Implementieren der Karte (Pia)
- Manuelles Anpassen der Orte, an denen der Name des jeweiligen Bundeslandes in der Darstellung angezeigt wird (Sina)
- Unterschiedliche Farbgebung wenn ein Bundesland per Klick ausgewählt wird (Pia)
- Hinzufügen “selected-bl” bei Auswahl eines Bundeslandes und das Entfernen der Klasse beim Abwählen dessen. So können Veränderungen durch Anklicken observiert und Anpassungen der anderen Visualisierungen ausgelöst werden. (Pia)
- Ein Alert wird angezeigt, wenn bereits drei Bundesländer ausgewählt wurden. Nutzertests ergaben zuvor, dass das Liniendiagramm und die - Treemap bei mehr als drei gleichzeitig ausgewählten Bundesländer zu unübersichtlich wurde. (Pia)
- Manuelle Anpassung der Geojson Datei mithilfe von https://geojson.io/#map=7/48.575/9.701, sodass die Meeresgebiete nicht mehr in der Darstellung angezeigt werden (Pia)
- Änderung des einfach alerts in einen ansprechenden Hinweis (Christina)
- Entfernung der Bundesland-Beschriftung, um die Karte so übersichtlich wie möglich zu gestalten (Pia)
- mapGermany.js fungiert als “Single Source of Truth” bezüglich der Farbgebung der Bundesländer in der Legende, im Liniendiagramm und in den Treempas. Die für das Liniendiagramm, die Legende und Fallzahlen zu verwendenden Farben werden in den anderen Dateien mittels getAttribute abgerufen. (Pia)
- Styling der Landkarte (Pia)
### Herausforderungen:
- Farbgebung: Es darf keine Farbe gleichzeitig in der Karte verwendet werden. Aus diesem Grund wurde letztendlich ein Array verwendet, aus dem die Farben bei Verwendung entfernt und wieder eingefügt werden. 
- Überlegung, wie getriggert werden kann, welche Bundesländer aktuell ausgewählt sind. Sowie die letztendliche Implementierung, da die jeweiligen Klassen des Bundeslandes extrahiert und folglich in verschiedenen Arrays gespeichert werden mussten. 

## lineChartView.js

- Recherche zur Fallzahlen-Datenquelle (Hyerim, Sina, Christina, Laura, Pia)
- Implementierung der Datenabfrage (Christina)
- Erste Implementierung des Liniendiagramms (Christina)
- Responiveness implementiert (Christina)
- Debugging des Prototypens, da die Daten nicht korrekt sortiert abgespeichert wurden (Pia)
- Überarbeitung der live Datenabfrage. Hierbei wurden die Erstellung des Objektes, das die Daten beinhaltet überarbeitet. Es erfolgt eine Datenabfrage für das ausgewählte Bundesland in dem ausgewählten Zeitraum. Die zurückgegebenen Werte müssen aufsummiert und nach Datum sortiert abgespeichert werden. Hierfür wurde die JavaScript Funktion reduce verwendet. Außerdem wurde die Query angepasst, um sie zu beschleunigen. (Pia)
- Darstellung mehrerer ausgewählter Bundesländer gleichzeitig in dem Diagramm (Pia)
- Die Gesamtanzahl der Fälle pro Bundesland variierten von März 2020 bis Dezember 2020 stark, sodass die Achsen sich entsprechend aktualisieren mussten. Dies führte zu mehreren Szenarien, in denen das Liniendiagramm angepasst werden musste: (Pia)
  - Ein Bundesland, das mehr Covid19-Fälle meldete als die bisher dargestellten Bundesländer, wurde hinzugefügt und die y-Achse entsprechend aktualisiert.
  - Eben jenes Bundesland wurde wieder abgewählt. Nun musste überprüft werden, welches noch dargestellte Bundesland die höchsten Dimensionen der y-Achse benötigt, um diese zu übernehmen.
  - Nur die Linien, der ausgewählten Bundesländer dürfen angezeigt werden.
  - Sobald ein anderer Monat ausgewählt wird, aktualisieren sich die Linien der Bundesländer. Damit kann auch die benötigte Dimension der y-Achse variieren und musste ermittelt werden.
- Gruppeninterne Diskussionen zeigten jedoch, dass das Aktualisieren der Achsen innerhalb eines Monats je nach ausgewähltem Bundesland zu einer Täuschung des Nutzers führen könnte. Dementsprechend einigten wir uns darauf, für jeden Monat die gemeldeten Covid19-Infektionen der gesamten Bundesrepublik für das jeweilige Meldedatum als Balkendiagramm mit anzuzeigen. Die Gesamtzahlen legen folglich die Dimensionen der x- und y-Achse fest, was den Code auch deutlich vereinfachte und lesbarer machte. (Pia)
- Das Prinzip des “Single point of truth” wurde auf kleiner Basis inkorporiert, da bis zu dem Zeitpunkt in der lineChartView.js sowie in der main.js Arrays existierten, die die ausgewählten Bundesländer speicherten. Dies führte jedoch zu Fehlverhalten der Anwendung. Im folgenden wurde der ausgewählte Monat und Bundesland nur noch aus der main.js übergeben. (Pia)
- Auslagerung der Datenabfragen-Logik und Formatierung der Daten in getLineChartData.js (Pia)
- Implementierung der Interaktivität des Liniendiagramms (Pia)
  - Die Maus verändert sich zum Pointer sobald sie sich über die Rechtecke bewegt.
  - Beim Klick auf ein Rechteck wird das entsprechende Meldedatum ausgewählt.
  - Rechts von dem Liniendiagramm wird die Anzahl der gemeldeten Covid19 Infektionen für das gewählte Datum angezeigt. Zum einen die in der gesamten Bundesrepublik gemeldeten Fälle und entsprechend eingefärbt die der ausgewählten Bundesländer.
  - Wird ein anderes Meldedatum ausgewählt, werden die Fälle aktualisiert.
  - Klickt der Nutzer einen anderen Monat an, wird die Auswahl zurückgesetzt und es kann ein Meldedatum des neuen Monats ausgewählt werden.
- Die Anzahl der durchschnittlich gemeldeten Covid19 Fälle für die gesamte Bundesrepublik und für die ausgewählten Bundesländer wird unterhalb des Liniendiagramms angezeigt und bei einem Wechsel des Monats aktualisiert. (Pia)
- Styling des Liniendiagramms (Achsenbeschriftung, Formatierung des ersten und letzten Balkens, damit sie die x-Achse nicht überschreiten) (Pia)
### Herausforderung 
- Formatierung der Achsen inkl. Speicherung des erforderlichen Wertebereichs
- Abfrage der vollständigen Daten und die Erstellung eines Objektes, das die Daten beinhaltet
- Asynchrone Funktionen 
- Styling des Liniendiagramms
- Erst zu einem fortgeschrittenen Zeitpunkt kam die Realisierung, dass die Datenquelle nicht die vollständigen Daten zurückgibt. Die Response ist auf eine Rückgabe von 5000 Objekten limitiert. Besonders in Bundesländern mit einer hohen Anzahl an Fällen wie zum Beispiel Bayern ist dies oftmals der Fall gewesen. Dies bedingte, dass die Begrenzung von 5000 zurückgegebenen Objekten schnell erreicht war. Die Daten für einen gesamten Monat können somit nicht mithilfe einer Abfrage erfolgen, sondern nur für einzelne Tage, damit das Limit nicht überschritten wird und die tatsächlichen Fälle zurückgegeben werden. Diese kleingranulare Abfrage bedingte jedoch nun Probleme bei langsameren Internetverbindungen. Die Berechnung der insgesamt gemeldeten Infektionen in Deutschland betrug in den Herbst- und Wintermonaten bis zu 50 Sekunden (ggf. noch länger bei einer langsameren Internetverbindung). Dies ist deutlich zu lange und kann den Nutzer irritieren, dementsprechend wurde gruppenintern beschlossen, die Daten nicht live abzurufen. Da über einen Großteil des Projekts davon ausgegangen wurde die Daten live abzufragen, entschieden wir uns dazu die Grundstruktur der Applikation nicht zu ändern, sondern mit dataHelperFunctions.js eine Funktion zu schreiben, die die Daten als json Datei herunterladen kann. Somit kann die Applikation theoretisch live Daten visualisieren, dies ist jedoch bei einer langsamen Internetverbindung nicht gut realisierbar und trat letztendlich außerdem in den Hintergrund, da uns die Mobilitätsdaten nur bis Dezember 2020 vorlagen.

## treeMapMobilityView.js

- Erste Implementierung der TreeMap nach Auswahl der Bundesländer und des Monats (Hyerim)
- Erstellen der arithmetische Funktion des Monatsdurchschnitts nach ausgewählten Regionen und erstellen der map Funktion, sodass der Durchschnittswert mittels Transport berechnet wird  (Hyerim) 
- Aus- und Abwählen der Bundesländer (Hyerim)
- Farbe pro Verkehrsmittel inkl. Opacity und Beschriftung (Sina, Hyerim)
- Hierarchische Strukturierung der Daten für Treemap (Sina)
- Debuggen der für die Treemap erforderlichen Hierarchie (Hyerim, Sina, Laura, Christina, Pia)
- Umschreiben der reduce Funktion, sodass das für die Hierarchie notwendige Objekt korrekt erstellt wird (Pia)
- Icons und Textdarstellung (Sina) 
- Farbe der ausgewählten Bundesländer werden korrekt in der Treemap übernommen (Christina, Sina)
- Responiveness implementiert (Christina)
### Herausforderungen:
- Die korrekten Durchschnittswerte errechnen (fehlende Daten, unterschiedliche Anzahl von Tagen für jeden Monat etc.)
- Geeignete Hierarchie für die Treemap erstellen (Die Treemapdaten müssen hierarchisch vorhanden sein. Da dies nicht der Fall war musste die Datenstruktur angepasst werden)
- Die Farbe der in der Treemap angezeigten Bundesländer entspricht der ausgewählten Bundesländer der DE-Karte

## treeMapView.js
- Auswahl einer geeigneter Datenquelle für die Treemap, welche Streckenanfragen für jedes Bundesland und verschiedene Transportmittel (Auto, Fußweg, Öffentlicher Nahverkehr) anzeigt (Laura)
- Anpassung der CSV (Vorfiltern und Anpassung der Sprache) (Laura)
- Konversion des Datumsformats, welches aus der main.js übergeben wird (nach Userauswahl), in den darzustellenden Monat der Treemap (Laura)
- Implementierung der TreeMap nach Auswahl der Bundesländer und des Monats (Laura)
- Implementierung einer ersten Farbskalierung, sodass sich die Farbe eines Rechtecks je nach Prozentwert ändert (Laura)
- Erstellen der arithmetischen Funktion des Monatsdurchschnitts nach ausgewählten Regionen und Transportmitteln sowie Erstellen der map Funktion, sodass der Durchschnittswert mittels Bundesland berechnet wird  (Laura) 
- Korrektes Labelling der Werte zu den einzelnen Bundesländern (Laura)
- Responsiveness implementiert (Christina)
- Erstellung der Icons (Laura)
### Herausforderungen:
- Jeder Datensatz zeigte ursprünglich die Prozentwerte der Nutzung eines Transportmittels je Bundesland zu verschiedenen Tagen an. Einige Datensätzen hatten fehlende Werte bei einzelnen Tagen und für den öffentlichen Nahverkehr als Transportmittel waren nur Datensätze zu insgesamt 11 Bundesländern vorhanden. Zu beachten war außerdem, dass verschiedene Monate eine unterschiedliche Anzahl an Tagen haben. Somit war es eine Herausforderung eine geeignete Verschachtelung mehrerer Schleifen zu finden, um die Daten je Bundesland und Transportmittel zu aggregieren und für jedes Bundesland und jeden Monat einen Divisor zu speichern, welcher anschließend den korrekten Durchschnittswert errechnet. 
- Richtiger Durchschnittswert bekommen (fehlende Daten, unterschiedliche Anzahl von Tagen für jeden Monat etc.)
- d3.js bietet keine automatisierte Funktion, welche Zeilenumbrüche bei zu langen Textfeldern einfügt oder sicherstellt, dass Text nicht über ein “rect”-Feld hinausragt. Lediglich mit “textlength” kann der Text entsprechend gestaucht oder durch Leerzeichen entsprechend gestreckt werden, dass er genau an die Größe des umhüllenden tspan-Elements passt, dies war jedoch visuell eine Verschlechterung. Es musste somit eine Funktion implementiert werden, welche die Bundesländer mit Bindestrichen in mehrere Substrings unterteilt und diese dann einzeln anfügt. 
- Geeignete Hierarchie für die Treemap erstellen

## circularBarplotView.js
- Auswahl der Datenquelle, welche Daten zu verschiedenen Mobilitätszielen für jedes Bundesland anzeigt. (Laura)
- Einlesen der Daten und Implementieren einer arithmetischen Funktion, sodass statt ursprünglich tagesbezogenen Prozentwerten ein monatlicher Durchschnittswert berechnet wird. Aufbereiten der Daten in einem Array, sodass diese von der d3.js stack()-Funktion verarbeitet werden können. (Laura)
- Erstellung des d3.js Code-Grundgerüsts für das radiale Balkendiagramm. (Laura, Pia)
- Implementierung der Anzeige-Funktionalität von den “gestapelten” Werten auf dem Barplot sowie umfassende Ursachenanalyse von möglichen Fehldarstellungen und anschließende Behebung dieser. (Pia)
- Labelling der Bundesländer, Implementierung der Legende zu den Mobilitätszielen und Styling. (Pia)
- Finale Formatierung und Ausrichtung der einzelnen Elemente zueinander, Parametrisierung der x-, y- und z-Achse sowie Auswahl der Farbgestaltung, sodass der Barplot sich harmonisch zu den vorhanden Visualiserungen einfügt. (Pia)
- Responsiveness des radialen Balkendiagramms (Christina)
### Herausforderungen
- Eine dreistufige Schachtelung der Daten nach einzelnen Bundesländern, Monaten und Kategorie-Werten, musste verworfen werden, da die d3.js Function diese nicht verarbeiten kann. Dies machte die Anpassung des Arrays in eine übergeordnete Schachtelung nach Monat und im zweiten Schritt nach Bundesland notwendig. In einer Funktion, die die Bundesländer zu der Ebene mit den konkreten Kategorie-Werten verschachtelt, mussten die vorherigen JavaScript-Objects in einzelne Arrays umgewandelt werden. Die anschließende Funktion zur Geniererung des Barplots kann jeweils nur mit einem Array, welches die Werte für alle Bundesländer zu einem Monat enthält, als Parameter aufgerufen werden.
- Die von d3.js bereitgestellte Stack()-Function zur Generierung des circular barplots führt zu Fehlern bei mehreren positiven und negativen Werten, da sequentiell die Differenzen zwischen einzelnen Array-Werten subtrahiert werden. Daher war eine Beschränkung auf 2 Kategorien notwendig. Die vorherige Implementierung mit sechs gleichzeitig abgebildeten Kategorien, welche bis auf die verfälschte Berechnung durch die stack()-Funktion, funktionsfähig war, musste verworfen werden.
- Die asynchrone Funktion "arc", die die Werte einfügt. Der Ort der Funktionsdeklaration war entscheidend, damit überhaupt etwas angezeigt wurde.



## Sonstiges
- Anlegen eines remote Repositories in github Pages (Herausforderung: Anpassung der Dokumentstruktur und der Pfade, Security Policy) (Sina)
- Erstellung von Mock Ups mit UX Pin (Christina, Hyerim) (https://preview.uxpin.com/c8ca4a35ba3a0b488e158603b871828d04452121#/pages/134594727/simulate/no-panels?mode=chdm)
- [CARP] Konzeption der Seite mit Miro (Christina, Pia)
- Auswahl der Farben mittels Color Blindness Stimulator (https://www.color-blindness.com/coblis-color-blindness-simulator/) (Hyerim, Christina, Pia, Laura, Sina) 
- Dokumentation (Hyerim, Christina, Pia, Laura, Sina) 
- Erstellen der Präsentation (Hyerim, Christina, Pia, Laura, Sina) 
- Erstellen der finalen Präsentation & Screencast (Sina) 
- Gantt Chart (Sina) 
