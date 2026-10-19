**`default`** — fallback item or default value

In a `case`, `randcase` or `randsequence`, the item taken when nothing else matches; always give one in combinational logic to avoid latches. In an assignment pattern (`'{default: 0}`) it sets every element not named. In a `clocking` block it sets default skews, and `default clocking` / `default disable iff` set defaults for assertions.

```systemverilog
case (op)
  ADD:     y = a + b;
  SUB:     y = a - b;
  default: y = '0;
endcase

logic [7:0] regs [16] = '{default: 8'hFF};
```
