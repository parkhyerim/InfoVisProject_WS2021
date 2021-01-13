# 📊 InfoVisProject_WS2021 📈
<br/>

## Aufrufen der Seite
d3.js erfordert das Starten eines Servers. Im Terminal kann hierfür zum Beispiel mit Python ein Server per `python -m SimpleHTTPServer 8080` Befehl im Root Directory des Projektes gestartet werden.
Alternativ kann bei Visual Studio Code eine Extension(Live Server) verwendet werden.

## Project Title:
Visualisierung der Nutzung verschiedener Verkehrsmittel und der Luftqualität in Deutschland während der Covid19-Pandemie
<br/>

## Ziel
Visualisierung der Auswirkungen der Pandemie auf die Luftqualität und die Mobilität
<br/>

# Meilensteine:
## Meilenstein 1:
- Themenfindung, Datensichtung und ein erstes Mock-Up

## Meilenstein 2:
- Vollständige Projektplanung inkl. Mock-Ups

## Meilenstein 3:
- Line Chart mit Corona Daten der jeweiligen Bundesländer

## Meilenstein 4:
- Drop-Down Menü zur Auswahl angezeigter Monate
- Aktualisierung der Line Chart je nach ausgewähltem Monat und Bundesland
- Interaktive Treemap mit Mobilitätsdaten
- Implementierung einer Deutschlandkarte zur Auswahl der in der Line Chart angezeigten Bundesländer

## Meilenstein 5:
- Treemaps fertigstellen
- (CSS-)Styling anpassen
- Line Chart: Achsenbeschriftung, Beschriftung der Linien anpassen bzw. eine Legende implementieren
- Pop Ups mit Informationen
- Auf fehlende/ lückenhafte Daten hinweisen



# Features
## Feature 1: Interaktive Landkarte
- "Bundesländer"-Button öffnet eine Karte von Deutschland mit den 16 Bundesländern
- Auswahl von bis zu 3 Bundesländern per Klick auf die Namen
- Ausgewählte Bundesländer ändern ihre Farbe
- Beim Hooveren über ein Bundesland wechselt dies die Farbe
- Karte kann eingeklappt werden beim erneuten Klick auf den "Bundesländer"Button
 
## Feature 2: Auswahl des Monats 
- Drop-Down Menü
- März 2020 als Default
- Weitere Monate per Klick auswählbar

## Feature 3: Line Chart
- Zeigt den Verlauf der COVID-19 Erkrankten für den entsprechenden Monat und die entsprechende Region
- Die auf der Deutschlandkarte ausgewählten Bundesländer werden abgebildet
- Der im Drop-Down Menü ausgewählte Monat wird angezeigt
- Die Skalierung der y-Achse passt sich an die Wertebereiche an
- Die x-Achse passt sich an die gefetchten Meldetdaten an. (Zum Beispiel hat Bayern oftmals weniger Meldedaten als Schleswig-Holstein. Werden beide Bundesländer zusammen ausgewählt, wird die x-Achse mit den Meldedaten, die für Bayern verfügbar sind, beschriftet.)

## Feature 4: Treemap
- Die Treemap errechnet einen Monatsdurchschnitt für jeden auswählbaren Monats für alle Bundesländer
- Die Werte repräsentieren das Anfragevolumen nach Apple Routenbeschreibung für Autofahrten
- Die Baseline der Daten ist vom 13.Januar 2020
- Sobald im Drop-Down Menü ein anderer Monat ausgewählt wird, aktualisiert sie
- Die Einfärbung der einzelnen Bundesländer-Felder ist abhängig von der Prozentzahl. Je höher diese wird, desto grüner wird das jeweilige Feld.

## Zusätzliche Features: 
Siehe Meilenstein 5