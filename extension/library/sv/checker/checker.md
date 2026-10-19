**`checker`** — reusable container for assertions

Groups assertions, covers, assumptions and their modelling code so they can be instantiated like a module, including inside procedural code. Arguments can be sequences, properties or expressions. Ends with `endchecker`.

```systemverilog
checker c_onehot(logic [3:0] sig, event clk);
  a_onehot : assert property (@clk $onehot0(sig));
endchecker

c_onehot u_chk (state, posedge clk);
```
