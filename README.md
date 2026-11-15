# NetScope – Network Diagnostics Platform

**Autor:** Iza

## 1. Cel aplikacji

NetScope to aplikacja webowa służąca do zarządzania zasobami sieciowymi, przeprowadzania podstawowej diagnostyki sieci oraz analizy ruchu sieciowego.

Aplikacja jest skierowana do osób uczących się networkingu i cyberbezpieczeństwa oraz użytkowników zarządzających własnymi urządzeniami i serwerami.

Przykładowe użycie: użytkownik dodaje do aplikacji urządzenie ze swojej sieci lokalnej, sprawdza jego dostępność i otwarte porty, a następnie przegląda wyniki diagnostyki. Może również przesłać plik PCAP w celu analizy przechwyconego ruchu sieciowego.

## 2. Planowane funkcjonalności

1. **Rejestracja i logowanie** – użytkownicy będą mogli zakładać konta i korzystać z aplikacji. System będzie posiadał również konto administratora.
2. **Zarządzanie urządzeniami** – możliwość ręcznego dodawania hostów oraz automatycznego wykrywania urządzeń w sieci lokalnej.
3. **Diagnostyka sieci** – sprawdzanie dostępności hostów, skanowanie wybranych portów TCP oraz analiza rekordów DNS.
4. **Diagnostyka serwerów WWW** – sprawdzanie odpowiedzi HTTP oraz podstawowych informacji o certyfikatach TLS.
5. **Analiza ruchu sieciowego** – przesyłanie plików PCAP/PCAPNG i analizowanie zawartych w nich pakietów oraz protokołów.
6. **Historia wyników** – zapisywanie i przeglądanie wcześniejszych testów.
7. **Zarządzanie uprawnieniami** – możliwość zgłaszania publicznych domen do diagnostyki wraz z dokumentem potwierdzającym uprawnienia do ich testowania. Administrator będzie zatwierdzał lub odrzucał zgłoszenia.

## 3. Technologie i dane

- **Frontend:** React, TypeScript, Vite.
- **Backend:** Python, Flask.
- **Baza danych:** SQLite, SQLAlchemy.
- **Analiza sieci:** Python Socket, Scapy, dnspython, HTTPX, SSL.
- **Przechowywanie danych:** baza danych będzie przechowywać konta użytkowników, zasoby sieciowe i wyniki diagnostyki.

Frontend będzie odpowiadał za interfejs użytkownika, natomiast backend za logikę aplikacji, obsługę danych, uwierzytelnianie oraz wykonywanie testów sieciowych.

## 4. Zagrożenia i zabezpieczenia

| Zagrożenie | Planowane zabezpieczenie |
|---|---|
| Nieautoryzowany dostęp do danych innych użytkowników | Kontrola uprawnień i właściciela zasobu po stronie serwera |
| Dostęp zwykłego użytkownika do funkcji administratora | System ról i autoryzacja endpointów |
| Przesyłanie nieprawidłowych danych | Walidacja danych po stronie backendu |
| Ataki XSS | Bezpieczne wyświetlanie danych wprowadzanych przez użytkowników |
| Wykorzystanie aplikacji do skanowania niedozwolonych adresów | Weryfikacja adresów IP, ograniczenie dozwolonych celów i zakresów testowania |
| Przesyłanie niebezpiecznych plików | Weryfikacja formatu i rozmiaru przesyłanych plików oraz bezpieczne przechowywanie |

## 5. Plan pracy

1. Przygotowanie środowiska, struktury projektu i bazy danych.
2. Implementacja rejestracji, logowania oraz systemu uprawnień.
3. Implementacja zarządzania zasobami sieciowymi i zgłaszania domen.
4. Stworzenie modułów diagnostycznych i analizy ruchu sieciowego.
5. Przygotowanie interfejsu użytkownika w React.
6. Integracja frontendu z backendem.
7. Implementacja i testowanie zabezpieczeń.
8. Przygotowanie dokumentacji oraz końcowe testy aplikacji.

## 6. Testowanie bezpieczeństwa

W ramach projektu zostaną przeprowadzone testy sprawdzające m.in.:
- próbę uzyskania dostępu do zasobów innego użytkownika;
- próbę wykonania funkcji administratora z konta zwykłego użytkownika;
- próbę przesłania nieprawidłowych danych do backendu;
- próbę przesłania nieprawidłowego pliku;
- próbę wykorzystania aplikacji do diagnostyki niedozwolonych adresów.

Wyniki testów i zastosowane zabezpieczenia zostaną opisane w dokumentacji projektu.