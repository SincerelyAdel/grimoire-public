**`incdir`** — include search path in a library map

In a library map file, `-incdir path` adds a directory to search for `` `include`` files. Simulators more often take `+incdir+path` on the command line.

```systemverilog
library rtl_lib "rtl/*.sv" -incdir "rtl/include";
```
