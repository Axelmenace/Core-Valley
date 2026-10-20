# Reconciliation Ledger: [Setting]

One entry per conflict, kept across rounds and settings (`references/06-verification-protocol.md`). Entries are append-only; a reopened entry gets a new status line, never an edit.

---

## Entry template

```
ID / Setting:       C_ / [Setting]
Type:               L / S / P (P1, P2, P3) / Q
Branch Force:       Branch A: S_ strict, S_ default ... | Branch B: ...
Derivation paths:   A: S_ + S_ over B_ -> L_ -> ...
                    B: S_ over B_ -> L_ ...
Attempts:           1. [patch]  cost: explication / scope / context / parameter / new System
                       Gate 1 (Retraction): pass / fail, because ...
                       Gate 2 (Fecundity):  pass / fail; yield: L_
                    2. ...
Outcome:            fecund reconciliation / explication / debt patch / promotion / surgery / accepted (P1, P2) / open
Context minted:     [SYS·force] S_  statement
Fecundity yield:    L_, L_
Charged conflicts:  C_ (introduced by this entry's patch, V4)
Status date:        YYYY-MM-DD  status
```

## Round accounting

| Round | Patches minted | Conflicts closed | Conflicts opened (charged) | Net | Debt Register delta |
|---|---|---|---|---|---|

*A round with negative net is degenerating, whatever it feels like locally (V4, V5).*

## Ledger metrics

- Fecund reconciliations / total conflicts: 
- Surgeries: 
- Open: 
- Debt outstanding: 

## Entries

*(append below)*
