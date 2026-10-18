**`export`** — make names visible to importers or C code

In a package, `export pkg::name;` or `export *::*;` re-exports names imported from another package. In DPI, `export "DPI-C" function f;` lets C code call the SystemVerilog function `f`.

```systemverilog
package top_pkg;
  import base_pkg::*;
  export base_pkg::*;
endpackage

export "DPI-C" function sv_callback;
```
