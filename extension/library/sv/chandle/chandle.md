**`chandle`** — opaque pointer from C

Stores a pointer passed through DPI, such as a handle to a C model. SystemVerilog can only store, compare and pass it back; the default is `null`.

```systemverilog
import "DPI-C" function chandle model_new();
import "DPI-C" function void model_step(chandle m);
chandle m = model_new();
```
