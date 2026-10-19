**`forkjoin`** — interface task that runs in every instance

`extern forkjoin task` in an interface declares a task that, when called, runs in all module instances that export it, as if in a `fork ... join`. Rarely used.

```systemverilog
interface bus;
  extern forkjoin task probe(int addr);
endinterface
```
