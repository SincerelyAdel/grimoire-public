**`or`** — built-in OR gate, or sequence/property OR

As a gate-level primitive, `or (out, in1, in2, ...)` drives the OR of its inputs. In event controls, `@(a or b)` is the same as `@(a, b)`. In assertions, `s1 or s2` matches when either sequence or property matches.

```systemverilog
or u_or (y, a, b);
always @(posedge clk or negedge rst_n) ...
assert property (@(posedge clk) start |-> (##1 ack) or (##1 nack));
```
