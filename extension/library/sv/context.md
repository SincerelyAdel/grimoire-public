**`context`** — DPI import that may call back into SystemVerilog

`import "DPI-C" context function ...` marks a C function that needs to know the calling scope, call exported SystemVerilog functions or use VPI. Plain imports are faster, so use `context` only when needed.

```systemverilog
import "DPI-C" context function void c_model_step();
export "DPI-C" function sv_report;
```
