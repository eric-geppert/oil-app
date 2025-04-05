Done:
3/10/25

- added my ip to whitelist of mongoDB so I could connect locally
- still had issues connecting from my application though - allowed traffic from anywhere for 1 week
- got connection string by using hard string not os.getenv
- god collection actually printing and returning things that make sense (indv users)

---

4/3/25:

- added requirments.txt
- got python3 working properly with venv and requirments.txt better docs so this will be faster next time

---

4/5/25:

- downloaded cursur and used it to generate companies_api (very happy with it)
- **create property table (with first maually created document inserted via mongodb compass)**
- companies table ^
- company_ownership_table ^
- create transaction table ^
- added company to db from code

todays todo:

- pull those then use the first one to push a tranaction record
- create admin functionality to be able to view income by company
- create admin functionality to be able to view income by property

---

next time:

- add additional merchandise_types table, (talk it over with m first)
- add 0.0.0.0/0 (allow all traffic) for temporary 6 hours (atlas network url saved in bookmarks)
- fix why adding currentIP address doesn't work (chatgpt had suggestions of ssl cert) (also try adding &ssl to the end of the connection string url?)

Todo:

- add 0.0.0 ip addr temporarily^^^
- abstract out connection string pw
- build basic object for payments

- even start fe at all?
