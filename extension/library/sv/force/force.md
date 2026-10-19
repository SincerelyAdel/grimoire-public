**`force`** — override a signal's value

Holds a net or variable at a value, overriding every driver, until `release`. Meant for testbench and debug use, for example injecting a fault. Not synthesizable.

```systemverilog
initial begin
  #100 force dut.u_fifo.full = 1'b1;
  #50  release dut.u_fifo.full;
end
```
