**`logic`** — 4-state variable type

A data type whose bits can each be `0`, `1`, `X` or `Z`. Replaces both `reg` and most uses of `wire`: it can be written by a process or by one continuous assignment, but not by several drivers. Use `wire` when a signal really has multiple drivers. Unsigned unless declared `signed`.

```systemverilog
logic        valid;
logic [7:0]  data;
logic signed [15:0] offset;
```
