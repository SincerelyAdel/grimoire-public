**`parameter`** — elaboration-time constant that can be overridden

A constant fixed at elaboration. When declared in a module's parameter port list, each instance can override it. Give it an explicit type so overrides are checked.

```systemverilog
module fifo #(
  parameter int DEPTH = 16
) ( ... );

fifo #(.DEPTH(64)) u_fifo ( ... );
```
