**`library`** — map source files to a library

In a library map file, `library name paths;` puts the listed files in the named library. Used with `config`.

```systemverilog
library rtl_lib  "rtl/*.sv";
library gate_lib "netlist/*.v";
```
