**`bit`** — 2-state variable type

A data type whose bits can only be `0` or `1`. `X` and `Z` values are converted to `0`, which hides unknowns, so it is mostly used in testbenches and for simulation speed, not in RTL. Unsigned unless declared `signed`.

```systemverilog
bit        done;
bit [31:0] counter;
```
