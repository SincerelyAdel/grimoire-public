**`defparam`** — override a parameter by hierarchical name

Changes a parameter of an instance from anywhere in the design. Deprecated and confusing; pass parameters with `#(...)` at instantiation instead.

```systemverilog
defparam u_fifo.DEPTH = 32;   // prefer: fifo #(.DEPTH(32)) u_fifo (...);
```
