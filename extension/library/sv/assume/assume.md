**`assume`** — constrain the environment for formal tools

`assume property` states what the inputs are allowed to do. Formal tools only explore behaviour where assumptions hold; simulators check them like assertions. Over-constraining with assumptions can hide real bugs.

```systemverilog
asm_req_held : assume property (@(posedge clk) disable iff (!rst_n)
  req && !gnt |=> req);
```
