**`case`** — multi-way branch

Selects the first item that matches the expression exactly, including `X` and `Z` bits. Use `case ... inside` for wildcard and range matching. Include a `default` item, or assign defaults before the `case`, to avoid inferring latches. Ends with `endcase`.

---

**Coding example**

```systemverilog
case (state)
  IDLE:    next = start ? BUSY : IDLE;
  BUSY:    next = done  ? DONE : BUSY;
  default: next = IDLE;
endcase
```

---

**Visual**

<img src="behavior.svg" width="300">
