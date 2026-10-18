**`release`** — end a force

Removes a `force` (or procedural `assign`). A net goes back to its drivers at once; a variable keeps the forced value until it is next assigned.

```systemverilog
force   dut.clk_en = 1'b0;
#20;
release dut.clk_en;
```
