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
5/7/25:

- fixed transaction creating undefined
- updated BE to allow transactions to be negative to balance
- made transactions be a separate screen inside of entries
- redid the path object to be /entry/<entry-id>/transactions
- removed now un used code in the old modal
- lots of troubleshooting that included a big reworking the way the transcribing jsonObjectId worked

5/8/25:

- removed validation on FE not allowing neg transaction amount
- did some research on where to keep documentation ->
  - **answer**:
    - Notion with screenshot "how tos"
    - embeded youtube videos with short demos
    - it's free to share unlimited times and basic non technical user friendly
- bought cursor for a year and canceled auto-renewing

5/9/25:

- ✅implement accounts tab\*\*\*\*
- ✅need to add accounts to the transaction instead of the company (or in addition to it? look at pics)
- ✅Aggregate by property/date

4/11/25:

- ✅be able to drill into each cell to get more detail
  - (but these will be under different entries? how can we get what entry they're under?)

currently have it coded up to go to transactions but it looks like you have it to go to an entry then you can drill down to transactions. But how do entries have a balance? do they not have to be a 0 balance thing?
may need to erase or stash the code I have written rn.
then update the entreis table to have a balance column

- Aggregate by company or by land
- add trend line graphs below

extra:

- be able to click on each cell and keep drilling down

todo next time:

- add post entries, that does some verification
- add unpost entries (don't allow on closed out years, have to add that in too- for now just put a comment on that page in the ui)
- add aggregation by revenue and shiz

------- ignoring above for now
5/12/25: had meeting with m and came up with below new understanding and next small critical steps to get general ledger and trends/summary working
5/13/25:

- ✅update account to start with an initial balance (allow negatives)
- ✅remove date from transactions (all have to be on the same day)
- ✅add "post" functionality to the entries backend
  -✅ add new status: posted/pending
- ✅added front end post button, grey out if not balanced, and warnings

5/15/25:

- ✅update trends tab to use account balances
- ✅updated transactions being saved as strings when creating or updating transactions
- ✅created this query to update all transaction strings in mongoDB compass to be numbers
  - ANSWER✅:
    - stage1: $addFields: (the add fields goes in mongoDbs dropdown box)
      - {amount: {$convert: { input: "$amount",to: "double", onError: null, onNull: null}}}
    - stage2: $merge:
      - { into: "transactions"}
- ✅found wasn't calculating balance right at all, went to fix it and realized we needed a balance snapshots collection
- ✅did good amount of research on this with my boy chatgpt

  - ANSWER✅:
    - we want a new collection balance_snapshots
    - calculated on a MongoDB atlas Trigger -> will update to AWS lambda later when needed
    - WEEKLY to start, to make sure it works, later on yearly
    - Performance limits Subject to MongoDB’s execution time limits (e.g., 10 min)
    - MAY NEED TO UPGRADE TO CRON JOB SOON depending on how resource intensive this is.

- - update the balance to only be affected by posted transactions
  - ? have temporary tab to be able to see posted transactions?

- update the trends tab to be for the balance of the account at the end of the month (is she 100% sure about this?)
- only have transactions that are "posted" be part of the trends

- have trend -> click on march-> pull up TRANSACTIONS that effect the account (only POSTED ones) during that month -> when click you pull up the entry it goes with and all other transactions

later:

- deploy app
- add user sign in and auth
- add user to each transaction
  - possibly the company they're connected with?
  - how can I break up the transactions table that will just be massive?
- should I have a field with current_balance in it ever for each account? How can I make the current balance calculation more efficient as over time there’s millions of transactions? since the initial balance source of truth?

  - Maybe have a current balance then work backwards from the new entries?
  - is it ever possible for these number to get off though?

- need to support multiple companies (kramers different companies or another family each being a whole separate login etc?)
- would they want to have the users above the companies or have each company have a list of users?
