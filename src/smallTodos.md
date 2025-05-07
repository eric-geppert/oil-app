todo:

- ❎create uuid for each table-> mongodb already generates Object_id
- ✅grab that uuid later^?
- ✅separate address into: street addr, city, state, zip
- make interest_type an enum

lil later:

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
