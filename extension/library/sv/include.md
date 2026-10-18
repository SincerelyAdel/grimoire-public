**`include`** — include another library map file

In a library map file, `include path;` reads another map file. Not the same as the `` `include`` compiler directive, which pastes a source file into the current one.

```systemverilog
include "common_libs.map";
```
