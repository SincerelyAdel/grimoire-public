**`interface`** — bundle of signals shared between modules

Groups related signals, and optionally tasks, functions and assertions, into one unit that is connected as a single port. Use `modport` to give each side its own signal directions. Ends with `endinterface`.

```systemverilog
interface bus_if (input logic clk);
  logic       valid, ready;
  logic [7:0] data;
  modport master (output valid, data, input  ready);
  modport slave  (input  valid, data, output ready);
endinterface
```
