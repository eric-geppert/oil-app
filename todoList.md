Done on each day:
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
- added apis for all tables
- added validation on the create_document for each api
- created validation record from api
- check id validations on all creates

todays todo:

---

4/7/25:

- removed amount, added gross,net,taxed amounts
- figured out how to keep history of owners -> just add dates to transactions table
- removed owners from property table (not needed there or accurate), put in new property, and new company_ownership data in app.py
- XX create admin for updating these???? ask m how that would work?-> no
- created basic front end for CRUD and displaying table
- attempted to fix dates and it didn't work

4/10/25:

- added new accounts api for new accounts table in the db
- restyling of front end to put the tabs on the left (cursor did it), added front end code for the accounts
- made main nav drawer on the left collapsable
- removed company from and company_to in transactions just made it company, updated api endpoints, server, and fe code"
- updated from using gross, net, taxed amount to single amount in backend, added entries table and FE code, put transactions inside of that
- added back properties tab, and fixed it to use location object instead of address string(can change this later if we want
- added back company property ownership tab and got all of the fields/validation working
- moved all backend files to folder called backend

(excuse for being so long: took vacation and was drowning trying to get the rental ready before I left to europe)
5/5/25:

- get transactions working like I want

extra:

- get summary table up

todo next time:

- make the entry just default be open, and not try to display already completed entries
- add post entries, that does some verification
- add unpost entries (don't allow on closed out years, have to add that in too- for now just put a comment on that page in the ui)
- add aggregation by revenue and shiz
