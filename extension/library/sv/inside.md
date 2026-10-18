**`inside`** — set membership test

`expr inside {set}` is true if the value equals any listed value or falls in any `[lo:hi]` range. `x` and `z` in the set act as wildcards. Also used in constraints and in `case ... inside`, which replaces `casez` and `casex`.

```systemverilog
if (addr inside {[16'h1000:16'h1FFF], 16'h2000})
  hit = 1;

case (opcode) inside
  [0:7]:   kind = ALU;
  8, 9:    kind = MEM;
  default: kind = OTHER;
endcase
```
