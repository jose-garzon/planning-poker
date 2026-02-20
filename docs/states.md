# Game State Mockups — Todo

Each state maps to `?state=<value>`. Desktop changes the `GameArea` content; mobile swaps the aside for a full-screen view (header + footer stay).

---

## States

- [ ] **Lobby** (`?state=undefined`) — participants list + stories panel; host can add stories and start vote
- [ ] **Voting** (`?state=voting`) — card deck for participant to pick; host sees live vote progress
- [ ] **Voted** (`?state=voted`, participant only, mobile) — waiting screen after participant casts their vote
- [ ] **Time Up** (`?state=timeup`) — voting timer expired; prompt to reveal or restart
- [ ] **Results** (`?state=results`) — vote breakdown per participant; host can accept estimate or revote
- [ ] **Unanimous Results** (`?state=unanimous-results`) — celebration screen when everyone picked the same card

---

## Notes

- Each state needs host and participant variants
- Footer actions change per state (e.g. REVEAL, REVOTE, NEXT STORY)
- Mobile and desktop layouts are separate concerns per state
