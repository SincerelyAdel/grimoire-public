**`bind`** — attach a module or checker without editing the design

Instantiates a module, interface or checker inside another module, or inside chosen instances, from outside its source code. The usual way to add assertion modules to RTL.

```systemverilog
bind fifo fifo_sva u_sva (.clk(clk), .rst_n(rst_n), .full(full), .empty(empty));
```
