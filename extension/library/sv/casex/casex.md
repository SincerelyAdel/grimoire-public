**`casex`** — case that treats x and z as don't-care

Like `case`, but `x`, `z` and `?` bits in either the expression or the item are ignored. Because an `x` in the selector also matches, simulation can hide bugs; prefer `case ... inside` or `casez`.

---

**Coding example**

```systemverilog
casex (instr)
  8'b1xxx_xxxx: op = LOAD;
  8'b01xx_xxxx: op = STORE;
  default:      op = NOP;
endcase
```

---

**Visual**

<img src="behavior.svg" width="300">
