Kroki:
1. plik csv wrzucamy do folderu csv
2. na podstawie pliku csv generujemy zapytania do bazy, uruchamiamy: node ./sql_generator nazwa.csv 
   - do folderu /sql_generated zostaną wrzucone zostaną pliki z zapytaniami sql podzielone na paczki (domyślnie 1000)
3. odpytujemy bazę, uruchamiamy: 
  3.1 
    a) dla konkretnego pliku z sql_generated: node .\sql_executor.js 1_1000  
    b) dla wszytkich zapytań z folderu sql_generated: node .\sql_executor.js
  3.2 
    - zwrócone dane w postaci json zostaną zapisane w folderze uniq_data dla każdego zapytania
4. wrzucanie na serwer uniq z danymi z folderu uniq_data, uruchamiamy:
  4.1
    a) dla konkretnego pliku z uniq_data: node .\upload_contacts.js 1_1000  
    b) dla wszytkich dannych z folderu uniq_data: node .\upload_contacts.js
  4.2
    - jeśli plik został poprawnie uploadownay zostanie przeniesiony do folderu /uniq_data_processed
5. podsumowanie z przeprowadzonego uploadu dla każdego z plików w folderze results z nazwą taką jak wrzucany plik
6. posumowanie do folderu results w pliku summary.json, uruchamiamy: 
    node .\summary.js dostajemy informacje z podsumowaniem

  -----------------------------------------------
  Uruchamiamy: node ./index.js
    Wykonywane automatycznie kroki:
    1. generowanie zapytań sql,
       Podajemy plik csv, z katalogu csv, który checemy wykorzystać, następnie podajemy zdefinowany szablon dla zapytania, mapper dla csv(jakie kolumny nas interesują), opcjonalnie filter dla wartości
       przetworzone poprawnie pliki automatycznie z folderu /csv do /csv_processed
    2. łącznie z bazą i wykonanie zapytań, oraz opcjonalnie funkcja filtrująca zwrócone     dane, zapis odpowiedzi do folderu /uniq_data
    3. autoryzacja żądania
    4. upload kolejnych kontaktów z plików w formacie json z folderu /uniq_data
        przetworzone poprawnie pliki automatycznie z folderu /uniq_data do /uniq_data_processed
    5. podsumowanie wygenerowane w folderze /results dla poszczególnych 