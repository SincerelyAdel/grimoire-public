**`program`** — testbench block that runs in the reactive region

Like a module for testbench code, but its `initial` blocks run after the design settles in each time step, avoiding races with design signals. It cannot contain `always` blocks or module instances. Ends with `endprogram`. UVM testbenches usually use modules instead.

```systemverilog
program test (bus_if.tb bus);
  initial begin
    bus.cb.req <= 1;
    @(bus.cb iff bus.cb.gnt);
    $finish;
  end
endprogram
```
