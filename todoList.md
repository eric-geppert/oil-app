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

todo:

- fix dates on front end
- deploy move be files under BE folder
- deploy BE and FE to server so mom can see it
- need to add pagination?
- don't allow deleting of companies that have transactions or properties associated (just remove delte on companies and properties)

- create basic admin UI where they can query by the big 3

1. Date
2. Property
3. Company
   then allow them to add to layer in multiple layers to the query

- abstract api endpoint base urls to a config

- ask how division order can "change ownership" when the krmrs are the owners?
- make owners be a company_id
- create admin functionality to be able to view income by company
- create admin functionality to be able to view income by property

- create basic FE
- addtional features for CompanyOwnershipAPI-> when creating on the UI make sure the percentage adds up to 100?
  where is the best place to validate this? likely the FE

next time:

- add 0.0.0.0/0 (allow all traffic) for temporary 6 hours (atlas network url saved in bookmarks)

Todo:

- add 0.0.0 ip addr temporarily^^^
- abstract out connection string pw
- add additional merchandise_type table, (talk it over with m first)
- fix why adding currentIP address doesn't work (chatgpt had suggestions of ssl cert) (also try adding &ssl to the end of the connection string url?)

Later on:

- break up the company_ownership table into several tables to make it be faster when querying?
- sub divide property use case?
- add user authentication!
- Make add another field for created by user or company and only let that company/user edit!
- Front end

thoughts:

- need to remove Deletes from the FE or make them only sudo admin deletable by me?
