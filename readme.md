# Importer kontaktów

Program napisany w **node** wykonuje import kontaktów z pliku **csv**. Pliki z konfiguracją bazy, endpointu do wrzucania plików znajduję się w pliku **config.js**.

Poszczególne kroki wykonywane są sekwencyjnie:

1. **sql_generator.js** wykonujewczytanie danych z pliku csv z folderu **/csv**
   1.1. podział na paczki(domyślnie 1000)
   1.2. wygenerowanie zapytań **SQL** do bazy danych
   1.3. przetworzony plik csv przenoszony jest do katalogu **/csv_processed**
   1.4. wygenerowane pliki z zapytaniami **SQL** wrzucane są do katalogu **/sql_generated**
2. **sql_executor.js** wykonuje zapytania wygenerowane z folderu **/sql_generated**
   2.1. łączenie z bazą danych na podstawie konfiguracji w pliku config.js
   2.2. każde z zapytań wykonywane jest sekwencyjnie
   2.3. po poprawnym wykonaniu zapytania do katalogu **/uniq_data** zapisywana jest odpowiedź z bazy, której nazwa odpowiada nazwie pliku sql z zapytaniem( **np. 1_1000.sql => 1_1000.json**)
3. **authorization.js** wykonuje autoryzacja i zwraca token
4. **upload_contacts.js** wykonuje upload kolejnych plików z folder **/uniq_data**
   4.1. zawartość każdego z plików jest wstawiana jako body w żądaniu
   4.2. po poprawnym uploadzie plik przenoszony jest do folderu **/uniq_data_processed**
5. **summary.js** tworzy podsumowanie z procesu przeprowadzonego importu do folderu **/results**

---

# Kod

Przykład użycia od strony kodu:

#### Uruchomienie importu:

```node
node index.js
```

#### Fragment zawartości pliku index.js:

```javascript
await generateSQLfromCSV("sws.csv", getSqlQuerySWS, mapper_sws, filter_sws);
await sqlExecutor([], pickUniqFields);
const token = await proceedAuthorization();
await uploadExecutor([], { url: URL_UNIQ, token });
await createSummary();
```

#### Ręczne pobranie danych z bazy dla pliku:

```javascript
await sqlExecutor(["1_1000"], pickUniqFields);
```

#### Ręczne upload danych z pliku pobranych z bazy:

```javascript
await uploadExecutor(["1_1000"], { url: URL_UNIQ, token });
```

## Diagram przepływu danych:

Diagram przepływu danych:

```mermaid
graph LR
A[Plik CSV] --> B(transformacja)
B --> C1[/sql_generated/1_1000.sql]
B --> C2[/sql_generated/1001_2000.sql]
B --> C3[...]
C1 --> D(wykonanie zapytań DB)
C2 --> D(wykonanie zapytań DB)
C3 --> D(wykonanie zapytań DB)
D --> E1[/uniq_data/1_1000.json]
D --> E2[/uniq_data/1001_2000.json]
D --> E3[...]
E1 --> F(uplaod plików)
E2 --> F(uplaod plików)
E3 --> F(uplaod plików)
F --> G1[/uniq_data_processed/1_1000.json]
F --> G2[/uniq_data_processed/1001_2000.json]
F --> G3[...]
G1 --> H(tworzenie raportu)
G2 --> H(tworzenie raportu)
G3 --> H(tworzenie raportu)
H --> I1[/results/1_1000.json]
H --> I2[/results/1001_2000.json]
H --> I3[...]
```
