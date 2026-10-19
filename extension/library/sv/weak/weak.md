**`weak`** — weak sequence

`weak(seq)` lets a property pass if the trace ends before the sequence completes, which is the default for sequences in `assert` and `assume`. Also part of drive strengths `weak0` and `weak1`.

```systemverilog
assert property (@(posedge clk) req |-> weak(##[1:$] gnt));
```
