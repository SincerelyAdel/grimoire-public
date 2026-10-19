**`var`** — declare a variable explicitly

Marks a declaration as a variable rather than a net. Mostly used on ports, where `input var logic x` makes the port a variable instead of the default net, so it cannot have multiple drivers.

```systemverilog
module m (input var logic sel, output logic y);
```
