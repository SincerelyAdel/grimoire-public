**`and`** — built-in AND gate

A gate-level primitive. The first terminal is the output and the rest are inputs, with any number of inputs. Found mostly in netlists; in RTL write the operator instead. An optional drive strength and delay can follow the keyword.

```systemverilog
and #1 u_and (y, a, b, c);   // y = a & b & c
```
