**`sequence`** — named series of conditions over clock cycles

Describes a pattern in time with cycle delays (`##n`), repetition (`[*n]`, `[->n]`, `[=n]`) and operators like `and`, `or`, `intersect` and `throughout`. Sequences are the building blocks of properties and can take arguments. Ends with `endsequence`.

```systemverilog
sequence s_handshake(req, ack);
  req ##[1:4] ack;
endsequence

assert property (@(posedge clk) start |-> s_handshake(req, ack));
```
