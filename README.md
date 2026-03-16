# Webdatenbanken

## Gliederung

- [Kurzbeschreibung](#kurzbeschreibung)
- [Aufgabenstellung](#aufgabenstellung)
- [Architektur -alt](#architektur--alt)
- [Architektur -neu](#architektur--neu)
- [Verwendete / vorgeschlagene Technologien](#verwendete--vorgeschlagene-technologien)
- [Nützliche Links / Lernmaterial](#nützliche-links--lernmaterial)
- [Datenbankpasswörter & Anleitung](#datenbankpasswörter--anleitung)
- [Gruppenaufbau](#gruppenaufbau)
- [Aufbau REST-API](#aufbau-rest-api)
  - [Authentifizierung & Nutzer — Endpunkte](#authentifizierung--nutzer--endpunkte-als-tabellen)
    - [Login](#login)
    - [Passwort vergessen](#Passwort-vergessen)
    - [Registrieren](#registrieren)
    - [All Events (admins & nutzer) (Dashboard)](#all-events-admins--nutzer-dashboard)
    - [Single Events (admins) (Dashboard)](#single-events-admins-dashboard)
    - [Single Events (nutzer) (Dashboard)](#single-events-nutzer-dashboard)
    - [Kontoansicht (Users)](#kontoansicht-users)
    - [Nutzer aktualisieren (Update User)](#nutzer-aktualisieren-update-user)
    - [Nutzer löschen (Delete User)](#nutzer-löschen-delete-user)
- [Genaue Ziele (EPICS)](#genaue-ziele-epics)
- [User Stories](#user-stories)



## Kurzbeschreibung

Ziel ist es, die Kommunikation zwischen unserer Gruppe (Gruppe‑FB4) und der REST‑API von Gruppe‑FB5 zu realisieren — Daten von API empfangen & senden und für Gruppe‑FB3 bereitstellen.

![Projektübersicht](Dokumentation/Bilder/Project.png)
![Projektübersicht](Dokumentation/Bilder/Project1.png)
![Projektübersicht](Dokumentation/Bilder/ERM-Modell.png)
![Projektübersicht](Dokumentation/Bilder/ajax-block-diagram1.jpg)

## Aufgabenstellung

- Datenempfang und -versand über eine REST‑API
- Authentifizierung/Autorisierung mittels JSON Web Tokens (JWT)
- Asynchrone Anfragen mit AJAX (jQuery)

## Architektur -alt
### Überblick
```bash
wiwsall
├── public 📁
├── src 📁
├── vendor 📁
├── .htaccess
├── .htpasswd
└── index.html
```
### JavaScript
```bash
wiwsall
├── public
│   ├── css 📁
│   ├── img 📁
│   └── js 📁
│       ├──bootstrap 📁
│       ├── /*app.js
│       ├── /*timeEntry.js
│       ├── /*user.js
│       ├── swagger 📁
│       ├── .htaccess
│       ├── favicon.ico
│       ├── index.html
│       ├── index.php
│       ├── timeEntries.html
│       └── users.html
├── src 📁
├── vendor 📁
├── .htaccess
├── .htpasswd
└── index.html
```
### PHP und DB
```bash
wiwsall
├── public
├── src 📁
│   ├── Controllers 📁
│   │   ├── JWTHandler.php
│   │   ├── TimeEntryController.php
│   │   └── UserController.php
│   ├── Database 📁
│   │   └── /* database.sql
│   ├── Models 📁
│   │   ├── Database.php
│   │   ├── TimeEntry.php
│   │   ├── User.php
│   ├── Routes 📁
│   │    └── routes.php
│   └── Views 📁
├── vendor 📁
├── .htaccess
├── .htpasswd
└── index.html
```
## Architektur -neu
### JavaScript
```bash
wiwsall
├── public
│   ├── css 📁
│   ├── img 📁
│   ├── js 📁
│   │   ├── bootstrap 📁
│   │   ├── m_data_get.js 
│   │   ├── m_data_render.js 
│   │   └── main.js 
│   ├── swagger 📁
│   ├── .htaccess
│   ├── .htaccess_
│   ├── eventmanager.html
│   ├── favicon.ico
│   ├── index.html
│   ├── index.php
│   ├── timeEntries.html
│   └── users.html
├── src 📁
├── vendor 📁
├── .htaccess
├── .htpasswd
└── index.html
```
### PHP und DB
```bash
wiwsall
├── public
├── src 📁
│   ├── Controllers 📁
│   │   ├── EventController.php
│   │   ├── JWTHandler.php
│   │   ├── SignInController.php
│   │   ├── TimeEntryController.php
│   │   └── UserController.php
│   ├── Database 📁
│   │   └── /* database.sql
│   ├── Models 📁
│   │   ├── Database.php
│   │   ├── Events.php
│   │   ├── Sign_In.php
│   │   ├── TimeEntry.php
│   │   ├── User.php
│   │   ├── Users.php
│   ├── Routes 📁
│   │    └── routes.php
│   └── Views 📁
├── vendor 📁
├── .htaccess
├── .htpasswd
└── index.html
```
## Verwendete / vorgeschlagene Technologien

- JavaScript
- REST (HTTP‑Methoden)
- JSON Web Token (JWT)
- jQuery (AJAX)
- Postman (API-Testing)

## Nützliche Links / Lernmaterial

- jQuery AJAX (Referenz): https://www.w3schools.com/jquery/jquery_ref_ajax.asp


- AJAX mit JavaScript (Übersicht): https://www.w3schools.com/js/js_ajax_http.asp
![Projektübersicht](Dokumentation/Bilder/AJAX1.png)
![Projektübersicht](Dokumentation/Bilder/AJAX2.png)

Zusätzlich: Lernstoff aus den Vorlesungsfolien "Theorie Session – Kapitel 4: Dynamische Webinhalte und AJAX" oder Ordner: "ajax_jquery_json_Beispiel".

- JSON Web Token (Artikel): https://www.geeksforgeeks.org/web-tech/json-web-token-jwt/
- RESTful HTTP Methods (Erklärung): https://restfulapi.net/http-methods/
![Projektübersicht](Dokumentation/Bilder/CRUID.png)
![Projektübersicht](Dokumentation/Bilder/httpCodes.png)


## Datenbankpasswörter & Anleitung
### Zugriff aktuell
Andy Le Hoang ist Stellvertretend für FB4 für die Serverkommunikation zuständig und hat somit Zugriff auf den serverseitigen Projektstand.
### Zugriff eigentlich (ohne funkt.)
- DB: 23i_dev_mydbox
- FTP: 23i_dev_myftpox
- Path: 23i_dev_mypathox

![Projektübersicht](Dokumentation/Bilder/Einrichtung1.png)
![Projektübersicht](Dokumentation/Bilder/Einrichtung2.png)

## Gruppenaufbau
- Michi (Produktowner)
- Jonathan (Agility Master)
- Tim & Andy (Programmierung haupt.)
- Harry, Niels, Lukas (Testing & Qualitätssicherung - Präsi?)
- Alle Mitglieder können gerne bei der Programmierung helfen 😊
### Repo Zugriff
Extern:
- Rashad (FB5) "rashad.mohammad@ba-rm.de"
- Julian (FB5) "julscheich@gmail.com"<br>

Intern (FB4):
- Tim "tim.zimmermann2411@gmail.com"
- Andy "andylh0407@gmail.com"
- Niels "Niels-Christian.bohr@web.de"
- Michael "mich.egner99@outlook.de"
- Lukas S. "lukas.scharnagl.mail@gmail.com"
- Harry "hary.hohmann@yahoo.com"
- Jonathan "jonathankross611@gmail.com"
## Aufbau REST-API

Rahmenbedingungen

- Eingabe und Ausgabe erfolgen ausschließlich in JSON.
- Token‑basierte Authentifizierung (JWT) für geschützte Endpunkte.

### Authentifizierung & Nutzer — Endpunkte (als Tabellen)
(Stand:09.02.2026)
#### Login

| Feld | Wert |
|---|---|
| Titel | LOGIN |
| Endpunkt | POST /auth/login |
| Header | `{ "Content-Type": "application/json" }` |
| Body (JSON) | `{ "email": "", "password": "" }` |
| Beschreibung | Meldet Benutzer an und gibt JWT-Token zurück. user.js prüft Eingaben, ruft Request-Controller auf; Token wird im Controller sicher gespeichert (z.B. memory/localStorage) und bei Folge-Requests als Bearer gesetzt. UserController verifiziert Credentials, erzeugt JWT (JWTHandler) mit Ablaufzeit, antwortet JSON { token }. |
| Response Codes | `200 OK` – Erfolgreich angemeldet<br>`400 Bad Request` – Ungültige Eingabedaten<br>`401 Unauthorized` – Falsche Email oder Passwort oder verified=false<br>`500 Internal Server Error` – Serverfehler<br>`429 optional nach mehreren failed-logins.` |
| Antwort Body (JSON) | `{ server_communication:{"code": "$code", "response": "$responseName", "message": "$responseMessage"}, "token": "<jwt-token>", "users":{"active":""} }` |
| Hinweise | `POST /auth/failed-login` erhöht einen Failed‑Login‑Zähler: `{ "num_failed_logins": 1 }` |

#### Passwort vergessen

| Feld | Wert |
|---|---|
| Titel | PASSWORT VERGESSEN |
| Endpunkt | GET /auth/forgot (Anfrage)<br>PATCH /auth/forgot (Neues Passwort setzen) |
| Header | `{ "Content-Type": "application/json" }` |
| Body (JSON) GET | `{ "email": "" }` |
| (Email-Link) Body (JSON) PATCH | `{ "newPassword": "", "resetToken": "<jwt-token>" }` |
| Beschreibung | Ermöglicht Benutzern das Zurücksetzen des Passworts.Frontend: user.js sendet E-Mail (GET) bzw. neues Passwort (PATCH) via Request-Controller; validiert Passwortregeln clientseitig.Backend: UserController initiiert Reset-Flow (Token/Code per Mail), setzt neues Passwort auf PATCH, invalidiert alte Tokens. Sicherheit: Rate-Limit/Throttle, keine Details leaken (immer generische Antwort) |
| Response Codes | `200 OK` – Anfrage erfolgreich verarbeitet<br>`400 Bad Request` – Ungültige Eingabedaten<br>`404 Not Found` – Email nicht gefunden<br>`500 Internal Server Error` – Serverfehler |
| Antwort Body (JSON) | `{ server_communication:{"code": "$code", "response": "$responseName", "message": "$responseMessage"} }` |


#### Registrieren

| Feld | Wert |
|---|---|
| Titel | REGISTRIERUNG |
| Endpunkt | POST /auth/register |
| Header | `{ "Content-Type": "application/json" }` |
| Body (JSON) | `{ "email": "", "password": "", "first_name": "", "last_name": "", "timestamp": "" }` |
| Beschreibung | Registriert neue Nutzer, Nutzer müssen sich dennoch erst anmelden, um Token zu erhalten |
| Response Codes | `201 Created` – Erfolgreich erstellt<br>`400 Bad Request` – Passwort zu kurz/schwach oder formal ungültige Daten<br>`409 Conflict` – Email bereits vorhanden<br>`500 Internal Server Error` – Serverfehler |
| Antwort Body (JSON) | `{ server_communication:{"code": "$code", "response": "$responseName", "message": "$responseMessage"} }` |

#### All Events (admins & nutzer) (Dashboard)

| Feld | Wert |
|---|---|
| Titel | ALL EVENTS (DASHBOARD) |
| Endpunkt | GET /events/all/info |
| Header | `{ "Content-Type": "application/json", "Authorization": "Bearer <token>" }` |
| Body (JSON) | Kein Body erforderlich |
| Beschreibung | Liefert alle Events des eingeloggten Users (Token im Authorization Header) |
| Response Codes | `200 OK` – Events erfolgreich abgerufen<br>`401 Unauthorized` – Kein oder ungültiges Token<br>`500 Internal Server Error` – Serverfehler |
| Antwort Body (JSON) | `{ server_communication:{"code": "$code", "response": "$responseName", "message": "$responseMessage"}, "events": [{ "name": "", "notes": "", "EID": "", "start": "", "end": "" }] }` |

#### Single Events (admins) (Dashboard)

| Feld | Wert |
|---|---|
| Titel | SINGLE EVENTS - ADMIN (DASHBOARD) |
| Endpunkt | GET /events/single/info (Abrufen)<br>POST /events/single/erstellen (Aufsetzen)<br>PUT /events/single/bearbeiten (Bearbeiten)<br>DELETE /events/single/loeschen (Löschen) |
| Header | `{ "Content-Type": "application/json", "Authorization": "Bearer <token>" }` |
| Body (JSON) GET | Kein Body erforderlich |
| Body (JSON) POST/PUT | `{ "name": "", "EID": "", "start": "", "end": "" }` |
| Body (JSON) DELETE | `{ "EID": "" }` |
| Beschreibung | Verwaltet einzelne Events (Admin-Funktionen: Erstellen, Bearbeiten, Löschen, Abrufen) |
| Response Codes | `200 OK` – Erfolgreich abgerufen/bearbeitet<br>`201 Created` – Event erfolgreich erstellt<br>`400 Bad Request` – Ungültige Eingabedaten<br>`401 Unauthorized` – Kein oder ungültiges Token<br>`403 Forbidden` – Keine Admin-Berechtigung<br>`404 Not Found` – Event nicht gefunden<br>`500 Internal Server Error` – Serverfehler |
| Antwort Body (JSON) | `{ server_communication:{"code": "$code", "response": "$responseName", "message": "$responseMessage"}, "events": { "name": "", "EID": "", "start": "", "end": "", "sign_in": {"last_name":"","first_name":"","sign_in_time":"","sign_out_time":"", "notes":""} } }` |

#### Single Events (nutzer) (Dashboard)

| Feld | Wert |
|---|---|
| Titel | SINGLE EVENTS - NUTZER (DASHBOARD) |
| Endpunkt | GET /events/single/info (Abrufen)<br>POST /events/single/Teilnahme (Teilnehmen/Ausloggen) |
| Header | `{ "Content-Type": "application/json", "Authorization": "Bearer <token>" }` |
| Body (JSON) GET | Kein Body erforderlich |
| Body (JSON) POST (Teilnehmen) | `{ "EID": "", "sign_in_time": timestamp }` |
| Body (JSON) POST (Ausloggen) | `{ "EID": "", "sign_out_time": timestamp }` |
| Beschreibung | Ermöglicht Nutzern das Abrufen von Event Infos sowie Teilnahme oder vorzeitiges Ausloggen |
| Response Codes | `200 OK` – Erfolgreich abgerufen/bearbeitet<br>`400 Bad Request` – Ungültige Eingabedaten<br>`401 Unauthorized` – Kein oder ungültiges Token<br>`404 Not Found` – Event nicht gefunden<br>`500 Internal Server Error` – Serverfehler |
| Antwort Body (JSON) | `{ server_communication:{"code": "$code", "response": "$responseName", "message": "$responseMessage"}, "events": { "name": "", "EID": "", "start": "", "end": "", "sign_in_time": "" } }` |


#### Kontoansicht (Users)

| Feld | Wert |
|---|---|
| Titel | KONTOANSICHT (USERS) |
| Endpunkt | GET /users |
| Header | `{ "Content-Type": "application/json", "Authorization": "Bearer <token>" }` |
| Body (JSON) | Kein Body erforderlich |
| Beschreibung | Liefert Übersicht der Nutzerattribute des eingeloggten Benutzers |
| Response Codes | `200 OK` – Erfolgreich abgerufen<br>`401 Unauthorized` – Kein oder ungültiges Token<br>`404 Not Found` – Benutzer nicht gefunden<br>`500 Internal Server Error` – Serverfehler |
| Antwort Body (JSON) | `{ server_communication:{"code": "$code", "response": "$responseName", "message": "$responseMessage"}, "users": { "UID": "", "first_name": "", "last_name": "", "email": "", "active": "","verified": "", "num_failed_logins": "" } }` |

#### Nutzer aktualisieren (Update User)

| Feld | Wert |
|---|---|
| Titel | NUTZER AKTUALISIEREN (UPDATE USER) |
| Endpunkt | PUT /users |
| Header | `{ "Content-Type": "application/json", "Authorization": "Bearer <token>" }` |
| Body (JSON) | `{ "first_name": "", "last_name": "", "email": "", "password": "" }` |
| Beschreibung | Aktualisiert die Profildaten des eingeloggten Benutzers. Es müssen nur die zu ändernden Felder im Body übergeben werden. Die Identifikation erfolgt über das JWT-Token im Authorization Header. |
| Response Codes | `200 OK` – Nutzerdaten erfolgreich aktualisiert<br>`400 Bad Request` – Ungültige Eingabedaten (z.B. Passwort zu kurz)<br>`401 Unauthorized` – Kein oder ungültiges Token<br>`404 Not Found` – Benutzer nicht gefunden<br>`409 Conflict` – Email bereits vergeben<br>`500 Internal Server Error` – Serverfehler |
| Antwort Body (JSON) | `{ server_communication:{"code": "$code", "response": "$responseName", "message": "$responseMessage"} }` |

#### Nutzer löschen (Delete User)

| Feld | Wert |
|---|---|
| Titel | NUTZER LÖSCHEN (DELETE USER) |
| Endpunkt | DELETE /users |
| Header | `{ "Content-Type": "application/json", "Authorization": "Bearer <token>" }` |
| Body (JSON) | Kein Body erforderlich |
| Beschreibung | Löscht das Konto des eingeloggten Benutzers. Die Identifikation erfolgt über das JWT-Token im Authorization Header. Nach erfolgreicher Löschung wird das Token ungültig. |
| Response Codes | `200 OK` – Benutzerkonto erfolgreich gelöscht<br>`401 Unauthorized` – Kein oder ungültiges Token<br>`404 Not Found` – Benutzer nicht gefunden<br>`500 Internal Server Error` – Serverfehler |
| Antwort Body (JSON) | `{ server_communication:{"code": "$code", "response": "$responseName", "message": "$responseMessage"} }` |


## Genaue Ziele (EPICS)
- Blueprints (Vorarbeit):
    - JWT → erstellen + Validierung 
    - Qualitätssicherrung: Funktionale Tests, (Funktioniert der Login/Registrieren/Logout,Passwort resetten), JSON-Struktur Annahme (JWT) Tests, Tests auf technische Verbindungsfehler und Logische Verbindungsfehler(pw nicht richtig etc (nach überreichung der JSON))
    Testingdateien: 
    Testkonzept: https://1drv.ms/x/c/23431215959db829/IQCoGb83Mt5NTbYQqJuhcLVCAc7q-quy-L7dxMtV3vmtkq0?e=5d7lFD
    Tests examples: https://1drv.ms/w/c/23431215959db829/IQCSRHqR7R_HRbzOFqR1QFMoAR3vWtz5i4jBYLfdD2OIJlw?e=CDHQjQ
    
    - Login
    - Registrieren
    - Passwort vergessen
    - Events
- Implementierung
- Abstimmung mit FB3 & FB5
- Präsentation

## User Stories
### Miro Story Board
https://miro.com/welcomeonboard/YjBXYWh2TFE5d01hbnYvWThnWmV5QXdHR0lrQzVJRXVBT0NkcnUvZEtlR2IwZHlKVHd6amVnaHR1OHpIZ2R6OVZVam0vYzdmWDFSKzI0ejBtNGFiWVVvUWRrck5na1RmVkczOVZTTGpEZE4vVGx0T2dTdHpOWXhMSFY2bk1FK1RBd044SHFHaVlWYWk0d3NxeHNmeG9BPT0hdjE=?share_link_id=444329631435

| Nr. | Story-ID | Titel | Beschreibung | Akzeptanz Kriterien | Priorität | User Story |
|-----|----------|-------|--------------|-----------|--------|--------|
| 1 | AUTH-1 | JWT Implementierung | Erstellung + Validierung | Hoch | ____ |


