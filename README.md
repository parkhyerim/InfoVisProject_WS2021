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
- (CSS-)Styling anpassen
- Line Chart: Achsenbeschriftung, Beschriftung der Linien anpassen bzw. eine Legende implementieren
- Pop Ups mit Informationen (u.a. auf fehlende/ lückenhafte Daten hinweisen)


# Features
## Feature 1: Interaktive Landkarte
- "Bundesländer"-Button öffnet eine Karte von Deutschland mit den 16 Bundesländern
- Auswahl von bis zu 3 Bundesländern per Klick auf die Namen
- Ausgewählte Bundesländer ändern ihre Farbe auf der Karte
- Beim Hooveren über ein Bundesland wechselt dies die Farbe
- Karte kann ein- und ausgeklappt werden per Klick auf den "Bundesländer"-Button
 
## Feature 2: Auswahl des Monats 
- Drop-Down Menü
- März 2020 als Default
- Weitere Monate per Klick auswählbar

## Feature 3: Line Chart
- Zeigt den Verlauf der COVID-19 Erkrankten für den entsprechenden Monat und das entsprechende Bundesland
- Die auf der Deutschlandkarte ausgewählten und im folgenden hervorgehobenen Bundesländer werden visualisiert
- Der im Drop-Down Menü ausgewählte Monat wird angezeigt
- Die Skalierung der y-Achse passt sich an die Wertebereiche an
- Die x-Achse passt sich an die gefetchten Meldetdaten an. (Zum Beispiel hat Bayern oftmals weniger Meldedaten als Schleswig-Holstein. Werden beide Bundesländer zusammen ausgewählt, wird die x-Achse mit den Meldedaten, die für Bayern verfügbar sind, beschriftet.)

## Feature 4: Treemap
- Die Treemap errechnet einen Monatsdurchschnitt für jeden auswählbaren Monat für alle Bundesländer
- Die Werte repräsentieren das Anfragevolumen nach Apple Routenbeschreibung für Autofahrten
- Die Baseline der Daten ist der 13. Januar 2020
- Sobald im Drop-Down Menü ein anderer Monat ausgewählt wird, aktualisiert die Treemap
- Die Einfärbung der einzelnen Bundesländer-Felder ist abhängig von der Prozentzahl. Je höher diese wird, desto grüner wird das jeweilige Feld.

## Zusätzliche Features: 
Siehe Meilenstein 5

## Browser:
Getestet in Firefox und Chrome