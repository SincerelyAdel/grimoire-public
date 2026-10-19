**`output`** — port that sends a value out

Declares an output port of a module, or an output argument of a task or function, copied back to the caller when the subroutine returns. An output port declared with `logic` is a variable and must have a single driver. In a `clocking` block, `output` signals are driven with the output skew.

```systemverilog
task automatic read(input int addr, output int data);
  data = mem[addr];
endtask
```
