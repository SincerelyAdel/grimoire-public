**`xor`** — built-in XOR gate

A gate-level primitive. The first terminal is the output and the rest are inputs, with any number of inputs. Found mostly in netlists; in RTL write the operator instead. An optional drive strength and delay can follow the keyword.

```systemverilog
xor u_xor (p, d0, d1, d2, d3);   // parity
```
