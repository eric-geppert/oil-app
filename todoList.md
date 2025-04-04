Done:
3/10/25

- added my ip to whitelist of mongoDB so I could connect locally
- still had issues connecting from my application though - allowed traffic from anywhere for 1 week
- got connection string by using hard string not os.getenv
- god collection actually printing and returning things that make sense (indv users)

Todo:

- abstract out connection string pw
- make requirements.txt
- build basic object for payments

- even start fe at all?

---

4/3/25:

- added requirments.txt

next time:

- add 0.0.0.0/0 (allow all traffic) for temporary 6 hours (atlas network url saved in bookmarks)
- fix why adding currentIP address doesn't work (chatgpt had suggestions of ssl cert) (also try adding &ssl to the end of the connection string url?)
