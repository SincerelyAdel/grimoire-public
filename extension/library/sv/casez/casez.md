**`casez`** — case that treats z and ? as don't-care

Like `case`, but `z` and `?` bits are ignored when matching. Write don't-care bits in the items as `?`. Safer than `casex` because an `x` in the selector does not match everything. `case ... inside` is the modern alternative.

---

**Coding example**

```systemverilog
casez (req)
  4'b1???: grant = 4'b1000;
  4'b01??: grant = 4'b0100;
  4'b001?: grant = 4'b0010;
  4'b0001: grant = 4'b0001;
  default: grant = '0;
endcase
```

---

**Visual**

<img src="behavior.svg" width="300">
