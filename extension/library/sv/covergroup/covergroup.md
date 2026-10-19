**`covergroup`** — functional coverage model

Groups coverpoints and crosses sampled together, on a clocking event or by calling `sample()`. Instantiate it with `new()` like a class. Report results with `get_coverage()` or the simulator's coverage report.

```systemverilog
covergroup cg_pkt @(posedge clk);
  cp_len  : coverpoint len { bins small = {[1:16]}; bins big = {[17:64]}; }
  cp_kind : coverpoint kind;
  x_len_kind : cross cp_len, cp_kind;
endgroup

cg_pkt cg = new();
```
