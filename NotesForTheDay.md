4/3/25:
got connection working again, added bookmark
I tried adding my IP address, but that still didn't work?
had to add 0.0.0.0/0 (allow all traffic) for temporary 6 hours

done:
python3 -m venv venv
pip3 install flask
pip3 freeze > requirements.txt
for future users: pip3 install -r requirements.txt

4/5/25:

- properties
  - addresses,
  - owners (different than companies because they lease the land/rights?)
- companies

  - company name

- company_ownership
  - propertie_id they are leasing
  - percentage ownership
  - royalty/working interest
  - type (oil/natural gas)
- transactions (income/expense from another company-for a particular property)
  - amount
  - date
  - property
  - company_from
  - company_to
  - merchandise_transacted (need to make this an Object_id)
  - amount_of_merch_transacted
  - merchandise_type
  - barrels of oil
  - service1
